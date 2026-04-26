import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { communicationSchema, paginationSchema } from '@/lib/validations';
import { ZodError } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    const validated = paginationSchema.parse({ page, limit });
    const skip = (validated.page - 1) * validated.limit;
    
    // Build where clause
    let where: any = {};
    
    if (auth.role === 'agent') {
      where.fromAgentId = auth.id;
    }
    
    if (userId) {
      where.toUserId = userId;
    }
    
    if (type) {
      where.type = type;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = new Date(startDate);
      if (endDate) where.timestamp.lte = new Date(endDate);
    }
    
    const total = await prisma.communication.count({ where });
    
    const communications = await prisma.communication.findMany({
      where,
      skip,
      take: validated.limit,
      orderBy: { timestamp: 'desc' },
      include: {
        fromAgent: {
          select: {
            name: true,
            territory: true,
          },
        },
        toUser: {
          select: {
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
    });
    
    return NextResponse.json({
      data: communications,
      pagination: {
        page: validated.page,
        limit: validated.limit,
        total,
        totalPages: Math.ceil(total / validated.limit),
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('GET /api/communications error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth || auth.role !== 'agent') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const validatedData = communicationSchema.parse(body);
    
    const communication = await prisma.communication.create({
      data: {
        fromAgentId: auth.id,
        toUserId: validatedData.toUserId,
        message: validatedData.message,
        type: validatedData.type,
        status: 'pending', // Default status
        timestamp: new Date(),
      },
    });
    
    return NextResponse.json(communication, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('POST /api/communications error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}