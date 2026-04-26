"use client";

import { motion } from "framer-motion";
import { BookOpen, Check } from "lucide-react";

export function Offerings() {
  return (
    <section id="offerings" className="bg-white py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#E9521C]/10 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-[#E9521C]" />
          </div>
          <span className="font-body text-[#E9521C] font-semibold text-sm uppercase tracking-widest">Learn & Grow</span>
        </div>
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div initial={{opacity: 0, x: -30}} whileInView={{opacity: 1, x: 0}} viewport={{once: true}} transition={{duration: 0.6}}>
            <h2 className="font-display text-5xl lg:text-6xl font-black text-[#0a0a0a] leading-tight mb-6">
              Financial Education<br /><span className="text-[#E9521C]">Made Simple</span>
            </h2>
            <p className="font-body text-gray-500 text-lg leading-relaxed mb-8">
              No more confusion. No more barriers. Nthoppa breaks down complex financial concepts into bite-sized lessons anyone can understand.
            </p>
            {[
              'Easy-to-understand financial courses',
              'Learn at your own pace, anytime',
              'Build confidence in money management',
              'From basics to advanced investing',
            ].map((item, i) => (
              <motion.div key={i} initial={{opacity: 0, x: -20}} whileInView={{opacity: 1, x: 0}} viewport={{once: true}} transition={{delay: i * 0.1 + 0.2}}
                className="flex items-center gap-3 mb-4"
              >
                <div className="w-5 h-5 rounded-full bg-[#E9521C] flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="font-body text-gray-700">{item}</span>
              </motion.div>
            ))}
          </motion.div>
          <motion.div initial={{opacity: 0, y: 30}} whileInView={{opacity: 1, y: 0}} viewport={{once: true}} transition={{duration: 0.6, delay: 0.2}}>
            <div className="bg-[#0a0a0a] rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <span className="font-body text-white/50 text-sm">Today's Lesson</span>
                <span className="bg-[#E9521C]/20 text-[#E9521C] font-body font-semibold text-xs px-3 py-1 rounded-full">75% Complete</span>
              </div>
              <h3 className="font-display text-white text-2xl font-bold mb-6">Understanding Savings</h3>
              <div className="space-y-4">
                {[
                  { label: 'Budgeting Basics', done: true, pct: 100 },
                  { label: 'Saving Strategies', done: true, pct: 100 },
                  { label: 'Investment Fundamentals', done: false, pct: 40 },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1.5">
                      <span className="font-body text-white/70 text-sm">{item.label}</span>
                      <span className="font-body text-white/40 text-xs">{item.done ? '✓ Done' : `${item.pct}%`}</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div initial={{width: 0}} whileInView={{width: `${item.pct}%`}} viewport={{once: true}} transition={{duration: 1, delay: i * 0.2}}
                        className={`h-full rounded-full ${item.done ? 'bg-green-500' : 'bg-[#E9521C]'}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 bg-[#F5A623]/10 border border-[#F5A623]/20 rounded-2xl p-4 flex items-center gap-3">
                <span className="text-2xl">🪙</span>
                <div>
                  <div className="font-display text-[#F5A623] font-bold">+25 Coins</div>
                  <div className="font-body text-white/50 text-xs">earned for completing this lesson</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}