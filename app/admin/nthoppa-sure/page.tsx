"use client";

import { useRouter } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";

export default function AdminNthoppaSurePage() {
  const router = useRouter();

  const stats = [
    { label: "Active Policies", value: "3,240", icon: "🛡️", change: "+8%", color: "#E9521C" },
    { label: "Total Premiums", value: "P 892K", icon: "💰", change: "+12%", color: "#16a34a" },
    { label: "Claims This Month", value: "47", icon: "📋", change: "-3%", color: "#2563eb" },
    { label: "Partner Products", value: "24", icon: "🏪", change: "+2", color: "#9333ea" },
  ];

  const products = [
    { name: "Motor Insurance", icon: "🚗", policies: 1240, premiums: "P 312K", tag: "Top Seller", tagColor: "#E9521C" },
    { name: "Property Insurance", icon: "🏠", policies: 890, premiums: "P 280K", tag: "Popular", tagColor: "#2563eb" },
    { name: "Life & Funeral", icon: "💙", policies: 670, premiums: "P 300K", tag: "Essential", tagColor: "#16a34a" },
    { name: "Stanbic Personal Loan", icon: "💳", policies: 240, premiums: "P 120K", tag: "Stanbic", tagColor: "#0f4c8a" },
    { name: "Stanbic Business Banking", icon: "🏦", policies: 180, premiums: "P 95K", tag: "Stanbic", tagColor: "#0f4c8a" },
    { name: "Stanbic FlexiSave", icon: "💰", policies: 320, premiums: "P 85K", tag: "Stanbic", tagColor: "#0f4c8a" },
  ];

  const maxPolicies = Math.max(...products.map(p => p.policies));

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-6">
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-[#E9521C] transition-colors mb-4 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E9521C] flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-orange-200">
                N
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">NthoppaSure</h1>
                <p className="text-sm text-gray-500">Insurance & financial products marketplace</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-orange-50 text-[#E9521C] text-xs font-semibold rounded-full border border-orange-200">
              Fintech Marketplace
            </span>
          </div>
        </div>

        <div className="px-8 py-8 max-w-7xl mx-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{s.icon}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.change.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                    {s.change}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs text-gray-400 mt-1 font-medium">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Two column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Products Grid - takes 2/3 */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
                  <h2 className="font-bold text-gray-800 text-base">Active Products</h2>
                  <span className="text-xs text-gray-400">{products.length} products</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {products.map((p, i) => (
                    <div key={i} className="px-6 py-4 hover:bg-gray-50 transition-colors group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-xl w-8 text-center">{p.icon}</span>
                          <div>
                            <div className="font-semibold text-gray-800 text-sm group-hover:text-[#E9521C] transition-colors">{p.name}</div>
                            <div className="text-xs text-gray-400">{p.policies.toLocaleString()} active policies</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-gray-700">{p.premiums}</span>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-medium text-white"
                            style={{ backgroundColor: p.tagColor }}
                          >
                            {p.tag}
                          </span>
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div className="ml-11 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${(p.policies / maxPolicies) * 100}%`,
                            backgroundColor: p.tagColor,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column - 1/3 */}
            <div className="flex flex-col gap-6">
              {/* Category Breakdown */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-800 text-sm mb-4">Category Breakdown</h3>
                {[
                  { label: "Insurance Products", count: 3, pct: 50, color: "#E9521C" },
                  { label: "Stanbic Services", count: 3, pct: 50, color: "#0f4c8a" },
                ].map((c, i) => (
                  <div key={i} className="mb-4">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-600 font-medium">{c.label}</span>
                      <span className="text-gray-400">{c.count} products</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${c.pct}%`, backgroundColor: c.color }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick summary */}
              <div className="bg-gradient-to-br from-[#E9521C] to-orange-400 rounded-2xl p-6 text-white shadow-lg shadow-orange-200">
                <div className="text-xs font-semibold uppercase tracking-widest opacity-80 mb-3">Monthly Summary</div>
                <div className="text-3xl font-bold mb-1">P 892K</div>
                <div className="text-sm opacity-80 mb-4">Total premiums collected</div>
                <div className="border-t border-white/20 pt-4 grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-lg font-bold">3,240</div>
                    <div className="text-xs opacity-70">Active policies</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">47</div>
                    <div className="text-xs opacity-70">Claims filed</div>
                  </div>
                </div>
              </div>

              {/* Stanbic Partnership */}
              <div className="bg-[#0f4c8a] rounded-2xl p-5 text-white shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🏦</span>
                  <span className="font-bold text-sm">Stanbic Partnership</span>
                </div>
                <p className="text-xs opacity-70 mb-3">3 active Stanbic products generating P 300K in monthly premiums.</p>
                <div className="flex items-center gap-1 text-xs font-semibold opacity-90">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Live Integration
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
