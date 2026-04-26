"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, Target, Award } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function HRFinancialWellnessPage() {
  const metrics = {
    avgLiteracy: 68,
    savingsAdoption: 54,
    avgCreditScore: 612,
    wellnessIndex: 71,
  };

  const departments = [
    { name: "Sales", literacy: 72, savings: 48, wellness: 78 },
    { name: "Operations", literacy: 58, savings: 35, wellness: 62 },
    { name: "Finance", literacy: 88, savings: 72, wellness: 91 },
    { name: "HR", literacy: 65, savings: 52, wellness: 74 },
  ];

  // Prepare data for department comparison chart
  const departmentChartData = departments.map(dept => ({
    name: dept.name,
    literacy: dept.literacy,
    savings: dept.savings,
    wellness: dept.wellness,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black">Financial Wellness</h1>
        <p className="text-gray-500 text-sm mt-1">Track employee financial health metrics</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Avg Literacy Score", value: `${metrics.avgLiteracy}%`, icon: <TrendingUp className="h-5 w-5" />, color: "text-[#E9521C]" },
          { label: "Savings Adoption", value: `${metrics.savingsAdoption}%`, icon: <Target className="h-5 w-5" />, color: "text-green-600" },
          { label: "Avg Credit Score", value: metrics.avgCreditScore, icon: <Award className="h-5 w-5" />, color: "text-blue-600" },
          { label: "Wellness Index", value: `${metrics.wellnessIndex}%`, icon: <Users className="h-5 w-5" />, color: "text-purple-600" },
        ].map(m => (
          <Card key={m.label} className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500">{m.label}</p>
                <div className={m.color}>{m.icon}</div>
              </div>
              <p className="text-2xl font-bold text-black">{m.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Department Breakdown */}
      <Card className="border-gray-200">
        <CardContent className="p-5">
          <h3 className="font-semibold text-black mb-4">Department Breakdown</h3>
          <div className="space-y-4">
            {departments.map(dept => (
              <div key={dept.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-black">{dept.name}</span>
                  <span className="text-gray-500">Wellness: {dept.wellness}%</span>
                </div>
                <Progress value={dept.wellness} className="h-2 mb-2" />
                <div className="flex gap-4 text-xs text-gray-500">
                  <span>Literacy: {dept.literacy}%</span>
                  <span>Savings: {dept.savings}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Department Wellness Comparison Chart - Recharts */}
      <Card className="border-gray-200">
        <CardContent className="p-5">
          <h3 className="font-semibold text-black mb-4">Department Wellness Comparison</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={departmentChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
              <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
              <Legend />
              <Bar dataKey="literacy" name="Literacy" fill="#3b82f6" radius={[3, 3, 0, 0]} />
              <Bar dataKey="savings" name="Savings" fill="#E9521C" radius={[3, 3, 0, 0]} />
              <Bar dataKey="wellness" name="Wellness" fill="#10b981" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="border-[#E9521C] bg-[#E9521C]/5">
        <CardContent className="p-5">
          <h3 className="font-semibold text-black mb-2">AI Recommendations</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• 📚 Schedule financial literacy workshop for Operations department (current score: 58%)</li>
            <li>• 🎯 Launch savings challenge to increase adoption from 54% to 70%</li>
            <li>• 📊 Review credit building program for employees with scores below 550</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}