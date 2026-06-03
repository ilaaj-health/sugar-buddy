import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getPatternInsights } from '@/lib/services/insightsService';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const insights = await getPatternInsights(userId);
  return NextResponse.json({ insights });
}
