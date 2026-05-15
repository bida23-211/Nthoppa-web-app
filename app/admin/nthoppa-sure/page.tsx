"use client";

import { useRouter } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import { useState, useEffect } from "react";

const ORANGE = "#E9521C";
const NAVY = "#0f4c8a";

const monthlyData = [
  { month: "Oct", premiums: 620 },
  { month: "Nov", premiums: 710 },
  { month: "Dec", premiums: 680 },
  { month: "Jan", premiums: 750 },
  { month: "Feb", premiums: 800 },
  { month: "Mar", premiums: 892 },
];

const products = [
  { name: "Motor Insurance", icon: "🚗", policies: 1240, premiums: 312, tag: "Top Seller", tagColor: ORANGE, category: "insurance" },
  { name: "Property Insurance", icon: "🏠", policies: 890, premiums: 280, tag: "Popular", tagColor: "#2563eb", category: "insurance" },
  { name: "Life & Funeral", icon: "💙", policies: 670, premiums: 300, tag: "Essential", tagColor: "#16a34a", category: "insurance" },
  { name: "Stanbic Personal Loan", icon: "💳", policies: 240, premiums: 120, tag: "Stanbic", tagColor: NAVY, category: "stanbic" },
  { name: "Stanbic Business Banking", icon: "🏦", policies: 180, premiums: 95, tag: "Stanbic", tagColor: NAVY, category: "stanbic" },
  { name: "Stanbic FlexiSave", icon: "💰", policies: 320, premiums: 85, tag: "Stanbic", tagColor: NAVY, category: "stanbic" },
];

const maxPolicies = Math.max(...products.map((p) => p.policies));
const maxPremiums = Math.max(...monthlyData.map((d) => d.premiums));

function SparkLine({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80, h = 32;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  const lastX = w;
  const lastY = h - ((data[data.length - 1] - min) / range) * (h - 4) - 2;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
      <circle cx={lastX} cy={lastY} r="3" fill={color} />
    </svg>
  );
}

