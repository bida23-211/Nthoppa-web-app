"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, DollarSign, ArrowUp, ArrowDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

export default function MerchantAnalyticsPage() {
  const weeklyData = [
    { day: "Mon", revenue: 3200, orders: 18 },
    { day: "Tue", revenue: 4100, orders: 22 },
    { day: "Wed", revenue: 2800, orders: 15 },
    { day: "Thu", revenue: 5100, orders: 28 },
    { day: "Fri", revenue: 6200, orders: 32 },
    { day: "Sat", revenue: 4800, orders: 25 },
    { day: "Sun", revenue: 3500, orders: 19 },
  ];

  const monthlyData = [
    { month: "Jan", revenue: 12500 },
    { month: "Feb", revenue: 15200 },
    { month: "Mar", revenue: 18800 },
    { month: "Apr", revenue: 28500 },
  ];

  const totalRevenue = weeklyData.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = weeklyData.reduce((sum, d) => sum + d.orders, 0);
  const avgOrderValue = totalRevenue / totalOrders;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Track your business performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Revenue", value: `BWP ${totalRevenue.toLocaleString()}`, change: "+8.2%", icon: <DollarSign className="h-5 w-5" />, trend: "up" },
          { label: "Total Orders", value: totalOrders, change: "+5.4%", icon: <Users className="h-5 w-5" />, trend: "up" },
          { label: "Avg Order Value", value: `BWP ${Math.round(avgOrderValue)}`, change: "+2.1%", icon: <TrendingUp className="h-5 w-5" />, trend: "up" },
        ].map(m => (
          <Card key={m.label} className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500">{m.label}</p>
                <div className="text-gray-400">{m.icon}</div>
              </div>
              <p className="text-2xl font-bold text-black">{m.value}</p>
              <p className={`text-xs ${m.trend === 'up' ? 'text-green-600' : 'text-red-600'} mt-1 flex items-center gap-1`}>
                {m.trend === 'up' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {m.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly Revenue Chart using Recharts */}
      <Card className="border-gray-200">
        <CardContent className="p-5">
          <h3 className="font-semibold text-black mb-4">Weekly Revenue (BWP)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => [`BWP ${Number(value).toLocaleString()}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#E9521C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly Trend Chart */}
      <Card className="border-gray-200">
        <CardContent className="p-5">
          <h3 className="font-semibold text-black mb-4">Monthly Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => [`BWP ${Number(value).toLocaleString()}`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#E9521C" strokeWidth={2} dot={{ fill: '#E9521C', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Customer Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-gray-200">
          <CardContent className="p-5">
            <h3 className="font-semibold text-black mb-3">Top Customers</h3>
            <div className="space-y-3">
              {[
                { name: "Josephine Morolong", spent: 2450, orders: 8 },
                { name: "Tshepo Kgosi", spent: 1820, orders: 6 },
                { name: "Mpho Sebina", spent: 1350, orders: 5 },
              ].map(c => (
                <div key={c.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-black">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.orders} orders</p>
                  </div>
                  <p className="text-sm font-semibold text-[#E9521C]">BWP {c.spent}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-5">
            <h3 className="font-semibold text-black mb-3">Payment Methods</h3>
            <div className="space-y-3">
              {[
                { method: "Nthoppa Wallet", percentage: 65, color: "#E9521C" },
                { method: "Mobile Money", percentage: 22, color: "#10B981" },
                { method: "Cash", percentage: 13, color: "#6366F1" },
              ].map(p => (
                <div key={p.method}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{p.method}</span>
                    <span>{p.percentage}%</span>
                  </div>
                  <Progress value={p.percentage} className="h-2" style={{ backgroundColor: `${p.color}20` }} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Repeat Purchase Rate */}
      <Card className="border-gray-200">
        <CardContent className="p-5">
          <h3 className="font-semibold text-black mb-2">Customer Loyalty</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Repeat Purchase Rate</span>
            <span className="text-2xl font-bold text-[#E9521C]">68%</span>
          </div>
          <Progress value={68} className="h-2 mb-3" />
          <p className="text-xs text-gray-400">124 total customers · 84 repeat customers</p>
        </CardContent>
      </Card>
    </div>
  );
}