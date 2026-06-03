import { Classification } from '@/generated/prisma/client';

export const GLUCOSE_THRESHOLDS = {
  DANGER_LOW: 70,
  NORMAL_LOW: 70,
  NORMAL_HIGH: 180,
  DANGER_HIGH: 300,
};

export function classifyReading(value: number): Classification {
  if (value < GLUCOSE_THRESHOLDS.DANGER_LOW) return 'DANGER' as Classification;
  if (value < GLUCOSE_THRESHOLDS.NORMAL_LOW) return 'LOW' as Classification;
  if (value <= GLUCOSE_THRESHOLDS.NORMAL_HIGH) return 'IN_RANGE' as Classification;
  if (value <= GLUCOSE_THRESHOLDS.DANGER_HIGH) return 'HIGH' as Classification;
  return 'DANGER' as Classification;
}

export const ESCALATION_MESSAGES = {
  LOW: {
    romanUrdu: 'Khatraa: Aap ki sugar bohat kam hai! Fori taur par koi meethi cheez khaayein (juice, cheeni, mithai) aur doctor se raabta karein.',
    english: 'DANGER: Your blood sugar is critically low! Eat something sweet immediately and contact your doctor.',
  },
  HIGH: {
    romanUrdu: 'Khatraa: Aap ki sugar bohat zyaada hai! Paani piyein aur fori taur par doctor se raabta karein.',
    english: 'DANGER: Your blood sugar is critically high! Drink water and contact your doctor immediately.',
  },
};

export const DOSING_KEYWORDS = [
  'dose', 'doses', 'units', 'insulin dose', 'kitni insulin', 'insulin units',
  'dawai badh', 'dawai kam', 'medicine dose', 'dosage',
];

export const DANGER_SYMPTOMS = [
  'chest pain', 'seene mein dard', 'behosh', 'faint', 'fainting',
  'nazar', 'vision loss', 'saans', 'breathing', 'confusion',
];
