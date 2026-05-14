"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  Users,
  DollarSign,
  ShoppingBag,
  Calendar,
  ArrowUp,
  ArrowDown,
  Download,
  Filter,
  ChevronLeft,
  Award,
  Building2,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import {
  LineChart,
  Line,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const weeklySales = [
  { day: "Mon", sales: 12500, orders: 45 },
  { day: "Tue", sales: 14800, orders: 52 },
  { day: "Wed", sales: 13200, orders: 48 },
  { day: "Thu", sales: 16400, orders: 61 },
  { day: "Fri", sales: 18900, orders: 73 },
  { day: "Sat", sales: 15600, orders: 58 },
  { day: "Sun", sales: 9800, orders: 34 },
];

const paymentMethods = [
  { name: "QR Code", value: 45, color: "#E9521C" },
  { name: "Cash", value: 35, color: "#F5A623" },
  { name: "Bank Transfer", value: 15, color: "#4A90E2" },
  { name: "Mobile Money", value: 5, color: "#7ED321" },
];

const recentTransactions = [
  { id: "TXN001", customer: "Thabo M.", amount: 345, method: "QR Code", status: "completed", time: "10:30 AM" },
  { id: "TXN002", customer: "Lerato K.", amount: 890, method: "QR Code", status: "completed", time: "09:15 AM" },
  { id: "TXN003", customer: "Mpho S.", amount: 2340, method: "Bank Transfer", status: "pending", time: "08:45 AM" },
  { id: "TXN004", customer: "Kagiso M.", amount: 450, method: "QR Code", status: "completed", time: "Yesterday" },
  { id: "TXN005", customer: "Boitumelo N.", amount: 1200, method: "Cash", status: "completed", time: "Yesterday" },
];

const stanbicProducts = [
  "Stanbic Personal Loan",
  "Stanbic Business Banking",
  "Stanbic FlexiSave",
  "Stanbic InsurePlus",
  "Stanbic PayOnline",
];

export default function MerchantDashboard() {
  const router = useRouter();
  const [merchantName, setMerchantName] = useState("Kgabo Trading");
  const [merchantCategory, setMerchantCategory] = useState("Retail");
  const [merchantLocation, setMerchantLocation] = useState("Gaborone");
  
  // Referral Modal State
  const [referModalOpen, setReferModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [referralNotes, setReferralNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();

  const stats = [
    { title: "Total Revenue", value: "BWP 98,450", change: "+12.5%", trend: "up", icon: DollarSign },
    { title: "Total Orders", value: "342", change: "+8.2%", trend: "up", icon: ShoppingBag },
    { title: "Active Customers", value: "1,245", change: "+5.4%", trend: "up", icon: Users },
    { title: "Avg. Order Value", value: "BWP 288", change: "+3.1%", trend: "up", icon: TrendingUp },
  ];

  const handleSubmitReferral = async () => {
    if (!customerName || !selectedProduct) {
      toast({
        title: "Missing Information",
        description: "Please enter customer name and select a product",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      toast({
        title: "✅ Referral Submitted Successfully!",
        description: `${customerName} has been referred for ${selectedProduct}. You'll earn rewards upon successful onboarding.`,
      });
      setReferModalOpen(false);
      setCustomerName("");
      setCustomerPhone("");
      setSelectedProduct("");
      setReferralNotes("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/")}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{merchantName}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Building2 className="h-4 w-4" />
                    <span>{merchantCategory}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span>{merchantLocation}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export Report
              </Button>
              <Button className="bg-[#E9521C] hover:bg-[#c44216] gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <stat.icon className="h-5 w-5 text-[#E9521C]" />
                  </div>
                  <Badge className={stat.trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stanbic Referral Widget */}
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-xl p-2 shadow-md flex-shrink-0">
                  <Image src="/partners/stanbic.jpeg" alt="Stanbic Bank" width={60} height={30} className="object-contain w-full h-full" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl font-bold text-gray-900">Refer Customers to Stanbic</h3>
                    <Badge className="bg-green-100 text-green-700">Earn up to 5% commission</Badge>
                    <Badge variant="outline" className="border-blue-300 text-blue-600">Quick approval</Badge>
                  </div>
                  <p className="text-gray-600 mt-1">
                    Help your customers access Stanbic financial services and earn referral rewards
                  </p>
                </div>
              </div>
              <Dialog open={referModalOpen} onOpenChange={setReferModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#E9521C] hover:bg-[#c44216] text-white px-6 py-2">
                    Refer Customer Now →
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Image src="/partners/stanbic.jpeg" alt="Stanbic" width={60} height={30} className="object-contain" />
                      <div>
                        <DialogTitle className="text-xl">Refer Customer to Stanbic</DialogTitle>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Earn referral rewards when your customer successfully onboards
                        </p>
                      </div>
                    </div>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Customer Name *</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#E9521C] focus:ring-1 focus:ring-[#E9521C]"
                        placeholder="Enter customer's full name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Customer Phone (Optional)</label>
                      <input
                        type="tel"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#E9521C] focus:ring-1 focus:ring-[#E9521C]"
                        placeholder="e.g. +267 71 234 567"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Product Interest *</label>
                      <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Stanbic product" />
                        </SelectTrigger>
                        <SelectContent>
                          {stanbicProducts.map((product) => (
                            <SelectItem key={product} value={product}>
                              {product}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Additional Notes</label>
                      <Textarea
                        placeholder="Any specific needs or context about this customer?"
                        value={referralNotes}
                        onChange={(e) => setReferralNotes(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setReferModalOpen(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleSubmitReferral} disabled={isSubmitting} className="flex-1 bg-[#E9521C] hover:bg-[#c44216]">
                      {isSubmitting ? "Submitting..." : "Submit Referral"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Weekly Sales Overview</CardTitle>
              <CardDescription>Revenue trends over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklySales}>
                    <defs>
                      <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E9521C" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#E9521C" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`BWP ${value.toLocaleString()}`, "Revenue"]}
                      contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="#E9521C"
                      fill="url(#salesGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Breakdown by transaction volume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentMethods}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {paymentMethods.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest customer payments and orders</CardDescription>
              </div>
              <Button variant="ghost" className="text-[#E9521C]">
                View All →
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Transaction ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Method</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Time</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500"></th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{tx.id}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{tx.customer}</td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900">BWP {tx.amount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="bg-gray-100">
                          {tx.method}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {tx.status === "completed" ? (
                          <Badge className="bg-green-100 text-green-700 border-0">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-700 border-0">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">{tx.time}</td>
                      <td className="py-3 px-4">
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                          <Eye className="h-4 w-4 text-gray-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* QR Code Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[#E9521C]" />
                QR Code Performance
              </CardTitle>
              <CardDescription>Adoption and usage metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">QR Adoption Rate</span>
                  <span className="font-semibold text-gray-900">68%</span>
                </div>
                <Progress value={68} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Monthly QR Transactions</span>
                  <span className="font-semibold text-gray-900">234</span>
                </div>
                <Progress value={234 / 5} className="h-2" />
              </div>
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">BWP 45,230</p>
                    <p className="text-xs text-gray-500">QR Revenue (MTD)</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">+18.5%</p>
                    <p className="text-xs text-gray-500">vs last month</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-[#E9521C]" />
                Merchant Rewards
              </CardTitle>
              <CardDescription>Your earned rewards and bonuses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Total Rewards Earned</p>
                  <p className="text-3xl font-bold text-[#E9521C]">BWP 4,280</p>
                  <p className="text-xs text-gray-500 mt-1">From customer referrals and transaction volume</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xl font-bold text-gray-900">12</p>
                    <p className="text-xs text-gray-500">Successful Referrals</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xl font-bold text-gray-900">BWP 1,240</p>
                    <p className="text-xs text-gray-500">Referral Bonuses</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}