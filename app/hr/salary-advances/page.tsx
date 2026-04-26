"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, XCircle, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function HRSalaryAdvancesPage() {
  const { toast } = useToast();
  const [requests, setRequests] = useState([
    { id: 1, employee: "Josephine Morolong", amount: 2000, reason: "Medical Emergency", date: "Apr 20", status: "pending" },
    { id: 2, employee: "Tshepo Kgosi", amount: 1500, reason: "School Fees", date: "Apr 19", status: "pending" },
    { id: 3, employee: "Mpho Sebina", amount: 3000, reason: "Home Repair", date: "Apr 18", status: "approved" },
    { id: 4, employee: "Boitumelo Phiri", amount: 1000, reason: "Transport", date: "Apr 17", status: "rejected" },
  ]);

  const handleApprove = (id: number) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "approved" } : r));
    toast({ title: "Approved", description: "Salary advance has been approved." });
  };

  const handleReject = (id: number) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "rejected" } : r));
    toast({ title: "Rejected", description: "Salary advance has been rejected." });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "pending": return <Badge className="bg-yellow-100 text-yellow-700"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "approved": return <Badge className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case "rejected": return <Badge className="bg-red-100 text-red-700"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default: return null;
    }
  };

  const pendingCount = requests.filter(r => r.status === "pending").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black">Salary Advances</h1>
        <p className="text-gray-500 text-sm mt-1">Manage employee salary advance requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-700">{pendingCount}</p>
            <p className="text-xs text-yellow-600">Pending Requests</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-700">BWP 6,500</p>
            <p className="text-xs text-green-600">Total Approved (MTD)</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-700">BWP 25,000</p>
            <p className="text-xs text-blue-600">Available Pool</p>
          </CardContent>
        </Card>
      </div>

      {/* Requests Table */}
      <Card className="border-gray-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Employee</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Amount</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Reason</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req.id} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-sm font-medium text-black">{req.employee}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-[#E9521C]">BWP {req.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{req.reason}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{req.date}</td>
                    <td className="py-3 px-4">{getStatusBadge(req.status)}</td>
                    <td className="py-3 px-4">
                      {req.status === "pending" ? (
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(req.id)}>Approve</Button>
                          <Button size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50" onClick={() => handleReject(req.id)}>Reject</Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => toast({ title: "View Details", description: `Viewing advance request #${req.id}` })}>
                          <Eye className="h-3 w-3 mr-1" /> View
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}