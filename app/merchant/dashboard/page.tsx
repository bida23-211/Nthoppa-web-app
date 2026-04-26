"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import {
  QrCode, TrendingUp, DollarSign, Users, ShoppingBag,
  ArrowUp, ArrowDown, CreditCard, Smartphone, Wallet,
  ChevronRight, Download, Calendar, Activity, Eye, ChevronLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const transactions = [
  { id: 1, customer: "Thabo M.", amount: 450, method: "wallet", date: "Today, 14:23", status: "Completed", initials: "TM" },
  { id: 2, customer: "Josephine K.", amount: 1280, method: "mobile", date: "Today, 11:45", status: "Completed", initials: "JK" },
  { id: 3, customer: "Michael L.", amount: 350, method: "cash", date: "Yesterday, 16:12", status: "Completed", initials: "ML" },
  { id: 4, customer: "Sarah P.", amount: 890, method: "wallet", date: "Yesterday, 09:34", status: "Pending", initials: "SP" },
];

const getMethodIcon = (method: string) => {
  if (method === "wallet") return <Wallet className="h-3.5 w-3.5" />;
  if (method === "mobile") return <Smartphone className="h-3.5 w-3.5" />;
  return <CreditCard className="h-3.5 w-3.5" />;
};

const getMethodLabel = (method: string) => {
  if (method === "wallet") return "Digital Wallet";
  if (method === "mobile") return "Mobile Money";
  return "Cash";
};

export default function MerchantDashboard() {
  const router = useRouter();
  const [showQr, setShowQr] = useState(false);
  const { toast } = useToast();
  const [todayRevenue, setTodayRevenue] = useState(2480);
  const [monthlyRevenue, setMonthlyRevenue] = useState(48290);
  const [transactionCount, setTransactionCount] = useState(342);

  useEffect(() => {
    fetch('/api/reports')
      .then(r => r.json())
      .then(data => {
        if (data?.reports?.length) {
          const estimatedCount = data.reports.length * 12;
          setTransactionCount(estimatedCount);
          const estimatedRevenue = estimatedCount * 230;
          setMonthlyRevenue(estimatedRevenue);
          const estimatedToday = Math.round(estimatedRevenue * 0.2 / 30);
          setTodayRevenue(estimatedToday > 0 ? estimatedToday : todayRevenue);
        }
      })
      .catch(() => {});
  }, []);

  const handleGenerateQR = () => {
    setShowQr(true);
    toast({ title: "QR Code Ready", description: "Share this code with customers to receive payments" });
  };

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
        <h1 className="text-2xl font-black text-gray-900">Merchant Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Kgabo General Store - Gaborone</p>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Today's Sales", value: `BWP ${todayRevenue.toLocaleString()}`, trend: '+12%', icon: '📈', color: 'border-l-[#E9521C]', trendColor: 'text-green-600', bars: [40, 65, 45, 80, 55, 70, 90] },
          { label: 'This Week', value: 'BWP 15,234', trend: '+8%', icon: '💰', color: 'border-l-blue-400', trendColor: 'text-green-600', bars: [30, 50, 70, 45, 80, 60, 75] },
          { label: 'This Month', value: `BWP ${monthlyRevenue.toLocaleString()}`, trend: '+23%', icon: '📊', color: 'border-l-green-400', trendColor: 'text-green-600', bars: [50, 60, 45, 75, 80, 65, 90] },
          { label: 'Customers', value: transactionCount.toString(), trend: '+45', icon: '👥', color: 'border-l-purple-400', trendColor: 'text-green-600', bars: [20, 40, 30, 60, 45, 70, 55] },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 border-l-4 ${card.color} hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">{card.icon}</span>
              <span className={`text-xs font-bold ${card.trendColor} bg-green-50 px-2 py-0.5 rounded-full`}>
                {card.trend}
              </span>
            </div>
            <div className="font-black text-gray-900 text-xl mb-1">{card.value}</div>
            <div className="text-gray-400 text-xs mb-4">{card.label}</div>
            <div className="flex items-end gap-0.5 h-8 mt-2 border-t border-gray-50 pt-2">
              {card.bars.map((h, j) => (
                <div
                  key={j}
                  className="flex-1 rounded-sm bg-[#E9521C]/20 hover:bg-[#E9521C]/40 transition-colors"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-gray-200 bg-gradient-to-r from-orange-500 to-orange-600 text-white cursor-pointer hover:shadow-lg transition" onClick={handleGenerateQR}>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Generate QR Code</p>
              <p className="font-bold text-lg">Accept Payments</p>
            </div>
            <QrCode className="h-10 w-10 text-white/80" />
          </CardContent>
        </Card>
        <Card className="border-gray-200 cursor-pointer hover:shadow-lg transition" onClick={() => window.location.href = "/merchant/analytics"}>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">View Analytics</p>
              <p className="font-bold text-black text-lg">Detailed Reports</p>
            </div>
            <Activity className="h-10 w-10 text-gray-300" />
          </CardContent>
        </Card>
      </div>

      {/* QR Code Modal */}
      {showQr && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-black">Your Payment QR Code</h3>
              <button onClick={() => setShowQr(false)} className="text-gray-500 hover:text-black">✕</button>
            </div>
            <div className="flex justify-center mb-4">
              <div className="w-48 h-48 bg-black rounded-2xl flex items-center justify-center">
                <QrCode className="h-32 w-32 text-white" />
              </div>
            </div>
            <p className="text-center text-sm text-gray-600 mb-4">Scan with Nthoppa app to pay</p>
            <div className="text-center text-xs text-gray-400 mb-4">
              <p>Kgabo General Store</p>
              <p>Merchant ID: KGS-001</p>
            </div>
            <Button 
              className="w-full bg-[#E9521C] text-white hover:bg-black"
              onClick={() => {
                setShowQr(false);
                toast({ title: "QR Code Shared", description: "Share this QR code with customers" });
              }}
            >
              Share QR Code
            </Button>
          </div>
        </div>
      )}

      {/* Recent Transactions - Fixed View All button */}
      <Card className="border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-black">Recent Transactions</CardTitle>
            <CardDescription>Latest payments received</CardDescription>
          </div>
          <Link href="/merchant/transactions" className="text-[#E9521C] text-sm font-medium hover:underline">
            View All →
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {transactions.map((tx, idx) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center justify-between p-4 hover:bg-orange-50/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-[#E9521C] to-[#c44216] text-white text-xs">
                      {tx.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-black text-sm">{tx.customer}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        {getMethodIcon(tx.method)}
                        {getMethodLabel(tx.method)}
                      </span>
                      <span className="text-xs text-gray-300">•</span>
                      <span className="text-xs text-gray-400">{tx.date}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-black text-sm">BWP {tx.amount}</p>
                  <Badge className={`text-xs ${tx.status === "Completed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"} border-0 mt-1`}>
                    {tx.status}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Floating FAB for QR */}
      <button
        onClick={handleGenerateQR}
        className="fixed bottom-6 right-6 z-40 p-4 bg-[#E9521C] text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
      >
        <QrCode className="h-6 w-6" />
      </button>
    </div>
  );
}