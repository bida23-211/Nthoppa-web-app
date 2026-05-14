import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AIFinancialAdvisor, UserFinancialProfile } from '@/lib/ai-financial-advisor';

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For agents: look up the agent and their users' aggregate profile
    if (auth.role === 'agent') {
      const agent = await prisma.agent.findUnique({
        where: { id: auth.id },
        include: {
          users: {
            include: {
              financialProfile: true,
              transactions: { take: 10, orderBy: { date: 'desc' } }
            }
          }
        }
      });

      if (!agent) {
        return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
      }

      // Use the first user's financial profile for recommendations, or defaults
      const firstUserWithProfile = agent.users.find((u: any) => u.financialProfile);
      const profile = firstUserWithProfile?.financialProfile;
      const transactions = firstUserWithProfile?.transactions || [];

      // Parse products if it's a string (JSON), otherwise use empty array
      let existingProducts: string[] = [];
      if (profile?.products) {
        if (typeof profile.products === 'string') {
          try {
            existingProducts = JSON.parse(profile.products);
          } catch {
            existingProducts = [];
          }
        } else if (Array.isArray(profile.products)) {
          existingProducts = profile.products;
        }
      }

      const financialProfile: UserFinancialProfile = {
        userId: auth.id,
        monthlyIncome: profile?.monthlyIncome ?? 0,
        employmentStatus: profile?.employmentStatus ?? 'unknown',
        savingsGoal: profile?.savingsGoal ?? undefined,
        riskTolerance: (profile?.riskTolerance as 'low' | 'medium' | 'high') || 'medium',
        financialLiteracyScore: profile?.literacyScore ?? 30,
        existingProducts: existingProducts,
        spendingPatterns: transactions.map((t: any) => ({
          category: t.category || 'other',
          percentage: t.percentageOfIncome || 0,
          trend: (t.trend as 'increasing' | 'decreasing' | 'stable') || 'stable'
        }))
      };

      const recommendations = await AIFinancialAdvisor.getPersonalizedRecommendations(financialProfile);
      const insights = await AIFinancialAdvisor.analyzeSpendingHabits(financialProfile.spendingPatterns);

      return NextResponse.json({
        recommendations,
        insights,
        literacyScore: financialProfile.financialLiteracyScore
      });
    }

    // For other roles: return generic recommendations
    const genericProfile: UserFinancialProfile = {
      userId: auth.id,
      monthlyIncome: 0,
      employmentStatus: 'unknown',
      savingsGoal: undefined,
      riskTolerance: 'medium',
      financialLiteracyScore: 30,
      existingProducts: [],
      spendingPatterns: []
    };

    const recommendations = await AIFinancialAdvisor.getPersonalizedRecommendations(genericProfile);
    const insights = await AIFinancialAdvisor.analyzeSpendingHabits([]);

    return NextResponse.json({
      recommendations,
      insights,
      literacyScore: genericProfile.financialLiteracyScore
    });
  } catch (error) {
    console.error('GET /api/ai/recommendations error:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}