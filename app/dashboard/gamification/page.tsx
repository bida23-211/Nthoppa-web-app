"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Trophy,
  Medal,
  Star,
  Target,
  TrendingUp,
  Users,
  Calendar,
  CheckCircle,
  Lock,
  Gift,
  Crown,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface GamificationData {
  coins: number;
  level: number;
  nextLevelCoins: number;
  progress: number;
  achievements: Achievement[];
  newAchievements: Achievement[];
  leaderboardRank: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  coinsReward: number;
  badge: string;
}

export default function GamificationPage() {
  const [data, setData] = useState<GamificationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch('/api/gamification/coins');
      const result = await response.json();
      setData(result);
      
      // Load leaderboard
      const leaderboardRes = await fetch('/api/gamification/leaderboard');
      const leaderboardData = await leaderboardRes.json();
      setLeaderboard(leaderboardData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load gamification data",
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
            <p className="mt-4 text-gray-600">Loading your rewards...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const coins = data?.coins || 0;
  const level = data?.level || 1;
  const nextLevelCoins = data?.nextLevelCoins || 1000;
  const progress = data?.progress || 0;
  const leaderboardRank = data?.leaderboardRank || 0;
  const achievements = data?.achievements || [];

  const coinsUntilNextLevel = ((data?.nextLevelCoins ?? 0) - (data?.coins || 0)) > 0 ? (data?.nextLevelCoins ?? 0) - (data?.coins || 0) : 0;

  return (
    <DashboardLayout type="agent">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Nthoppa Rewards</h1>
          <p className="text-gray-600">Earn coins, unlock achievements, and climb the leaderboard</p>
        </div>

        {/* Coins and Level Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-gray-200 bg-gradient-to-br from-[#E9521C] to-black text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Your Nthoppa Coins</p>
                  <p className="text-4xl font-bold mt-2">{coins}</p>
                  <p className="text-white/70 text-sm mt-1">
                    Rank #{leaderboardRank} on leaderboard
                  </p>
                </div>
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                  <Gift className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-500 text-sm">Level {level}</p>
                  <p className="text-2xl font-bold text-black mt-1">
                    {coins} / {nextLevelCoins} coins
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#E9521C]/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-[#E9521C]" />
                </div>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-gray-500 mt-2">
                {coinsUntilNextLevel} coins until next level
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Achievements Section */}
        <div>
          <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-[#E9521C]" />
            Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.length > 0 ? (
              achievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{achievement.badge}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-black">{achievement.name}</h3>
                      <p className="text-sm text-gray-500">{achievement.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-[#E9521C] text-white">
                          +{achievement.coinsReward} coins
                        </Badge>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                <Award className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No achievements unlocked yet. Keep going!</p>
              </div>
            )}
          </div>
        </div>

        {/* Leaderboard */}
        <div>
          <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-[#E9521C]" />
            Leaderboard
          </h2>
          <Card className="border-gray-200">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Rank</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Agent</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Territory</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Coins</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.length > 0 ? (
                      leaderboard.map((agent, index) => (
                        <tr key={agent.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            {index === 0 && <Trophy className="h-5 w-5 text-yellow-500" />}
                            {index === 1 && <Medal className="h-5 w-5 text-gray-400" />}
                            {index === 2 && <Medal className="h-5 w-5 text-amber-600" />}
                            {index > 2 && <span className="text-gray-600">#{index + 1}</span>}
                          </td>
                          <td className="py-3 px-4 font-medium text-black">{agent.name}</td>
                          <td className="py-3 px-4 text-gray-600">{agent.territory}</td>
                          <td className="py-3 px-4 text-right font-bold text-[#E9521C]">{agent.nthoppaCoins || 0}</td>
                          <td className="py-3 px-4 text-right text-gray-600">Lvl {Math.floor((agent.nthoppaCoins || 0) / 1000) + 1}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-gray-500">
                          <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                          <p>No leaderboard data available</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}