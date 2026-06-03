import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const reports = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
    'SELECT id, "weekStart", content, stats, "createdAt" FROM "WeeklyReport" WHERE "userId" = $1 ORDER BY "createdAt" DESC LIMIT 1',
    userId
  );
  return NextResponse.json(reports[0] || null);
}

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Get user info
  const users = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
    'SELECT name, age, "diabetesType", "onInsulin" FROM "User" WHERE id = $1', userId
  );
  const user = users[0] || {};

  // Get last 7 days readings
  const readings = await prisma.reading.findMany({
    where: { userId, takenAt: { gte: new Date(Date.now() - 7 * 86400000) } },
    orderBy: { takenAt: 'desc' },
    select: { value: true, type: true, classification: true, takenAt: true },
  });

  if (readings.length === 0) {
    return NextResponse.json({ error: 'No readings this week' }, { status: 400 });
  }

  // Calculate stats
  const values = readings.map(r => r.value);
  const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  const highest = Math.round(Math.max(...values));
  const lowest = Math.round(Math.min(...values));
  const inRange = readings.filter(r => r.classification === 'IN_RANGE').length;
  const danger = readings.filter(r => r.classification === 'DANGER').length;
  const fasting = readings.filter(r => r.type === 'FASTING');
  const fastingAvg = fasting.length > 0 ? Math.round(fasting.reduce((a, r) => a + r.value, 0) / fasting.length) : null;
  const postMeal = readings.filter(r => r.type === 'POST_MEAL');
  const postMealAvg = postMeal.length > 0 ? Math.round(postMeal.reduce((a, r) => a + r.value, 0) / postMeal.length) : null;

  const stats = { totalReadings: readings.length, avg, highest, lowest, inRange, danger, fastingAvg, postMealAvg, inRangePct: Math.round((inRange / readings.length) * 100) };

  // Generate AI summary
  const prompt = `Generate a weekly diabetes report summary in Roman Urdu for this patient.
Patient: ${user.name || 'User'}, Age: ${user.age || 'unknown'}, Type: ${user.diabetesType || 'unknown'}

This week's stats:
- Total readings: ${stats.totalReadings}
- Average: ${avg} mg/dl
- Highest: ${highest} mg/dl, Lowest: ${lowest} mg/dl
- In range: ${stats.inRangePct}% (${inRange}/${readings.length})
- Danger readings: ${danger}
${fastingAvg ? `- Fasting average: ${fastingAvg} mg/dl` : ''}
${postMealAvg ? `- Post-meal average: ${postMealAvg} mg/dl` : ''}

Write a 4-6 sentence summary in simple Roman Urdu. Include:
1. Overall assessment (achhi/buri week)
2. Key numbers in context
3. One specific pattern or concern
4. One actionable tip for next week
5. End with encouragement

Do NOT give medication advice. Keep it warm and simple.`;

  let content = '';
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-haiku';
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages: [{ role: 'system', content: 'You are Sugar Buddy, a diabetes education assistant. Reply in Roman Urdu.' }, { role: 'user', content: prompt }], max_tokens: 500, temperature: 0.4 }),
    });
    const data = await res.json();
    content = data.choices?.[0]?.message?.content || 'Report generate nahi ho saka.';
  } catch {
    content = 'AI report generate karne mein masla hua. Stats neeche dekhein.';
  }

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);

  await prisma.$queryRawUnsafe(
    'INSERT INTO "WeeklyReport" (id, "userId", "weekStart", content, stats) VALUES (gen_random_uuid()::text, $1, $2, $3, $4)',
    userId, weekStart.toISOString().split('T')[0], content, JSON.stringify(stats)
  );

  return NextResponse.json({ content, stats });
}
