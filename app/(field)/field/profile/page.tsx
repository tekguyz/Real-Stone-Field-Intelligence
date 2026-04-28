"use client";

import { LogOut } from "lucide-react";
import { useProfileController } from "../../../../features/field-profile/hooks/useProfileController";
import { ProfileInfo } from "../../../../features/field-profile/ui/ProfileInfo";
import { ProfilePreferences } from "../../../../features/field-profile/ui/ProfilePreferences";
import { ProfileAppControls } from "../../../../features/field-profile/ui/ProfileAppControls";
import { ProfileSupport } from "../../../../features/field-profile/ui/ProfileSupport";

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
      {/* Neo-Brutalist Strict Header - Exactly h-14 */}
      <div className="h-14 px-4 bg-surface border-b border-border flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-primary">
            {initials}
          </span>
          <span className="text-border">/</span>
          <h1 className="text-sm font-black tracking-widest text-foreground uppercase">
            {t.profile}
          </h1>
        </div>
        <span className="px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest border border-primary/20">
          {language === "es" ? "Principal" : "Lead"}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-6 pt-6">
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

        {/* Combined System & Apps - Neo-Brutalist Grid */}
        <ProfileAppControls language={language} />

        {/* Support & Reporting - High Density */}
        <ProfileSupport 
          language={language}
          showReportForm={showReportForm}
          setShowReportForm={setShowReportForm}
          activeRole={activeRole}
          fullName={fullName}
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
