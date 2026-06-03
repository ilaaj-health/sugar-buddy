import { NextResponse } from 'next/server';
import { stripe as getStripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import type Stripe from 'stripe';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');
  if (!signature) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });

  let event: Stripe.Event;
  try { event = getStripe().webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET || ''); }
  catch { return NextResponse.json({ error: 'Invalid signature' }, { status: 400 }); }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (userId && session.subscription) {
        await prisma.user.update({ where: { id: userId }, data: { plan: 'pro', stripeSubscriptionId: session.subscription as string } });
      }
      break;
    }
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      const user = await prisma.user.findUnique({ where: { stripeCustomerId: sub.customer as string } });
      if (user) {
        const isActive = sub.status === 'active' || sub.status === 'trialing';
        await prisma.user.update({ where: { id: user.id }, data: { plan: isActive ? 'pro' : 'free', stripeSubscriptionId: sub.id } });
      }
      break;
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      await prisma.user.updateMany({ where: { stripeCustomerId: sub.customer as string }, data: { plan: 'free', stripeSubscriptionId: null } });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
