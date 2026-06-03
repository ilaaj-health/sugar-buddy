import { prisma } from './db';

// Fallback defaults if PlanConfig table doesn't exist yet
const DEFAULTS = {
  free: { readingsPerMonth: 5, chatMessagesPerMonth: 10, trendsDays: 7 },
  pro: { readingsPerMonth: Infinity, chatMessagesPerMonth: Infinity, trendsDays: 90 },
};

export type PlanType = 'free' | 'pro';

async function getPlanConfig() {
  try {
    const rows = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
      'SELECT * FROM "PlanConfig" WHERE id = $1', 'default'
    );
    if (rows.length === 0) return null;
    return rows[0];
  } catch {
    return null; // table might not exist
  }
}

function getMonthStart(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export async function getUserPlan(userId: string): Promise<PlanType> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { plan: true } });
  return (user?.plan === 'pro' ? 'pro' : 'free') as PlanType;
}

async function getLimits(plan: PlanType) {
  const config = await getPlanConfig();
  if (!config) return DEFAULTS[plan];

  if (plan === 'pro') {
    const r = config.proReadings as number;
    const c = config.proChatMessages as number;
    return {
      readingsPerMonth: r === -1 ? Infinity : r,
      chatMessagesPerMonth: c === -1 ? Infinity : c,
      trendsDays: config.proTrendsDays as number,
    };
  }

  return {
    readingsPerMonth: config.freeReadings as number,
    chatMessagesPerMonth: config.freeChatMessages as number,
    trendsDays: config.freeTrendsDays as number,
  };
}

export async function checkReadingLimit(userId: string) {
  const plan = await getUserPlan(userId);
  const limits = await getLimits(plan);
  if (limits.readingsPerMonth === Infinity) return { allowed: true, used: 0, limit: Infinity };
  const used = await prisma.reading.count({ where: { userId, createdAt: { gte: getMonthStart() } } });
  return { allowed: used < limits.readingsPerMonth, used, limit: limits.readingsPerMonth };
}

export async function checkChatLimit(userId: string) {
  const plan = await getUserPlan(userId);
  const limits = await getLimits(plan);
  if (limits.chatMessagesPerMonth === Infinity) return { allowed: true, used: 0, limit: Infinity };
  const used = await prisma.chatMessage.count({ where: { userId, role: 'USER', createdAt: { gte: getMonthStart() } } });
  return { allowed: used < limits.chatMessagesPerMonth, used, limit: limits.chatMessagesPerMonth };
}

export async function getTrendsDaysLimit(userId: string) {
  const plan = await getUserPlan(userId);
  const limits = await getLimits(plan);
  return limits.trendsDays;
}
