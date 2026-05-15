"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, LayoutDashboard, UserPlus, Users, BarChart3,
  FileText, LogOut, Bell, ChevronDown,
  Shield, TrendingUp, Activity, ChevronRight, Sparkles, Lock,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const adminNavItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Register Agent", href: "/admin/register-agent", icon: UserPlus },
  { name: "Manage Agents", href: "/admin/agents", icon: Users },
  { name: "NthoppaSure", href: "/admin/nthoppa-sure", icon: Shield },
  { name: "SME Pipeline", href: "/admin/sme-pipeline", icon: Building2 },
  { name: "Investor View", href: "/admin/investor", icon: TrendingUp },
  { name: "Reports", href: "/admin/reports", icon: FileText },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [lastLoginDate, setLastLoginDate] = useState<string>("");
  const [collapsed, setCollapsed] = useState(false);
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
          setAdminName(data.name || "Administrator");
          setAdminEmail(data.email || "");
        } else {
          router.push('/login');
        }
      } catch {
        setAdminName("Administrator");
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (e) {}
    localStorage.removeItem("nthoppa_role");
    localStorage.removeItem("nthoppa_token");
    toast({ title: "Logged out", description: "You have been successfully logged out." });
    router.push('/login');
  };

  const getInitials = (name: string) =>
    name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const sidebarWidth = collapsed ? "w-16" : "w-64";

  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: -256 }}
        animate={{ x: sidebarOpen ? 0 : -256 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed left-0 top-0 z-50 h-full ${sidebarWidth} bg-[#0a0a0a] text-white lg:translate-x-0 transition-all duration-300 flex flex-col border-r border-[#E9521C]/20`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-black flex-shrink-0 border border-[#E9521C]/20">
              <img src="/nthoppa-logo.png" alt="Nthoppa" className="w-full h-full object-cover" />
            </div>
            {!collapsed && (
              <div>
                <span className="text-lg font-black text-white tracking-tight">Nthoppa</span>
                <div className="text-[10px] text-[#E9521C] font-semibold uppercase tracking-wider">Admin Portal</div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ChevronRight className={`h-4 w-4 transition-transform ${collapsed ? '' : 'rotate-180'}`} />
            </button>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 text-gray-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {!collapsed && (
          <div className="mx-3 mt-4 p-3 rounded-xl border border-[#E9521C]/20 bg-white/5">
            <p className="text-xs text-gray-400 mb-0.5">Logged in as</p>
            <p className="font-bold text-white">{adminName || "Administrator"}</p>
            <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-[#E9521C]/20 text-[#E9521C] text-xs rounded-full">
              <span className="w-1.5 h-1.5 bg-[#E9521C] rounded-full"></span> Super Admin
            </div>
          </div>
        )}

        <nav className="flex-1 mt-4 px-2 space-y-0.5 overflow-y-auto scrollbar-hide">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative",
                  isActive
                    ? "bg-[#E9521C] text-white shadow-[0_0_12px_rgba(233,82,28,0.3)]"
                    : "text-gray-400 hover:bg-white/8 hover:text-white"
                )}
              >
                {!isActive && (
                  <span className="absolute left-0 w-0 h-5 bg-[#E9521C] rounded-r transition-all group-hover:w-1" />
                )}
                <item.icon className={`h-4.5 w-4.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'} relative z-10`} />
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate relative z-10">{item.name}</span>
                    {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-60 relative z-10" />}
                  </>
                )}
              </a>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all ${collapsed ? 'justify-center' : ''}`}
          >
            <LogOut className="h-4.5 w-4.5 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${collapsed ? "lg:pl-16" : "lg:pl-64"}`}>
        <header className={`fixed right-0 top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300 ${collapsed ? "left-16" : "left-0 lg:left-64"}`}>
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600 hover:text-[#E9521C]">
                <Menu className="h-6 w-6" />
              </button>
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md overflow-hidden bg-black flex-shrink-0">
                    <img src="/nthoppa-logo.png" alt="Nthoppa" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[#E9521C] font-semibold">Nthoppa</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="font-medium text-gray-800 capitalize">
                  {pathname.split('/').filter(Boolean).pop()?.replace(/-/g, ' ') || 'Dashboard'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700 border border-yellow-200">
                <Sparkles className="h-3 w-3" />
                Admin
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors">
                    <Avatar className="h-8 w-8 ring-2 ring-[#E9521C]/30 ring-offset-2">
                      <AvatarFallback className="bg-gradient-to-br from-[#E9521C] to-[#c44216] text-white text-xs font-bold">
                        {getInitials(adminName || "Admin")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-xs font-semibold text-gray-800 leading-none">{adminName || "Administrator"}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{lastLoginDate}</p>
                    </div>
                    <ChevronDown className="h-3.5 w-3.5 text-gray-400 hidden md:block" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-xl border-gray-100 p-1">
                  <div className="px-3 py-2.5 border-b border-gray-100">
                    <p className="font-semibold text-gray-900 text-sm truncate">{adminName || "Administrator"}</p>
                    <p className="text-gray-400 text-xs truncate">{adminEmail || ""}</p>
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

        <main className="pt-16 min-h-screen">
          <div className="p-6 max-w-7xl mx-auto">
            {children}
            <footer className="mt-12 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
              <span className="font-medium">© 2026 Nthoppa Financial Technologies. All rights reserved.</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5"><Shield className="h-3 w-3 text-green-500" />AES-256 Encrypted</span>
                <span className="flex items-center gap-1.5"><Lock className="h-3 w-3 text-blue-500" />OAuth 2.0</span>
                <span className="flex items-center gap-1.5"><Activity className="h-3 w-3 text-[#E9521C]" />Live Monitoring</span>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}