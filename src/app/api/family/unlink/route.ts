import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { linkId } = await request.json();
  await prisma.$queryRawUnsafe(
    'DELETE FROM "FamilyLink" WHERE id = $1 AND ("caregiverId" = $2 OR "patientId" = $2)', linkId, userId
  );
  return NextResponse.json({ success: true });
}
