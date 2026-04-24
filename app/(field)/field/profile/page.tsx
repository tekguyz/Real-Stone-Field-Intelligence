'use client';

import { 
  User, 
  Globe, 
  Lock, 
  LogOut, 
  ChevronRight,
  ShieldCheck,
  Languages,
  Eye,
  EyeOff,
  Phone,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'motion/react';
import { useUserStore } from '../../../../entities/user/store';
import { dict } from '../../../../entities/i18n/dict';

export default function FieldProfilePage() {
  const { 
    activeRole, 
    language, 
    setLanguage 
  } = useUserStore();
  const t = dict[language].field;
  const router = useRouter();

  const [showPin, setShowPin] = useState(false);
  const fullName = activeRole.split('_')[1]?.charAt(0).toUpperCase() + activeRole.split('_')[1]?.slice(1) || 'Installer';
  const initials = activeRole.split('_')[1]?.substring(0, 2).toUpperCase() || 'IN';
  
  const handleLanguageToggle = (lang: 'en' | 'es') => {
    if (language !== lang) setLanguage(lang);
  };

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <div className="flex flex-col min-h-full bg-background animate-in slide-in-from-bottom-4 duration-500">
      {/* Neo-Brutalist Strict Header - Exactly h-14 */}
      <div className="h-14 px-4 bg-surface border-b border-border flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-primary">
            {initials}
          </span>
          <span className="text-border">/</span>
          <h1 className="text-sm font-black tracking-widest text-foreground uppercase">{t.profile}</h1>
        </div>
        <span className="px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest border border-primary/20">
          Lead
        </span>
      </div>

      <div className="p-4 flex flex-col gap-6 pt-6">
        {/* Profile Info - Dense Text */}
        <div className="flex flex-col mb-2">
          <h2 className="text-2xl font-black text-foreground tracking-tight uppercase leading-none">{fullName}</h2>
          <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.2em] mt-1">ID: 884-29</span>
        </div>

        {/* Masked PIN - High Security Feel */}
        <section className="bg-surface border border-border p-4 relative group">
          <div className="absolute top-0 left-0 w-1 h-full bg-foreground/30 group-hover:bg-primary transition-colors" />
          <div className="flex justify-between items-center mb-3 pl-3">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-foreground/40" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/60">{t.accessPin}</span>
            </div>
            <button 
              onClick={() => setShowPin(!showPin)}
              className="p-2 text-foreground/40 hover:text-primary transition-colors"
            >
              {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="bg-foreground/[0.02] border border-border p-3 flex items-center justify-center ml-3 group-hover:bg-primary/[0.02] transition-colors">
            <span className={`font-mono text-lg tracking-[0.5em] font-black ${showPin ? 'text-primary' : 'text-foreground/20'}`}>
              {showPin ? '4 4 5 2' : '• • • •'}
            </span>
          </div>
        </section>

        {/* Language Switcher - Brutalist Toggle */}
        <section>
          <h3 className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.2em] mb-2">{t.languageSelection}</h3>
          <div className="bg-surface border border-border flex p-1">
            {(['en', 'es'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageToggle(lang)}
                className={`flex-1 h-12 flex items-center justify-center font-bold text-[10px] uppercase tracking-[0.2em] transition-all relative ${
                  language === lang 
                    ? 'text-primary-foreground z-10' 
                    : 'text-foreground/40 hover:text-foreground/60 hover:bg-foreground/5'
                }`}
              >
                {language === lang && (
                  <motion.div 
                    layoutId="lang-pill-field"
                    className="absolute inset-0 bg-primary -z-10"
                    transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                  />
                )}
                {lang === 'en' ? 'English' : 'Español'}
              </button>
            ))}
          </div>
        </section>

        {/* Support & Reporting - High Density */}
        <section className="flex flex-col gap-2">
          <h3 className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.2em] mb-1">{t.help}</h3>
          
          <a 
            href="tel:5615551234"
            className="w-full h-14 bg-surface border border-border flex items-center justify-between px-4 active:scale-[0.98] transition-all group hover:border-primary/40"
          >
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/80">{t.callOffice}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-foreground/20 group-hover:text-primary transition-colors" />
          </a>

          <button 
            className="w-full h-14 bg-surface border border-border flex items-center justify-between px-4 active:scale-[0.98] transition-all group hover:border-amber-500/40"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/80">{t.reportIssue}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-foreground/20 group-hover:text-amber-500 transition-colors" />
          </button>
        </section>

        {/* System Footer */}
        <div className="mt-8 flex flex-col items-center gap-6 pb-8">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500/60 hover:text-red-500 transition-colors font-bold uppercase text-[10px] tracking-[0.2em]"
          >
            <LogOut className="w-3.5 h-3.5" />
            {t.logout}
          </button>
          
          <div className="text-center opacity-20 flex flex-col items-center gap-1">
             <div className="w-8 h-[2px] bg-primary opacity-30 mb-2" />
             <p className="text-[8px] font-mono uppercase tracking-[0.4em]">Real Stone & Granite</p>
             <p className="text-[7px] font-mono opacity-60 uppercase">Field Intel v1.0.4-PRO</p>
          </div>
        </div>
      </div>
    </div>
  );
}
