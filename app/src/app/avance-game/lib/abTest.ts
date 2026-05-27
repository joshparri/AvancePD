'use client';

const STORAGE_VARIANT_PREFIX = 'ab_variant_';
const STORAGE_METRICS_PREFIX = 'ab_metrics_';

const canUse = () => typeof window !== 'undefined' && !!window.localStorage;

export const assignVariant = (testName: string, variants: string[] = ['A', 'B']): string => {
  if (!canUse()) return variants[0];
  const key = STORAGE_VARIANT_PREFIX + testName;
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const pick = variants[Math.floor(Math.random() * variants.length)];
  window.localStorage.setItem(key, pick);
  return pick;
};

export const recordImpression = (testName: string, variant: string) => {
  if (!canUse()) return;
  const key = STORAGE_METRICS_PREFIX + testName;
  try {
    const raw = window.localStorage.getItem(key) || '{}';
    const obj = JSON.parse(raw) as Record<string, { impressions: number; clicks: number }>;
    obj[variant] = obj[variant] || { impressions: 0, clicks: 0 };
    obj[variant].impressions += 1;
    window.localStorage.setItem(key, JSON.stringify(obj));
  } catch {}
};

export const recordClick = (testName: string, variant: string) => {
  if (!canUse()) return;
  const key = STORAGE_METRICS_PREFIX + testName;
  try {
    const raw = window.localStorage.getItem(key) || '{}';
    const obj = JSON.parse(raw) as Record<string, { impressions: number; clicks: number }>;
    obj[variant] = obj[variant] || { impressions: 0, clicks: 0 };
    obj[variant].clicks += 1;
    window.localStorage.setItem(key, JSON.stringify(obj));
  } catch {}
};

export const getMetrics = (testName: string) => {
  if (!canUse()) return {} as Record<string, { impressions: number; clicks: number }>;
  const key = STORAGE_METRICS_PREFIX + testName;
  try {
    return JSON.parse(window.localStorage.getItem(key) || '{}');
  } catch {
    return {};
  }
};
