import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

function generateCode() {
  return 'SB-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Get my invite code
  const users = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
    'SELECT "inviteCode" FROM "User" WHERE id = $1', userId
  );
  const inviteCode = users[0]?.inviteCode || null;

  // People I'm caring for (I'm the caregiver)
  const caring = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
    `SELECT fl.id, fl."patientId", fl.status, fl."createdAt", u.name, u.email
     FROM "FamilyLink" fl JOIN "User" u ON u.id = fl."patientId"
     WHERE fl."caregiverId" = $1 AND fl.status = 'active'`, userId
  );

  // People caring for me (I'm the patient)
  const caregivers = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
    `SELECT fl.id, fl."caregiverId", fl.status, fl."createdAt", u.name, u.email
     FROM "FamilyLink" fl JOIN "User" u ON u.id = fl."caregiverId"
     WHERE fl."patientId" = $1 AND fl.status = 'active'`, userId
  );

  return NextResponse.json({ inviteCode, caring, caregivers });
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { action, code } = await request.json();

  if (action === 'generate') {
    const inviteCode = generateCode();
    await prisma.$queryRawUnsafe('UPDATE "User" SET "inviteCode" = $1 WHERE id = $2', inviteCode, userId);
    return NextResponse.json({ inviteCode });
  }

  if (action === 'join' && code) {
    // Find patient by invite code
    const patients = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
      'SELECT id, name FROM "User" WHERE "inviteCode" = $1', code.toUpperCase()
    );
    if (patients.length === 0) return NextResponse.json({ error: 'Invalid code' }, { status: 404 });
    const patientId = patients[0].id as string;
    if (patientId === userId) return NextResponse.json({ error: 'Cannot link to yourself' }, { status: 400 });

    try {
      await prisma.$queryRawUnsafe(
        'INSERT INTO "FamilyLink" (id, "caregiverId", "patientId") VALUES (gen_random_uuid()::text, $1, $2)',
        userId, patientId
      );
    } catch {
      return NextResponse.json({ error: 'Already linked' }, { status: 409 });
    }

    return NextResponse.json({ success: true, patientName: patients[0].name });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
