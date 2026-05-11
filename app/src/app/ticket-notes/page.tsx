import { Layout } from '@/components/Layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ClipboardCheck, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

const noteStructure = [
  'Issue',
  'User impact',
  'Checks performed',
  'Action taken',
  'Result',
  'Next step',
  'Escalation reason if applicable',
];

const ticketNoteTemplate = `Issue:

User impact:

Checks performed:

Action taken:

Result:

Next step:

Escalation reason if applicable:
`;

const examples = [
  {
    label: 'Poor',
    tone: 'Not enough context',
    note: 'Fixed Outlook.',
    why: 'No symptom, impact, checks, action detail, result, or next step. The next technician would have to start again.',
  },
  {
    label: 'Okay',
    tone: 'Useful but thin',
    note:
      'User reported Outlook was not updating. Checked webmail and confirmed new mail was present. Restarted Outlook and recreated profile. Mail started syncing again. User confirmed email is working.',
    why: 'Captures the basic issue, check, action, and result, but does not clearly state impact, timing, or what to do if it returns.',
  },
  {
    label: 'Excellent',
    tone: 'Handover-ready',
    note:
      'Issue: User reported Outlook desktop had not received new mail since this morning, while webmail continued to work. User impact: User could not reliably respond to client emails from Outlook. Checks performed: Confirmed Microsoft 365 webmail showed current mail, checked Outlook connection state, confirmed network access, and noted no wider reports. Action taken: Restarted Outlook, cleared stuck send/receive state, and recreated the Outlook profile after confirming mailbox data was available online. Result: Mailbox synced successfully and user confirmed current mail appeared. Next step: If issue returns, check add-ins and mailbox profile health before escalating to Exchange Online support.',
    why: 'Clear issue, impact, evidence, action, outcome, and recurrence path. It helps the next person continue without guessing.',
  },
];

const qualityRubric = [
  {
    section: 'Issue',
    what: 'What the user reported and when you first heard about it',
    good: 'User reported that Teams calls would not connect. Issue started this morning around 9:30 AM after reboot.',
    weak: 'Teams broken.',
  },
  {
    section: 'User impact',
    what: `How the problem affected the user's work or the business`,
    good: 'User could not join client calls, delaying project handover meeting by 30 minutes.',
    weak: 'User could not use Teams.',
  },
  {
    section: 'Checks performed',
    what: 'Evidence you gathered before taking action (do not include fixes here)',
    good: 'Confirmed network connectivity (ping gateway succeeded). Confirmed Teams desktop app version. Checked Windows event log for driver or permission errors. Checked Teams admin centre for service status.',
    weak: 'Checked settings.',
  },
  {
    section: 'Action taken',
    what: `What you changed or restarted; be specific about sequence`,
    good: 'Restarted Teams app. If still failing, restarted Windows audio driver. If still failing, signed out and back into Teams.',
    weak: 'Fixed Teams.',
  },
  {
    section: 'Result',
    what: 'What the user can do now that could not be done before',
    good: 'User successfully joined test call and confirmed outbound audio and video working. Joined client call and confirmed call quality stable.',
    weak: 'Working now.',
  },
  {
    section: 'Next step',
    what: 'What the user or next technician should do if the issue returns',
    good: 'If issue returns within a week, escalate to Teams support with call history from admin centre. If isolated to Teams calls only, check audio driver and USB device conflicts.',
    weak: 'User will call if it breaks again.',
  },
  {
    section: 'Escalation reason (if needed)',
    what: 'Why you could not resolve it and what you tried first',
    good: 'Escalating to Exchange support: we confirmed mailbox is not full and mail flow is working on web client, but Outlook desktop remains stuck. We have restarted Outlook, cleared cache, and recreated profile without success.',
    weak: 'Could not fix it.',
  },
];

