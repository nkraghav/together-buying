import { NextRequest, NextResponse } from 'next/server';
import { constructWebhookEvent } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  try {
    const event = constructWebhookEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object);
        break;

      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}

async function handlePaymentSuccess(paymentIntent: any) {
  const transaction = await prisma.transactions.findUnique({
    where: { stripePaymentIntentId: paymentIntent.id },
      include: { groups: true },
  });

  if (!transaction) {
    console.error('Transaction not found for payment intent:', paymentIntent.id);
    return;
  }

  // Update transaction status
  await prisma.transactions.update({
    where: { id: transaction.id },
    data: {
      status: 'COMPLETED',
      stripeChargeId: paymentIntent.charges.data[0]?.id,
    },
  });

  // Update group member commitment status
  if (transaction.groupId) {
    await prisma.group_members.updateMany({
      where: {
        groupId: transaction.groupId,
        userId: transaction.userId,
      },
      data: {
        commitmentStatus: 'PAID',
        paymentReference: paymentIntent.id,
      },
    });

    // Create milestone
    await prisma.group_milestones.create({
      data: {
        id: randomUUID(),
        groupId: transaction.groupId,
        title: 'Payment Received',
        description: 'A member has completed their payment',
        type: 'GROUP_CREATED',
      },
    });
  }

  // Log activity
    await prisma.activity_logs.create({
    data: {
      id: randomUUID(),
      tenantId: transaction.tenantId,
      userId: transaction.userId,
      action: 'PAYMENT_COMPLETED',
      entityType: 'Transaction',
      entityId: transaction.id,
      metadata: {
        amount: transaction.amount,
        paymentIntentId: paymentIntent.id,
      },
    },
  });
}

async function handlePaymentFailure(paymentIntent: any) {
  const transaction = await prisma.transactions.findUnique({
    where: { stripePaymentIntentId: paymentIntent.id },
  });

  if (!transaction) return;

  await prisma.transactions.update({
    where: { id: transaction.id },
    data: { status: 'FAILED' },
  });
}

async function handlePaymentCanceled(paymentIntent: any) {
  const transaction = await prisma.transactions.findUnique({
    where: { stripePaymentIntentId: paymentIntent.id },
  });

  if (!transaction) return;

  await prisma.transactions.update({
    where: { id: transaction.id },
    data: { status: 'FAILED' },
  });
}

