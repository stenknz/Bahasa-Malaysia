export function calculateLevel(totalXp: number): number {
  return Math.floor(Math.sqrt(totalXp / 100));
}

export function getXpForLevel(level: number): number {
  return level * level * 100;
}

export function calculateStreak(lastActivityDate: string | null | undefined): { current: number; frozen: boolean } {
  if (!lastActivityDate) return { current: 0, frozen: false };
  const last = new Date(lastActivityDate);
  const today = new Date();
  const diffDays = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 1) return { current: 1, frozen: false };
  return { current: Math.max(0, 1 - diffDays), frozen: false };
}
