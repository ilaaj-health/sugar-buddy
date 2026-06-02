import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const messages = await prisma.chatMessage.findMany({ where: { userId }, orderBy: { createdAt: "asc" }, take: 100, select: { id: true, role: true, content: true, createdAt: true } });
  return NextResponse.json({ messages });
}

export async function DELETE() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.chatMessage.deleteMany({ where: { userId } });
  return NextResponse.json({ success: true });
}
