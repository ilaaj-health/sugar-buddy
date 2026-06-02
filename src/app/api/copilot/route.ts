import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { checkUserInputSafety, processAIOutput } from "@/lib/services/safetyGate";
import { getCopilotResponse } from "@/lib/services/aiService";
import { ChatRole } from "@/generated/prisma/client";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { message?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body" }, { status: 400 }); }

  const message = body.message?.trim();
  if (!message) return NextResponse.json({ error: "Message is required" }, { status: 400 });

  const inputSafety = checkUserInputSafety(message);
  if (inputSafety.fixedResponse) {
    await prisma.chatMessage.createMany({ data: [
      { userId, role: ChatRole.USER, content: message },
      { userId, role: ChatRole.ASSISTANT, content: inputSafety.fixedResponse },
    ]});
    return NextResponse.json({ response: inputSafety.fixedResponse });
  }

  const [user, recentReadings, totalReadings, chatHistory] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true, age: true, diabetesType: true, onInsulin: true, createdAt: true } }),
    prisma.reading.findMany({ where: { userId, takenAt: { gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) } }, orderBy: { takenAt: "desc" }, take: 20, select: { value: true, type: true, classification: true, takenAt: true } }),
    prisma.reading.count({ where: { userId } }),
    prisma.chatMessage.findMany({ where: { userId }, orderBy: { createdAt: "asc" }, take: 20, select: { role: true, content: true } }),
  ]);

  const aiResponse = await getCopilotResponse({
    message,
    chatHistory: chatHistory.map((m: { role: string; content: string }) => ({
      role: m.role === ChatRole.USER ? ("user" as const) : ("assistant" as const), content: m.content,
    })),
    user: user ?? {},
    totalReadings,
    recentReadings: recentReadings.map((r: { value: number; type: string; classification: string; takenAt: Date }) => ({
      value: r.value, type: r.type, classification: r.classification, takenAt: r.takenAt,
    })),
  });

  const safeResponse = processAIOutput(aiResponse);

  await prisma.chatMessage.createMany({ data: [
    { userId, role: ChatRole.USER, content: message },
    { userId, role: ChatRole.ASSISTANT, content: safeResponse },
  ]});

  return NextResponse.json({ response: safeResponse });
}
