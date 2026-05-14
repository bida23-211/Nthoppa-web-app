"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  CreditCard,
  QrCode,
  BarChart3,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Shield,
  Lock,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { name: "Dashboard", href: "/merchant/dashboard", icon: LayoutDashboard },
  { name: "Transactions", href: "/merchant/transactions", icon: CreditCard },
  { name: "QR Payments", href: "/merchant/qr-payments", icon: QrCode },
  { name: "Analytics", href: "/merchant/analytics", icon: BarChart3 },
];

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [merchantName, setMerchantName] = useState("");
  const [merchantEmail, setMerchantEmail] = useState("");
  const [lastLoginDate, setLastLoginDate] = useState<string>("");
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setLastLoginDate(new Date().toLocaleDateString());
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/check', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setMerchantName(data.name || "Merchant");
          setMerchantEmail(data.email || "");
        } else {
          router.push("/login");
        }
      } catch {
        setMerchantName("Merchant");
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (e) {}
    localStorage.removeItem("nthoppa_token");
    localStorage.removeItem("nthoppa_role");
    localStorage.removeItem("nthoppa_user_id");
    toast({ title: "Logged out", description: "You have been successfully logged out." });
    router.push("/login");
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-white">
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ type: "tween", duration: 0.3 }}
        className="fixed left-0 top-0 z-50 h-full w-72 bg-black text-white lg:translate-x-0"
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-black flex-shrink-0 border border-[#E9521C]/20">
              <img src="/nthoppa-logo.png" alt="Nthoppa" className="h-9 w-9 object-cover" />
            </div>
            <span className="text-xl font-bold text-white">Nthoppa Merchant</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-3 mt-6">
          <div className="mb-6 p-3 bg-[#1A1A1A] rounded-xl">
            <p className="text-xs text-gray-400">Welcome back,</p>
            <p className="font-semibold text-white">{merchantName || "Merchant"}</p>
            <div className="mt-2 inline-block px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full border border-purple-500/30">
              🏪 Merchant
            </div>
          </div>
        </div>

        <nav className="mt-2 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-[#E9521C] text-white"
                    : "text-gray-300 hover:bg-[#E9521C]/10 hover:text-[#E9521C]"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </a>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <Button
            variant="outline"
            className="w-full border-gray-700 text-white hover:bg-[#E9521C] hover:border-[#E9521C]"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </motion.aside>

      {/* Main Content - REMOVED LEFT PADDING */}
      <div className="lg:pl-0">
        <header className="fixed right-0 left-0 top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex h-16 items-center justify-between px-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex-1" />

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-600 border border-purple-500/30">
                  🏪 Merchant
                </div>
                <div className="text-xs text-gray-400 hidden md:block">
                  Last login: {lastLoginDate || "Loading..."} from Gaborone
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <Avatar className="h-8 w-8 bg-[#E9521C]">
                      <AvatarFallback className="text-white">
                        {getInitials(merchantName || "Merchant")}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-xl border-gray-100 p-1">
                  <div className="px-3 py-2.5 border-b border-gray-100">
                    <p className="font-semibold text-gray-900 text-sm truncate">{merchantName || "Merchant"}</p>
                    <p className="text-gray-400 text-xs truncate">{merchantEmail || ""}</p>
                  </div>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500 rounded-lg mt-1 cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="pt-16">
          <div className="p-6">
            {children}
            
            <footer className="mt-8 pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
              <span>© 2026 Nthoppa Financial. All rights reserved.</span>
              <div className="flex items-center gap-4 flex-wrap justify-center">
                <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> AES-256 Encrypted</span>
                <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> OAuth 2.0</span>
                <span className="flex items-center gap-1"><Activity className="h-3 w-3" /> Real-time Monitoring</span>
                <button className="text-[#E9521C] hover:underline">Support</button>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}