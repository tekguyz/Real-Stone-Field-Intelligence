"use client";

import { useUserStore } from "../../entities/user/store";
import { dict } from "../../entities/i18n/dict";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, 
  X, 
  Mountain, 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Package, 
  HardHat,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AdminSidebar } from "../../features/admin-nav/AdminSidebar";
import { useJobs } from "../../entities/job/api";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language } = useUserStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const t = dict[language].admin;

  const { data: jobs } = useJobs();
  const activeReports = jobs?.filter(job => job.status === "submitted_for_review" || job.status === "verified" || job.status === "in_progress").slice(0, 3) || [];

  const navItems = [
    { name: t.dashboard, href: "/dashboard", icon: LayoutDashboard },
    { name: t.commandCenter, href: "/command-center", icon: Mountain },
    { name: t.jobs, href: "/jobs", icon: Briefcase },
    { name: t.team, href: "/team", icon: Users },
    { name: t.inventory, href: "/inventory", icon: Package },
  ];

  return (
    <div className="flex flex-col md:flex-row w-full h-full overflow-hidden bg-background print:bg-white relative">
      {/* Mobile Top Navbar with Industrial Theme and Sticky position */}
      <header className="sticky top-0 flex md:hidden items-center justify-between h-14 px-4 bg-sidebar border-b border-sidebar-border text-sidebar-foreground z-40 shrink-0 select-none">
        <Link href="/command-center" className="flex items-center gap-2">
          <Mountain className="w-5 h-5 text-primary" />
          <span className="font-mono font-black text-sm tracking-tight uppercase text-foreground">Real Stone</span>
          <span className="text-[8px] font-mono font-black tracking-widest bg-rsg-gold/15 text-rsg-gold border border-rsg-gold/20 px-1.5 py-0.5 rounded ml-1">ADMIN</span>
          <span className="text-[8px] font-mono font-black tracking-widest bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded ml-1">#ADM-01</span>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 -mr-2 bg-transparent hover:bg-sidebar-accent border-0 rounded-md transition-colors text-foreground focus:outline-none focus:ring-1 focus:ring-rsg-gold"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Menu Backdrop/Sidebar Drawer wrapper */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-30 md:hidden"
            />
            {/* Nav Menu Content */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-14 bottom-0 left-0 w-64 bg-sidebar border-r border-sidebar-border z-30 flex flex-col md:hidden pt-4 pb-6 overflow-y-auto"
            >
              <div className="flex-1 flex flex-col min-h-0">
                <nav className="px-3 flex flex-col gap-1.5">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 transition-colors text-xs font-black uppercase tracking-widest rounded-md ${
                          isActive
                            ? "bg-rsg-gold text-black font-black shadow-sm"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>

                {/* Instant Reports Navigation Section */}
                <div className="px-3 py-2 mt-4 select-none border-t border-sidebar-border/50">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-4">REPORTS</span>
                  <div className="flex flex-col gap-1 mt-1.5">
                    {activeReports.map((job) => (
                      <Link
                        key={job.id}
                        href={`/admin/reports/${job.id}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 transition-all hover:bg-accent hover:text-foreground text-xs font-semibold uppercase text-muted-foreground rounded-md truncate"
                      >
                        <FileText className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="truncate">{job.legacy_id} / {job.client_name}</span>
                      </Link>
                    ))}
                    {activeReports.length === 0 && (
                      <span className="text-[9px] text-muted-foreground italic px-4 uppercase">No active reports found</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Footer */}
              <div className="px-4 pt-4 border-t border-sidebar-border mt-auto flex items-center gap-3 cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="w-8 h-8 rounded border-2 border-primary bg-primary/10 flex items-center justify-center text-foreground font-mono font-black text-xs uppercase shadow-sm">
                  AD
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold leading-none text-foreground uppercase">
                    {dict[language].demo.admin}
                  </span>
                  <span className="text-[9px] text-primary font-black uppercase tracking-widest mt-1">
                    Administrator
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-10 print:p-0 print:overflow-visible h-full">
        {children}
      </main>
    </div>
  );
}
