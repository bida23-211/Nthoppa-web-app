"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Calendar, TrendingUp } from "lucide-react";

export default function ClientMotsheloPage() {
  const groups = [
    { name: "Women's Empowerment Group", members: 12, contribution: 250, totalPaid: 1500, nextPayout: "May 1", payoutOrder: 4, status: "active", balance: 3000 },
    { name: "Gaborone Traders Circle", members: 8, contribution: 500, totalPaid: 3000, nextPayout: "Jun 1", payoutOrder: 2, status: "active", balance: 4000 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black flex items-center gap-2"><Users className="h-6 w-6 text-[#E9521C]" />My Motshelo Groups</h1>
        <p className="text-gray-500 text-sm mt-1">Track your community savings groups and payout schedule</p>
      </div>
      {groups.map(g => (
        <Card key={g.name} className="border-gray-200">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-black text-lg">{g.name}</h3>
                <p className="text-sm text-gray-500">{g.members} members · BWP {g.contribution}/month contribution</p>
              </div>
              <Badge className="bg-green-100 text-green-700">{g.status}</Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="p-3 bg-gray-50 rounded-lg text-center"><p className="text-xl font-bold text-black">BWP {g.totalPaid.toLocaleString()}</p><p className="text-xs text-gray-500">Total Paid In</p></div>
              <div className="p-3 bg-gray-50 rounded-lg text-center"><p className="text-xl font-bold text-black">BWP {g.balance.toLocaleString()}</p><p className="text-xs text-gray-500">Group Balance</p></div>
              <div className="p-3 bg-[#E9521C]/10 rounded-lg text-center"><p className="text-xl font-bold text-[#E9521C]">#{g.payoutOrder}</p><p className="text-xs text-gray-500">Your Payout Order</p></div>
              <div className="p-3 bg-gray-50 rounded-lg text-center"><p className="text-xl font-bold text-black">{g.nextPayout}</p><p className="text-xs text-gray-500">Next Payout Date</p></div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Group Progress</span><span>{g.payoutOrder - 1}/{g.members} members paid out</span></div>
              <Progress value={((g.payoutOrder - 1) / g.members) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}