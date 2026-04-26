"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function MerchantTransactionsPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");

  const transactions = [
    { id: "T-001", customer: "Josephine Morolong", amount: 450, method: "Wallet", status: "completed", date: "Apr 20, 2026", time: "10:30 AM" },
    { id: "T-002", customer: "Tshepo Kgosi", amount: 120, method: "Mobile Money", status: "completed", date: "Apr 20, 2026", time: "09:15 AM" },
    { id: "T-003", customer: "Mpho Sebina", amount: 890, method: "Wallet", status: "pending", date: "Apr 19, 2026", time: "03:45 PM" },
    { id: "T-004", customer: "Boitumelo Phiri", amount: 250, method: "Cash", status: "completed", date: "Apr 19, 2026", time: "11:20 AM" },
    { id: "T-005", customer: "Lerato Kgosiemang", amount: 1500, method: "Wallet", status: "completed", date: "Apr 18, 2026", time: "02:00 PM" },
    { id: "T-006", customer: "Thato Mmolawa", amount: 75, method: "Mobile Money", status: "refunded", date: "Apr 18, 2026", time: "09:30 AM" },
  ];

  const filtered = transactions.filter(t => 
    t.customer.toLowerCase().includes(search.toLowerCase()) ||
    t.id.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = filtered.reduce((sum, t) => t.status === 'completed' ? sum + t.amount : sum, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">Transactions</h1>
          <p className="text-gray-500 text-sm mt-1">View and manage all payment transactions</p>
        </div>
        <Button 
          variant="outline" 
          className="border-[#E9521C] text-[#E9521C] hover:bg-[#E9521C] hover:text-white"
          onClick={() => toast({ title: "Export Started", description: "Transactions are being exported to CSV" })}
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold text-black">BWP {totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Total Transactions</p>
            <p className="text-2xl font-bold text-black">{filtered.length}</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Average Transaction</p>
            <p className="text-2xl font-bold text-black">BWP {Math.round(totalRevenue / filtered.length)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by customer or transaction ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 border-gray-200"
        />
      </div>

      {/* Transactions Table */}
      <Card className="border-gray-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Transaction ID</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Customer</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Amount</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Method</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(tx => (
                  <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-black">{tx.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{tx.customer}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-[#E9521C]">BWP {tx.amount}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{tx.method}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{tx.date}</td>
                    <td className="py-3 px-4">
                      <Badge className={
                        tx.status === 'completed' ? 'bg-green-100 text-green-700' :
                        tx.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }>
                        {tx.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Showing {filtered.length} of {transactions.length} transactions</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled className="border-gray-200">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="bg-[#E9521C] text-white border-[#E9521C]">1</Button>
          <Button variant="outline" size="sm" className="border-gray-200">2</Button>
          <Button variant="outline" size="sm" className="border-gray-200">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}