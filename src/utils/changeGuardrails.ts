const riskKeywords = [
  'migration',
  'delete',
  'deletion',
  'destroy',
  'rollback',
  'restore',
  'backup',
  'mfa',
  'conditional access',
  'firewall',
  'dns',
  'policy',
  'intune',
  'registry',
  'script',
  'production',
  'prod',
  'escalation',
  'change request',
  'cleanup',
  'reconfigure',
  'shutdown',
  'reboot',
  'shutdown',
  'restore',
  'delete user',
  'remove user',
  'restore point',
  'system state',
  'group policy',
  'conditional access policy',
  'delete device',
  'wipe device'
];

export function detectRiskyWork(text: string) {
  const normalized = text.toLowerCase();
  const matches = riskKeywords.filter((keyword) => normalized.includes(keyword));
  const uniqueMatches = Array.from(new Set(matches));
  return {
    isRisky: uniqueMatches.length > 0,
    reasons: uniqueMatches,
  };
}

export function buildRiskGuardrailMessage(reasons: string[]) {
  if (!reasons.length) {
    return '';
  }

  return `This entry contains risky change-management terms: ${reasons.join(', ')}. Confirm this is authorized, safe to document locally, and not client-sensitive before saving.`;
}
