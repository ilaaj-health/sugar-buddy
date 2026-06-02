'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { classifyReading } from '@/lib/services/glucoseService';
import { generateInterpretation } from '@/lib/services/aiService';
import { checkEscalation } from '@/lib/services/safetyGate';
import { checkReadingLimit } from '@/lib/planLimits';
import { ReadingType, Classification } from '@/generated/prisma/client';

export type ReadingState = {
  success?: boolean;
  message?: string;
  reading?: { value: number; classification: string };
  interpretation?: string;
  escalation?: { reason: string };
} | undefined;

export async function logReading(state: ReadingState, formData: FormData): Promise<ReadingState> {
  const { userId } = await auth();
  if (!userId) throw new Error('You must be signed in to log a reading.');

  const readingLimit = await checkReadingLimit(userId);
  if (!readingLimit.allowed) {
    return { message: `Aap ki monthly reading limit (${readingLimit.limit}) poori ho gayi hai. Pro plan lein for unlimited readings.` };
  }

  const valueRaw = formData.get('value') as string;
  const type = formData.get('type') as string;
  const takenAtRaw = formData.get('takenAt') as string;

  const value = parseFloat(valueRaw);
  if (isNaN(value) || value < 1 || value > 999) {
    return { message: 'Please enter a valid glucose value (1-999).' };
  }

  const validTypes = ['FASTING', 'POST_MEAL', 'RANDOM', 'BEDTIME'];
  if (!validTypes.includes(type)) {
    return { message: 'Please select a valid reading type.' };
  }

  const classification = classifyReading(value);
  const takenAt = takenAtRaw ? new Date(takenAtRaw) : new Date();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, age: true, diabetesType: true, onInsulin: true },
  });

  const reading = await prisma.reading.create({
    data: {
      userId,
      value,
      type: type as ReadingType,
      classification: classification as Classification,
      takenAt,
    },
  });

  let interpretation = '';
  try {
    interpretation = await generateInterpretation({
      value, type: type as ReadingType, classification: classification as Classification,
      user: user ?? {},
    });
    await prisma.reading.update({ where: { id: reading.id }, data: { interpretation } });
  } catch (e) {
    console.error('Failed to generate interpretation:', e);
  }

  const escalation = checkEscalation(value);
  if (escalation?.shouldEscalate) {
    await prisma.escalationEvent.create({
      data: { userId, triggerReadingId: reading.id, reason: escalation.reason },
    });
  }

  return {
    success: true,
    reading: { value, classification },
    interpretation,
    escalation: escalation?.shouldEscalate ? { reason: escalation.reason } : undefined,
  };
}
