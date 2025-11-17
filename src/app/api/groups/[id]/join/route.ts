import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { CommitmentStatus } from '@prisma/client';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const groupId = params.id;

    // Check if group exists and is accepting members
    const group = await prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    if (group.status !== 'OPEN') {
      return NextResponse.json(
        { error: 'Group is not accepting new members' },
        { status: 400 }
      );
    }

    // Check if user is already a member
    const existingMember = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId: session.user.id,
        },
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: 'You are already a member of this group' },
        { status: 400 }
      );
    }

    // Create group membership
    const member = await prisma.groupMember.create({
      data: {
        groupId,
        userId: session.user.id,
        commitmentStatus: CommitmentStatus.INTERESTED,
      },
    });

    // Update group member count
    await prisma.group.update({
      where: { id: groupId },
      data: {
        currentBuyersCount: { increment: 1 },
      },
    });

    // Create milestone
    await prisma.groupMilestone.create({
      data: {
        groupId,
        title: 'New Member Joined',
        description: `${session.user.name || 'A buyer'} joined the group`,
        type: 'GROUP_CREATED',
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        tenantId: session.user.tenantId,
        userId: session.user.id,
        action: 'GROUP_JOIN',
        entityType: 'Group',
        entityId: groupId,
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error('Error joining group:', error);
    return NextResponse.json(
      { error: 'Failed to join group' },
      { status: 500 }
    );
  }
}

