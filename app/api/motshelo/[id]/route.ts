import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type Params = { params: Promise<{ id: string }> };

export async function GET(
  request: NextRequest,
  { params }: Params
) {
  try {
    const auth = await verifyAuth(request);
    if (!auth || auth.role !== 'agent') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const motshelo = await prisma.motsheloGroup.findFirst({
      where: {
        id,
        agentId: auth.id
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                phone: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!motshelo) {
      return NextResponse.json({ error: 'Motshelo group not found' }, { status: 404 });
    }

    return NextResponse.json(motshelo);
  } catch (error) {
    console.error('GET /api/motshelo/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
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
    const { status, currentBalance } = body;

    const motshelo = await prisma.motsheloGroup.updateMany({
      where: {
        id,
        agentId: auth.id
      },
      data: {
        ...(status && { status }),
        ...(currentBalance !== undefined && { currentBalance })
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PATCH /api/motshelo/[id] error:', error);
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

    const motshelo = await prisma.motsheloGroup.findFirst({
      where: {
        id,
        agentId: auth.id
      }
    });

    if (!motshelo) {
      return NextResponse.json({ error: 'Motshelo group not found' }, { status: 404 });
    }

    if (motshelo.status === 'active') {
      return NextResponse.json({ error: 'Cannot delete active motshelo group' }, { status: 400 });
    }

    await prisma.motsheloGroup.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/motshelo/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}