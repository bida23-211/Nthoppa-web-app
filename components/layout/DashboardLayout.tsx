"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, LayoutDashboard, UserPlus, Users, BarChart3, MapPin,
  MessageSquare, FileText, LogOut, Bell, ChevronDown,
  User, Trophy, Brain, Users2, BookOpen, TrendingUp, CreditCard,
  ShoppingBag, Store, Shield, Lock, Activity, ChevronRight, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { getAgentSession, clearAgentSession, getAdminSession, clearAdminSession } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

interface NavItem { name: string; href: string; icon: any; badge?: string; }
interface Notification { id: string; message: string; type: string; read: boolean; createdAt: string; }

const agentNavItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard/main", icon: LayoutDashboard },
  { name: "Register User", href: "/dashboard/register", icon: UserPlus },
  { name: "Users", href: "/dashboard/users", icon: Users },
  { name: "Motshelo", href: "/dashboard/motshelo", icon: Users2 },
  { name: "Education", href: "/dashboard/education", icon: BookOpen },
  { name: "AI Advisor", href: "/dashboard/ai-advisor", icon: Brain, badge: "AI" },
  { name: "Rewards", href: "/dashboard/gamification", icon: Trophy },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Credit Scoring", href: "/dashboard/credit-scoring", icon: CreditCard },
  { name: "SMME Pipeline", href: "/dashboard/smme-pipeline", icon: ShoppingBag },
  { name: "Merchant", href: "/dashboard/merchant", icon: Store },
  { name: "NthoppaSure", href: "/dashboard/nthoppa-sure", icon: Shield },
  { name: "Territory", href: "/dashboard/territory", icon: MapPin },
  { name: "Communications", href: "/dashboard/communications", icon: MessageSquare },
  { name: "Reports", href: "/dashboard/reports", icon: FileText },
];

const adminNavItems: NavItem[] = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Register Agent", href: "/admin/register-agent", icon: UserPlus },
  { name: "Manage Agents", href: "/admin/agents", icon: Users },
  { name: "Investor View", href: "/admin/investor", icon: TrendingUp },
  { name: "Reports", href: "/admin/reports", icon: FileText },
];

interface DashboardLayoutProps { children: React.ReactNode; type: "agent" | "admin"; }

