"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Package,
  Mountain,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useUserStore } from "../../entities/user/store";
import { dict } from "../../entities/i18n/dict";
import { motion, AnimatePresence } from "motion/react";

export function AdminSidebar() {
  const pathname = usePathname();
  const { language, isSidebarOpen, toggleSidebar, setSidebarOpen } = useUserStore();
  const t = dict[language].admin;

  useEffect(() => {
    // If on tablet screen range (e.g. 768px -> 1150px), collapse sidebar by default.
    const handleViewport = () => {
      if (typeof window !== "undefined" && window.innerWidth >= 768 && window.innerWidth < 1150) {
        setSidebarOpen(false);
      }
    };
    handleViewport();
    window.addEventListener("resize", handleViewport);
    return () => window.removeEventListener("resize", handleViewport);
  }, [setSidebarOpen]);

  const navItems = [
    { name: t.dashboard, href: "/dashboard", icon: LayoutDashboard },
    { name: t.commandCenter, href: "/command-center", icon: Mountain },
    { name: t.jobs, href: "/jobs", icon: Briefcase },
    { name: t.team, href: "/team", icon: Users },
    { name: t.inventory, href: "/inventory", icon: Package },
  ];

  return (
    <motion.div
      initial={false}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
      transition={{ type: "spring", damping: 30, stiffness: 400, mass: 1.5 }}
      className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground flex flex-col hidden md:flex shrink-0 h-full sticky top-0 relative overflow-visible print:hidden"
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border overflow-hidden whitespace-nowrap shrink-0">
        <Mountain className="w-6 h-6 mr-3 text-primary shrink-0" />
        <AnimatePresence mode="wait">
          {isSidebarOpen && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="font-bold text-lg tracking-tight uppercase"
            >
              Real Stone
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Section */}
      <nav className="flex-1 px-4 py-2 flex flex-col gap-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={!isSidebarOpen ? item.name : undefined}
              className={`flex items-center gap-3 px-3 py-2 transition-colors text-sm font-medium whitespace-nowrap relative group rounded-md ${
                isActive
                  ? "bg-rsg-gold text-black font-semibold shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <AnimatePresence mode="wait">
                {isSidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>

              {!isSidebarOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-foreground text-background text-[10px] font-semibold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap rounded-sm shadow-md">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Industrial Sleek Toggle Button */}
      <button
        type="button"
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 bg-sidebar border border-sidebar-border rounded-md flex items-center justify-center text-sidebar-foreground/50 hover:text-sidebar-primary hover:border-sidebar-primary transition-all z-[70] shadow-sm active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
      >
        {isSidebarOpen ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>

      {/* Profile Footer - Industrial ID Badge Refactor */}
      <Link
        href="/settings"
        className="py-3 px-4 border-t border-sidebar-border overflow-visible whitespace-nowrap relative flex items-center gap-3 cursor-pointer hover:bg-sidebar-accent transition-colors shrink-0 mb-4 rounded-md mx-2"
      >
        {/* AVATAR: High-contrast metallic gold badge */}
        <div className="w-9 h-9 rounded-md border-2 border-primary bg-primary/10 flex items-center justify-center text-foreground font-mono font-black text-xs uppercase shrink-0 shadow-sm">
          AD
        </div>

        <AnimatePresence mode="wait">
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex flex-col overflow-hidden"
            >
              <span className="text-sm font-bold leading-none truncate text-foreground">
                {dict[language].demo.admin}
              </span>
              <span className="text-[10px] text-primary mt-1 font-black truncate uppercase tracking-tighter">
                Administrator
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </Link>
    </motion.div>
  );
}