const practicePrompts = [
  {
    title: 'Password reset with MFA issue',
    scenario:
      'User called at 3 PM saying they cannot sign in after their password was reset this morning. They receive an MFA prompt but it does not complete. No clear error message appears. This affects their ability to access Teams and shared files.',
    whatToWrite: `Write a ticket note capturing: the user's specific issue, when and how it affects them, what checks you would do (do not include fixes), what you would try, the result, and the next step if it happens again.`,
    modelAnswer:
      `Issue: User reset password at 9 AM. At 3 PM, user attempted sign-in and MFA prompt appeared but did not proceed to validation. User is blocked from Teams and shared file access. User impact: User missing client meetings and unable to review shared documents, delaying project review by unknown duration. Checks performed: Confirmed account is not locked by reviewing sign-in logs. Confirmed MFA methods in account profile (phone, authenticator app). Confirmed user is on company Wi-Fi. Tested account sign-in from webmail to isolate desktop app issue. Action taken: Signed out of Teams completely. Cleared Teams cache folder. Signed back in and completed MFA verification via authenticator app. User confirmed Teams and SharePoint access working. Next step: If MFA prompt hangs again on first sign-in after password change, ask user to wait 30 seconds and retry. If issue persists, escalate to Identity team with exact error message and check if account is flagged for verification by security policy.`,
    commonMistake: `Rushing to reset the account or password again without gathering evidence of which MFA method is failing or checking sign-in logs first. Also forgetting to record user impact (lost meeting time, blocked access) which is critical for escalation decisions.`,
  },
  {
    title: 'OneDrive sync broken',
    scenario:
      'User reports that OneDrive shows a red X icon next to their Documents folder. Files have not synced in two hours. The user has a large project file they need to access from another device, and they are worried about data loss. They are mildly frustrated.',
    whatToWrite: `Write a ticket note that documents: the issue clearly, the user's business impact and timeline pressure, what you checked, what you changed, whether the sync resumed, and what to do if it breaks again.`,
    modelAnswer:
      `Issue: OneDrive sync shows error icon (red X) on Documents folder since approximately 1 PM. Sync has not progressed for 2 hours. User impact: User cannot access large project file needed for 4 PM meeting with external client. User is concerned about data loss and cannot collaborate with team member who is waiting on synced updates. Checks performed: Confirmed user has internet connectivity (ping and web browser working). Checked OneDrive status in system tray (shows sync paused with error). Confirmed file is accessible via OneDrive web client (data is safe on server). Checked OneDrive storage quota (user at 85% capacity, under limit). Reviewed OneDrive sync settings and found a single file with path length exceeding Windows limit. Action taken: Renamed problematic file to shorten path. Resumed OneDrive sync from system tray. Confirmed Documents folder now shows green checkmark and files are syncing. User confirmed project file downloaded and is accessible locally. Next step: User should periodically check OneDrive status in system tray for future errors. If sync stalls again, check for files with long paths or special characters, and consider moving to a folder with shorter path depth.`,
    commonMistake: `Not checking OneDrive web client to verify the file is safe (causing unnecessary panic). Also not documenting the storage quota or path length, which are common sync causes. Missing the user's timeline pressure (they need it for a 4 PM meeting) makes escalation decisions harder later.`,
  },
  {
    title: 'Suspicious phishing email',
    scenario:
      'User received an email appearing to come from their manager asking to update payment details in a company portal. The sender address looks similar to the manager\'s but not exact. The user is uncertain and forwarded it to you. You need to determine if it is a phishing attempt.',
    whatToWrite: `Write a ticket note that covers: the suspected issue, why it's concerning, what evidence you checked, what action you took, the result, and any escalation or user guidance.`,
    modelAnswer:
      `Issue: User received email claiming to be from manager requesting urgent update to payment details in attached portal link. Email sender address appears to be "m.smith@company.co.nz" but user reports manager is normally "mark.smith@company.co.nz". Email sent at 11:47 PM outside business hours. User impact: User did not click link but is unsure if email is legitimate. Risk: If user or other employees click and enter credentials, attacker gains access to accounts and internal systems. Checks performed: Examined email headers to identify actual sender domain (mail-bounce from external Gmail account, not company domain). Checked legitimate manager's recent emails (none request payment updates via external links). Verified company payment portal is always accessed via intranet, never via email link. Searched for similar emails in organisation (found 3 others sent today to different staff). Action taken: Deleted email from user's inbox. Reported email address and domain to Security team with full headers. Sent user communication that company will never request payment updates via email links, and to report suspicious emails immediately. Escalation reason: Evidence suggests coordinated phishing campaign targeting multiple staff. Escalating to Security team for threat analysis, user awareness notification, and email filter rule update. Recommend immediate staff notification to flag similar emails.`,
    commonMistake: `Clicking the link to "test" if it is real (this confirms your email is active to the attacker). Also not reporting to Security team, which prevents organisation-wide protection. Missing the fact that multiple emails were sent is critical for escalation priority.`,
  },
];

const beforeAfterRewrite = {
  title: 'Before and after: rewriting a weak note',
  poor: 'User could not print. Checked printer. Restarted printer. Now working.',
  poor_issues: [
    'No timestamp or how long the issue lasted',
    'No user impact (printing delayed project?)',
    'Did not record which printer or which user',
    'Did not list actual checks (is it offline? queue stuck?)',
    `Did not explain what "restart" entails for next technician`,
    'No next step if it happens again',
  ],
  improved: `Issue: User could not print to Finance colour printer (shared, on 4th floor). Issue reported at 1:30 PM, affecting accounts team unable to print cheques for payment run. Impact: Payment processing delayed, accounts manager escalated. Checks: Finance printer showed offline status on server, physical device powered on with error light blinking, print queue showed 47 stuck jobs. Network reachability confirmed (ping succeeded). Action: Powered off printer, waited 20 seconds, powered on. Cleared print queue from server. Printed test page successfully. User confirmed colour and quality normal. Result: Accounts team resumed printing and payment run completed by 2:15 PM. Next step: If printer goes offline again, check error light code and clear queue before power cycle. If offline happens more than once in a week, log a maintenance call for potential hardware issue.`,
  improved_good: [
    'Clear timestamp and duration',
    'User impact and business consequence stated upfront',
    'Specific printer and affected team identified',
    'Actual checks documented (offline status, queue, network, physical state)',
    'Exact sequence of actions so next technician can repeat it',
    'Escalation guidance for recurring issues',
  ],
};

