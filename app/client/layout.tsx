"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  PiggyBank,
  BookOpen,
  History,
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
  { name: "Overview", href: "/client/dashboard", icon: LayoutDashboard },
  { name: "My Motshelo", href: "/client/motshelo", icon: Users },
  { name: "Loans", href: "/client/loans", icon: CreditCard },
  { name: "Savings Goals", href: "/client/savings", icon: PiggyBank },
  { name: "Education", href: "/client/education", icon: BookOpen },
  { name: "Transactions", href: "/client/transactions", icon: History },
  { name: "NthoppaSure", href: "/client/marketplace", icon: Shield },
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
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
          setClientName(data.name || "Client");
          setClientEmail(data.email || "");
        } else {
          router.push("/login");
        }
      } catch {
        setClientName("Client");
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
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -288 }}
        animate={{ x: sidebarOpen ? 0 : -288 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 z-50 h-full w-72 bg-[#0a0a0a] text-white lg:translate-x-0 flex flex-col"
      >
        <div className="flex h-16 items-center justify-between px-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-black flex-shrink-0 border border-[#E9521C]/20">
              <img src="/nthoppa-logo.png" alt="Nthoppa" className="h-9 w-9 object-cover" />
            </div>
            <div>
              <span className="text-lg font-black text-white tracking-tight">Nthoppa</span>
              <div className="text-[10px] text-[#E9521C] font-semibold uppercase tracking-wider">Client Portal</div>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mx-3 mt-4 p-3 rounded-xl bg-gradient-to-br from-[#E9521C]/20 to-[#E9521C]/5 border border-[#E9521C]/20">
          <p className="text-xs text-gray-400 mb-0.5">Welcome back,</p>
          <p className="font-bold text-white">{clientName || "Client"}</p>
          <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span> Active Client
          </div>
        </div>

        <nav className="flex-1 mt-4 px-2 space-y-0.5 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-[#E9521C] text-white shadow-lg shadow-[#E9521C]/20"
                    : "text-gray-400 hover:bg-white/8 hover:text-white"
                )}
              >
                <item.icon className="h-4.5 w-4.5 flex-shrink-0" />
                {item.name}
              </a>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <Button
            variant="outline"
            className="w-full border-white/10 text-gray-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 rounded-xl"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </motion.aside>

      {/* Main Content - REMOVED LEFT PADDING */}
      <div className="lg:pl-0">
        {/* Header */}
        <header className="fixed right-0 left-0 top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200/80">
          <div className="flex h-16 items-center justify-between px-6">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600 hover:text-[#E9521C]">
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex-1" />

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-600 border border-green-500/30">
                  👤 Client
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
                        {getInitials(clientName || "Client")}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-xl border-gray-100 p-1">
                  <div className="px-3 py-2.5 border-b border-gray-100">
                    <p className="font-semibold text-gray-900 text-sm truncate">{clientName || "Client"}</p>
                    <p className="text-gray-400 text-xs truncate">{clientEmail || ""}</p>
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
          <div className="p-6 max-w-7xl mx-auto">
            {children}
            
            <footer className="mt-8 pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
              <span className="font-medium">© 2026 Nthoppa Financial. All rights reserved.</span>
              <div className="flex items-center gap-4 flex-wrap justify-center">
                <span className="flex items-center gap-1"><Shield className="h-3 w-3 text-green-500" /> AES-256 Encrypted</span>
                <span className="flex items-center gap-1"><Lock className="h-3 w-3 text-blue-500" /> OAuth 2.0</span>
                <span className="flex items-center gap-1"><Activity className="h-3 w-3 text-[#E9521C]" /> Real-time Monitoring</span>
                <button className="text-[#E9521C] hover:underline">Support</button>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}