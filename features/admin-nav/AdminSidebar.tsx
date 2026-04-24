'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Package, 
  Settings, 
  Mountain,
  ChevronLeft,
  ChevronRight 
} from 'lucide-react';
import { useUserStore } from '../../entities/user/store';
import { dict } from '../../entities/i18n/dict';
import { motion, AnimatePresence } from 'motion/react';

export function AdminSidebar() {
  const pathname = usePathname();
  const { language, isSidebarOpen, toggleSidebar } = useUserStore();
  const t = dict[language].admin;

  const navItems = [
    { name: t.commandCenter, href: '/command-center', icon: LayoutDashboard },
    { name: t.jobs, href: '/jobs', icon: Briefcase },
    { name: t.team, href: '/team', icon: Users },
    { name: t.inventory, href: '/inventory', icon: Package }
  ];

  return (
    <motion.div 
      initial={false}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="border-r border-border bg-card flex flex-col hidden md:flex shrink-0 h-full relative"
    >
      <div className="h-16 flex items-center px-6 border-b border-border overflow-hidden whitespace-nowrap">
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

      <nav className="flex-1 p-4 flex flex-col gap-1 overflow-hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={!isSidebarOpen ? item.name : undefined}
              className={`flex items-center gap-3 px-3 py-3 transition-colors text-xs font-black tracking-widest uppercase whitespace-nowrap relative group border-l-4 ${
                isActive 
                  ? 'bg-primary/10 border-primary text-primary' 
                  : 'border-transparent text-foreground/70 hover:bg-surface hover:text-foreground'
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
        className="absolute -right-3 top-20 w-6 h-6 bg-card border border-border flex items-center justify-center text-foreground/50 hover:text-primary transition-colors z-[60]"
      >
        {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      <div className="p-4 border-t border-border overflow-visible whitespace-nowrap relative group">
        <div className="absolute bottom-full left-0 w-full p-2 translate-y-2 opacity-0 invisible group-hover:visible group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all z-50">
          <div className="bg-card border border-border shadow-lg p-1 flex flex-col gap-1">
            <Link href="/settings" className="flex items-center gap-2 px-3 py-2 text-xs font-black tracking-widest uppercase text-foreground/70 hover:text-foreground hover:bg-surface transition-colors">
              <Settings className="w-4 h-4" />
              {isSidebarOpen && <span>{t.settings}</span>}
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3 cursor-pointer p-2 -m-2 hover:bg-surface transition-colors">
          <div className="w-8 h-8 border border-primary/20 bg-primary/10 flex items-center justify-center text-primary font-black text-xs uppercase shrink-0">
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
                <span className="text-sm font-medium leading-none truncate">Admin</span>
                <span className="text-[10px] text-foreground/60 mt-1 font-mono truncate">RSG-OS</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
