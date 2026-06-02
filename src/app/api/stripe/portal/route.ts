import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { stripe as getStripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { stripeCustomerId: true } });
  if (!user?.stripeCustomerId) return NextResponse.json({ error: 'No subscription found' }, { status: 404 });

  const session = await getStripe().billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/settings`,
  });

  return NextResponse.json({ url: session.url });
}
