'use client';

import { useMemo, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
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
import { getStoredQuizAttempts, getBestQuizScore } from '@/lib/mspQuizProgress';
import { getLearningProgress, getLearningStats } from '@/lib/mspLearningProgress';
import { mspLearningActivities } from '@/data/mspLearningActivities';
import { getKbEvidenceSummary, mergeKbCardsWithProgress } from '@/lib/kbLearningProgress';
import { Archive, ClipboardCheck, FileText, Target, TrendingUp, Brain } from 'lucide-react';
import { ExternalLearningLinks } from '@/components/ExternalLearningLinks';
import {
  getEvidenceSummary,
  type LearningEvidenceItem,
  type LearningEvidenceSource,
} from '@/lib/learningEvidence';

const countBy = <T,>(items: T[], getKey: (item: T) => string) =>
  items.reduce<Record<string, number>>((counts, item) => {
    const key = getKey(item);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});

const formatList = (items: string[]) => items.map((item) => `- ${item}`).join('\n');

const sourceLabels: Record<LearningEvidenceSource, string> = {
  'learning-cockpit': 'Learning Cockpit',
  'kb-learning-machine': 'KB Learning Machine',
  'msp-quiz': 'Quiz',
  'msp-skills': 'MSP Skills',
  external: 'External study',
};

const formatEvidenceDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

const formatEvidenceResult = (item: LearningEvidenceItem) => {
  if (item.score !== undefined && item.maxScore !== undefined) {
    const pct = Math.round((item.score / item.maxScore) * 100);
    return `${item.score}/${item.maxScore} (${pct}%)`;
  }
  if (item.result) return item.result;
  return item.status;
};

export default function EvidencePackPage() {
  const [skillReadiness] = useState<MspSkillReadinessById>(() => getStoredSkillReadiness());
  const [scenarioStatuses] = useState<MspScenarioStatusById>(() => getStoredScenarioStatuses());
  const [copyMessage, setCopyMessage] = useState<string>('');
  const [learningProgress] = useState(() => getLearningProgress());
  const [learningStats] = useState(() => getLearningStats());
  const [kbCards] = useState(() => mergeKbCardsWithProgress());
  const [kbEvidenceSummary] = useState(() => getKbEvidenceSummary(kbCards));

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

  const quizAttempts = getStoredQuizAttempts();
  const bestQuizScore = getBestQuizScore();
  const bestQuizAttempt = quizAttempts.find(a => a.percentage === bestQuizScore?.percentage);
  const evidenceSummary = getEvidenceSummary();

  // Learning activities data
  const completedActivities = mspLearningActivities.filter(activity => 
    learningProgress.completedActivityIds.includes(activity.id)
  );
  const activityTypeCounts = learningStats.activityTypeCounts;
  const domainCounts = learningStats.domainCounts;
  const activityTypesCompleted = Object.entries(activityTypeCounts)
    .filter(([, count]) => count > 0)
    .map(([type, count]) => `${type}: ${count}`);
  const domainsCompleted = Object.entries(domainCounts)
    .map(([domain, count]) => `${domain}: ${count}`);
  const recentActivities = completedActivities
    .slice(-5)
    .map(activity => `${activity.title} (${activity.activityType}, ${activity.estimatedMinutes} min)`);

  // Recent reflections from learning activities
  const recentReflections = Object.entries(learningProgress.reflections || {})
    .slice(-3)
    .map(([activityId, reflection]) => {
      const activity = completedActivities.find(a => a.id === activityId);
      return activity ? `${activity.title}: ${reflection.slice(0, 100)}${reflection.length > 100 ? '...' : ''}` : null;
    })
    .filter(Boolean) as string[];

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

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(markdownSummary);
      setCopyMessage('Summary copied!');
      setTimeout(() => setCopyMessage(''), 2000);
    } catch {
      setCopyMessage('Failed to copy');
      setTimeout(() => setCopyMessage(''), 2000);
    }
  };

  const markdownSummary = `# MSP Professional Development Evidence Pack

## Summary
- Focus: Building practical MSP readiness across triage, endpoint support, Microsoft 365, networking, security, documentation, and escalation judgement.
- Current evidence base: ${practisedSkills.length} skills at practised or stronger readiness, ${reviewedScenarios.length} scenarios marked reviewed/practised/confident, ${completedActivities.length} learning activities completed, and ticket note practice in place.
- KB learning evidence: ${kbEvidenceSummary.kbsStudied} KB cards studied, ${kbEvidenceSummary.reviewsCompleted} reviews completed, ${kbEvidenceSummary.scenariosCompleted} KB scenario drills saved, and ${kbEvidenceSummary.ticketNotesPractised} KB ticket notes practised.
- Learning progress: ${learningStats.totalMinutes} minutes logged across ${Object.keys(activityTypeCounts).length} learning activity types.
- Current weak area pattern: ${weakAreas[0] ?? 'No weak area data available yet.'}

## Skills Practised
${formatList(skillsPractised.length > 0 ? skillsPractised : ['No practised skills recorded yet.'])}

## Scenario Categories Reviewed
${formatList(scenarioCategories.length > 0 ? scenarioCategories : ['No scenarios marked reviewed yet.'])}

## Scenario Progress
${formatList(scenarioProgressList.length > 0 ? scenarioProgressList : ['No scenario progress saved yet.'])}

## Learning Activities Completed
- Total activities: ${completedActivities.length}
- Minutes logged: ${learningStats.totalMinutes}
- Activity types practiced: ${formatList(activityTypesCompleted.length > 0 ? activityTypesCompleted : ['No learning activities completed yet.'])}
- Domains covered: ${formatList(domainsCompleted.length > 0 ? domainsCompleted : ['No domains covered yet.'])}
- Recent activities: ${formatList(recentActivities.length > 0 ? recentActivities : ['No recent activities.'])}
- Recent reflections: ${formatList(recentReflections.length > 0 ? recentReflections : ['No reflections written yet.'])}

## Ticket Notes Practice
- Structure practised: Issue, user impact, checks performed, action taken, result, next step, and escalation reason.
- Current output: Copy-ready ticket note template and poor/okay/excellent examples.
- Next evidence target: Write one excellent ticket note from a scenario and one escalation-ready handover note.

## KB Learning Machine
- KBs studied: ${kbEvidenceSummary.kbsStudied}
- Reviews completed: ${kbEvidenceSummary.reviewsCompleted}
- KB scenarios completed: ${kbEvidenceSummary.scenariosCompleted}
- KB ticket notes practised: ${kbEvidenceSummary.ticketNotesPractised}
- Confidence changes: ${kbEvidenceSummary.confidenceChanges}
- Current KB gaps: ${formatList(kbEvidenceSummary.currentGaps)}
- Next KB goals: ${formatList(kbEvidenceSummary.nextGoals)}

## Quiz Performance
- Quiz attempts completed: ${quizAttempts.length}
- Best quiz score: ${bestQuizScore ? `${bestQuizScore.percentage}%` : 'No quizzes completed yet'}
- Recent quiz scores: ${quizAttempts.slice(0, 3).map(a => `${a.percentage}%`).join(', ') || 'None'}
- Quiz domains covered: ${[...new Set(quizAttempts.flatMap(a => Object.keys(a.domainBreakdown)))].join(', ') || 'None'}

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

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-8">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Activities completed</p>
                <p className="text-2xl font-bold">{evidenceSummary.activitiesCompleted}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">KB reviews</p>
                <p className="text-2xl font-bold">{evidenceSummary.kbReviews}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Quiz attempts</p>
                <p className="text-2xl font-bold">{evidenceSummary.quizAttempts}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Avg quiz score</p>
                <p className="text-2xl font-bold">
                  {evidenceSummary.averageQuizScore !== null ? `${evidenceSummary.averageQuizScore}%` : 'N/A'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Ticket notes</p>
                <p className="text-2xl font-bold">{evidenceSummary.ticketNotesPractised}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Reflections saved</p>
                <p className="text-2xl font-bold">{evidenceSummary.reflectionsSaved}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Minutes logged</p>
                <p className="text-2xl font-bold">{evidenceSummary.minutesLogged || learningStats.totalMinutes}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Best quiz score</p>
                <p className="text-2xl font-bold">{bestQuizScore ? `${bestQuizScore.percentage}%` : 'N/A'}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="h-5 w-5" />
                  Recent evidence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {evidenceSummary.recentItems.length > 0 ? (
                  evidenceSummary.recentItems.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-md border border-gray-100 p-3 dark:border-gray-800"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</p>
                        <Badge variant="outline" className="text-xs capitalize">
                          {item.type.replace(/-/g, ' ')}
                        </Badge>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {item.source && <span>{sourceLabels[item.source]}</span>}
                        <span>{formatEvidenceResult(item)}</span>
                        <span>{formatEvidenceDate(item.updatedAt)}</span>
                      </div>
                      {item.notes && (
                        <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{item.notes}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No unified evidence yet. Complete a Cockpit activity, KB drill, or quiz to populate this list.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5" />
                  Gaps and next actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Evidence by category</h2>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {(Object.entries(evidenceSummary.bySource) as [LearningEvidenceSource, number][]).map(
                      ([source, count]) => (
                        <li key={source}>
                          - {sourceLabels[source]}: {count}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Suggested next actions</h2>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {evidenceSummary.nextActions.map((action) => (
                      <li key={action}>- {action}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5" />
                  Quiz Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quizAttempts.length > 0 ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Best Score</span>
                      <Badge variant="outline">{bestQuizScore?.percentage}%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Recent Attempts</span>
                      <span className="text-sm text-muted-foreground">
                        {quizAttempts.slice(0, 3).map(a => `${a.percentage}%`).join(', ')}
                      </span>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium mb-1">Weakest Domains</p>
                      <p className="text-muted-foreground">
                        {bestQuizAttempt?.weakestDomains?.slice(0, 2).join(', ') || 'None identified'}
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">No quiz attempts yet. Complete a quiz to see your performance here.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Archive className="h-5 w-5" />
                  External study evidence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Future versions will allow marking external resources as saved, started, or completed to include
                  them in this evidence pack.
                </p>
                <ExternalLearningLinks
                  activityTitle={recommendations[0]?.title ?? 'microsoft 365 admin'}
                  heading="Suggested external study this week"
                  limit={2}
                  compact
                />
              </CardContent>
            </Card>

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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="h-5 w-5" />
                  Learning Activities Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Activities Completed</span>
                  <Badge variant="outline">{completedActivities.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Minutes</span>
                  <Badge variant="outline">{learningStats.totalMinutes}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Activity Types</span>
                  <Badge variant="outline">{Object.keys(activityTypeCounts).length}</Badge>
                </div>
                <div className="text-sm">
                  <p className="font-medium mb-1">Activity Types Practiced</p>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(activityTypeCounts).map(([type, count]) => (
                      <Badge key={type} variant="outline" className="text-xs">
                        {type}: {count}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="text-sm">
                  <p className="font-medium mb-1">Recent Activities</p>
                  <ul className="text-muted-foreground space-y-1">
                    {recentActivities.slice(0, 3).map((activity, index) => (
                      <li key={index} className="text-xs">- {activity}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Archive className="h-5 w-5" />
                  KB Learning Machine
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-md border p-3">
                    <p className="text-xs text-muted-foreground">KBs studied</p>
                    <p className="text-xl font-bold">{kbEvidenceSummary.kbsStudied}</p>
                  </div>
                  <div className="rounded-md border p-3">
                    <p className="text-xs text-muted-foreground">Ticket notes</p>
                    <p className="text-xl font-bold">{kbEvidenceSummary.ticketNotesPractised}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Current KB gaps</p>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {kbEvidenceSummary.currentGaps.map((gap) => (
                      <li key={gap}>- {gap}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium">Next KB goals</p>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {kbEvidenceSummary.nextGoals.map((goal) => (
                      <li key={goal}>- {goal}</li>
                    ))}
                  </ul>
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
              <div className="flex items-center gap-2">
                <Button onClick={handleCopySummary} size="sm">
                  Copy summary
                </Button>
                {copyMessage && <span className="text-sm text-green-600">{copyMessage}</span>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
