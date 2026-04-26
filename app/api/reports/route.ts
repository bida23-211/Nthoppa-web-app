import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function serializeReport(r: any) {
  return {
    ...r,
    data: typeof r.data === 'string' ? JSON.parse(r.data) : r.data,
    generatedAt: r.generatedAt instanceof Date ? r.generatedAt.toISOString() : r.generatedAt,
  };
}

// GET /api/reports
export async function GET(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const agentIdParam = searchParams.get('agentId');

    let where: Record<string, any> = {};

    // Admins can see all reports or filter by agentId
    if (auth.role === 'admin') {
      if (agentIdParam) {
        where.agentId = agentIdParam;
      }
      // No where clause for admins = all reports
    } 
    // Agents can only see their own reports
    else if (auth.role === 'agent') {
      where.agentId = auth.id;
    }
    // Other roles shouldn't access reports
    else {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const reports = await prisma.report.findMany({
      where,
      orderBy: { generatedAt: 'desc' },
    });

    return NextResponse.json(reports.map(serializeReport));
  } catch (error) {
    console.error('GET /api/reports error:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

// POST /api/reports — generate and persist a report
export async function POST(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type, agentId, dateFrom, dateTo } = body as {
      type: string;
      agentId?: string;
      dateFrom?: string;
      dateTo?: string;
    };

    if (!type) {
      return NextResponse.json({ error: 'type is required' }, { status: 400 });
    }

    // Determine which agentId to use for the report
    let resolvedAgentId: string;
    
    if (auth.role === 'admin') {
      // Admin can generate report for any agent, or platform-wide
      resolvedAgentId = agentId ?? 'platform';
    } else if (auth.role === 'agent') {
      // Agent can only generate for themselves
      resolvedAgentId = auth.id;
    } else {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Build date range filter
    const from = dateFrom ? new Date(dateFrom) : new Date(new Date().setMonth(new Date().getMonth() - 1));
    const to = dateTo ? new Date(dateTo) : new Date();

    // Fetch data based on report type
    let reportData: any = { type, dateRange: { from: from.toISOString(), to: to.toISOString() } };

    if (type === 'registration' || type === 'users') {
      const usersWhere: Record<string, any> = {
        registrationDate: { gte: from, lte: to },
      };
      
      if (resolvedAgentId !== 'platform') {
        usersWhere.agentId = resolvedAgentId;
      }

      const users = await prisma.user.findMany({ where: usersWhere });
      const totalUsers = users.length;
      const activeUsers = users.filter((u: any) => u.status === 'active').length;
      const pendingUsers = users.filter((u: any) => u.status === 'pending').length;
      const inactiveUsers = users.filter((u: any) => u.status === 'inactive').length;
      const averageCompletion = totalUsers > 0
        ? Math.round(users.reduce((sum: number, u: any) => sum + (u.completionRate || 0), 0) / totalUsers)
        : 0;

      reportData = {
        ...reportData,
        totalUsers,
        activeUsers,
        pendingUsers,
        inactiveUsers,
        averageCompletion,
      };
    }

    const report = await prisma.report.create({
      data: {
        agentId: resolvedAgentId,
        type,
        data: JSON.stringify(reportData),
      },
    });

    return NextResponse.json(serializeReport(report), { status: 201 });
  } catch (error: any) {
    console.error('POST /api/reports error:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}