import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  await prisma.$queryRawUnsafe('DELETE FROM "Medicine" WHERE id = $1 AND "userId" = $2', id, userId);
  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const { enabled } = await request.json();
  await prisma.$queryRawUnsafe('UPDATE "Medicine" SET enabled = $1 WHERE id = $2 AND "userId" = $3', enabled, id, userId);
  return NextResponse.json({ success: true });
}
