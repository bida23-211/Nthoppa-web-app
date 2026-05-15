"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useInView } from "framer-motion";
import {
  Menu,
  X,
  BookOpen,
  ShoppingBag,
  Shield,
  Check,
  BarChart3,
  ChevronRight,
  Globe,
  Rocket,
  TrendingUp,
  Wallet,
  CheckCircle,
  Award,
  Star,
  Clock,
  Target,
  Zap,
  Lock,
  Activity,
  Building2,
  Store,
  Briefcase,
  GraduationCap,
  PiggyBank,
  CreditCard,
} from "lucide-react";
import Image from "next/image";

const navLinks = [
  { label: "Offerings", href: "#offerings" },
  { label: "Partners", href: "#partners" },
  { label: "Banking", href: "#banking" },
  { label: "Credit", href: "#credit-scoring" },
  { label: "SME Pipeline", href: "#sme-pipeline" },
  { label: "Incubator", href: "#incubator" },
];

const socialLinks = [
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    )
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    )
  },
  {
    label: 'X (Twitter)',
    href: 'https://x.com',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622z"/>
      </svg>
    )
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8z"/>
      </svg>
    )
  },
];


// ── Animated CountUp hook ─────────────────────────────────────────────────────
function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

// ── Stats Section with animated countup ──────────────────────────────────────
function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const stats = [
    { target: 24891, label: 'Total Users', icon: '👥', suffix: '', desc: 'and growing daily' },
    { target: 8342, label: 'Active Agents', icon: '🤝', suffix: '', desc: 'across Botswana' },
    { target: 6120, label: 'Credit Profiles', icon: '📊', suffix: '', desc: 'built on the platform' },
    { target: 712, label: 'Avg Credit Score', icon: '⭐', suffix: '', desc: 'average member score' },
  ];
  const counts = [
    useCountUp(stats[0].target, 2000, isInView),
    useCountUp(stats[1].target, 2000, isInView),
    useCountUp(stats[2].target, 2000, isInView),
    useCountUp(stats[3].target, 2000, isInView),
  ];

  // Live activity ticker
  const activities = [
    "🎉 Thabo M. just earned 50 coins",
    "📈 Kgabo Trading reached SME Ready status",
    "🏦 Josephine K. opened a Stanbic account",
    "🛡️ Michael L. activated NthoppaSure",
    "⭐ Botsalano Farm credit score jumped +34pts",
    "🎓 Sarah P. completed Financial Literacy Level 3",
    "💰 Lebo Fashion saved BWP 2,000 this month",
  ];
  const [tickerIdx, setTickerIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTickerIdx(i => (i + 1) % activities.length), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="bg-white py-20 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        {/* Live ticker */}
        <div className="flex items-center gap-3 bg-[#E9521C]/5 border border-[#E9521C]/20 rounded-xl px-4 py-2.5 mb-12 overflow-hidden">
          <span className="flex-shrink-0 flex items-center gap-1.5 text-[#E9521C] font-body font-bold text-xs uppercase tracking-widest">
            <span className="w-2 h-2 bg-[#E9521C] rounded-full animate-pulse" />
            Live
          </span>
          <div className="overflow-hidden flex-1">
            <motion.div
              key={tickerIdx}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="font-body text-sm text-gray-600"
            >
              {activities[tickerIdx]}
            </motion.div>
          </div>
        </div>

        <div className="text-center mb-12">
          <span className="font-body text-[#E9521C] font-semibold text-sm uppercase tracking-widest">Platform Dashboard</span>
          <h2 className="font-display text-4xl font-black text-[#0a0a0a] mt-2">Nthoppa by the <span className="text-[#E9521C]">Numbers</span></h2>
          <p className="font-body text-gray-400 text-base mt-3 max-w-md mx-auto">Real impact, real people. See what the Nthoppa community has built together.</p>
        </div>
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{opacity: 0, y: 20}} whileInView={{opacity: 1, y: 0}} viewport={{once: true}} transition={{delay: i * 0.1}}
              className="flex flex-col items-center gap-2 p-6 rounded-2xl hover:bg-[#f8f9fa] transition-colors group"
            >
              <span className="text-4xl mb-1 group-hover:scale-110 transition-transform">{stat.icon}</span>
              <div className="font-display text-5xl font-black text-[#0a0a0a]">
                {isInView ? counts[i].toLocaleString() : '0'}{stat.suffix}
              </div>
              <div className="font-body font-semibold text-gray-700 text-sm">{stat.label}</div>
              <div className="font-body text-gray-400 text-xs">{stat.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── How It Works Section ──────────────────────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    { num: '01', icon: '📱', title: 'Sign Up in Minutes', desc: 'Create your Nthoppa account with just your name, phone number, and national ID. No bank account required to get started.' },
    { num: '02', icon: '🎓', title: 'Complete Financial Literacy', desc: 'Work through bite-sized modules that teach budgeting, saving, and credit. Earn coins and build your Grit score as you go.' },
    { num: '03', icon: '📊', title: 'Build Your Credit Profile', desc: 'Your savings patterns, income consistency, and behaviour automatically generate an alternative credit score — no formal history needed.' },
    { num: '04', icon: '🏦', title: 'Unlock Banking Products', desc: 'Once ready, access Stanbic's Instant Money Wallet, savings accounts, and business banking — with Nthoppa as your bridge.' },
  ];

  return (
    <section className="bg-[#0a0a0a] py-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 w-96 h-96 bg-[#E9521C]/10 rounded-full blur-[120px] -translate-x-1/2" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="font-body text-[#E9521C] font-semibold text-sm uppercase tracking-widest">Simple Process</span>
          <h2 className="font-display text-4xl lg:text-5xl font-black text-white mt-2">How It <span className="text-[#E9521C]">Works</span></h2>
          <p className="font-body text-white/50 text-base mt-3 max-w-md mx-auto">From unbanked to business banking — four steps that change everything.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="relative bg-white/5 border border-white/10 hover:border-[#E9521C]/40 rounded-3xl p-6 transition-all group hover:bg-white/8"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl group-hover:scale-110 transition-transform">{step.icon}</span>
                <span className="font-display text-5xl font-black text-white/10 group-hover:text-[#E9521C]/20 transition-colors">{step.num}</span>
              </div>
              <h3 className="font-display text-lg font-black text-white mb-2">{step.title}</h3>
              <p className="font-body text-white/50 text-sm leading-relaxed">{step.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-[#E9521C]/30" />
              )}
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12">
          <a href="/login" className="inline-flex items-center gap-3 bg-[#E9521C] text-white font-body font-bold px-8 py-4 rounded-2xl hover:bg-[#c44216] transition-all shadow-[0_8px_32px_rgba(233,82,28,0.4)] hover:shadow-[0_12px_40px_rgba(233,82,28,0.6)] hover:-translate-y-0.5 transform">
            Start Your Journey →
          </a>
        </div>
      </div>
    </section>
  );
}

