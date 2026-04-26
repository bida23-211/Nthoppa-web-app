import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { order: 'asc' }
    });
    
    return NextResponse.json(courses);
  } catch (error) {
    console.error('GET /api/courses error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}