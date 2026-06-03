import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getStreak, getBadges } from '@/lib/services/streakService';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const streak = await getStreak(userId);
  const badges = await getBadges(userId);
  return NextResponse.json({ ...streak, badges });
}
