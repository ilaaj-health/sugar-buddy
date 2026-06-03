import { prisma } from '@/lib/db';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastLogDate: string | null;
}

export async function getStreak(userId: string): Promise<StreakData> {
  const rows = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
    'SELECT "currentStreak", "longestStreak", "lastLogDate" FROM "User" WHERE id = $1', userId
  );
  if (rows.length === 0) return { currentStreak: 0, longestStreak: 0, lastLogDate: null };
  const r = rows[0];
  return {
    currentStreak: (r.currentStreak as number) || 0,
    longestStreak: (r.longestStreak as number) || 0,
    lastLogDate: r.lastLogDate ? String(r.lastLogDate) : null,
  };
}

export async function updateStreak(userId: string): Promise<{ currentStreak: number; longestStreak: number; newBadges: string[] }> {
  const streak = await getStreak(userId);
  const today = new Date().toISOString().split('T')[0];

  if (streak.lastLogDate === today) {
    return { currentStreak: streak.currentStreak, longestStreak: streak.longestStreak, newBadges: [] };
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  let newStreak: number;

  if (streak.lastLogDate === yesterday) {
    newStreak = streak.currentStreak + 1;
  } else {
    newStreak = 1;
  }

  const newLongest = Math.max(newStreak, streak.longestStreak);

  await prisma.$queryRawUnsafe(
    'UPDATE "User" SET "currentStreak" = $1, "longestStreak" = $2, "lastLogDate" = $3 WHERE id = $4',
    newStreak, newLongest, today, userId
  );

  const newBadges = await checkAndAwardBadges(userId, newStreak);
  return { currentStreak: newStreak, longestStreak: newLongest, newBadges };
}

const BADGE_RULES = [
  { key: 'first_log', name: 'Pehla Qadam', description: 'Pehli reading log ki!', minStreak: 1 },
  { key: 'week_warrior', name: 'Hafta Warrior', description: '7 din lagatar readings!', minStreak: 7 },
  { key: 'two_week', name: '14 Din Champion', description: '2 hafte lagatar!', minStreak: 14 },
  { key: 'month_hero', name: 'Maheena Hero', description: '30 din lagatar readings!', minStreak: 30 },
  { key: 'sixty_days', name: '60 Din Master', description: '60 din lagatar!', minStreak: 60 },
  { key: 'hundred_days', name: '100 Din Legend', description: '100 din lagatar readings!', minStreak: 100 },
];

async function checkAndAwardBadges(userId: string, currentStreak: number): Promise<string[]> {
  const newBadges: string[] = [];

  for (const rule of BADGE_RULES) {
    if (currentStreak >= rule.minStreak) {
      try {
        await prisma.$queryRawUnsafe(
          'INSERT INTO "Badge" (id, "userId", key, name, description) VALUES (gen_random_uuid()::text, $1, $2, $3, $4) ON CONFLICT ("userId", key) DO NOTHING',
          userId, rule.key, rule.name, rule.description
        );
        // Check if it was actually inserted (new badge)
        const result = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
          'SELECT "earnedAt" FROM "Badge" WHERE "userId" = $1 AND key = $2 AND "earnedAt" >= NOW() - INTERVAL \'5 seconds\'',
          userId, rule.key
        );
        if ((result as Array<unknown>).length > 0) {
          newBadges.push(rule.name);
        }
      } catch {
        // Badge already exists, skip
      }
    }
  }

  return newBadges;
}

export async function getBadges(userId: string) {
  const badges = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
    'SELECT key, name, description, "earnedAt" FROM "Badge" WHERE "userId" = $1 ORDER BY "earnedAt" ASC',
    userId
  );
  return badges;
}
