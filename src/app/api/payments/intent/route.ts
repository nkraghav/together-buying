import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createPaymentIntent } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { TransactionType } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, groupId, type } = await request.json();

    if (!amount || !groupId || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify group exists
    const group = await prisma.groups.findUnique({
      where: { id: groupId },
      include: { projects: true },
    });

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    // Create payment intent with Stripe
    const paymentIntent = await createPaymentIntent(
      amount * 100, // Convert to cents
      'inr',
      {
        userId: session.user.id,
        groupId,
        type,
        projectName: group.projects.name,
      }
    );

    // Create transaction record
    const transaction = await prisma.transactions.create({
      data: {
        id: crypto.randomUUID(),
        tenantId: session.user.tenantId,
        userId: session.user.id,
        groupId,
        type: type as TransactionType,
        amount: amount * 100,
        currency: 'INR',
        status: 'PENDING',
        stripePaymentIntentId: paymentIntent.id,
        description: `${type} for ${group.projects.name}`,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      transactionId: transaction.id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}

