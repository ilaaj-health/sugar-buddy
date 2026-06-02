import { prisma } from './db';

export const PLAN_LIMITS = {
  free: {
    readingsPerMonth: 5,
    chatMessagesPerMonth: 10,
    trendsDays: 7,
  },
  pro: {
    readingsPerMonth: Infinity,
    chatMessagesPerMonth: Infinity,
    trendsDays: 90,
  },
};

export type PlanType = keyof typeof PLAN_LIMITS;

function getMonthStart(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export async function getUserPlan(userId: string): Promise<PlanType> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });
  return (user?.plan === 'pro' ? 'pro' : 'free') as PlanType;
}

export async function checkReadingLimit(userId: string): Promise<{ allowed: boolean; used: number; limit: number }> {
  const plan = await getUserPlan(userId);
  const limits = PLAN_LIMITS[plan];

  if (limits.readingsPerMonth === Infinity) {
    return { allowed: true, used: 0, limit: Infinity };
  }

  const monthStart = getMonthStart();
  const used = await prisma.reading.count({
    where: { userId, createdAt: { gte: monthStart } },
  });

  return { allowed: used < limits.readingsPerMonth, used, limit: limits.readingsPerMonth };
}

export async function checkChatLimit(userId: string): Promise<{ allowed: boolean; used: number; limit: number }> {
  const plan = await getUserPlan(userId);
  const limits = PLAN_LIMITS[plan];

  if (limits.chatMessagesPerMonth === Infinity) {
    return { allowed: true, used: 0, limit: Infinity };
  }

  const monthStart = getMonthStart();
  const used = await prisma.chatMessage.count({
    where: { userId, role: 'USER', createdAt: { gte: monthStart } },
  });

  return { allowed: used < limits.chatMessagesPerMonth, used, limit: limits.chatMessagesPerMonth };
}

export async function getTrendsDaysLimit(userId: string): Promise<number> {
  const plan = await getUserPlan(userId);
  return PLAN_LIMITS[plan].trendsDays;
}
