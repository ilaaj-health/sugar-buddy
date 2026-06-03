import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { getUserPlan } from '@/lib/planLimits';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const plan = await getUserPlan(userId);
  if (plan !== 'pro') return NextResponse.json({ error: 'Pro plan required' }, { status: 403 });

  const readings = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
    `SELECT value, type, classification, notes, "takenAt", "createdAt" FROM "Reading" WHERE "userId" = $1 ORDER BY "takenAt" DESC`,
    userId
  );

  const header = 'Date,Time,Value (mg/dl),Type,Classification,Notes\n';
  const rows = readings.map((r: Record<string, unknown>) => {
    const d = new Date(r.takenAt as string);
    const date = d.toLocaleDateString('en-PK');
    const time = d.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' });
    const notes = ((r.notes as string) || '').replace(/,/g, ';').replace(/\n/g, ' ');
    return `${date},${time},${r.value},${r.type},${r.classification},${notes}`;
  }).join('\n');

  return new NextResponse(header + rows, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="sugar-buddy-readings-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  });
}
