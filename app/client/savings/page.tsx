"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PiggyBank, Target, Plus, CheckCircle, ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ClientSavingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const goals = [
    { name: "Emergency Fund", target: 5000, saved: 2100, deadline: "Dec 2026", color: "bg-blue-500" },
    { name: "School Fees", target: 8000, saved: 4250, deadline: "Jan 2027", color: "bg-[#E9521C]" },
    { name: "Business Capital", target: 20000, saved: 3000, deadline: "Jun 2027", color: "bg-green-500" },
  ];

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

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black flex items-center gap-2"><PiggyBank className="h-6 w-6 text-[#E9521C]" />Savings Goals</h1>
          <p className="text-gray-500 text-sm mt-1">Track progress toward your financial milestones</p>
        </div>
        <Button className="bg-[#E9521C] text-white hover:bg-black" onClick={() => toast({ title: "Coming Soon", description: "Custom goal creation is coming in the next update." })}>
          <Plus className="h-4 w-4 mr-2" />New Goal
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {goals.map(g => {
          const pct = Math.round((g.saved / g.target) * 100);
          return (
            <Card key={g.name} className="border-gray-200">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 ${g.color} rounded-xl flex items-center justify-center`}><Target className="h-5 w-5 text-white" /></div>
                  <div><h3 className="font-semibold text-black">{g.name}</h3><p className="text-xs text-gray-500">Target: {g.deadline}</p></div>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">BWP {g.saved.toLocaleString()} saved</span>
                  <span className="font-medium text-black">{pct}%</span>
                </div>
                <Progress value={pct} className="h-2 mb-2" />
                <p className="text-xs text-gray-400">BWP {(g.target - g.saved).toLocaleString()} remaining of BWP {g.target.toLocaleString()}</p>
                {pct >= 100 && <div className="flex items-center gap-1 text-green-600 text-xs mt-2"><CheckCircle className="h-3 w-3" />Goal reached!</div>}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}