"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  PiggyBank,
  TrendingUp,
  Shield,
  GraduationCap,
  CreditCard,
  Lightbulb,
  Target,
  ChevronRight,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Recommendation {
  type: string;
  title: string;
  description: string;
  impact: string;
  priority: string;
  estimatedReturn?: string;
  riskLevel?: string;
  actionUrl: string;
}

interface AIAdvisorData {
  recommendations: Recommendation[];
  insights: string[];
  literacyScore: number;
}

const typeIcons: Record<string, any> = {
  savings: PiggyBank,
  investment: TrendingUp,
  insurance: Shield,
  education: GraduationCap,
  credit: CreditCard,
};

const priorityColors: Record<string, string> = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  low: "bg-green-100 text-green-700 border-green-200",
};

export default function AIAdvisorPage() {
  const [data, setData] = useState<AIAdvisorData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      const response = await fetch('/api/ai/recommendations');
      const result = await response.json();
      setData(result);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load AI recommendations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout type="agent">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E9521C] mx-auto"></div>
            <p className="mt-4 text-gray-600">AI Advisor is analyzing your financial profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout type="agent">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2 flex items-center gap-2">
              <Brain className="h-8 w-8 text-[#E9521C]" />
              AI Financial Advisor
            </h1>
            <p className="text-gray-600">Personalized recommendations powered by artificial intelligence</p>
          </div>
        </div>

        {/* Financial Literacy Score */}
        <Card className="border-gray-200 bg-gradient-to-r from-[#E9521C]/5 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-semibold text-black">Your Financial Literacy Score</h3>
                <p className="text-sm text-gray-500">Based on your activity and assessments</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-3xl font-bold text-[#E9521C]">{data?.literacyScore || 0}%</div>
                  <p className="text-xs text-gray-500">Proficiency Level</p>
                </div>
                <div className="w-32">
                  <Progress value={data?.literacyScore || 0} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        {data?.insights && data.insights.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-[#E9521C]" />
              AI Insights
            </h2>
            <div className="space-y-2">
              {data.insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800"
                >
                  💡 {insight}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div>
          <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-[#E9521C]" />
            Personalized Recommendations
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {data?.recommendations.map((rec, index) => {
              const Icon = typeIcons[rec.type] || TrendingUp;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => window.location.href = rec.actionUrl}>
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-[#E9521C]/10 rounded-lg">
                          <Icon className="h-6 w-6 text-[#E9521C]" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-black">{rec.title}</h3>
                            <Badge className={priorityColors[rec.priority]}>
                              {rec.priority.toUpperCase()} Priority
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                          <div className="flex items-center gap-3 text-xs">
                            {rec.estimatedReturn && (
                              <span className="text-green-600">📈 {rec.estimatedReturn}</span>
                            )}
                            {rec.riskLevel && (
                              <span className="text-orange-600">⚠️ {rec.riskLevel} Risk</span>
                            )}
                            <span className="text-[#E9521C]">💪 Impact: {rec.impact}</span>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}