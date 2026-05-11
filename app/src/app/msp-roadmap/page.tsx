import Link from 'next/link';
import { Layout } from '@/components/Layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mspScenarios } from '@/data/mspScenarios';
import { mspSkills } from '@/data/mspSkills';
import { getMspNextBestActions } from '@/lib/mspNextBestAction';
import { ArrowRight, CheckCircle2, Map, Target } from 'lucide-react';

interface RoadmapStage {
  id: string;
  title: string;
  summary: string;
  targetSkillIds: string[];
  scenarioCategories: string[];
  practiceTasks: string[];
  evidenceToCollect: string[];
  readinessIndicators: string[];
}

const roadmapStages: RoadmapStage[] = [
  {
    id: 'stage-1',
    title: 'Stage 1: Level 1 Helpdesk Foundations',
    summary: 'Build calm intake, scope control, ticket triage, password/MFA basics, and ticket note discipline.',
    targetSkillIds: [
      'helpdesk-ticket-triage',
      'helpdesk-diagnostic-questions',
      'helpdesk-password-mfa',
      'psa-ticket-discipline',
      'service-incident-request',
      'service-sla-priority',
    ],
    scenarioCategories: ['Entra ID and identity', 'Endpoint support', 'Microsoft 365 support'],
    practiceTasks: [
      'Review five easy or medium scenarios and write first questions before reading the answer.',
      'Classify each scenario as incident, service request, or security concern.',
      'Write one complete ticket note using the Ticket Notes Trainer structure.',
    ],
    evidenceToCollect: ['First-question checklist', 'SLA priority explanation', 'Excellent ticket note'],
    readinessIndicators: [
      'Can ask useful first questions before touching settings.',
      'Can identify urgency vs noise.',
      'Can escalate with issue, impact, checks, and next step.',
    ],
  },
  {
    id: 'stage-2',
    title: 'Stage 2: Endpoint and Windows Confidence',
    summary: 'Strengthen Windows troubleshooting, endpoint lifecycle, app installs, performance, updates, and basic endpoint security.',
    targetSkillIds: [
      'endpoint-device-lifecycle',
      'endpoint-app-installs',
      'endpoint-security-basics',
      'windows-event-viewer',
      'windows-update-repair',
      'windows-performance-profile',
    ],
    scenarioCategories: ['Endpoint support', 'Windows troubleshooting'],
    practiceTasks: [
      'Complete laptop performance and Windows Update scenarios.',
      'Create a safe first-check endpoint troubleshooting flow.',
      'Explain one Event Viewer finding in plain English.',
    ],
    evidenceToCollect: ['Windows troubleshooting flowchart', 'Slow laptop ticket note', 'Update failure summary'],
    readinessIndicators: [
      'Can separate user, device, app, and policy causes.',
      'Can avoid risky cleanup or registry actions without approval.',
      'Can record endpoint evidence clearly.',
    ],
  },
  {
    id: 'stage-3',
    title: 'Stage 3: Microsoft 365 Admin Basics',
    summary: 'Build practical M365 confidence across Outlook, Teams, OneDrive, shared mailboxes, licensing, and service health.',
    targetSkillIds: [
      'm365-admin-basics',
      'm365-outlook-troubleshooting',
      'm365-onedrive-sync',
      'm365-teams-support',
      'entra-users-groups',
      'entra-mfa-troubleshooting',
    ],
    scenarioCategories: ['Microsoft 365 support', 'Entra ID and identity'],
    practiceTasks: [
      'Review Outlook, Teams, OneDrive, shared mailbox, and sign-in scenarios.',
      'Create M365 admin task cards for user, licence, group, and mailbox checks.',
      'Write a plain-English explanation of local Outlook issue vs mailbox/service issue.',
    ],
    evidenceToCollect: ['Shared mailbox checklist', 'OneDrive sync note', 'M365 admin task cards'],
    readinessIndicators: [
      'Can compare local app state with web/service state.',
      'Can explain access and licence checks simply.',
      'Can escalate tenant-wide issues with evidence.',
    ],
  },
  {
    id: 'stage-4',
    title: 'Stage 4: Networking Fundamentals',
    summary: 'Practise layered network thinking across DNS, DHCP, Wi-Fi, internet outages, ports, gateways, and ISP escalation.',
    targetSkillIds: [
      'networking-dns-dhcp',
      'networking-wifi-troubleshooting',
      'networking-internet-outage',
      'networking-ports-protocols',
    ],
    scenarioCategories: ['Networking'],
    practiceTasks: [
      'Review DNS website failure, Wi-Fi room issue, and internet outage scenarios.',
      'Write an ISP escalation note with scope, tests, and impact.',
      'Create a small office network diagram.',
    ],
    evidenceToCollect: ['DNS troubleshooting note', 'ISP escalation template', 'Network diagram'],
    readinessIndicators: [
      'Can isolate device, Wi-Fi, LAN, DNS, firewall, ISP, and service layers.',
      'Can ask scope questions before assuming outage.',
      'Can record command results and timestamps.',
    ],
  },
  {
    id: 'stage-5',
    title: 'Stage 5: Security and Essential Eight Basics',
    summary: 'Build safe security judgement around phishing, MFA, patching, EDR, backups, least privilege, and risk language.',
    targetSkillIds: [
      'cyber-phishing-analysis',
      'cyber-security-baselines',
      'cyber-incident-first-response',
      'backup-monitoring',
      'rmm-patch-management',
      'judgement-risk-scope',
    ],
    scenarioCategories: ['Cybersecurity', 'Backup and disaster recovery'],
    practiceTasks: [
      'Review phishing, backup failure, and Windows Update scenarios.',
      'Map common controls to Essential Eight categories.',
      'Write a non-technical risk explanation for a manager.',
    ],
    evidenceToCollect: ['Phishing analysis note', 'Security maturity checklist', 'Risk explanation'],
    readinessIndicators: [
      'Can treat credential exposure as urgent.',
      'Can avoid casual reassurance without evidence.',
      'Can explain security risk without fearmongering.',
    ],
  },
  {
    id: 'stage-6',
    title: 'Stage 6: Intune and Cloud Endpoint Management',
    summary: 'Understand compliance, enrolment, app deployment, Autopilot, update rings, and device retirement.',
    targetSkillIds: [
      'intune-compliance-policy',
      'intune-app-deployment',
      'intune-autopilot-enrolment',
      'endpoint-security-basics',
      'entra-joiner-mover-leaver',
    ],
    scenarioCategories: ['Intune and endpoint management', 'Entra ID and identity'],
    practiceTasks: [
      'Review missing compliance and onboarding scenarios.',
      'Create a compliance first-check card.',
      'Draft a device retirement or wipe checklist.',
    ],
    evidenceToCollect: ['Compliance troubleshooting note', 'Policy explanation', 'Device retirement checklist'],
    readinessIndicators: [
      'Can read device state before making policy changes.',
      'Can distinguish user, device, app, and policy causes.',
      'Can escalate policy-wide failures.',
    ],
  },
  {
    id: 'stage-7',
    title: 'Stage 7: PowerShell and Automation',
    summary: 'Use PowerShell and automation safely for discovery, reporting, log reading, and low-risk repeatable tasks.',
    targetSkillIds: ['script-powershell-basics', 'script-safe-testing', 'script-log-reading', 'rmm-alert-triage'],
    scenarioCategories: ['Windows troubleshooting', 'RMM and PSA operations'],
    practiceTasks: [
      'Complete five read-only PowerShell challenges.',
      'Annotate a small script before running it.',
      'Write a pre-flight checklist for script deployment.',
    ],
    evidenceToCollect: ['Annotated command list', 'Script test plan', 'Log-to-ticket summary'],
    readinessIndicators: [
      'Can explain what a command does before running it.',
      'Can test against a safe scope.',
      'Can identify when automation is riskier than manual work.',
    ],
  },
  {
    id: 'stage-8',
    title: 'Stage 8: L2 Readiness and Client Ownership',
    summary: 'Move toward ownership: change safety, root cause summaries, client updates, escalation judgement, and improvement habits.',
    targetSkillIds: [
      'docs-root-cause-summary',
      'comm-outage-updates',
      'judgement-escalation',
      'judgement-change-safety',
      'service-continual-improvement',
    ],
    scenarioCategories: ['Escalation and professional judgement', 'Documentation', 'Client communication'],
    practiceTasks: [
      'Review three hard scenarios and write escalation notes.',
      'Draft a root cause summary for a repeated issue.',
      'Generate an Evidence Pack and choose one next improvement.',
    ],
    evidenceToCollect: ['Root cause summary', 'Change request draft', 'Manager-safe PD summary'],
    readinessIndicators: [
      'Can own a ticket without hiding uncertainty.',
      'Can communicate status and risk clearly.',
      'Can hand over work so the next person can continue.',
    ],
  },
];

