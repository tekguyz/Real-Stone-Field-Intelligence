"use client";

import { useSettings } from "../../../features/admin-settings/hooks/useSettings";
import { ReportIssueForm } from "../../../shared/ui/ReportIssueForm";
import { Button } from "../../../components/ui/button";
import { AlertTriangle } from "lucide-react";
import { AccountSettings } from "../../../features/admin-settings/ui/AccountSettings";
import { PreferenceSettings } from "../../../features/admin-settings/ui/PreferenceSettings";
import { AccessibilitySettings } from "../../../features/admin-settings/ui/AccessibilitySettings";
import { NotificationSettings } from "../../../features/admin-settings/ui/NotificationSettings";
import { AdvancedSettings } from "../../../features/admin-settings/ui/AdvancedSettings";
import { DangerZone } from "../../../features/admin-settings/ui/DangerZone";

export default function SettingsPage() {
  const { language, t, showReportForm, setShowReportForm, handleSave } = useSettings();

  return (
    <div className="flex flex-col gap-8 max-w-4xl pb-10">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground text-center sm:text-left">
          {t.settings}
        </h1>
        <p className="text-foreground/50 mt-1 font-mono text-sm leading-none uppercase text-center sm:text-left">
          {language === "es" ? "CONFIGURACIÓN DEL SISTEMA Y PREFERENCIAS" : "SYSTEM CONFIGURATION & PREFERENCES"}
        </p>
      </div>

      <div className="flex flex-col gap-0 divide-y divide-border border-t border-b border-border">
        <AccountSettings />
        <PreferenceSettings />
        <AccessibilitySettings />
        <NotificationSettings />
        <AdvancedSettings />
        <DangerZone />

        {/* Global Save */}
        <div className="flex justify-between items-center bg-card border border-border p-6 mt-4">
          <button
            onClick={() => setShowReportForm(!showReportForm)}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 hover:text-foreground transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-rsg-gold"
          >
            <AlertTriangle className="w-3.5 h-3.5 group-hover:text-amber-500" />
            <span>
              {showReportForm ? "Hide Support" : "Report Issue"}
            </span>
          </button>
          <Button onClick={handleSave} className="px-8 py-6 text-sm font-black uppercase tracking-widest outline-none focus-visible:ring-2 focus-visible:ring-rsg-gold">
            {t.saveChanges}
          </Button>
        </div>

        {showReportForm && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <ReportIssueForm
              userRole="admin"
              userName="Admin User"
            />
          </div>
        )}
      </div>
    </div>
  );
}
