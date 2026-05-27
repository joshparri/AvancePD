'use client';

const STORAGE_FRIENDS = 'avance_game_friends';
const STORAGE_INVITES = 'avance_game_invites';

export type Friend = { id: string; name: string; xp: number; avatarColor?: string };

const canUse = () => typeof window !== 'undefined' && !!window.localStorage;

export const getFriends = (): Friend[] => {
  if (!canUse()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_FRIENDS);
    if (!raw) {
      const seed: Friend[] = [
        { id: 'f1', name: 'Aisha', xp: 1200, avatarColor: 'amber' },
        { id: 'f2', name: 'Ben', xp: 980, avatarColor: 'sky' },
        { id: 'f3', name: 'Chi', xp: 860, avatarColor: 'emerald' },
      ];
      window.localStorage.setItem(STORAGE_FRIENDS, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as Friend[];
  } catch {
    return [];
  }
};

export const addFriend = (f: Friend) => {
  if (!canUse()) return;
  const cur = getFriends();
  window.localStorage.setItem(STORAGE_FRIENDS, JSON.stringify([...cur, f]));
};

export const inviteLinkFor = (userId: string) => {
  // simple simulated share link
  return `${location.origin}/avance-game?invite=${encodeURIComponent(userId)}`;
};

export const recordInvite = (fromId: string, toEmail: string) => {
  if (!canUse()) return;
  const raw = window.localStorage.getItem(STORAGE_INVITES) || '[]';
  const invites = JSON.parse(raw) as Array<{ from: string; to: string; at: string }>;
  invites.push({ from: fromId, to: toEmail, at: new Date().toISOString() });
  window.localStorage.setItem(STORAGE_INVITES, JSON.stringify(invites));
};

export const topFriends = (): Friend[] => getFriends().sort((a, b) => b.xp - a.xp);
