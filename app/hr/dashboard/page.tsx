"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import {
  Users, TrendingUp, Award, Clock, Download, PieChart as PieChartIcon,
  ChevronRight, Shield, Activity, TrendingDown, UserCheck, Calendar, ChevronLeft
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useToast } from "@/hooks/use-toast";

const wellnessData = [
  { name: "Healthy", value: 342, color: "#22c55e" },
  { name: "At-Risk", value: 156, color: "#eab308" },
  { name: "Critical", value: 42, color: "#ef4444" },
];

const employees = [
  { id: 1, name: "Thabo M.", wellness: 92, status: "Healthy", department: "Sales", initials: "TM" },
  { id: 2, name: "Josephine K.", wellness: 78, status: "At-Risk", department: "Customer Support", initials: "JK" },
  { id: 3, name: "Michael L.", wellness: 45, status: "Critical", department: "Operations", initials: "ML" },
  { id: 4, name: "Sarah P.", wellness: 88, status: "Healthy", department: "Finance", initials: "SP" },
  { id: 5, name: "David M.", wellness: 62, status: "At-Risk", department: "IT", initials: "DM" },
];

export default function HRDashboard() {
  const router = useRouter();
  const [totalEmployees, setTotalEmployees] = useState(540);
  const { toast } = useToast();

  const getWellnessBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-100 text-green-700 border-0">Healthy</Badge>;
    if (score >= 60) return <Badge className="bg-amber-100 text-amber-700 border-0">At-Risk</Badge>;
    return <Badge className="bg-red-100 text-red-700 border-0">Critical</Badge>;
  };

  const getWellnessColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("");

  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(data => {
        if (data?.users?.length) {
          setTotalEmployees(data.users.length);
        }
      })
      .catch(() => {});
  }, []);

  const handleExport = () => {
    toast({ title: "Export Started", description: "Your report is being generated" });
  };

  return (
    <div className="space-y-6">
      {/* Back Navigation - Goes to Landing Page */}
      <button
        onClick={() => router.push("/")}
        className="inline-flex items-center gap-2 text-gray-500 hover:text-[#E9521C] font-medium text-sm mb-6 group transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-[#E9521C]/10 flex items-center justify-center transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </div>
        Back
      </button>

      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">HR Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Employee financial wellness overview</p>
        </div>
        <Button onClick={handleExport} className="bg-[#E9521C] hover:bg-black text-white rounded-xl gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Total Employees", value: totalEmployees, change: "+12", icon: Users, color: "bg-orange-500" },
          { title: "Wellness Score", value: "74", change: "+5", icon: Activity, color: "bg-green-500", suffix: "%" },
          { title: "Salary Advances", value: "BWP 1.2M", change: "+18%", icon: TrendingUp, color: "bg-blue-500" },
          { title: "Avg Engagement", value: "82%", change: "+7%", icon: Award, color: "bg-purple-500" },
        ].map((stat, idx) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm card-hover"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-xl ${stat.color} bg-opacity-10`}>
                <stat.icon className={`h-5 w-5 ${stat.color.replace("bg-", "text-")}`} />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-black">{stat.value}{stat.suffix || ""}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Wellness Distribution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-black flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-[#E9521C]" />
              Wellness Distribution
            </CardTitle>
            <CardDescription>Employee financial health breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={wellnessData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {wellnessData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              {wellnessData.map(item => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-600">{item.name}</span>
                  <span className="font-bold text-black">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">Wellness Trends</CardTitle>
            <CardDescription>Monthly average wellness score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Overall Wellness Score</span>
                  <span className="font-bold text-black">74%</span>
                </div>
                <Progress value={74} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Financial Literacy</span>
                  <span className="font-bold text-black">68%</span>
                </div>
                <Progress value={68} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Savings Engagement</span>
                  <span className="font-bold text-black">71%</span>
                </div>
                <Progress value={71} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Debt Management</span>
                  <span className="font-bold text-black">59%</span>
                </div>
                <Progress value={59} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Wellness Table */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-black">Employee Financial Wellness Summary</CardTitle>
          <CardDescription>Current wellness scores by employee</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Employee</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Department</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Wellness Score</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, idx) => (
                  <motion.tr
                    key={emp.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-gray-100 hover:bg-orange-50/30 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gradient-to-br from-[#E9521C] to-[#c44216] text-white text-xs">
                            {emp.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-black text-sm">{emp.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{emp.department}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${getWellnessColor(emp.wellness)}`}>{emp.wellness}%</span>
                        <Progress value={emp.wellness} className="w-16 h-1.5" />
                      </div>
                    </td>
                    <td className="py-3 px-4">{getWellnessBadge(emp.wellness)}</td>
                    <td className="py-3 px-4">
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 transition">
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}