export function DashboardLayout({ children, type }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [agentName, setAgentName] = useState("");
  const [agentEmail, setAgentEmail] = useState("");
  const [agentTerritory, setAgentTerritory] = useState("");
  const [agentId, setAgentId] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [lastLoginDate, setLastLoginDate] = useState<string>("");
  const [collapsed, setCollapsed] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const navItems = type === "agent" ? agentNavItems : adminNavItems;

  useEffect(() => {
    setLastLoginDate(new Date().toLocaleDateString());
    const loadUserData = async () => {
      try {
        const response = await fetch('/api/auth/check', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setAgentName(data.name || (type === "agent" ? "Agent" : "Admin"));
          setAgentEmail(data.email || "");
          setAgentTerritory(data.territory || (type === "agent" ? "Gaborone" : "Admin Portal"));
          setAgentId(data.id || "");
          
          if (type === "agent" && data.id) {
            loadNotifications();
          }
        } else {
          if (type === "agent") {
            const session = getAgentSession();
            if (session) {
              setAgentName(session.name);
              setAgentTerritory(session.territory);
              setAgentId(session.agentId);
              loadNotifications();
            } else {
              router.push('/login');
            }
          } else {
            router.push('/login');
          }
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
        setAgentName(type === "agent" ? "Agent" : "Admin");
        if (type === "agent") {
          setAgentTerritory("Gaborone");
        }
      }
    };
    loadUserData();
  }, [type, router]);

  const loadNotifications = async () => {
    try {
      const response = await fetch('/api/notifications', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        const unread = Array.isArray(data) ? data.filter((n: Notification) => !n.read) : [];
        setNotifications(unread);
        setNotificationCount(unread.length);
      }
    } catch {}
  };

  const markAllAsRead = async () => {
    try {
      const ids = notifications.map(n => n.id);
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
        credentials: 'include',
      });
      setNotifications([]);
      setNotificationCount(0);
    } catch {}
  };

  const handleLogout = async () => {
    try { await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }); } catch {}
    if (type === "agent") clearAgentSession(); else clearAdminSession();
    localStorage.removeItem("nthoppa_role");
    localStorage.removeItem("nthoppa_token");
    toast({ title: "Logged out", description: "You have been successfully logged out." });
    router.push(type === "agent" ? "/login" : "/admin");
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
        className={`fixed left-0 top-0 z-50 h-full ${sidebarWidth} bg-[#0a0a0a] text-white lg:translate-x-0 transition-all duration-300 flex flex-col`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-black flex-shrink-0 border border-[#E9521C]/20">
              <img src="/nthoppa-logo.png" alt="Nthoppa" className="w-full h-full object-cover" />
            </div>
            {!collapsed && (
              <div>
                <span className="text-lg font-black text-white tracking-tight">Nthoppa</span>
                <div className="text-[10px] text-[#E9521C] font-semibold uppercase tracking-wider">
                  {type === "agent" ? "Agent Portal" : "Admin Portal"}
                </div>
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
          <div className="mx-3 mt-4 p-3 rounded-xl bg-gradient-to-br from-[#E9521C]/20 to-[#E9521C]/5 border border-[#E9521C]/20">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-[#E9521C] to-[#c44216] text-white text-xs font-bold">
                  {getInitials(agentName || "User")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{agentName || "User"}</p>
                <p className="text-xs text-gray-400 truncate">{agentTerritory || "Field Agent"}</p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 mt-4 px-2 space-y-0.5 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative",
                  isActive
                    ? "bg-[#E9521C] text-white shadow-lg shadow-[#E9521C]/20"
                    : "text-gray-400 hover:bg-white/8 hover:text-white"
                )}
              >
                <item.icon className={`h-4.5 w-4.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} />
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{item.name}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#E9521C] text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
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

      <div className={`${collapsed ? 'lg:pl-16' : 'lg:pl-64'} transition-all duration-300`}>
        <header className={`fixed right-0 ${collapsed ? 'lg:left-16' : 'lg:left-64'} left-0 top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200/80 transition-all duration-300`}>
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
              <div className={cn(
                "hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border",
                type === "agent"
                  ? "bg-orange-50 text-[#E9521C] border-orange-200"
                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
              )}>
                <Sparkles className="h-3 w-3" />
                {type === "agent" ? "Agent" : "Admin"}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
                    <Bell className="h-5 w-5 text-gray-600" />
                    {notificationCount > 0 && (
                      <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-[#E9521C] text-white text-[10px] font-bold flex items-center justify-center">
                        {notificationCount}
                      </span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 p-0 rounded-2xl shadow-xl border-gray-100">
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <h4 className="font-bold text-black">Notifications</h4>
                    {notificationCount > 0 && (
                      <button onClick={markAllAsRead} className="text-xs text-[#E9521C] hover:underline font-medium">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-400">
                        <Bell className="h-10 w-10 mx-auto mb-3 opacity-20" />
                        <p className="text-sm font-medium">All caught up!</p>
                        <p className="text-xs mt-1">No new notifications</p>
                      </div>
                    ) : notifications.map(n => (
                      <DropdownMenuItem key={n.id} className="p-4 cursor-pointer">
                        <div>
                          <p className="text-sm text-gray-700">{n.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-[#E9521C] to-[#c44216] text-white text-xs font-bold">
                        {getInitials(agentName || "User")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-xs font-semibold text-gray-800 leading-none">{agentName || "User"}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{lastLoginDate}</p>
                    </div>
                    <ChevronDown className="h-3.5 w-3.5 text-gray-400 hidden md:block" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-xl border-gray-100 p-1">
                  <div className="px-3 py-2.5 border-b border-gray-100">
                    <p className="font-semibold text-gray-900 text-sm truncate">{agentName || "User"}</p>
                    <p className="text-gray-400 text-xs truncate">{agentEmail || ""}</p>
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