import { prisma } from '@/lib/db';

export async function getDailyTip(): Promise<{ tip: string; tipEn: string } | null> {
  try {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const tips = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
      'SELECT tip, "tipEn" FROM "DailyTip" ORDER BY id'
    );
    if (tips.length === 0) return null;
    const index = dayOfYear % tips.length;
    const t = tips[index];
    return { tip: t.tip as string, tipEn: t.tipEn as string };
  } catch {
    return null;
  }
}
