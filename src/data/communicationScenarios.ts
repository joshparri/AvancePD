export type CommunicationScenario = {
  id: string;
  title: string;
  context: string;
  poorResponse: string;
  betterResponse: string;
  excellentResponse: string;
  whyItWorks: string;
  relatedMspSkills: string[];
};

export const communicationScenarios: CommunicationScenario[] = [
  {
    id: 'frustrated-user',
    title: 'Frustrated user',
    context: 'A user is upset because their ticket has already been open for two days without a clear update.',
    poorResponse: 'Fine, I will look at it later. Please wait.',
    betterResponse: 'I understand you are frustrated. I am checking the ticket now and will update you shortly.',
    excellentResponse: 'I understand this is frustrating. I am reviewing the ticket now and will update you in 30 minutes with what I found and the next step.',
    whyItWorks: 'It acknowledges the user, sets a realistic short-term expectation, and keeps the response calm and professional.',
    relatedMspSkills: ['client-updates', 'deescalation', 'setting-expectations']
  },
  {
    id: 'non-technical-manager',
    title: 'Non-technical manager',
    context: 'A manager asks why the network issue affected operations and wants a short explanation.',
    poorResponse: 'The switch had a spanning tree loop and BGP failed. We had to reset the core router.',
    betterResponse: 'The building network had a routing issue, which stopped some systems from talking to each other. We are addressing it now and I will keep you updated.',
    excellentResponse: 'A network device lost its connection to the rest of the site, so some systems could not communicate. I am fixing the failed device and will confirm when the connection is restored. I will also provide a short note on why it happened and how we will prevent it next time.',
    whyItWorks: 'It removes jargon, focuses on business impact, and promises a follow-up note rather than overloading the manager with technical detail.',
    relatedMspSkills: ['plain-english', 'business-impact-thinking', 'risk-communication']
  },
  {
    id: 'security-warning',
    title: 'Security warning',
    context: 'A user reports a suspicious email and asks whether it is safe. You need to reassure them while keeping the response professional.',
    poorResponse: 'Yes it is safe, don’t worry. The email is fine.',
    betterResponse: 'I will review the email. If it is suspicious, I will let you know and help you next.',
    excellentResponse: 'I appreciate you reporting this. I am reviewing the email now for signs of phishing. If it is unsafe, I will tell you exactly what to do next and whether any further action is required.',
    whyItWorks: 'It validates the report, avoids false reassurance, and commits to a clear, safe next step.',
    relatedMspSkills: ['phishing-analysis', 'risk-communication', 'client-updates']
  },
  {
    id: 'outage-update',
    title: 'Outage update',
    context: 'The internet is down at a site and the client needs a concise status update.',
    poorResponse: 'We are looking at it.',
    betterResponse: 'The site network is currently down. We are investigating the cause and will update you again shortly.',
    excellentResponse: 'The site internet connection is down right now. We have confirmed it is not a single computer issue. We are investigating the network equipment and will update you again in 20 minutes with the current status and next steps.',
    whyItWorks: 'It gives the client a current status, explains the scope, and commits to a follow-up time.',
    relatedMspSkills: ['incident-thinking', 'client-updates', 'setting-expectations']
  },
  {
    id: 'need-to-escalate',
    title: 'Saying I need to escalate this',
    context: 'You identify a risky issue that requires senior support. You need to explain why escalation is the right next step.',
    poorResponse: 'I am escalating because I can’t fix it.',
    betterResponse: 'This issue is outside my support level, so I am escalating it to the specialist team.',
    excellentResponse: 'I have confirmed the issue involves a system change and a policy decision, so I am escalating it to the senior technical team to avoid further risk. I will stay involved and update you with their next recommendation.',
    whyItWorks: 'It explains the risk, avoids sounding helpless, and shows you remain part of the response.',
    relatedMspSkills: ['escalation-basics', 'risk-awareness', 'service-minded']
  },
  {
    id: 'ask-more-information',
    title: 'Asking for more information',
    context: 'A ticket report is too vague to act on. You need to ask the right clarifying questions without sounding accusatory.',
    poorResponse: 'You are not clear. Tell me more.',
    betterResponse: 'I need a bit more detail to help you. Which app, device, and error are you seeing?',
    excellentResponse: 'To solve this quickly, could you tell me which app or device is affected, what you were doing when it failed, and whether you saw an error message? That helps me avoid unnecessary steps.',
    whyItWorks: 'It asks for specific details clearly, without sounding robotic or accusatory.',
    relatedMspSkills: ['diagnostic-questions', 'client-updates', 'ticket-triage']
  },
  {
    id: 'explain-delay',
    title: 'Explaining a delay',
    context: 'A ticket is taking longer than expected. You need to explain why and set a new expectation.',
    poorResponse: 'Sorry, it is taking longer than expected.',
    betterResponse: 'This ticket is taking longer than expected because I have to check another system. I will update you by the end of the day.',
    excellentResponse: 'I am still working on this because I need to verify the issue across the network and the user device. I expect to have a clearer answer within the next hour and will update you then.',
    whyItWorks: 'It gives the reason for the delay, shows work is in progress, and sets a specific next update window.',
    relatedMspSkills: ['setting-expectations', 'client-updates', 'process-discipline']
  },
  {
    id: 'close-ticket-professionally',
    title: 'Closing a ticket professionally',
    context: 'A ticket appears resolved. You need to close it with a good summary and next step if needed.',
    poorResponse: 'Fixed. Closing ticket.',
    betterResponse: 'The issue has been resolved. I am closing the ticket now.',
    excellentResponse: 'Issue resolved: printer queue cleared and test page printed successfully. User confirmed normal printing. Closing the ticket, and I will reopen it if the issue returns within 24 hours.',
    whyItWorks: 'It summarizes the fix, confirms the result, and provides a clear next step if the problem returns.',
    relatedMspSkills: ['ticket-summaries', 'handover-notes', 'client-updates']
  },
  {
    id: 'push-back-out-of-scope',
    title: 'Push back gently on an unsafe or out-of-scope request',
    context: 'A request asks you to bypass security controls for convenience. You need to push back professionally.',
    poorResponse: 'I can’t do that. It’s not my problem.',
    betterResponse: 'That request is outside our standard practice, so I cannot make that change right now.',
    excellentResponse: 'I understand why you want that change, but bypassing security controls would put the environment at risk. I recommend we explore an approved alternative and will bring it to the team for review.',
    whyItWorks: 'It validates the request, explains the risk, and offers a safer path without sounding dismissive.',
    relatedMspSkills: ['no-kindly', 'risk-awareness', 'service-minded']
  }
];
