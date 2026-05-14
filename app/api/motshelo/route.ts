import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createMotsheloSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  monthlyContribution: z.number().positive(),
});

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth || auth.role !== 'agent') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const motshelos = await prisma.motsheloGroup.findMany({
      where: { agentId: auth.id },
      include: {
        _count: {
          select: { members: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(motshelos);
  } catch (error) {
    console.error('GET /api/motshelo error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth || auth.role !== 'agent') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = createMotsheloSchema.parse(body);

    const motshelo = await prisma.motsheloGroup.create({
      data: {
        name: validated.name,
        description: validated.description,
        monthlyContribution: validated.monthlyContribution,
        agentId: auth.id,
        totalMembers: 0,
        currentBalance: 0,
        status: 'active'
      }
    });

    return NextResponse.json(motshelo, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('POST /api/motshelo error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}