"use client";

import { useRouter } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";

export default function AdminNthoppaSurePage() {
  const router = useRouter();

  const products = [
    { name: "Motor Insurance", icon: "🚗", policies: 1240, premiums: "P 312K" },
    { name: "Property Insurance", icon: "🏠", policies: 890, premiums: "P 280K" },
    { name: "Life & Funeral", icon: "💙", policies: 670, premiums: "P 300K" },
    { name: "Stanbic Personal Loan", icon: "💳", policies: 240, premiums: "P 120K" },
    { name: "Stanbic Business Banking", icon: "🏦", policies: 180, premiums: "P 95K" },
    { name: "Stanbic FlexiSave", icon: "💰", policies: 320, premiums: "P 85K" },
  ];

  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6"
        >
          ← Back
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">NthoppaSure</h1>
          <p className="text-gray-500 text-sm mt-1">Insurance & financial products marketplace</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Active Policies", value: "3,240", icon: "🛡️" },
            { label: "Total Premiums", value: "P 892K", icon: "💰" },
            { label: "Claims This Month", value: "47", icon: "📋" },
            { label: "Partner Products", value: "24", icon: "🏪" },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl border p-4 shadow-sm">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-xl font-bold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Active Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p, i) => (
              <div key={i} className="border rounded-lg p-4 hover:border-[#E9521C] transition-colors">
                <div className="text-2xl mb-2">{p.icon}</div>
                <div className="font-semibold text-gray-800">{p.name}</div>
                <div className="text-sm text-gray-500 mt-1">{p.policies} active policies</div>
                <div className="text-sm font-medium text-[#E9521C] mt-1">{p.premiums} premiums</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
