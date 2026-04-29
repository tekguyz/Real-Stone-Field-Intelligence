"use client";

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
  BookOpen,
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

  const bottomNavItems = [
    { name: "Knowledge Base", href: "/knowledge-base", icon: BookOpen },
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

      {/* Nav Section - Overflow handled here to protect toggle button visibility */}
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
              className={`flex items-center gap-3 px-3 py-3 transition-colors text-xs font-black tracking-widest uppercase whitespace-nowrap relative group border-l-4 rounded-none ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-primary"
                  : "border-transparent text-sidebar-foreground/50 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="admin-active-indicator"
                  className="absolute left-[-4px] top-0 bottom-0 w-1 bg-primary z-10"
                />
              )}
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

              {/* Tooltip for collapsed state */}
              {!isSidebarOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-foreground text-background text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap border border-foreground">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Nav */}
      <div className="px-4 py-2 flex flex-col gap-1 border-t border-sidebar-border/50">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
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
              {isSidebarOpen && <span>{item.name}</span>}
              {!isSidebarOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-foreground text-background text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap border border-foreground">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Industrial Square Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 bg-sidebar border border-sidebar-border flex items-center justify-center text-sidebar-foreground/50 hover:text-sidebar-primary hover:border-sidebar-primary transition-all z-[70] shadow-[2px_2px_0px_rgba(0,0,0,0.1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
      >
        {isSidebarOpen ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>

      {/* Profile Footer */}
      <Link
        href="/settings"
        className="p-4 border-t border-sidebar-border overflow-visible whitespace-nowrap relative flex items-center gap-3 cursor-pointer hover:bg-sidebar-accent transition-colors shrink-0 mb-4"
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
              <span className="text-[10px] text-foreground/60 mt-1 font-mono truncate uppercase">
                RSG-OS
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </Link>
    </motion.div>
  );
}