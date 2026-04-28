"use client";

import { useRouter } from "next/navigation";
import { useUserStore, Role } from "../../entities/user/store";
import { dict } from "../../entities/i18n/dict";
import { useEffect, useState, useRef } from "react";
import { Languages, UserCircle, Sun, Moon, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

export function DemoBanner() {
  const {
    activeRole,
    language,
    isDevMode,
    setRole,
    setLanguage,
    setManualThemeOverride,
  } = useUserStore();

  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
      const demoMode = localStorage.getItem("demo_mode");
      if (demoMode !== null) {
        setShowBanner(demoMode === "true");
      }
    });

    // Listen for storage changes in other tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "demo_mode") {
        setShowBanner(e.newValue === "true");
      }
    };
    window.addEventListener("storage", handleStorage);

    // Custom event for same-tab updates
    const handleDemoToggle = () => {
      const demoMode = localStorage.getItem("demo_mode");
      setShowBanner(demoMode === "true");
    };
    window.addEventListener("demo_mode_changed", handleDemoToggle);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("demo_mode_changed", handleDemoToggle);
    };
  }, []);

  if (!isDevMode || !mounted || !showBanner) return null;

  const t = dict[language].demo;

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    if (newRole === "admin") {
      router.push("/command-center");
    } else {
      router.push("/field");
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "es" : "en");
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    setManualThemeOverride(true);
  };

  const handleAvatarClick = () => {
    if (selectRef.current) {
      // Use showPicker if available (modern browsers)
      if ("showPicker" in HTMLSelectElement.prototype) {
        try {
          (selectRef.current as any).showPicker();
        } catch (e) {
          selectRef.current.focus();
        }
      } else {
        selectRef.current.focus();
      }
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-10 bg-rsg-gold text-black flex items-center justify-between px-6 z-[100] text-xs uppercase font-black font-mono shrink-0 rounded-none shadow-md print:hidden">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 group">
          <UserCircle className="w-5 h-5 opacity-80" />
          <Select value={activeRole} onValueChange={(val) => handleRoleChange(val as Role)}>
            <SelectTrigger className="bg-transparent border-none h-8 text-black font-bold uppercase p-0 focus:ring-0 focus:ring-offset-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin" className="text-xs font-bold uppercase">{t.admin}</SelectItem>
              <SelectItem value="installer_juan" className="text-xs font-bold uppercase">{t.installer_juan}</SelectItem>
              <SelectItem value="installer_carlos" className="text-xs font-bold uppercase">{t.installer_carlos}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 hover:bg-black/10 px-2 py-1 transition-colors text-black"
          title={t.language}
        >
          <Languages className="w-4 h-4" />
          <span className="uppercase">{language}</span>
        </button>

        <div className="w-px h-4 bg-black/20" />

        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 hover:bg-black/10 px-2 py-1 transition-colors text-black"
          title={t.theme}
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
          <span className="hidden sm:inline uppercase">{theme}</span>
        </button>
      </div>
    </div>
  );
}