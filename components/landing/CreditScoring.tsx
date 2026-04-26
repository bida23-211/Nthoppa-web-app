"use client";

import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

export function CreditScoring() {
  return (
    <section id="credit-scoring" className="bg-white py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div initial={{opacity: 0, y: 30}} whileInView={{opacity: 1, y: 0}} viewport={{once: true}} transition={{duration: 0.6}}>
            <div className="bg-[#0a0a0a] rounded-3xl p-8 shadow-2xl">
              <div className="font-body text-white/40 text-xs uppercase tracking-widest mb-6">Credit Scoring — Alternative Data</div>
              <div className="space-y-4 mb-6">
                {[
                  { label: 'Savings Consistency', pct: 82 },
                  { label: 'Income Patterns', pct: 74 },
                  { label: 'Financial Discipline', pct: 68 },
                  { label: 'Transaction History', pct: 66 },
                  { label: 'Behavioural Score', pct: 77 },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1.5">
                      <span className="font-body text-white/70 text-xs">{item.label}</span>
                      <span className="font-body text-[#E9521C] font-bold text-xs">{item.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div initial={{width: 0}} whileInView={{width: `${item.pct}%`}} viewport={{once: true}} transition={{duration: 1, delay: i * 0.1}}
                        className="h-full bg-[#E9521C] rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="font-body text-white/40 text-xs mb-2">CreditYame</div>
                  <div className="font-body text-white/80 text-xs">Formal Sector</div>
                  <div className="font-display text-[#E9521C] font-black text-2xl mt-2">4,230</div>
                  <div className="font-body text-white/40 text-xs">Avg Score 703</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="font-body text-white/40 text-xs mb-2">iPachi</div>
                  <div className="font-body text-white/80 text-xs">Informal Sector</div>
                  <div className="font-display text-orange-400 font-black text-2xl mt-2">8,940</div>
                  <div className="font-body text-white/40 text-xs">Payment Ready 42%</div>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{opacity: 0, x: 30}} whileInView={{opacity: 1, x: 0}} viewport={{once: true}} transition={{duration: 0.6}}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#E9521C]/10 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-[#E9521C]" />
              </div>
              <span className="font-body text-[#E9521C] font-semibold text-sm uppercase tracking-widest">Alternative Credit Data</span>
            </div>
            <h2 className="font-display text-5xl font-black text-[#0a0a0a] leading-tight mb-6">
              Credit Scoring for the <span className="text-[#E9521C]">Underserved</span>
            </h2>
            <p className="font-body text-gray-500 text-lg leading-relaxed mb-8">
              Nthoppa's user behaviour data — savings consistency, income patterns, and financial discipline — can complement existing credit assessment models for small-ticket unsecured lending, especially in segments where formal credit histories are limited or absent.
            </p>
            {[
              { icon: '🏢', title: 'CreditYame — Formal Sector', desc: 'Traditional credit scoring integration for salaried and formally employed users' },
              { icon: '🏪', title: 'iPachi — Informal Sector', desc: 'Alternative data scoring for informal traders and micro-entrepreneurs without formal credit histories' },
              { icon: '📊', title: 'Behaviour-Based Scoring', desc: 'Savings streaks, quiz performance and spending patterns build a rich alternative credit profile' },
              { icon: '🎯', title: 'Small-Ticket Lending', desc: 'Enable responsible unsecured personal loans to segments previously excluded from formal credit' },
            ].map((item, i) => (
              <motion.div key={i} initial={{opacity: 0, x: 20}} whileInView={{opacity: 1, x: 0}} viewport={{once: true}} transition={{delay: i * 0.1}}
                className="flex items-start gap-4 mb-5"
              >
                <div className="w-10 h-10 rounded-xl bg-[#E9521C]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">{item.icon}</span>
                </div>
                <div>
                  <div className="font-body font-bold text-[#0a0a0a] text-sm mb-0.5">{item.title}</div>
                  <div className="font-body text-gray-400 text-xs leading-relaxed">{item.desc}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}