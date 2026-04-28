"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Package,
  Settings,
  Mountain,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useUserStore } from "../../entities/user/store";
import { dict } from "../../entities/i18n/dict";
import { motion, AnimatePresence } from "motion/react";

export function AdminSidebar() {
  const pathname = usePathname();
  const { language, isSidebarOpen, toggleSidebar } = useUserStore();
  const t = dict[language].admin;

  const navItems = [
    { name: t.commandCenter, href: "/command-center", icon: LayoutDashboard },
    { name: t.jobs, href: "/jobs", icon: Briefcase },
    { name: t.team, href: "/team", icon: Users },
    { name: t.inventory, href: "/inventory", icon: Package },
  ];

  return (
    <motion.div
      initial={false}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
      transition={{ type: "spring", damping: 30, stiffness: 400, mass: 1.5 }}
      className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground flex flex-col hidden md:flex shrink-0 h-[100dvh] sticky top-0 overflow-y-auto overflow-x-hidden relative print:hidden"
    >
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border overflow-hidden whitespace-nowrap shrink-0">
        <Mountain className="w-6 h-6 mr-3 text-primary shrink-0" />
        <AnimatePresence mode="wait">
          {isSidebarOpen && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="font-bold text-lg tracking-tight"
            >
              Real Stone
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={!isSidebarOpen ? item.name : undefined}
              className={`flex items-center gap-3 px-3 py-3 transition-colors text-xs font-black tracking-widest uppercase whitespace-nowrap relative group border-l-4 rounded-none ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-primary"
                  : "border-transparent text-sidebar-foreground/50 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
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
                <div className="absolute left-full ml-2 px-2 py-1 bg-foreground text-background text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 bg-sidebar border border-sidebar-border flex items-center justify-center text-sidebar-foreground/50 hover:text-sidebar-primary transition-colors z-[60]"
      >
        {isSidebarOpen ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>

      <Link
        href="/settings"
        className="p-4 border-t border-sidebar-border overflow-visible whitespace-nowrap relative flex items-center gap-3 cursor-pointer hover:bg-sidebar-accent transition-colors shrink-0"
      >
        <div className="w-8 h-8 border border-sidebar-primary/20 bg-sidebar-primary/10 flex items-center justify-center text-sidebar-primary font-black text-xs uppercase shrink-0">
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
              <span className="text-sm font-medium leading-none truncate">
                {dict[language].demo.admin}
              </span>
              <span className="text-[10px] text-foreground/60 mt-1 font-mono truncate">
                RSG-OS
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </Link>
    </motion.div>
  );
}
