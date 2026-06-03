import { prisma } from '@/lib/db';

interface Insight {
  type: 'warning' | 'positive' | 'info';
  message: string;
}

export async function getPatternInsights(userId: string): Promise<Insight[]> {
  const insights: Insight[] = [];

  const readings = await prisma.reading.findMany({
    where: { userId, takenAt: { gte: new Date(Date.now() - 7 * 86400000) } },
    orderBy: { takenAt: 'desc' },
    select: { value: true, type: true, classification: true, takenAt: true },
  });

  if (readings.length === 0) return [{ type: 'info', message: 'Abhi tak koi reading nahi — pehli reading log karein!' }];

  // Check for consecutive high readings
  const lastThree = readings.slice(0, 3);
  const allHigh = lastThree.length >= 3 && lastThree.every(r => r.classification === 'HIGH' || r.classification === 'DANGER');
  if (allHigh) {
    insights.push({ type: 'warning', message: 'Aap ki pichli 3 readings high hain — khaane aur warzish par dhyan dein.' });
  }

  // Check for improving trend
  if (readings.length >= 5) {
    const recent = readings.slice(0, 3).reduce((a, r) => a + r.value, 0) / 3;
    const older = readings.slice(-3).reduce((a, r) => a + r.value, 0) / Math.min(3, readings.slice(-3).length);
    if (recent < older - 10) {
      insights.push({ type: 'positive', message: `Achhi khabar! Aap ki sugar pichle hafte se ${Math.round(older - recent)} mg/dl kam hui hai.` });
    }
  }

  // Fasting sugar pattern
  const fasting = readings.filter(r => r.type === 'FASTING');
  if (fasting.length >= 3) {
    const avg = Math.round(fasting.reduce((a, r) => a + r.value, 0) / fasting.length);
    if (avg > 130) {
      insights.push({ type: 'warning', message: `Khaali pet sugar ausat ${avg} mg/dl hai — target 70-100 hai. Raat ka khaana jaldi khayein.` });
    } else if (avg <= 100) {
      insights.push({ type: 'positive', message: `Khaali pet sugar ausat ${avg} mg/dl — bilkul normal range mein! Shandar!` });
    }
  }

  // Post-meal pattern
  const postMeal = readings.filter(r => r.type === 'POST_MEAL');
  if (postMeal.length >= 3) {
    const avg = Math.round(postMeal.reduce((a, r) => a + r.value, 0) / postMeal.length);
    if (avg > 180) {
      insights.push({ type: 'warning', message: `Khaane ke baad sugar ausat ${avg} mg/dl hai — chhoti roti aur zyada sabzi try karein.` });
    }
  }

  // In-range percentage
  const inRange = readings.filter(r => r.classification === 'IN_RANGE').length;
  const pct = Math.round((inRange / readings.length) * 100);
  if (pct >= 80) {
    insights.push({ type: 'positive', message: `Is hafte ${pct}% readings normal range mein — bohat achha kaam!` });
  } else if (pct < 50) {
    insights.push({ type: 'info', message: `Is hafte sirf ${pct}% readings normal mein — doctor se zaroor milein.` });
  }

  return insights.slice(0, 4); // Max 4 insights
}
