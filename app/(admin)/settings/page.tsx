"use client";

import { useState } from "react";
import { useUserStore } from "../../../entities/user/store";
import { dict } from "../../../entities/i18n/dict";
import {
  Settings as SettingsIcon,
  Globe,
  Bell,
  Lock,
  CheckCircle2,
  Sun,
  Moon,
  Laptop,
  AlertTriangle,
} from "lucide-react";
import { useTheme } from "next-themes";
import { ReportIssueForm } from "../../../shared/ui/ReportIssueForm";

type Tab = "general" | "operations" | "security";

export default function SettingsPage() {
  const { language, setLanguage, setManualThemeOverride } = useUserStore();
  const { theme, setTheme } = useTheme();
  const t = dict[language].admin;
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [saved, setSaved] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    setManualThemeOverride(true);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {t.settings}
          </h1>
          <p className="text-foreground/50 mt-1 font-mono text-sm leading-none uppercase">
            {language === "es" ? "CONFIGURACIÓN DEL SISTEMA Y PREFERENCIAS" : "SYSTEM CONFIGURATION & PREFERENCES"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation Tabs */}
        <div className="md:col-span-1 flex flex-col gap-2">
          {[
            { id: "general", label: t.general, icon: Globe },
            { id: "operations", label: t.operations, icon: Bell },
            { id: "security", label: t.security, icon: Lock },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-3 px-4 py-3 transition-colors text-sm font-black tracking-[0.2em] uppercase ${
                activeTab === tab.id
                  ? "bg-primary border-l-4 border-primary text-primary-foreground"
                  : "border-l-4 border-transparent text-foreground/70 hover:bg-surface/50 hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">
          <div className="bg-card border border-border overflow-hidden flex flex-col">
            <div className="p-8">
              {activeTab === "general" && (
                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {/* Profile Header Block */}
                  <div className="flex items-center gap-6 pb-8 border-b border-border">
                    <div className="w-16 h-16 bg-foreground text-background flex items-center justify-center font-black text-2xl">
                      AU
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold tracking-tight">
                          {language === "es" ? "Usuario Administrador" : "Admin User"}
                        </h2>
                        <span className="bg-primary/10 border border-primary/20 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-primary">
                          {language === "es" ? "Arquitecto Principal" : "Principal Architect"}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/50 font-mono uppercase tracking-tighter">
                        admin@realstone.com
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-6">
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground/40 border-b border-border pb-2">
                        {language === "es" ? "Preferencias" : "Preferences"}
                      </h3>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest font-black">
                          {t.languagePref}
                        </label>
                        <select
                          value={language}
                          onChange={(e) =>
                            setLanguage(e.target.value as "en" | "es")
                          }
                          className="bg-surface border border-border px-4 py-3 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-primary transition-colors w-full"
                        >
                          <option value="en">English (US)</option>
                          <option value="es">Español (ES)</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest font-black">
                          {t.defaultTheme}
                        </label>
                        <div className="flex bg-surface border border-border p-1 rounded-sm w-full">
                          {[
                            { id: "light", icon: Sun, label: language === "es" ? "Luz" : "Light" },
                            { id: "dark", icon: Moon, label: language === "es" ? "Oscuro" : "Dark" },
                            { id: "system", icon: Laptop, label: language === "es" ? "Auto" : "Auto" },
                          ].map((item) => (
                            <button
                              key={item.id}
                              onClick={() => handleThemeChange(item.id)}
                              className={`flex-1 flex items-center justify-center gap-2 py-3 text-[9px] font-black uppercase tracking-widest transition-all ${
                                theme === item.id
                                  ? "bg-foreground text-background shadow-sm"
                                  : "text-foreground/40 hover:text-foreground/70 hover:bg-foreground/5"
                              }`}
                            >
                              <item.icon className="w-3.5 h-3.5" />
                              <span>{item.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-6">
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground/40 border-b border-border pb-2">
                        {language === "es" ? "Información del Sistema" : "System Info"}
                      </h3>
                      <div className="bg-surface border border-border p-4 flex flex-col gap-4">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-mono text-foreground/40 uppercase">
                            {language === "es" ? "Versión de App" : "App Version"}
                          </span>
                          <span className="font-black">v0.8.2-beta</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-mono text-foreground/40 uppercase">
                            {language === "es" ? "Almacenaje Usado" : "Storage Used"}
                          </span>
                          <span className="font-black">12.4 MB / 500 MB</span>
                        </div>
                        <button className="w-full py-2 bg-foreground/5 border border-border text-[9px] font-black uppercase tracking-widest hover:bg-rsg-error hover:text-white transition-colors">
                          {language === "es" ? "Limpiar Caché" : "Purge Offline Cache"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Collapsible Report Form */}
                  <div className="mt-4">
                    <button
                      onClick={() => setShowReportForm(!showReportForm)}
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 hover:text-foreground transition-colors group"
                    >
                      <AlertTriangle className="w-3 h-3 group-hover:text-rsg-warning" />
                      <span>
                        {showReportForm
                          ? (language === "es" ? "Ocultar Herramienta" : "Hide Support Tool")
                          : (language === "es" ? "Reportar Problema" : "Report System Issue")}
                      </span>
                    </button>

                    {showReportForm && (
                      <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <ReportIssueForm
                          userRole="admin"
                          userName="Admin User"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "operations" && (
                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex flex-col gap-8">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground/40 border-b border-border pb-2">
                       {t.automationIngestion}
                    </h3>

                    <div className="flex items-center justify-between py-4 border-b border-border">
                      <div className="pr-12">
                        <h4 className="font-bold text-foreground uppercase text-xs tracking-tight">
                          {t.verifiedProofEmail}
                        </h4>
                        <p className="text-xs text-foreground/50 mt-1 uppercase font-mono tracking-tighter">
                          {language === "es" ? "Envío automático al cliente tras verificación." : "Automatic customer delivery upon verification."}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div className="w-11 h-6 bg-surface border border-border peer-focus:outline-none peer-checked:bg-foreground after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-foreground after:border-border after:border after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:bg-background"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-border">
                      <div className="pr-12">
                        <h4 className="font-bold text-foreground uppercase text-xs tracking-tight">
                          StoneApp Integration
                        </h4>
                        <p className="text-xs text-foreground/50 mt-1 uppercase font-mono tracking-tighter">
                          {language === "es" ? "Sincronización en tiempo real del estado de órdenes." : "Real-time sync of work order status."}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] font-black uppercase tracking-widest text-rsg-success bg-rsg-success/10 px-2 py-0.5 border border-rsg-success/20">
                          {language === "es" ? "Activo" : "Active"}
                        </span>
                        <button className="text-[9px] font-black uppercase tracking-widest text-foreground/40 hover:text-foreground">
                          {language === "es" ? "Re-sync" : "Re-sync"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex flex-col gap-8">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground/40 border-b border-border pb-2">
                       {t.accessControl}
                    </h3>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-border">
                      <div>
                        <h4 className="font-bold text-foreground uppercase text-xs tracking-tight">
                          {t.masterPin}
                        </h4>
                        <p className="text-xs text-foreground/50 mt-1 uppercase font-mono tracking-tighter">
                          {t.globalOverridePin}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="w-10 h-12 bg-surface border border-border flex items-center justify-center font-mono text-lg font-black"
                          >
                            {"1234"[i]}
                          </div>
                        ))}
                        <button className="ml-2 text-[9px] font-black uppercase tracking-widest text-primary hover:underline">
                          {language === "es" ? "Cambiar" : "Change"}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-border">
                      <div>
                        <h4 className="font-bold text-foreground uppercase text-xs tracking-tight">
                          {t.auditLogDepth}
                        </h4>
                        <p className="text-xs text-foreground/50 mt-1 uppercase font-mono tracking-tighter">
                          {language === "es" ? "Tiempo de persistencia de registros de campo." : "How long to persist field operation logs."}
                        </p>
                      </div>
                      <select
                        defaultValue="90 Days"
                        className="bg-surface border border-border px-3 py-2 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-primary"
                      >
                        <option>30 {t.days}</option>
                        <option>90 {t.days}</option>
                        <option>1 {language === "es" ? "Año" : "Year"}</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-surface/50 p-6 border-t border-border flex justify-end items-center gap-4">
              {saved && (
                <span className="text-green-500 flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.2em] animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  {language === "es" ? "Preferencias guardadas" : "Preferences saved"}
                </span>
              )}
              <button
                onClick={handleSave}
                className="bg-foreground text-background px-6 py-3 font-black tracking-[0.2em] uppercase transition-opacity hover:opacity-90 active:scale-[0.98]"
              >
                {t.saveChanges}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
