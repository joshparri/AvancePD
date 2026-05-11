'use client';

import { useMemo, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { mspScenarios } from '@/data/mspScenarios';
import { mspSkills } from '@/data/mspSkills';
import { getMspNextBestActions } from '@/lib/mspNextBestAction';
import {
  getScenarioProgressStatus,
  getStoredScenarioStatuses,
  getStoredSkillReadiness,
  mergeSkillsWithProgress,
  mspScenarioStatusLabels,
  MspScenarioStatusById,
  MspSkillReadinessById,
} from '@/lib/mspProgress';
import { Archive, ClipboardCheck, FileText, Target, TrendingUp } from 'lucide-react';

const countBy = <T,>(items: T[], getKey: (item: T) => string) =>
  items.reduce<Record<string, number>>((counts, item) => {
    const key = getKey(item);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});

const formatList = (items: string[]) => items.map((item) => `- ${item}`).join('\n');

export default function EvidencePackPage() {
  const [skillReadiness] = useState<MspSkillReadinessById>(() => getStoredSkillReadiness());
  const [scenarioStatuses] = useState<MspScenarioStatusById>(() => getStoredScenarioStatuses());

  const skillsWithProgress = useMemo(
    () => mergeSkillsWithProgress(mspSkills, skillReadiness),
    [skillReadiness]
  );

  const reviewedScenarios = useMemo(
    () =>
      mspScenarios.filter(
        (scenario) => getScenarioProgressStatus(scenarioStatuses, scenario.id) !== 'not-started'
      ),
    [scenarioStatuses]
  );

  const practisedSkills = skillsWithProgress.filter((skill) =>
    ['practised', 'work-ready', 'evidence-proven'].includes(skill.readiness)
  );
  const lowReadinessSkills = skillsWithProgress.filter((skill) =>
    ['unseen', 'learning'].includes(skill.readiness)
  );
  const weakAreaCounts = countBy(lowReadinessSkills, (skill) => skill.category);
  const scenarioCategoryCounts = countBy(reviewedScenarios, (scenario) => scenario.category);
  const recommendations = getMspNextBestActions(skillsWithProgress, mspScenarios, scenarioStatuses);

  const skillsPractised = practisedSkills.slice(0, 8).map((skill) => skill.title);
  const weakAreas = Object.entries(weakAreaCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([category, count]) => `${category}: ${count} early-stage skills`);
  const scenarioCategories = Object.entries(scenarioCategoryCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => `${category}: ${count} scenarios`);
  const scenarioProgressList = reviewedScenarios
    .slice(0, 10)
    .map(
      (scenario) =>
        `${scenario.title}: ${mspScenarioStatusLabels[getScenarioProgressStatus(scenarioStatuses, scenario.id)]}`
    );
  const practicalOutputs = [
    ...new Set(
      skillsWithProgress
        .flatMap((skill) => skill.evidenceExamples)
        .filter((example) =>
          /note|checklist|summary|template|explanation|article|diagram/i.test(example)
        )
    ),
  ].slice(0, 10);

  const markdownSummary = `# MSP Professional Development Evidence Pack

## Summary
- Focus: Building practical MSP readiness across triage, endpoint support, Microsoft 365, networking, security, documentation, and escalation judgement.
- Current evidence base: ${practisedSkills.length} skills at practised or stronger readiness, ${reviewedScenarios.length} scenarios marked reviewed/practised/confident, and ticket note practice in place.
- Current weak area pattern: ${weakAreas[0] ?? 'No weak area data available yet.'}

## Skills Practised
${formatList(skillsPractised.length > 0 ? skillsPractised : ['No practised skills recorded yet.'])}

## Scenario Categories Reviewed
${formatList(scenarioCategories.length > 0 ? scenarioCategories : ['No scenarios marked reviewed yet.'])}

## Scenario Progress
${formatList(scenarioProgressList.length > 0 ? scenarioProgressList : ['No scenario progress saved yet.'])}

## Ticket Notes Practice
- Structure practised: Issue, user impact, checks performed, action taken, result, next step, and escalation reason.
- Current output: Copy-ready ticket note template and poor/okay/excellent examples.
- Next evidence target: Write one excellent ticket note from a scenario and one escalation-ready handover note.

## Weak Areas Identified
${formatList(weakAreas)}

## Suggested Next Study Areas
${formatList(recommendations.slice(0, 5).map((item) => `${item.title}: ${item.action}`))}

## Practical Outputs Created Or Ready To Create
${formatList(practicalOutputs)}
`;

  return (
    <Layout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Evidence Pack</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-3xl">
              A manager-safe snapshot of MSP professional development: what has been practised, where
              the gaps are, and what evidence should be created next.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Skills practised</p>
                <p className="text-2xl font-bold">{practisedSkills.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Early-stage skills</p>
                <p className="text-2xl font-bold">{lowReadinessSkills.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Scenarios saved</p>
                <p className="text-2xl font-bold">{reviewedScenarios.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Next actions</p>
                <p className="text-2xl font-bold">{recommendations.length}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ClipboardCheck className="h-5 w-5" />
                  Skills practised
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {practisedSkills.map((skill) => (
                  <div key={skill.id} className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3 last:border-0 last:pb-0 dark:border-gray-800">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{skill.title}</p>
                      <p className="text-xs text-muted-foreground">{skill.category}</p>
                    </div>
                    <Badge variant="outline">{skill.readiness}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5" />
                  Scenario categories reviewed
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(scenarioCategoryCounts).length > 0 ? (
                  Object.entries(scenarioCategoryCounts).map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{category}</span>
                      <Badge variant="outline">{count} scenarios</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No scenarios have been marked reviewed, practised, or confident yet.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5" />
                  Weak areas and next study
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Weak areas</h2>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {weakAreas.map((area) => (
                      <li key={area}>- {area}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Suggested next study</h2>
                  <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                    {recommendations.slice(0, 4).map((recommendation) => (
                      <li key={recommendation.id}>
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {recommendation.title}:
                        </span>{' '}
                        {recommendation.action}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Archive className="h-5 w-5" />
                  Practical outputs created
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {practicalOutputs.map((output) => (
                    <Badge key={output} variant="outline">
                      {output}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5" />
                Copy-ready Markdown summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                This is intentionally professional and conservative: useful for a PD check-in without
                overstating capability.
              </p>
              <Textarea readOnly value={markdownSummary} className="min-h-[520px] font-mono text-sm" />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
