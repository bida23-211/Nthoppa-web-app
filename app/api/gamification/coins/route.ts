import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { GamificationEngine, ACHIEVEMENTS } from '@/lib/gamification';

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth || auth.role !== 'agent') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const agent = await prisma.agent.findUnique({
      where: { id: auth.id },
      include: {
        achievements: true,
        users: true,
        communications: true
      }
    });
    
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }
    
    // Calculate stats
    const stats = {
      usersRegistered: agent.users.length,
      completionRate: agent.users.reduce((sum: number, u: any) => sum + (u.completionRate || 0), 0) / agent.users.length || 0,
      streakDays: agent.streakDays || 0,
      totalSavings: agent.totalSavingsGenerated || 0
    };
    
    const newAchievements = await GamificationEngine.checkAchievements(agent.id, stats);
    const levelInfo = GamificationEngine.calculateLevel(agent.nthoppaCoins || 0);
    
    return NextResponse.json({
      coins: agent.nthoppaCoins || 0,
      level: levelInfo.level,
      nextLevelCoins: levelInfo.nextLevelCoins,
      progress: levelInfo.progress,
      achievements: agent.achievements,
      newAchievements,
      leaderboardRank: agent.leaderboardRank || 0
    });
  } catch (error) {
    console.error('Gamification error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gamification data' },
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
    
    const { action, coins } = await request.json();
    
    // Update agent coins based on actions
    const agent = await prisma.agent.update({
      where: { id: auth.id },
      data: {
        nthoppaCoins: {
          increment: action === 'earn' ? coins : -coins
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      newBalance: agent.nthoppaCoins
    });
  } catch (error) {
    console.error('Failed to update coins:', error);
    return NextResponse.json(
      { error: 'Failed to update coins' },
      { status: 500 }
    );
  }
}