export default function TicketNotesPage() {
  return (
    <Layout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ticket Notes Trainer</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-3xl">
              Write ticket notes that protect continuity and save time. Document the issue clearly, capture user impact, separate checks from actions, state the result, explain the next step, and flag escalation reasons. The next technician should understand the situation without asking.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ClipboardCheck className="h-5 w-5" />
                  Seven-part structure
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-2">Follow this order to build clear, handover-ready notes. Use the template to copy and paste.</p>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  {noteStructure.map((item, index) => (
                    <li key={item} className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-200">
                        {index + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5" />
                  Copy-ready template
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-2">Paste this into your ticket system and fill in each section. Saves time and keeps structure consistent.</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea readOnly value={ticketNoteTemplate} className="min-h-64 font-mono text-sm" aria-label="Ticket note template" />
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Three examples: poor, okay, excellent</h2>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {examples.map((example) => (
              <Card key={example.label}>
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <CardTitle className="text-lg">{example.label}</CardTitle>
                    <Badge variant="outline">{example.tone}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200">
                    {example.note}
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Why this matters</h2>
                    <p className="mt-2 text-sm text-muted-foreground">{example.why}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Before you save or escalate: self-check</CardTitle>
              <p className="text-xs text-muted-foreground mt-2">Use this checklist to make sure your note is clear and complete.</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 text-sm text-gray-700 dark:text-gray-300 md:grid-cols-2">
                <label className="flex items-start gap-2 cursor-pointer">
                  <span className="mt-1 text-lg">☐</span>
                  <span>Could another technician understand the current state from this note?</span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer">
                  <span className="mt-1 text-lg">☐</span>
                  <span>Did I record user impact, not just the technical symptom?</span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer">
                  <span className="mt-1 text-lg">☐</span>
                  <span>Did I separate checks performed from actions taken?</span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer">
                  <span className="mt-1 text-lg">☐</span>
                  <span>Did I avoid claiming root cause without solid evidence?</span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer">
                  <span className="mt-1 text-lg">☐</span>
                  <span>Did I state what happens next?</span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer">
                  <span className="mt-1 text-lg">☐</span>
                  <span>If escalating, did I explain why and what risk remains?</span>
                </label>
              </div>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Before and after: rewriting a weak note</h2>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    Weak note
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm leading-6 text-gray-800 dark:border-red-900 dark:bg-red-950 dark:text-gray-200">
                    {beforeAfterRewrite.poor}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Missing information</h3>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {beforeAfterRewrite.poor_issues.map((issue) => (
                        <li key={issue}>• {issue}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Improved note
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-md border border-green-200 bg-green-50 p-4 text-sm leading-6 text-gray-800 dark:border-green-900 dark:bg-green-950 dark:text-gray-200">
                    {beforeAfterRewrite.improved}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">What makes it better</h3>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {beforeAfterRewrite.improved_good.map((point) => (
                        <li key={point}>✓ {point}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">MSP note quality rubric</h2>
            <p className="text-sm text-muted-foreground mb-4">Use this checklist to build each section of your note. Each section should answer a specific question.</p>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {qualityRubric.map((item) => (
                <Card key={item.section}>
                  <CardHeader>
                    <CardTitle className="text-base">{item.section}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-2">{item.what}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase mb-1">Good example</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{item.good}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-red-700 dark:text-red-400 uppercase mb-1">Weak example</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">{item.weak}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Practice prompts: realistic MSP scenarios</h2>
            <p className="text-sm text-muted-foreground mb-4">For each scenario, write a ticket note first, then compare your answer to the model. Look for the common mistake to avoid.</p>
            <div className="space-y-6">
              {practicePrompts.map((prompt, index) => (
                <Card key={prompt.title}>
                  <CardHeader>
                    <CardTitle className="text-base">{index + 1}. {prompt.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">The scenario</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{prompt.scenario}</p>
                    </div>

                    <div className="rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950">
                      <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200">Your task</h4>
                      <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">{prompt.whatToWrite}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Model answer</h4>
                      <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 font-mono text-xs">
                        {prompt.modelAnswer}
                      </div>
                    </div>

                    <div className="rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950">
                      <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-200">Common mistake to avoid</h4>
                      <p className="text-sm text-amber-800 dark:text-amber-300 mt-1">{prompt.commonMistake}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

