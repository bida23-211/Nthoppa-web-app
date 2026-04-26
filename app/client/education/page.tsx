"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Lock, CheckCircle, Award, ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ClientEducationPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const { toast } = useToast();
  const literacyScore = 65;

  useEffect(() => {
    fetch('/api/courses').then(r => r.json()).then(setCourses).catch(() => {});
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

      <div>
        <h1 className="text-2xl font-bold text-black flex items-center gap-2"><BookOpen className="h-6 w-6 text-[#E9521C]" />Financial Education</h1>
        <p className="text-gray-500 text-sm mt-1">Literacy Score: <span className="font-semibold text-[#E9521C]">{literacyScore}%</span></p>
      </div>
      <Card className="border-gray-200 bg-gradient-to-r from-[#E9521C]/5 to-transparent">
        <CardContent className="p-5 flex items-center justify-between gap-4">
          <div><h3 className="font-semibold text-black">Your Financial Literacy</h3><p className="text-xs text-gray-500 mt-0.5">Complete courses to unlock better loan products</p></div>
          <div className="text-right"><p className="text-3xl font-bold text-[#E9521C]">{literacyScore}%</p><Progress value={literacyScore} className="h-1 w-24 mt-1" /></div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {courses.map((c: any) => {
          const available = literacyScore >= (c.requiredScore || 0);
          return (
            <Card key={c.id} className={`border-gray-200 ${!available ? 'opacity-70' : ''}`}>
              <CardContent className="p-5">
                <div className="flex justify-between mb-3">
                  <div className={`p-2 rounded-lg ${available ? 'bg-[#E9521C]/10' : 'bg-gray-100'}`}>
                    {available ? <BookOpen className="h-5 w-5 text-[#E9521C]" /> : <Lock className="h-5 w-5 text-gray-400" />}
                  </div>
                  <Badge className="bg-[#E9521C] text-white">+{c.coinsReward} coins</Badge>
                </div>
                <h3 className="font-semibold text-black mb-1">{c.title}</h3>
                <p className="text-xs text-gray-500 mb-3">{c.description}</p>
                {available ? (
                  <Button className="w-full bg-[#E9521C] text-white hover:bg-black text-sm" onClick={() => toast({ title: "Course Started!", description: `Starting "${c.title}"` })}>Start Course</Button>
                ) : (
                  <p className="text-xs text-yellow-600 flex items-center gap-1"><Lock className="h-3 w-3" />Requires {c.requiredScore}% literacy score</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}