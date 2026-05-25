export type SkillTrack = {
  id: string;
  title: string;
  description: string;
  categories: string[];
  suggestedRoutine: string;
};

export const skillTracks: SkillTrack[] = [
  {
    id: 'm365-basics',
    title: 'M365 Support Basics',
    description: 'Build confidence with Outlook, Teams, OneDrive, licensing, and shared mailbox support.',
    categories: ['Microsoft 365 support'],
    suggestedRoutine: 'Read one M365 micro-learning card, practise one related scenario, then write a safe ticket note.'
  },
  {
    id: 'identity-access',
    title: 'Identity & Access',
    description: 'Practise Entra ID, MFA, group membership, access boundaries, and joiner/mover/leaver thinking.',
    categories: ['Entra ID and identity'],
    suggestedRoutine: 'Review one identity scenario and write the escalation or access-check notes.'
  },
  {
    id: 'endpoint-triage',
    title: 'Endpoint Triage',
    description: 'Strengthen Windows, device, performance, update, and safe first-check habits.',
    categories: ['Endpoint support', 'Windows troubleshooting', 'Intune and endpoint management'],
    suggestedRoutine: 'Pick one endpoint symptom and write first checks before touching settings.'
  },
  {
    id: 'network-foundations',
    title: 'Network Foundations',
    description: 'Practise DNS, DHCP, Wi-Fi, VPN, and command-output interpretation.',
    categories: ['Networking'],
    suggestedRoutine: 'Read one networking card and explain what evidence would prove the cause.'
  },
  {
    id: 'professional-judgement',
    title: 'Professional Judgement',
    description: 'Improve triage, communication, escalation, documentation, and manager-safe evidence habits.',
    categories: ['Helpdesk and triage', 'Escalation and professional judgement', 'Documentation and evidence', 'Communication'],
    suggestedRoutine: 'Practise one communication or escalation scenario, then create a safe Evidence Pack note.'
  }
];
