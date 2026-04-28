"use client";

import { useRouter } from "next/navigation";
import { useUserStore, Role } from "../../entities/user/store";
import { dict } from "../../entities/i18n/dict";
import { useEffect, useState } from "react";
import { Languages, UserCircle, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { formatInstallerName } from "../../shared/lib/utils";
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

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
      const demoMode = localStorage.getItem("demo_mode");
      if (demoMode !== null) {
        setShowBanner(demoMode === "true");
      }
    });

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "demo_mode") {
        setShowBanner(e.newValue === "true");
      }
    };
    window.addEventListener("storage", handleStorage);

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

  return (
    <div className="w-full h-10 bg-rsg-gold text-black flex items-center justify-between px-6 z-[100] text-xs uppercase font-black font-mono shrink-0 rounded-none shadow-md print:hidden">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 group">
          <UserCircle className="w-5 h-5 opacity-80" />
          <Select value={activeRole} onValueChange={(val) => handleRoleChange(val as Role)}>
            {/* FIX: Absolute background transparency in all states to kill the faint rectangle.
                Removed chevron and all shadows/rings. Added text black, font-black, industrial tracking.
            */}
            <SelectTrigger className="bg-transparent! border-none h-8 text-black font-black uppercase p-0 shadow-none! outline-none! ring-0! focus:ring-0! hover:bg-transparent! data-[state=open]:bg-transparent! [&>svg]:hidden focus-visible:ring-0! tracking-widest appearance-none">
              <SelectValue>
                {formatInstallerName(activeRole)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin" className="text-xs font-bold uppercase">ADMIN</SelectItem>
              <SelectItem value="installer_juan" className="text-xs font-bold uppercase">JUAN</SelectItem>
              <SelectItem value="installer_carlos" className="text-xs font-bold uppercase">CARLOS</SelectItem>
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