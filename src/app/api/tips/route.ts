import { NextResponse } from 'next/server';
import { getDailyTip } from '@/lib/services/tipsService';

export async function GET() {
  const tip = await getDailyTip();
  return NextResponse.json(tip || { tip: 'Roz apni sugar check karein!', tipEn: 'Check your sugar daily!' });
}
