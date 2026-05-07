"use client";

import { HardHat, User, ClipboardList } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/entities/user/store";
import { dict } from "@/entities/i18n/dict";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

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

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    {
      label: t.jobs,
      href: "/field",
      icon: ClipboardList,
      isActive:
        pathname === "/field" ||
        (pathname.startsWith("/field/") && pathname !== "/field/profile"), // Heuristic for job depth
    },
    {
      label: t.profile,
      href: "/field/profile",
      icon: User,
      isActive: pathname === "/field/profile",
    },
  ];

  if (isKeyboardVisible) return null;

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-background px-4 pb-safe z-50 print:hidden pointer-events-auto border-t border-border">
      <div className="flex justify-around items-center h-14">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`relative flex flex-col items-center justify-center gap-0.5 w-full h-full transition-all active:translate-y-[1px] rounded-none ${
              item.isActive
                ? "bg-foreground/10 text-foreground"
                : "text-foreground/40 hover:text-foreground/60"
            }`}
          >
            {item.isActive && (
              <motion.div
                layoutId="field-active-indicator"
                className="absolute top-0 left-0 right-0 h-1 bg-rsg-gold z-10 shadow-[0_2px_4px_rgba(255,215,0,0.3)]"
              />
            )}
            <item.icon
              className="w-5 h-5"
              strokeWidth={item.isActive ? 3 : 2}
            />
            <span className={`text-[8px] font-black uppercase tracking-[0.3em] ${item.isActive ? 'text-foreground' : 'text-inherit opacity-60'}`}>
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
