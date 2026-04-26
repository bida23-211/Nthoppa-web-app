"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  scrolled: boolean;
}

const navLinks = [
  { label: "Offerings", href: "#offerings" },
  { label: "Partners", href: "#partners" },
  { label: "Banking", href: "#banking" },
  { label: "Credit", href: "#credit-scoring" },
  { label: "SME Pipeline", href: "#sme-pipeline" },
  { label: "Incubator", href: "#incubator" },
];

export function Navbar({ scrolled }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSmoothScroll = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
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
  );
}