export default function MspRoadmapPage() {
  const recommendations = getMspNextBestActions();
  const topRecommendation = recommendations[0];

  return (
    <Layout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">MSP Roadmap</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-3xl">
                A practical path from Level 1 support foundations to early L2 readiness, with evidence
                targets attached to each stage.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/evidence-pack">
                View Evidence Pack
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {topRecommendation && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5" />
                  Current next best action
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{topRecommendation.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{topRecommendation.reason}</p>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{topRecommendation.action}</p>
                  </div>
                  <Badge variant="outline">{topRecommendation.priority} priority</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-6">
            {roadmapStages.map((stage) => {
              const linkedSkills = mspSkills.filter((skill) => stage.targetSkillIds.includes(skill.id));
              const linkedScenarios = mspScenarios.filter((scenario) =>
                stage.scenarioCategories.includes(scenario.category)
              );

              return (
                <Card key={stage.id}>
                  <CardHeader>
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-xl">
                          <Map className="h-5 w-5" />
                          {stage.title}
                        </CardTitle>
                        <p className="mt-2 text-sm text-muted-foreground">{stage.summary}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{linkedSkills.length} skills</Badge>
                        <Badge variant="outline">{linkedScenarios.length} scenarios</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div>
                      <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Target skills</h2>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {linkedSkills.map((skill) => (
                          <Badge key={skill.id} variant="outline">
                            {skill.title}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Linked scenarios
                      </h2>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {linkedScenarios.slice(0, 8).map((scenario) => (
                          <Badge key={scenario.id} variant="outline">
                            {scenario.title}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Practice tasks</h2>
                      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                        {stage.practiceTasks.map((task) => (
                          <li key={task}>- {task}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Evidence to collect
                      </h2>
                      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                        {stage.evidenceToCollect.map((evidence) => (
                          <li key={evidence}>- {evidence}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="lg:col-span-2">
                      <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Readiness indicators
                      </h2>
                      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-3">
                        {stage.readinessIndicators.map((indicator) => (
                          <div
                            key={indicator}
                            className="flex gap-2 rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
                          >
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                            <span>{indicator}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}

