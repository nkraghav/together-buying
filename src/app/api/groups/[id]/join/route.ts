import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { CommitmentStatus } from '@prisma/client';
import { randomUUID } from 'crypto';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: groupId } = await params;

    // Check if group exists and is accepting members
    const group = await prisma.groups.findUnique({
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
    const existingMember = await prisma.group_members.findUnique({
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
    const member = await prisma.group_members.create({
      data: {
        id: randomUUID(),
        groupId,
        userId: session.user.id,
        commitmentStatus: CommitmentStatus.INTERESTED,
        updatedAt: new Date(),
      },
    });

    // Update group member count
    await prisma.groups.update({
      where: { id: groupId },
      data: {
        currentBuyersCount: { increment: 1 },
      },
    });

    // Create milestone
    await prisma.group_milestones.create({
      data: {
        id: randomUUID(),
        groupId,
        title: 'New Member Joined',
        description: `${session.user.name || 'A buyer'} joined the group`,
        type: 'GROUP_CREATED',
      },
    });

    // Log activity
    await prisma.activity_logs.create({
      data: {
        id: randomUUID(),
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

