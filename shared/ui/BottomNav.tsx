'use client';

import { HardHat, User, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserStore } from '../../entities/user/store';
import { dict } from '../../entities/i18n/dict';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

/**
 * Industrial high-touch navigation for field users.
 * Sits at the bottom and detects keyboard activity to hide/show.
 */
export function BottomNav() {
  const pathname = usePathname();
  const { language } = useUserStore();
  const t = dict[language].field;
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // Keyboard awareness to prevent nav from floating over inputs
  useEffect(() => {
    const handleResize = () => {
      // If window height decreases significantly, assume keyboard is open
      const isVisible = window.innerHeight < 500;
      setIsKeyboardVisible(isVisible);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { 
      label: t.jobs, 
      href: '/field', 
      icon: ClipboardList,
      isActive: pathname === '/field' || pathname.startsWith('/field/') && pathname !== '/field/profile' // Heuristic for job depth
    },
    { 
      label: t.profile, 
      href: '/field/profile', 
      icon: User,
      isActive: pathname === '/field/profile'
    }
  ];

  if (isKeyboardVisible) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t-2 border-border px-6 pb-safe pt-2 z-50">
      <div className="max-w-md mx-auto flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href}
            className={`relative flex flex-col items-center justify-center gap-1 w-20 h-full transition-all active:scale-90 ${
              item.isActive ? 'text-primary' : 'text-foreground/40 hover:text-foreground/60'
            }`}
          >
            <item.icon className="w-6 h-6" strokeWidth={item.isActive ? 2.5 : 2} />
            <span className={`text-[10px] font-mono uppercase tracking-widest ${item.isActive ? 'font-bold' : 'font-medium'}`}>
              {item.label}
            </span>
            {item.isActive && (
              <motion.div 
                layoutId="nav-glow"
                className="absolute -top-[8px] w-full h-[4px] bg-primary"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
              />
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