function BarChart({ animated }: { animated: boolean }) {
  return (
    <div className="flex items-end gap-2 h-36 w-full">
      {monthlyData.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex flex-col items-center justify-end" style={{ height: 110 }}>
            <div
              className="w-full rounded-t-lg transition-all duration-700"
              style={{
                height: animated ? `${(d.premiums / maxPremiums) * 100}%` : "0%",
                background: i === monthlyData.length - 1
                  ? `linear-gradient(to top, ${ORANGE}, #f97316)`
                  : "#e5e7eb",
                transitionDelay: `${i * 80}ms`,
              }}
            />
          </div>
          <span className="text-[10px] text-gray-400 font-medium">{d.month}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart() {
  const insurance = 2800, stanbic = 440;
  const total = insurance + stanbic;
  const pct = insurance / total;
  const r = 36, cx = 48, cy = 48;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  return (
    <svg width={96} height={96} viewBox="0 0 96 96">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth="14" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={ORANGE} strokeWidth="14"
        strokeDasharray={`${dash - 4} ${circ - dash + 4}`}
        strokeDashoffset={circ * 0.25}
        strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={NAVY} strokeWidth="14"
        strokeDasharray={`${circ - dash - 8} ${dash + 8}`}
        strokeDashoffset={circ * 0.25 - dash}
        strokeLinecap="round" />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize="13" fontWeight="800" fill="#111">{Math.round(pct * 100)}%</text>
    </svg>
  );
}

export default function AdminNthoppaSurePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"all" | "insurance" | "stanbic">("all");
  const [animated, setAnimated] = useState(false);

  useEffect(() => { const t = setTimeout(() => setAnimated(true), 300); return () => clearTimeout(t); }, []);

  const filtered = activeTab === "all" ? products : products.filter((p) => p.category === activeTab);

  const stats = [
    { label: "Active Policies", value: "3,240", change: "+8%", up: true, spark: [2840, 2980, 3050, 3100, 3180, 3240], color: ORANGE },
    { label: "Total Premiums", value: "P 892K", change: "+12%", up: true, spark: [620, 710, 680, 750, 800, 892], color: "#16a34a" },
    { label: "Claims This Month", value: "47", change: "-3%", up: false, spark: [38, 42, 55, 40, 44, 47], color: "#2563eb" },
    { label: "Partner Products", value: "24", change: "+2", up: true, spark: [18, 19, 21, 22, 23, 24], color: "#9333ea" },
  ];

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#f8f9fb]">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/admin/dashboard")}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#E9521C] transition-colors group">
              <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span> Back
            </button>
            <div className="w-px h-5 bg-gray-200" />
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#E9521C] flex items-center justify-center text-white font-bold text-sm shadow-md shadow-orange-200">N</div>
              <div>
                <h1 className="font-bold text-gray-900 text-base leading-tight">NthoppaSure</h1>
                <p className="text-xs text-gray-400">Insurance & financial products marketplace</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">Last updated: Today, 14:32</span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" style={{ animation: "pulse 2s infinite" }} />
              Live
            </span>
            <span className="px-3 py-1 bg-orange-50 text-[#E9521C] text-xs font-semibold rounded-full border border-orange-200">
              Fintech Marketplace
            </span>
          </div>
        </div>

        <div className="px-8 py-6 max-w-7xl mx-auto space-y-5">

          {/* KPI cards with sparklines */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-1">{s.label}</p>
                    <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                  </div>
                  <SparkLine data={s.spark} color={s.color} />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.up ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                    {s.change}
                  </span>
                  <span className="text-xs text-gray-400">vs last month</span>
                </div>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Bar chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-bold text-gray-900 text-sm">Premium Revenue Trend</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Monthly collected premiums (P thousands)</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#E9521C] inline-block" /> Mar (current)</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-200 inline-block" /> Prior months</span>
                </div>
              </div>
              <BarChart animated={animated} />
              <div className="grid grid-cols-3 gap-4 mt-5 pt-4 border-t border-gray-50">
                <div>
                  <p className="text-[11px] text-gray-400 mb-0.5">Peak Month</p>
                  <p className="font-bold text-gray-800 text-sm">P 892K <span className="text-green-500 font-normal text-xs">↑ Mar</span></p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 mb-0.5">6-Month Avg</p>
                  <p className="font-bold text-gray-800 text-sm">P 742K</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 mb-0.5">Total Growth</p>
                  <p className="font-bold text-green-600 text-sm">+43.9%</p>
                </div>
              </div>
            </div>

            {/* Donut chart */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col">
              <h2 className="font-bold text-gray-900 text-sm mb-4">Product Mix</h2>
              <div className="flex items-center justify-center gap-5 flex-1">
                <DonutChart />
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: ORANGE }} />
                      <span className="text-xs font-semibold text-gray-700">Insurance</span>
                    </div>
                    <p className="text-xs text-gray-400 ml-4">3 products · P 692K</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: NAVY }} />
                      <span className="text-xs font-semibold text-gray-700">Stanbic</span>
                    </div>
                    <p className="text-xs text-gray-400 ml-4">3 products · P 300K</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-50 grid grid-cols-2 gap-3">
                <div className="bg-orange-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-[#E9521C]">86%</p>
                  <p className="text-xs text-gray-500">Retention</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-[#0f4c8a]">1.2%</p>
                  <p className="text-xs text-gray-500">Claim ratio</p>
                </div>
              </div>
            </div>
          </div>

          {/* Products + sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Product table */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                <h2 className="font-bold text-gray-900 text-sm">Active Products</h2>
                <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                  {(["all", "insurance", "stanbic"] as const).map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition-all capitalize ${activeTab === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}>
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              <div className="px-6 py-2 grid grid-cols-12 text-[10px] text-gray-400 font-semibold uppercase tracking-widest border-b border-gray-50">
                <span className="col-span-5">Product</span>
                <span className="col-span-3 text-right">Revenue</span>
                <span className="col-span-2 text-right">Policies</span>
                <span className="col-span-2 text-right">Share</span>
              </div>
              <div className="divide-y divide-gray-50">
                {filtered.map((p, i) => (
                  <div key={i} className="px-6 py-3.5 grid grid-cols-12 items-center hover:bg-gray-50 transition-colors group">
                    <div className="col-span-5 flex items-center gap-3">
                      <span className="text-lg w-7 text-center">{p.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 group-hover:text-[#E9521C] transition-colors leading-tight">{p.name}</p>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold text-white" style={{ backgroundColor: p.tagColor }}>{p.tag}</span>
                      </div>
                    </div>
                    <div className="col-span-3 text-right">
                      <p className="text-sm font-bold text-gray-900">P {p.premiums}K</p>
                    </div>
                    <div className="col-span-2 text-right">
                      <p className="text-sm text-gray-500">{p.policies.toLocaleString()}</p>
                    </div>
                    <div className="col-span-2 flex flex-col items-end gap-1">
                      <span className="text-xs font-semibold text-gray-600">{Math.round((p.policies / maxPolicies) * 100)}%</span>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: animated ? `${(p.policies / maxPolicies) * 100}%` : "0%", backgroundColor: p.tagColor }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right sidebar */}
            <div className="flex flex-col gap-4">
              {/* Monthly summary */}
              <div className="bg-gradient-to-br from-[#E9521C] to-orange-500 rounded-2xl p-6 text-white shadow-lg shadow-orange-200">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Monthly Summary</p>
                <p className="text-4xl font-black mb-0.5">P 892K</p>
                <p className="text-xs opacity-60 mb-5">Total premiums · March 2026</p>
                <div className="grid grid-cols-3 gap-2">
                  {[{ v: "3,240", l: "Policies" }, { v: "47", l: "Claims" }, { v: "86%", l: "Retention" }].map((x, i) => (
                    <div key={i} className="bg-white/15 rounded-xl p-2.5 text-center backdrop-blur-sm">
                      <p className="text-sm font-bold">{x.v}</p>
                      <p className="text-[10px] opacity-70 mt-0.5">{x.l}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Claims breakdown */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h3 className="font-bold text-gray-900 text-sm mb-4">Claims by Type</h3>
                {[
                  { label: "Motor", value: 22, color: ORANGE },
                  { label: "Property", value: 13, color: "#2563eb" },
                  { label: "Life", value: 8, color: "#16a34a" },
                  { label: "Other", value: 4, color: "#9333ea" },
                ].map((c, i) => (
                  <div key={i} className="mb-3 last:mb-0">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-600 font-medium flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                        {c.label}
                      </span>
                      <span className="text-gray-400 font-semibold">{c.value}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: animated ? `${(c.value / 47) * 100}%` : "0%", backgroundColor: c.color, transitionDelay: `${i * 100}ms` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Stanbic card */}
              <div className="bg-[#0f4c8a] rounded-2xl p-5 text-white shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🏦</span>
                    <span className="font-bold text-sm">Stanbic Partnership</span>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full font-semibold">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" /> Live
                  </span>
                </div>
                <p className="text-xs opacity-60 mb-3">3 active products · P 300K/month</p>
                <div className="grid grid-cols-3 gap-2">
                  {["Loans", "Banking", "Savings"].map((s, i) => (
                    <div key={i} className="bg-white/10 rounded-lg py-1.5 text-center text-[10px] font-semibold opacity-80">{s}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
