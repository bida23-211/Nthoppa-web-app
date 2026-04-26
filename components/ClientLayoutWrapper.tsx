"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { X, ChevronRight } from "lucide-react";

const roles = [
  { value: "agent", label: "Agent", redirect: "/dashboard/main", badge: "🏃", color: "orange" },
  { value: "client", label: "Client", redirect: "/client/dashboard", badge: "👤", color: "green" },
  { value: "hr", label: "HR Manager", redirect: "/hr/dashboard", badge: "🏢", color: "blue" },
  { value: "merchant", label: "Merchant", redirect: "/merchant/dashboard", badge: "🏪", color: "purple" },
  { value: "admin", label: "Admin", redirect: "/admin/dashboard", badge: "👑", color: "gold" },
];

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleRoleSwitch = (roleValue: string) => {
    const role = roles.find(r => r.value === roleValue);
    if (role) {
      localStorage.setItem("nthoppa_role", roleValue);
      router.push(role.redirect);
    }
    setIsExpanded(false);
  };

  // Don't show role switcher on login page
  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      
      {/* Floating Role Switcher */}
      {isClient && pathname !== "/login" && (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className={`
              bg-[#1A1A1A] border border-gray-700 rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden
              ${isExpanded ? "w-64" : "w-auto"}
            `}
          >
            {!isExpanded ? (
              <button
                onClick={() => setIsExpanded(true)}
                className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:text-[#E9521C] transition-colors"
              >
                <span>🔀</span>
                <span>Switch Role</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            ) : (
              <div>
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
                  <span className="text-xs font-semibold text-gray-400">DEMO MODE</span>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
                <div className="p-2">
                  {roles.map((role) => (
                    <button
                      key={role.value}
                      onClick={() => handleRoleSwitch(role.value)}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-left hover:bg-gray-800 transition-colors group"
                    >
                      <span className="text-lg">{role.badge}</span>
                      <span className="flex-1 text-gray-300 group-hover:text-white">{role.label}</span>
                      <ChevronRight className="h-3 w-3 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}