import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

type Params = { params: Promise<{ id: string }> };

const addMemberSchema = z.object({
  userId: z.string()
});

export async function POST(
  request: NextRequest,
  { params }: Params
) {
  try {
    const auth = await verifyAuth(request);
    if (!auth || auth.role !== 'agent') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validated = addMemberSchema.parse(body);

    const motshelo = await prisma.motsheloGroup.findFirst({
      where: {
        id,
        agentId: auth.id
      }
    });

    if (!motshelo) {
      return NextResponse.json({ error: 'Motshelo group not found' }, { status: 404 });
    }

    const existingMember = await prisma.motsheloMember.findUnique({
      where: {
        groupId_userId: {
          groupId: id,
          userId: validated.userId
        }
      }
    });

    if (existingMember) {
      return NextResponse.json({ error: 'User already in group' }, { status: 400 });
    }

    await prisma.motsheloMember.create({
      data: {
        groupId: id,
        userId: validated.userId,
        totalPaid: 0
      }
    });

    await prisma.motsheloGroup.update({
      where: { id },
      data: { totalMembers: { increment: 1 } }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('POST /api/motshelo/[id]/members error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: Params
) {
  try {
    const auth = await verifyAuth(request);
    if (!auth || auth.role !== 'agent') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    const motshelo = await prisma.motsheloGroup.findFirst({
      where: {
        id,
        agentId: auth.id
      }
    });

    if (!motshelo) {
      return NextResponse.json({ error: 'Motshelo group not found' }, { status: 404 });
    }

    await prisma.motsheloMember.delete({
      where: {
        groupId_userId: {
          groupId: id,
          userId: userId
        }
      }
    });

    await prisma.motsheloGroup.update({
      where: { id },
      data: { totalMembers: { decrement: 1 } }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/motshelo/[id]/members error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}