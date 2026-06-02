import { Classification, ReadingType } from '@/generated/prisma/client';
import { classifyReading } from '@/lib/config/safety';

export type { Classification, ReadingType };

export { classifyReading };

export function getClassificationLabel(classification: Classification): {
  romanUrdu: string; english: string;
} {
  switch (classification) {
    case 'LOW': return { romanUrdu: 'Kam', english: 'Low' };
    case 'IN_RANGE': return { romanUrdu: 'Normal', english: 'In Range' };
    case 'HIGH': return { romanUrdu: 'Ziyaada', english: 'High' };
    case 'DANGER': return { romanUrdu: 'Khatarnaak', english: 'Dangerous' };
    default: return { romanUrdu: 'Unknown', english: 'Unknown' };
  }
}

export function getTargetRangeLabel(type: ReadingType): {
  romanUrdu: string; english: string;
} {
  switch (type) {
    case 'FASTING': return { romanUrdu: '70-100 mg/dl (Khaali Pet)', english: '70-100 mg/dl (Fasting)' };
    case 'POST_MEAL': return { romanUrdu: '140 se kam mg/dl (Khaane ke 2 ghante baad)', english: 'Under 140 mg/dl (2hrs post-meal)' };
    case 'RANDOM': return { romanUrdu: '70-140 mg/dl (Be-Tarteeb)', english: '70-140 mg/dl (Random)' };
    case 'BEDTIME': return { romanUrdu: '100-140 mg/dl (Sone se Pehle)', english: '100-140 mg/dl (Bedtime)' };
    default: return { romanUrdu: '70-180 mg/dl', english: '70-180 mg/dl' };
  }
}
