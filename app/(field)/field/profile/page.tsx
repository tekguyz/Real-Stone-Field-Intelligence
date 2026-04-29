"use client";

import { LogOut } from "lucide-react";
import { useProfileController } from "../../../../features/field-profile/hooks/useProfileController";
import { ProfileInfo } from "../../../../features/field-profile/ui/ProfileInfo";
import { ProfilePreferences } from "../../../../features/field-profile/ui/ProfilePreferences";

export default function FieldProfilePage() {
  const {
    t,
    language,
    theme,
    fullName,
    initials,
    activeRole,
    showPin,
    setShowPin,
    showReportForm,
    setShowReportForm,
    handleThemeChange,
    handleLanguageToggle,
    handleLogout
  } = useProfileController();

  return (
    <div className="flex flex-col min-h-full bg-background animate-in slide-in-from-bottom-4 duration-500">
      {/* Neo-Brutalist Strict Header - Exactly h-16 */}
      <div className="sticky top-0 z-50 h-16 px-4 bg-background flex justify-between items-center shrink-0 w-full">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-rsg-gold text-black flex items-center justify-center border-2 border-foreground shadow-[var(--rugged-shadow-sm)] shrink-0">
            <span className="font-black text-sm uppercase tracking-widest">
              {initials}
            </span>
          </div>
          <span className="text-border mx-1">/</span>
          <h1 className="text-[12px] font-black tracking-widest text-foreground uppercase">
            {t.profile}
          </h1>
        </div>
        <span className="px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest border-2 border-primary/20">
          {language === "es" ? "Principal" : "Lead"}
        </span>
      </div>

      <div className="p-3 flex flex-col gap-3 pt-4">
        {/* Profile Info - Dense Text */}
        <ProfileInfo 
          fullName={fullName} 
          initials={initials} 
          showPin={showPin} 
          setShowPin={setShowPin} 
          language={language} 
        />

        {/* Preferences (Language and Theme) */}
        <ProfilePreferences 
          language={language} 
          theme={theme} 
          handleLanguageToggle={handleLanguageToggle} 
          handleThemeChange={handleThemeChange} 
        />

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
            <p className="text-[8px] font-mono uppercase tracking-[0.4em]">
              Real Stone & Granite
            </p>
            <p className="text-[7px] font-mono opacity-60 uppercase">
              Field Intel v1.0.4-PRO
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
