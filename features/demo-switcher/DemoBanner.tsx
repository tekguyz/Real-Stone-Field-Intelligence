'use client';

import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useUserStore, Role, Language } from '../../entities/user/store';
import { dict } from '../../entities/i18n/dict';
import { useEffect, useState } from 'react';
import { Sun, Moon, Languages, UserCircle } from 'lucide-react';

export function DemoBanner() {
  const { 
    activeRole, 
    language, 
    isDevMode, 
    setRole, 
    setLanguage, 
    setManualThemeOverride 
  } = useUserStore();
  
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!isDevMode || !mounted) return null;

  const t = dict[language].demo;

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as Role;
    setRole(newRole);
    if (newRole === 'admin') {
      router.push('/command-center');
    } else {
      router.push('/field');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    setManualThemeOverride(true);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-10 bg-primary text-primary-foreground flex items-center justify-between px-6 z-[100] text-xs uppercase font-black font-mono shrink-0 rounded-none">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <UserCircle className="w-4 h-4 opacity-70" />
          <select 
            value={activeRole} 
            onChange={handleRoleChange}
            className="bg-transparent border-none focus:outline-none cursor-pointer font-bold appearance-none hover:opacity-80 transition-opacity"
          >
            <option value="admin" className="text-black">{t.admin}</option>
            <option value="installer_juan" className="text-black">{t.installer_juan}</option>
            <option value="installer_carlos" className="text-black">{t.installer_carlos}</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={toggleLanguage}
          className="flex items-center gap-2 hover:bg-primary-foreground/10 px-2 py-1 transition-colors"
          title={t.language}
        >
          <Languages className="w-4 h-4" />
          <span className="uppercase">{language}</span>
        </button>

        <div className="w-px h-4 bg-primary-foreground/20" />

        <button 
          onClick={toggleTheme}
          className="flex items-center gap-2 hover:bg-primary-foreground/10 px-2 py-1 transition-colors"
          title={t.theme}
        >
          {theme === 'dark' ? (
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
