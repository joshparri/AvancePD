'use client';

import { useMemo, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mspScenarios, MspScenarioDifficulty } from '@/data/mspScenarios';
import { mspSkills } from '@/data/mspSkills';
import {
  getScenarioProgressStatus,
  getStoredScenarioStatuses,
  mspScenarioStatusLabels,
  mspScenarioStatusOptions,
  MspScenarioStatus,
  MspScenarioStatusById,
  setStoredScenarioStatus,
} from '@/lib/mspProgress';
import { AlertTriangle, CheckCircle2, ClipboardList, ShieldAlert } from 'lucide-react';
import { HeroPanel, PageShell } from '@/components/academy';
import {
  LearningIllustration,
  scenarioCategoryToIllustration,
} from '@/components/learning/LearningIllustration';
import { LearningDiagram } from '@/components/learning/LearningDiagram';

const difficultyClasses: Record<MspScenarioDifficulty, string> = {
  easy: 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-200',
  medium:
    'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200',
  hard: 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-200',
};

function TrainingSection({
  title,
  items,
  icon,
}: {
  title: string;
  items: string[];
  icon: React.ReactNode;
}) {
  return (
    <Card className="dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
          {items.map((item) => (
            <li key={item}>- {item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default function MspScenariosPage() {
  const [selectedScenarioId, setSelectedScenarioId] = useState(mspScenarios[0].id);
  const [scenarioStatuses, setScenarioStatuses] = useState<MspScenarioStatusById>(() =>
    getStoredScenarioStatuses()
  );

  const selectedScenario = useMemo(
    () => mspScenarios.find((scenario) => scenario.id === selectedScenarioId) ?? mspScenarios[0],
    [selectedScenarioId]
  );

  const selectedScenarioStatus = getScenarioProgressStatus(scenarioStatuses, selectedScenario.id);

  const relatedSkills = useMemo(
    () => mspSkills.filter((skill) => selectedScenario.relatedSkillIds.includes(skill.id)),
    [selectedScenario]
  );

  const handleScenarioStatusChange = (scenarioId: string, status: MspScenarioStatus) => {
    setScenarioStatuses(setStoredScenarioStatus(scenarioId, status));
  };

  return (
    <Layout>
      <PageShell
        eyebrow="Practice"
        title="MSP Scenario Trainer"
        subtitle="Read realistic tickets and practise judgement: first questions, safe checks, escalation, and handover notes."
      >
        <HeroPanel
          title="Guided scenario practice"
          subtitle="Compare your thinking with model checks, unsafe shortcuts, and ideal ticket notes."
          illustration={<LearningIllustration variant="scenario-practice" size="lg" decorative />}
        />

        <LearningDiagram variant="ticket-lifecycle" compact />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
            <Card className="dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg">Select a scenario</CardTitle>
                <p className="text-xs text-muted-foreground mt-2">Choose a ticket to practise. Each scenario includes good opening questions, expected checks, unsafe shortcuts, and escalation triggers.</p>
              </CardHeader>
              <CardContent className="space-y-2">
                {mspScenarios.map((scenario) => {
                  const isSelected = scenario.id === selectedScenario.id;
                  const categoryIllustration = scenarioCategoryToIllustration(scenario.category);

                  return (
                    <Button
                      key={scenario.id}
                      type="button"
                      variant={isSelected ? 'default' : 'outline'}
                      className="h-auto w-full justify-start gap-3 whitespace-normal px-3 py-3 text-left"
                      onClick={() => setSelectedScenarioId(scenario.id)}
                    >
                      <LearningIllustration variant={categoryIllustration} size="sm" decorative />
                        <span>
                        <span className="block font-medium">{scenario.title}</span>
                        <span className="block text-xs opacity-80">{scenario.category}</span>
                        <span className="mt-1 block text-xs opacity-80">
                          {mspScenarioStatusLabels[getScenarioProgressStatus(scenarioStatuses, scenario.id)]}
                        </span>
                      </span>
                    </Button>
                  );
                })}
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="dark:border-slate-700">
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-4">
                      <LearningIllustration
                        variant={scenarioCategoryToIllustration(selectedScenario.category)}
                        size="md"
                      />
                    <div>
                      <CardTitle className="text-2xl leading-tight">{selectedScenario.title}</CardTitle>
                      <p className="mt-2 text-sm text-muted-foreground">{selectedScenario.category}</p>
                    </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className={difficultyClasses[selectedScenario.difficulty]}>
                        {selectedScenario.difficulty}
                      </Badge>
                      <Badge variant="outline">{selectedScenario.userEmotion}</Badge>
                      <Badge variant="outline">{mspScenarioStatusLabels[selectedScenarioStatus]}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <label
                      htmlFor="scenario-status"
                      className="text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Scenario progress
                    </label>
                    <select
                      id="scenario-status"
                      value={selectedScenarioStatus}
                      onChange={(event) =>
                        handleScenarioStatusChange(
                          selectedScenario.id,
                          event.target.value as MspScenarioStatus
                        )
                      }
                      className="mt-2 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 md:w-64"
                    >
                      {mspScenarioStatusOptions.map((option) => (
                        <option key={option} value={option}>
                          {mspScenarioStatusLabels[option]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white">The ticket</h2>
                    <p className="academy-inset-panel mt-2 text-sm">
                      {selectedScenario.ticketText}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white">What you will learn</h2>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300"><em>Root cause:</em> {selectedScenario.hiddenCause}</p>
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Related skills</h2>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {relatedSkills.map((skill) => (
                        <Badge key={skill.id} variant="outline">
                          {skill.title}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <TrainingSection
                  title="Good opening questions"
                  items={selectedScenario.goodFirstQuestions}
                  icon={<ClipboardList className="h-5 w-5" />}
                />
                <TrainingSection
                  title="Safe checks to perform"
                  items={selectedScenario.expectedChecks}
                  icon={<CheckCircle2 className="h-5 w-5" />}
                />
                <TrainingSection
                  title="Unsafe shortcuts to avoid"
                  items={selectedScenario.unsafeActions}
                  icon={<ShieldAlert className="h-5 w-5" />}
                />
                <TrainingSection
                  title="When to escalate"
                  items={selectedScenario.escalationTriggers}
                  icon={<AlertTriangle className="h-5 w-5" />}
                />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Model ticket note for handover</CardTitle>
                  <p className="text-xs text-muted-foreground mt-2">Use this as a reference for clear, handover-ready documentation of the issue, checks, action, and next step.</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">
                    {selectedScenario.idealTicketNotes}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Key learning points</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    {selectedScenario.learningPoints.map((point) => (
                      <li key={point}>- {point}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
      </PageShell>
    </Layout>
  );
}
