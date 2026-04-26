"use client";

import { useRouter } from "next/navigation";
import { useUserStore, Role } from "../../entities/user/store";
import { dict } from "../../entities/i18n/dict";
import { useEffect, useState, useRef } from "react";
import { Languages, UserCircle, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

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
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!isDevMode || !mounted) return null;

  const t = dict[language].demo;

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as Role;
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
    <div className="fixed top-0 left-0 right-0 h-10 bg-rsg-gold text-black flex items-center justify-between px-6 z-[100] text-xs uppercase font-black font-mono shrink-0 rounded-none shadow-md">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 group">
          <button
            onClick={handleAvatarClick}
            className="flex items-center gap-2 hover:opacity-70 transition-opacity"
            aria-label="Toggle Role"
          >
            <UserCircle className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" />
          </button>
          <select
            ref={selectRef}
            id="role-switcher"
            value={activeRole}
            onChange={handleRoleChange}
            className="bg-transparent border-none focus:outline-none cursor-pointer font-bold appearance-none hover:opacity-80 transition-opacity text-black h-8"
          >
            <option value="admin" className="text-black bg-white">
              {t.admin}
            </option>
            <option value="installer_juan" className="text-black bg-white">
              {t.installer_juan}
            </option>
            <option value="installer_carlos" className="text-black bg-white">
              {t.installer_carlos}
            </option>
          </select>
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
