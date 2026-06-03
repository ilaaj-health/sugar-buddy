import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const medicines = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
    'SELECT * FROM "Medicine" WHERE "userId" = $1 ORDER BY "createdAt" ASC', userId
  );
  return NextResponse.json(medicines);
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { name, dosage, times } = await request.json();
  if (!name || !times || !Array.isArray(times)) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  await prisma.$queryRawUnsafe(
    'INSERT INTO "Medicine" (id, "userId", name, dosage, times) VALUES (gen_random_uuid()::text, $1, $2, $3, $4)',
    userId, name, dosage || null, JSON.stringify(times)
  );
  return NextResponse.json({ success: true });
}
