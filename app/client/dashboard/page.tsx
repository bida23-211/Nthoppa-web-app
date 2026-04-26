"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Wallet, TrendingUp, Shield, BookOpen, ArrowUpRight, 
  Copy, Check, Send, CreditCard, History, FileText,
  ArrowUp, Home, ShoppingBag, Zap, PiggyBank, Eye, Coins, ChevronLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function CircularProgress({ percentage, color, size = "w-16 h-16" }: { percentage: number; color: string; size?: string }) {
  const [animatedPercent, setAnimatedPercent] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setAnimatedPercent(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);
  
  return (
    <div className={`relative ${size}`}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50" cy="50" r="42"
          fill="none" stroke="#e5e7eb" strokeWidth="6"
        />
        <circle
          cx="50" cy="50" r="42"
          fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={`${2 * Math.PI * 42}`}
          strokeDashoffset={`${2 * Math.PI * 42 * (1 - animatedPercent / 100)}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-bold text-sm">{animatedPercent}%</span>
      </div>
    </div>
  );
}

function QuickActionIcon({ icon: Icon, label, onClick }: { icon: any; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1.5 group">
      <div className="w-12 h-12 bg-gradient-to-br from-[#E9521C] to-[#c44216] rounded-2xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-xs font-medium text-gray-600">{label}</span>
    </button>
  );
}

export default function ClientDashboard() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    name: "Josephine Morolong",
    accountNumber: "NTH-2024-00847",
    balance: 12500,
    savingsGoal: 50000,
    savedAmount: 12500,
    literacyScore: 78,
    coinsBalance: 1450,
    kycTier: 2,
    creditScore: 712,
  });

  const stats = {
    balance: 12500,
    savingsGoal: 50000,
    savingsProgress: 25,
    creditScore: 712,
    literacyScore: 78,
    kycStatus: "Verified",
  };

  const transactions = [
    { id: 1, description: "Salary Deposit", amount: 8500, date: "Apr 25, 2026", type: "income", category: "Income", icon: ArrowUp, color: "text-green-600", bg: "bg-green-50" },
    { id: 2, description: "Rent Payment", amount: 3500, date: "Apr 22, 2026", type: "expense", category: "Housing", icon: Home, color: "text-red-600", bg: "bg-red-50" },
    { id: 3, description: "Checkers - Groceries", amount: 1250, date: "Apr 20, 2026", type: "expense", category: "Food", icon: ShoppingBag, color: "text-red-600", bg: "bg-red-50" },
    { id: 4, description: "Electricity Bill", amount: 450, date: "Apr 18, 2026", type: "expense", category: "Utilities", icon: Zap, color: "text-red-600", bg: "bg-red-50" },
    { id: 5, description: "Savings Transfer", amount: 1000, date: "Apr 15, 2026", type: "savings", category: "Savings", icon: PiggyBank, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  const copyAccountNumber = () => {
    navigator.clipboard.writeText(profile.accountNumber);
    setCopied(true);
    toast({ title: "Copied!", description: "Account number copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  const getCreditScoreColor = (score: number) => {
    if (score < 500) return "text-red-600 bg-red-100";
    if (score < 700) return "text-amber-600 bg-amber-100";
    return "text-green-600 bg-green-100";
  };

  const getKycColor = (status: string) => {
    if (status === "Verified") return "bg-green-100 text-green-700 border-green-200";
    return "bg-amber-100 text-amber-700 border-amber-200";
  };

  useEffect(() => {
    const userId = localStorage.getItem('nthoppa_user_id');
    if (userId) {
      fetch(`/api/users/${userId}`)
        .then(r => r.json())
        .then(data => {
          if (data?.user) {
            setProfile(prev => ({
              ...prev,
              name: data.user.fullName || prev.name,
              coinsBalance: data.user.nthoppaCoins || prev.coinsBalance,
            }));
          }
        })
        .catch(() => {});
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-gray-500 hover:text-[#E9521C] font-medium text-sm mb-6 group transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-[#E9521C]/10 flex items-center justify-center transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </div>
        Back
      </button>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Client Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Welcome back, {profile.name.split(' ')[0]}! Here's your financial snapshot</p>
      </div>

      {/* Balance Card */}
      <div className="relative bg-gradient-to-br from-[#E9521C] to-[#7a2a0e] rounded-3xl p-6 md:p-8 overflow-hidden mb-6 shadow-xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <p className="text-white/70 text-sm font-medium mb-2">Total Balance</p>
            <h2 className="text-white font-black text-4xl md:text-5xl tracking-tight">BWP {profile.balance.toLocaleString()}</h2>
            <p className="text-white/50 text-xs mt-2">Account: {profile.accountNumber}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 bg-black/20 rounded-xl px-3 py-2">
              <span className="text-yellow-300 text-sm">🪙</span>
              <span className="text-white font-bold text-sm">{profile.coinsBalance} Coins</span>
            </div>
            <button onClick={copyAccountNumber} className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
              {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-white" />}
            </button>
          </div>
        </div>
        
        <div className="relative z-10 grid grid-cols-4 gap-3 mt-6">
          {[
            { icon: '↑', label: 'Send', onClick: () => toast({ title: "Coming Soon", description: "Send money feature coming soon" }) },
            { icon: '↓', label: 'Receive', onClick: () => toast({ title: "Coming Soon", description: "Receive money feature coming soon" }) },
            { icon: '💳', label: 'Pay', onClick: () => toast({ title: "Coming Soon", description: "Pay bills feature coming soon" }) },
            { icon: '📋', label: 'History', onClick: () => toast({ title: "Coming Soon", description: "Transaction history" }) },
          ].map((action, i) => (
            <button key={i} onClick={action.onClick} className="flex flex-col items-center gap-1.5 bg-black/20 hover:bg-black/30 rounded-2xl py-3 transition-colors">
              <span className="text-white text-lg">{action.icon}</span>
              <span className="text-white/70 text-xs font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-gray-200 card-hover">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-orange-50 rounded-xl">
                <PiggyBank className="h-4 w-4 text-[#E9521C]" />
              </div>
              <CircularProgress percentage={stats.savingsProgress} color="#E9521C" size="w-12 h-12" />
            </div>
            <p className="text-sm font-semibold text-gray-700">Savings Goal</p>
            <p className="text-2xl font-bold text-black">BWP {stats.savingsGoal.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">{stats.savingsProgress}% completed</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 card-hover">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-xl ${getCreditScoreColor(stats.creditScore)}`}>
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className={`rounded-full px-2 py-1 text-xs font-bold ${getCreditScoreColor(stats.creditScore)}`}>
                {stats.creditScore}
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-700">Credit Score</p>
            <p className="text-2xl font-bold text-black">{stats.creditScore}</p>
            <p className="text-xs text-gray-400 mt-1">+12 pts from last month</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 card-hover">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-50 rounded-xl">
                <BookOpen className="h-4 w-4 text-blue-600" />
              </div>
              <CircularProgress percentage={stats.literacyScore} color="#3b82f6" size="w-12 h-12" />
            </div>
            <p className="text-sm font-semibold text-gray-700">Literacy Score</p>
            <p className="text-2xl font-bold text-black">{stats.literacyScore}%</p>
            <p className="text-xs text-gray-400 mt-1">3 modules remaining</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 card-hover">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-green-50 rounded-xl">
                <Shield className="h-4 w-4 text-green-600" />
              </div>
              <Badge className={getKycColor(stats.kycStatus)}>Tier {profile.kycTier}</Badge>
            </div>
            <p className="text-sm font-semibold text-gray-700">KYC Status</p>
            <p className="text-2xl font-bold text-black">{stats.kycStatus} ✓</p>
            <p className="text-xs text-gray-400 mt-1">ID & address confirmed</p>
          </CardContent>
        </Card>
      </div>

      {/* NthoppaSure Banner */}
      <Card className="bg-gradient-to-r from-orange-500 to-orange-600 border-0 card-hover cursor-pointer" onClick={() => window.location.href = "/client/marketplace"}>
        <CardContent className="p-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-white/80 text-sm font-medium">NthoppaSure</p>
              <p className="text-white font-bold text-lg">Insurance made simple</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <span className="text-white/60 text-xs">Motor</span>
                <span className="text-white/60 text-xs">• Property</span>
                <span className="text-white/60 text-xs">• Life</span>
                <span className="text-white/60 text-xs">• Funeral</span>
                <span className="text-white/60 text-xs">• Credit</span>
              </div>
            </div>
            <ArrowUpRight className="h-6 w-6 text-white" />
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions - Fixed View All Link */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-black">Recent Transactions</h2>
          <Link href="/client/transactions" className="text-[#E9521C] text-sm font-medium hover:underline">
            View All →
          </Link>
        </div>
        <Card className="border-gray-200">
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-orange-50/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${tx.bg} flex items-center justify-center`}>
                      <tx.icon className={`h-4 w-4 ${tx.color}`} />
                    </div>
                    <div>
                      <p className="font-medium text-black text-sm">{tx.description}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-gray-400">{tx.date}</p>
                        <span className="text-xs text-gray-300">•</span>
                        <p className="text-xs text-gray-400">{tx.category}</p>
                      </div>
                    </div>
                  </div>
                  <p className={`font-bold text-sm ${tx.amount > 0 ? 'text-green-600' : 'text-gray-800'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} BWP
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Savings Goal Progress Detail */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-black flex items-center gap-2">
            <PiggyBank className="h-5 w-5 text-[#E9521C]" />
            Savings Goal Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">BWP {profile.savedAmount.toLocaleString()} of BWP {profile.savingsGoal.toLocaleString()}</span>
                <span className="font-medium text-black">{stats.savingsProgress}%</span>
              </div>
              <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.savingsProgress}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#E9521C] to-orange-400 rounded-full"
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-400 px-1">
                <span>0%</span>
                <span className="relative">
                  25%
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-gray-300"></div>
                </span>
                <span className="relative">
                  50%
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-gray-300"></div>
                </span>
                <span className="relative">
                  75%
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-gray-300"></div>
                </span>
                <span>100%</span>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              You need <span className="font-bold text-[#E9521C]">BWP {(profile.savingsGoal - profile.savedAmount).toLocaleString()}</span> more to reach your goal.
              <br />At your current rate, you'll reach it in ~4 months.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}