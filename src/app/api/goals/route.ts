import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const rows = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
    'SELECT "goalTarget", "goalType" FROM "User" WHERE id = $1', userId
  );
  if (rows.length === 0) return NextResponse.json({ goalTarget: null, goalType: null });
  return NextResponse.json({ goalTarget: rows[0].goalTarget, goalType: rows[0].goalType });
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { goalTarget, goalType } = await request.json();
  await prisma.$queryRawUnsafe(
    'UPDATE "User" SET "goalTarget" = $1, "goalType" = $2 WHERE id = $3',
    goalTarget, goalType, userId
  );
  return NextResponse.json({ success: true });
}