// ── Testimonials Section ──────────────────────────────────────────────────────
function TestimonialsSection() {
  const testimonials = [
    { name: 'Thabo Molefe', role: 'Informal Trader → SME Owner', location: 'Gaborone', quote: 'I had no credit history and no bank account. After 6 months on Nthoppa, I qualified for a Stanbic business account and got working capital for my hardware shop.', score: '+89pts credit score', avatar: 'TM', color: 'from-orange-500 to-red-500' },
    { name: 'Josephine Kgosinkwe', role: 'Market Vendor → Micro-Entrepreneur', location: 'Francistown', quote: 'The financial literacy modules taught me things no one ever explained before — budgeting, savings goals, insurance. My Grit score is now 78 and I'm in the Accelerate programme.', score: '78 Grit Score', avatar: 'JK', color: 'from-blue-500 to-purple-500' },
    { name: 'Michael Modise', role: 'Agent, Nthoppa Field Team', location: 'Maun', quote: 'As an agent I've helped 340 clients register in 8 months. The pipeline dashboard shows me exactly who's ready for Stanbic referral — it takes the guesswork out completely.', score: '340 clients enrolled', avatar: 'MM', color: 'from-green-500 to-teal-500' },
  ];

  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="font-body text-[#E9521C] font-semibold text-sm uppercase tracking-widest">Real Stories</span>
          <h2 className="font-display text-4xl lg:text-5xl font-black text-[#0a0a0a] mt-2">People Behind the <span className="text-[#E9521C]">Numbers</span></h2>
          <p className="font-body text-gray-400 text-base mt-3 max-w-md mx-auto">From spaza shops to formal business banking — Batswana building better financial futures.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-white border border-gray-100 rounded-3xl p-7 shadow-sm hover:shadow-lg transition-all group hover:-translate-y-1"
            >
              <div className="flex items-center gap-4 mb-5">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-display font-black text-sm flex-shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-display font-black text-[#0a0a0a] text-sm">{t.name}</p>
                  <p className="font-body text-gray-400 text-xs">{t.role}</p>
                  <p className="font-body text-gray-300 text-xs">📍 {t.location}</p>
                </div>
              </div>
              <div className="mb-4">
                <svg className="w-8 h-8 text-[#E9521C]/20 mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
                <p className="font-body text-gray-600 text-sm leading-relaxed">{t.quote}</p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <span className="inline-flex items-center gap-1.5 bg-[#E9521C]/10 text-[#E9521C] font-body font-bold text-xs px-3 py-1.5 rounded-full">
                  ⭐ {t.score}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSmoothScroll = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-[#0a0a0a]/95 backdrop-blur-xl shadow-[0_1px_0_rgba(233,82,28,0.3)]' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-black border border-[#E9521C]/30 flex-shrink-0">
              <img src="/nthoppa-logo.png" alt="Nthoppa" className="h-9 w-9 object-cover" />
            </div>
            <span className="font-display font-black text-xl text-white tracking-tight">Nthoppa</span>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <a key={link.label} href={link.href}
                onClick={(e) => { e.preventDefault(); handleSmoothScroll(link.href); }}
                className="text-white/60 hover:text-[#E9521C] font-body font-medium text-sm transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#E9521C] group-hover:w-full transition-all duration-300 rounded-full" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a href="/login" className="bg-[#E9521C] text-white font-body font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-[#c44216] transition-all shadow-[0_0_20px_rgba(233,82,28,0.4)] hover:shadow-[0_0_30px_rgba(233,82,28,0.6)]">
              Get Started →
            </a>
          </div>

          <button className="lg:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0a0a0a] border-t border-white/10 py-4 px-6">
            <div className="flex flex-col gap-4">
              {navLinks.map(link => (
                <a key={link.label} href={link.href}
                  onClick={(e) => { e.preventDefault(); handleSmoothScroll(link.href); }}
                  className="text-white/60 hover:text-[#E9521C] font-body text-sm transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a href="/login" className="bg-[#E9521C] text-white font-body font-bold text-sm px-5 py-2.5 rounded-xl text-center">Get Started →</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen bg-[#0a0a0a] flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#E9521C]/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#E9521C]/10 rounded-full blur-[100px] animate-pulse" style={{animationDelay: '1s'}} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-orange-900/20 rounded-full blur-[80px] animate-pulse" style={{animationDelay: '2s'}} />
          <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px'}} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center py-24">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#E9521C]/10 border border-[#E9521C]/30 rounded-full px-4 py-2 mb-8">
              <div className="w-2 h-2 bg-[#E9521C] rounded-full animate-pulse" />
              <span className="text-[#E9521C] font-body text-sm font-semibold">Botswana's #1 Fintech Platform</span>
            </div>
            <h1 className="font-display text-6xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-6">
              Financial<br />
              <span className="text-[#E9521C]">Freedom</span><br />
              for Everyone
            </h1>
            <p className="font-body text-white/60 text-lg leading-relaxed mb-10 max-w-md">
              Empowering the unbanked through financial education, inclusive banking products, and rewards that transform lives.
            </p>
            <div className="flex flex-wrap gap-4 mb-12">
              <a href="/login" className="inline-flex items-center gap-3 bg-[#E9521C] text-white font-body font-bold px-7 py-4 rounded-2xl hover:bg-[#c44216] transition-all shadow-[0_8px_32px_rgba(233,82,28,0.4)] hover:shadow-[0_12px_40px_rgba(233,82,28,0.6)] hover:-translate-y-0.5 transform text-sm">
                Get Started →
              </a>
              <a href="#partners" onClick={(e) => { e.preventDefault(); handleSmoothScroll('#partners'); }}
                className="inline-flex items-center gap-2 border border-white/20 text-white/80 font-body font-semibold px-7 py-4 rounded-2xl hover:border-[#E9521C]/50 hover:text-white transition-all text-sm backdrop-blur-sm"
              >
                Our Partners
              </a>
            </div>
            <div className="flex items-center gap-8">
              {[
                { value: '24,891', label: 'Total Users' },
                { value: '8,342', label: 'Active Agents' },
                { value: '712', label: 'Avg Credit Score' },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="font-display text-2xl font-black text-white">{stat.value}</div>
                  <div className="font-body text-white/40 text-xs mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-end justify-center gap-5 h-[560px]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-72 h-72 bg-[#E9521C]/25 rounded-full blur-[80px]" />
            </div>
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-[175px] mt-16 z-10"
            >
              <div className="rounded-[2.8rem] overflow-hidden border-[3px] border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.8)]">
                <img src="/app-screen-home.jpg" alt="Nthoppa App" className="w-full h-auto block" />
              </div>
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-14 h-1.5 bg-black rounded-full z-20" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              className="relative w-[175px] mb-16 z-10"
            >
              <div className="rounded-[2.8rem] overflow-hidden border-[3px] border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.8)]">
                <img src="/app-screen-coins.jpg" alt="Nthoppa Rewards" className="w-full h-auto block" />
              </div>
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-14 h-1.5 bg-black rounded-full z-20" />
              <motion.div
                animate={{ y: [0, -6, 0], rotate: [0, 2, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -right-8 top-20 bg-[#F5A623] text-black font-display font-black text-xs px-3 py-2 rounded-2xl shadow-xl whitespace-nowrap"
              >
                🪙 +25 Coins Earned!
              </motion.div>
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -left-10 bottom-32 bg-white text-black font-body font-semibold text-xs px-3 py-2 rounded-2xl shadow-xl whitespace-nowrap"
              >
                🛡️ Insured & Protected
              </motion.div>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-white" />
      </section>

      {/* Offerings Section */}
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

      {/* Banking Section - Full Marketplace */}
      <section id="banking" className="bg-[#0a0a0a] py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E9521C]/10 rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
            <div className="w-8 h-8 rounded-lg bg-[#E9521C]/10 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-[#E9521C]" />
            </div>
            <span className="font-body text-[#E9521C] font-semibold text-sm uppercase tracking-widest">Fintech Marketplace</span>
          </div>
          
          <div className="text-center mb-16">
            <h2 className="font-display text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Access Financial<br />Products <span className="text-[#E9521C]">You Need</span>
            </h2>
            <p className="font-body text-white/50 text-lg max-w-2xl mx-auto">
              From insurance to investments, get access to a curated marketplace of financial products designed for the everyday Motswana.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { 
                icon: '🛡️', 
                title: 'Insurance', 
                description: 'Motor, home, life, and funeral coverage from Westlife Insurance Botswana',
                features: ['24/7 claims support', 'Flexible payment plans', 'Instant quotes']
              },
              { 
                icon: '📈', 
                title: 'Investments', 
                description: 'Low-cost investment opportunities starting from P500 minimum',
                features: ['Unit trusts', 'Money market funds', 'Retirement planning']
              },
              { 
                icon: '📱', 
                title: 'Airtime & Data', 
                description: 'Instant purchases for all major Botswana networks',
                features: ['Mascom', 'Orange', 'BTC', 'Instant delivery']
              },
              { 
                icon: '🏦', 
                title: 'Banking Products', 
                description: 'Entry-level accounts and savings products from partner banks',
                features: ['Low fees', 'No minimum balance', 'Mobile banking']
              },
            ].map((product, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative bg-gradient-to-br from-white/5 to-white/0 rounded-2xl p-6 border border-white/10 hover:border-[#E9521C]/40 transition-all hover:transform hover:-translate-y-1"
              >
                <div className="text-5xl mb-4">{product.icon}</div>
                <h3 className="font-bold text-white text-xl mb-2">{product.title}</h3>
                <p className="text-white/50 text-sm mb-4">{product.description}</p>
                <ul className="space-y-2">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-white/40 text-xs">
                      <Check className="w-3 h-3 text-[#E9521C]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Credit Scoring Section */}
      <section id="credit-scoring" className="bg-white py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#E9521C]/10 border border-[#E9521C]/30 rounded-full px-4 py-2 mb-6">
              <BarChart3 className="w-4 h-4 text-[#E9521C]" />
              <span className="font-body text-[#E9521C] font-semibold text-sm uppercase tracking-widest">Alternative Credit Data</span>
            </div>
            <h2 className="font-display text-5xl lg:text-6xl font-black text-[#0a0a0a] leading-tight mb-6">
              Credit Scoring for the <span className="text-[#E9521C]">Underserved</span>
            </h2>
            <p className="font-body text-gray-500 text-lg max-w-2xl mx-auto">
              Nthoppa's user behaviour data — savings consistency, income patterns, and financial discipline — complements existing credit assessment models for small-ticket unsecured lending.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{opacity: 0, x: -30}} whileInView={{opacity: 1, x: 0}} viewport={{once: true}} transition={{duration: 0.6}}>
              <div className="bg-[#0a0a0a] rounded-3xl p-8 shadow-2xl">
                <div className="font-body text-white/40 text-xs uppercase tracking-widest mb-6">Behavioural Credit Metrics</div>
                <div className="space-y-4 mb-8">
                  {[
                    { label: 'Savings Consistency', pct: 82, icon: '🏦' },
                    { label: 'Income Patterns', pct: 74, icon: '📊' },
                    { label: 'Financial Discipline', pct: 68, icon: '🎯' },
                    { label: 'Transaction History', pct: 66, icon: '💳' },
                    { label: 'Behavioural Score', pct: 77, icon: '⭐' },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{item.icon}</span>
                          <span className="font-body text-white/70 text-sm">{item.label}</span>
                        </div>
                        <span className="font-body text-[#E9521C] font-bold text-sm">{item.pct}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div initial={{width: 0}} whileInView={{width: `${item.pct}%`}} viewport={{once: true}} transition={{duration: 1, delay: i * 0.1}}
                          className="h-full bg-[#E9521C] rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-4 h-4 text-[#E9521C]" />
                      <span className="font-body text-white/40 text-xs">CreditYame</span>
                    </div>
                    <div className="font-display text-[#E9521C] font-black text-2xl">4,230</div>
                    <div className="font-body text-white/40 text-xs">Formal Sector Profiles</div>
                    <div className="font-body text-white/60 text-sm mt-1">Avg Score: 703</div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Store className="w-4 h-4 text-orange-400" />
                      <span className="font-body text-white/40 text-xs">iPachi</span>
                    </div>
                    <div className="font-display text-orange-400 font-black text-2xl">8,940</div>
                    <div className="font-body text-white/40 text-xs">Informal Sector Traders</div>
                    <div className="font-body text-white/60 text-sm mt-1">Avg Score: 477</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{opacity: 0, x: 30}} whileInView={{opacity: 1, x: 0}} viewport={{once: true}} transition={{duration: 0.6}}>
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-gray-50">
                  <div className="w-12 h-12 rounded-xl bg-[#E9521C]/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-[#E9521C]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0a0a0a] text-lg mb-1">CreditYame — Formal Sector</h3>
                    <p className="text-gray-500 text-sm">Traditional credit scoring integration for salaried and formally employed users in Botswana.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-gray-50">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <Store className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0a0a0a] text-lg mb-1">iPachi — Informal Sector</h3>
                    <p className="text-gray-500 text-sm">Alternative data scoring for informal traders and micro-entrepreneurs without formal credit histories.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-gray-50">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0a0a0a] text-lg mb-1">Small-Ticket Lending</h3>
                    <p className="text-gray-500 text-sm">Enable responsible unsecured personal loans from P500–P5,000 to segments previously excluded from formal credit.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SME Pipeline Section */}
      <section id="sme-pipeline" className="bg-[#0a0a0a] py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E9521C]/8 rounded-full blur-[140px]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex items-center gap-3 mb-6 justify-center">
            <div className="w-8 h-8 rounded-lg bg-[#E9521C]/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#E9521C]" />
            </div>
            <span className="font-body text-[#E9521C] font-semibold text-sm uppercase tracking-widest">SME Pipeline Development</span>
          </div>
          
          <div className="text-center mb-16">
            <h2 className="font-display text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              From Informal Trader<br />to <span className="text-[#E9521C]">Business Banking</span>
            </h2>
            <p className="font-body text-white/60 text-lg max-w-2xl mx-auto">
              Nthoppa provides visibility into informal traders and micro-entrepreneurs who may, over time, transition into formal Business Banking.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div initial={{opacity: 0, x: -30}} whileInView={{opacity: 1, x: 0}} viewport={{once: true}} transition={{duration: 0.6}}>
              <div className="space-y-4">
                {[
                  { icon: '🏪', title: 'Informal Traders', desc: 'Identify and onboard micro-entrepreneurs at the base of the pyramid' },
                  { icon: '📈', title: 'Skills Qualification', desc: 'Track financial discipline scores that signal readiness for formal products' },
                  { icon: '🏦', title: 'Business Banking Ready', desc: 'Bridge informal traders into SME accounts and working capital solutions' },
                  { icon: '🚀', title: 'Enterprise Development', desc: 'Create a long-term pipeline into enterprise and corporate banking' },
                ].map((item, i) => (
                  <motion.div key={i} initial={{opacity: 0, x: -20}} whileInView={{opacity: 1, x: 0}} viewport={{once: true}} transition={{delay: i * 0.1}}
                    className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 hover:bg-white/8 transition-colors border border-white/5 hover:border-[#E9521C]/20 group"
                  >
                    <span className="text-3xl">{item.icon}</span>
                    <div>
                      <div className="font-body font-bold text-white text-base mb-1">{item.title}</div>
                      <div className="font-body text-white/40 text-sm leading-relaxed">{item.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{opacity: 0, y: 30}} whileInView={{opacity: 1, y: 0}} viewport={{once: true}} transition={{duration: 0.6, delay: 0.2}}>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <div className="font-body text-white/40 text-xs uppercase tracking-widest mb-6">iPachi Integration — SMME Pipeline</div>
                {[
                  { stage: 'Informal Traders Identified', value: 12480, pct: 100, color: 'bg-[#E9521C]' },
                  { stage: 'Skills & Readiness Qualified', value: 5240, pct: 42, color: 'bg-orange-400' },
                  { stage: 'Business Banking Ready', value: 863, pct: 7, color: 'bg-amber-400' },
                  { stage: 'Enterprise Development', value: 218, pct: 2, color: 'bg-yellow-300' },
                ].map((item, i) => (
                  <div key={i} className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="font-body text-white/70 text-sm">{item.stage}</span>
                      <span className="font-body text-white font-bold text-sm">{item.value.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div initial={{width: 0}} whileInView={{width: `${item.pct}%`}} viewport={{once: true}} transition={{duration: 1.2, delay: i * 0.15}}
                        className={`h-full ${item.color} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
                <div className="mt-6 border-t border-white/10 pt-6">
                  <div className="flex items-center justify-between">
                    {['Identify', 'Qualify', 'Graduate'].map((step, i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-black text-sm ${i === 0 ? 'bg-[#E9521C] text-white' : 'bg-white/10 text-white/40'}`}>
                          {i + 1}
                        </div>
                        <span className="font-body text-white/50 text-xs">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Accelerate Incubator Section */}
      <section id="incubator" className="bg-white py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-6 justify-center">
            <div className="w-8 h-8 rounded-lg bg-[#E9521C]/10 flex items-center justify-center">
              <Rocket className="w-4 h-4 text-[#E9521C]" />
            </div>
            <span className="font-body text-[#E9521C] font-semibold text-sm uppercase tracking-widest">Accelerate Incubator</span>
          </div>

          <div className="text-center mb-16">
            <h2 className="font-display text-5xl lg:text-6xl font-black text-[#0a0a0a] leading-tight mb-6">
              Nurturing the Next Generation of <span className="text-[#E9521C]">Entrepreneurs</span>
            </h2>
            <p className="font-body text-gray-500 text-lg max-w-2xl mx-auto">
              Nthoppa acts as a preparatory layer for the Accelerate Incubator, equipping early-stage entrepreneurs with baseline financial capability and business discipline.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{opacity: 0, y: 30}} whileInView={{opacity: 1, y: 0}} viewport={{once: true}} transition={{duration: 0.6}}>
              <div className="bg-[#0a0a0a] rounded-3xl p-8 shadow-2xl">
                <div className="font-body text-white/40 text-xs uppercase tracking-widest mb-6">Programme Stats</div>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    { value: '2,840', label: 'Assessed', color: 'text-[#E9521C]' },
                    { value: '412', label: 'Referred', color: 'text-orange-400' },
                    { value: '189', label: 'Evaluated', color: 'text-amber-400' },
                    { value: '134', label: 'Businesses Launched', color: 'text-green-400' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/5 rounded-2xl p-5 text-center">
                      <div className={`font-display text-4xl font-black ${stat.color}`}>{stat.value}</div>
                      <div className="font-body text-white/50 text-xs mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                  <div className="font-body text-white/60 text-xs uppercase tracking-wider mb-4">Entry Requirements</div>
                  <ul className="space-y-3">
                    {[
                      'Grit score 70 or higher',
                      '90-day savings streak',
                      'Weekly activity maintained',
                      '50% module completion',
                    ].map((req, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#E9521C]/20 flex items-center justify-center flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-[#E9521C]" />
                        </div>
                        <span className="font-body text-white/60 text-sm">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{opacity: 0, x: 30}} whileInView={{opacity: 1, x: 0}} viewport={{once: true}} transition={{duration: 0.6}}>
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-gray-50">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0a0a0a] text-base mb-1">Financial Baseline</h3>
                    <p className="text-gray-500 text-sm">Entrepreneurs complete structured financial literacy modules before programme entry.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-gray-50">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0a0a0a] text-base mb-1">Readiness Scoring</h3>
                    <p className="text-gray-500 text-sm">Behaviour-based scoring identifies the most prepared candidates automatically.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-gray-50">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <PiggyBank className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0a0a0a] text-base mb-1">Business Discipline</h3>
                    <p className="text-gray-500 text-sm">Savings streaks, quiz completion and engagement track discipline over time.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partners Section - WITH STANBIC LOGO (Blurb Removed) */}
      <section id="partners" className="bg-[#0a0a0a] py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="font-body text-white/40 text-sm uppercase tracking-widest mb-10">Trusted Partners</div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-5xl mx-auto">
            {[
              { name: "CreditYame", logo: "/partners/credityame.jpeg", category: "Credit Scoring" },
              { name: "iPachi Capital", logo: "/partners/ipachi.jpeg", category: "SME Finance" },
              { name: "Seriti Insights", logo: "/partners/seriti.jpeg", category: "Data & Analytics" },
              { name: "Seipone.ai", logo: "/partners/seipone.jpeg", category: "AI Solutions" },
              { name: "Stanbic Bank", logo: "/partners/stanbic.jpeg", category: "Strategic Banking Partner" },
            ].map(partner => (
              <div key={partner.name} className="bg-white/5 rounded-2xl p-5 flex flex-col items-center gap-3 hover:bg-white/10 transition-all">
                <div className="h-12 w-full flex items-center justify-center">
                  <img src={partner.logo} alt={partner.name} className="max-h-10 max-w-full object-contain opacity-70 hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-center">
                  <p className="font-body font-semibold text-white/60 text-xs">{partner.name}</p>
                  <p className="font-body text-white/30 text-[10px] mt-0.5">{partner.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />
      <HowItWorksSection />
      <TestimonialsSection />

      {/* Footer */}
      <footer className="bg-[#050505] border-t border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl overflow-hidden bg-black border border-[#E9521C]/20">
                  <img src="/nthoppa-logo.png" alt="Nthoppa" className="h-9 w-9 object-cover" />
                </div>
                <span className="font-display font-black text-white text-lg">Nthoppa</span>
              </div>
              <p className="font-body text-white/40 text-sm leading-relaxed">Empowering the unbanked with financial education, marketplace access, and rewards that transform lives.</p>
            </div>
            <div>
              <div className="font-body font-semibold text-white/60 text-xs uppercase tracking-widest mb-4">Quick Links</div>
              {[
                { label: 'Our Offerings', href: '#offerings' },
                { label: 'Partners', href: '#partners' },
                { label: 'Banking', href: '#banking' },
                { label: 'SME Pipeline', href: '#sme-pipeline' },
                { label: 'Incubator', href: '#incubator' },
              ].map(link => (
                <a key={link.label} href={link.href}
                  onClick={(e) => { e.preventDefault(); const el = document.querySelector(link.href); if(el) el.scrollIntoView({ behavior: 'smooth' }); }}
                  className="block font-body text-white/40 hover:text-[#E9521C] text-sm mb-3 cursor-pointer transition-colors">{link.label}</a>
              ))}
            </div>
            <div>
              <div className="font-body font-semibold text-white/60 text-xs uppercase tracking-widest mb-4">Legal</div>
              {['Terms & Conditions', 'Privacy Policy', 'Cookie Policy', 'Disclaimer'].map(link => (
                <div key={link} className="font-body text-white/40 hover:text-[#E9521C] text-sm mb-3 cursor-pointer transition-colors">{link}</div>
              ))}
            </div>
            <div>
              <div className="font-body font-semibold text-white/60 text-xs uppercase tracking-widest mb-4">Contact</div>
              <div className="font-body text-white/40 text-sm mb-2">info@nthoppa.com</div>
              <div className="font-body text-white/40 text-sm mb-2">+267 7123 4567</div>
              <div className="font-body text-white/40 text-sm">Gaborone, Botswana</div>
              <div className="flex items-center gap-3 mt-4">
                {socialLinks.map(social => (
                  <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#E9521C]/20 flex items-center justify-center transition-colors border border-white/10 hover:border-[#E9521C]/30 text-white/50 hover:text-[#E9521C]"
                    aria-label={social.label}
                  >
                    {social.svg}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="font-body text-white/20 text-xs">© 2026 Nthoppa. All rights reserved.</div>
            <div className="font-body text-white/20 text-xs">Made with ❤️ for Batswana</div>
          </div>
        </div>
      </footer>
    </div>
  );
}