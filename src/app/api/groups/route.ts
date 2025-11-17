import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { GroupStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status') as GroupStatus | null;

    const where: any = {
      isActive: true,
    };

    if (projectId) where.projectId = projectId;
    if (status) where.status = status;

    const groups = await prisma.group.findMany({
      where,
      include: {
        project: {
          select: {
            name: true,
            slug: true,
            city: true,
            images: true,
          },
        },
        _count: {
          select: { members: true },
        },
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch groups' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions (Organizer or above)
    if (
      !['ORGANIZER', 'PARTNER_ADMIN', 'SUPER_ADMIN'].includes(session.user.role)
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await request.json();

    const group = await prisma.group.create({
      data: {
        ...data,
        tenantId: session.user.tenantId,
        createdById: session.user.id,
      },
    });

    // Create initial milestone
    await prisma.groupMilestone.create({
      data: {
        groupId: group.id,
        title: 'Group Created',
        description: `${session.user.name || 'Organizer'} created this group`,
        type: 'GROUP_CREATED',
      },
    });

    return NextResponse.json(group, { status: 201 });
  } catch (error) {
    console.error('Error creating group:', error);
    return NextResponse.json(
      { error: 'Failed to create group' },
      { status: 500 }
    );
  }
}

