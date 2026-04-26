// app/api/agents/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { verifyAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function serializeAgent(a: any) {
  // Never expose the hashed password to the client
  const { loginPassword: _pw, ...rest } = a;
  return {
    ...rest,
    createdAt: a.createdAt instanceof Date ? a.createdAt.toISOString() : a.createdAt,
    updatedAt: a.updatedAt instanceof Date ? a.updatedAt.toISOString() : a.updatedAt,
  };
}

// GET /api/agents
export async function GET(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    // Agents can only see themselves; admins see all
    const where = auth.role === 'agent' ? { id: auth.id } : {};
    const agents = await prisma.agent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ agents: agents.map(serializeAgent) });
  } catch (error) {
    console.error('GET /api/agents error:', error);
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 });
  }
}

// POST /api/agents — admin only
export async function POST(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth || auth.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, email, loginEmail, loginPassword, territory, isActive } = body as {
      name: string;
      email: string;
      loginEmail: string;
      loginPassword: string;
      territory: string;
      isActive?: boolean;
    };

    if (!name || !email || !loginEmail || !loginPassword || !territory) {
      return NextResponse.json(
        { error: 'name, email, loginEmail, loginPassword, and territory are required' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(loginPassword, 10);

    const agent = await prisma.agent.create({
      data: {
        name,
        email,
        loginEmail,
        loginPassword: hashedPassword,
        territory,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(serializeAgent(agent), { status: 201 });
  } catch (error: any) {
    console.error('POST /api/agents error:', error);
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'An agent with that email or login email already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 });
  }
}