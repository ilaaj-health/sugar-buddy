import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const url = new URL(request.url);
  const patientId = url.searchParams.get('id');
  if (!patientId) return NextResponse.json({ error: 'Missing patient id' }, { status: 400 });

  const links = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
    "SELECT id FROM \"FamilyLink\" WHERE \"caregiverId\" = $1 AND \"patientId\" = $2 AND status = 'active'",
    userId, patientId
  );
  if (links.length === 0) return NextResponse.json({ error: 'Not authorized' }, { status: 403 });

  const readings = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
    'SELECT value, type, classification, notes, "takenAt" FROM "Reading" WHERE "userId" = $1 ORDER BY "takenAt" DESC LIMIT 50',
    patientId
  );
  const patient = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
    'SELECT name, age, "diabetesType", "currentStreak" FROM "User" WHERE id = $1', patientId
  );

  return NextResponse.json({ patient: patient[0] || {}, readings });
}
