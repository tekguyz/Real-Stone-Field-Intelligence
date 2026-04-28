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
  User,
  Monitor,
  Zap,
  ShieldAlert,
  Smartphone,
  Calendar,
  Clock,
  Trash
} from "lucide-react";
import { useTheme } from "next-themes";
import { ReportIssueForm } from "../../../shared/ui/ReportIssueForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Switch } from "../../../components/ui/switch";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { toast } from "sonner";
import { useEffect } from "react";

export default function SettingsPage() {
  const { language, setLanguage, setManualThemeOverride } = useUserStore();
  const { theme, setTheme } = useTheme();
  const t = dict[language].admin;
  const [saved, setSaved] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [demoMode, setDemoMode] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("demo_mode");
      return stored !== null ? stored === "true" : true;
    }
    return true;
  });

  const [reduceMotion, setReduceMotion] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("reduce_motion") === "reduce";
    }
    return false;
  });

  const [cacheSize, setCacheSize] = useState("—");

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then(estimate => {
        if (estimate.usage) {
          setCacheSize((estimate.usage / (1024 * 1024)).toFixed(1) + " MB");
        }
      });
    }
  }, []);

  const handleDemoModeChange = (checked: boolean) => {
    setDemoMode(checked);
    localStorage.setItem("demo_mode", checked.toString());
    window.dispatchEvent(new Event("demo_mode_changed"));
    toast.success(`Demo mode ${checked ? "enabled" : "disabled"}`);
  };

  const handleReduceMotionChange = (checked: boolean) => {
    setReduceMotion(checked);
    const value = checked ? "reduce" : "no-preference";
    localStorage.setItem("reduce_motion", value);
    if (checked) {
      document.documentElement.classList.add("reduce-motion");
    } else {
      document.documentElement.classList.remove("reduce-motion");
    }
    toast.success(`Reduce motion ${checked ? "enabled" : "disabled"}`);
  };

  const handleClearCache = async () => {
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map(key => caches.delete(key)));
      setCacheSize("0.0 MB");
      toast.success("Cache cleared successfully");
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    setManualThemeOverride(true);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    toast.success(t.preferencesSaved || "Preferences saved");
  };

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
        {/* ACCOUNT */}
        <section className="py-8 space-y-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 font-black">ACCOUNT</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">{language === "es" ? "Nombre a Mostrar" : "Display Name"}</Label>
              <input 
                type="text" 
                defaultValue="Admin User"
                className="w-full bg-surface border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors h-10 outline-none focus-visible:ring-2 focus-visible:ring-rsg-gold"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Email</Label>
              <div className="w-full bg-muted/50 border border-border px-4 py-2 text-sm text-foreground/50 h-10 flex items-center">
                admin@realstone.com
              </div>
            </div>
            <div className="md:col-span-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="text-xs font-black uppercase tracking-widest h-10 outline-none focus-visible:ring-2 focus-visible:ring-rsg-gold">
                    {language === "es" ? "Cambiar Contraseña" : "Change Password"}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{language === "es" ? "Cambiar Contraseña" : "Change Password"}</DialogTitle>
                    <DialogDescription>
                      This feature is restricted in demo mode.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button onClick={() => {}} className="uppercase text-xs font-bold">Close</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </section>

        {/* PREFERENCES */}
        <section className="py-8 space-y-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 font-black">PREFERENCES</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">{t.languagePref}</Label>
              <Select value={language} onValueChange={(val: "en" | "es") => setLanguage(val)}>
                <SelectTrigger className="w-full bg-surface h-10 outline-none focus-visible:ring-2 focus-visible:ring-rsg-gold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English (US)</SelectItem>
                  <SelectItem value="es">Español (ES)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {language === "es" ? "Formato de Fecha" : "Date Format"}
                </div>
              </Label>
              <Select defaultValue="MM/DD/YYYY">
                <SelectTrigger className="w-full bg-surface h-10 outline-none focus-visible:ring-2 focus-visible:ring-rsg-gold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {language === "es" ? "Formato de Hora" : "Time Format"}
                </div>
              </Label>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 text-[10px] font-black uppercase tracking-widest h-10 bg-primary/10 border-primary/20 text-primary">12H</Button>
                <Button variant="outline" className="flex-1 text-[10px] font-black uppercase tracking-widest h-10 text-muted-foreground">24H</Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">{t.defaultTheme}</Label>
            <div className="flex bg-surface border border-border p-1 rounded-none w-full max-w-sm">
              {[
                { id: "light", icon: Sun, label: language === "es" ? "Luz" : "Light" },
                { id: "dark", icon: Moon, label: language === "es" ? "Oscuro" : "Dark" },
                { id: "system", icon: Laptop, label: language === "es" ? "Auto" : "Auto" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleThemeChange(item.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-[9px] font-black uppercase tracking-widest transition-all outline-none focus-visible:ring-2 focus-visible:ring-rsg-gold ${
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
        </section>

        {/* ACCESSIBILITY */}
        <section className="py-8 space-y-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 font-black">ACCESSIBILITY</h2>
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label className="text-sm font-bold uppercase tracking-tight">{language === "es" ? "Reducir Movimiento" : "Reduce Motion"}</Label>
            </div>
            <Switch checked={reduceMotion} onCheckedChange={handleReduceMotionChange} className="focus-visible:ring-2 focus-visible:ring-rsg-gold" />
          </div>
          <p className="text-xs text-muted-foreground italic">
            Text size follows your device&apos;s system font scale setting
          </p>
        </section>

        {/* NOTIFICATIONS */}
        <section className="py-8 space-y-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 font-black">NOTIFICATIONS</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold uppercase tracking-tight flex items-center gap-2">
                  Job status change alerts
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-muted-foreground" title="Coming soon" />
                <Switch disabled />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold uppercase tracking-tight flex items-center gap-2">
                  New assignment alerts
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-muted-foreground" title="Coming soon" />
                <Switch disabled />
              </div>
            </div>
          </div>
        </section>

        {/* ADVANCED */}
        <section className="py-8 space-y-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 font-black">ADVANCED</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold uppercase tracking-tight">Demo Mode</Label>
                <p className="text-xs text-muted-foreground">Show demo banner</p>
              </div>
              <Switch checked={demoMode} onCheckedChange={handleDemoModeChange} className="focus-visible:ring-2 focus-visible:ring-rsg-gold" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold uppercase tracking-tight">Offline Storage</Label>
                <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-tighter">Estimated cache size: {cacheSize}</p>
              </div>
            </div>

            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-[10px] font-black uppercase tracking-widest border-rsg-error/20 text-rsg-error hover:bg-rsg-error hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-rsg-error">
                    Clear Offline Cache
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[400px]">
                  <DialogHeader>
                    <DialogTitle>Clear Offline Data?</DialogTitle>
                    <DialogDescription>
                      This will remove cached offline data. You&apos;ll need a connection to reload job data.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="ghost" onClick={() => {}} className="uppercase text-[10px] font-black tracking-widest">Cancel</Button>
                    <Button variant="destructive" onClick={handleClearCache} className="uppercase text-[10px] font-black tracking-widest">Clear Cache</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </section>

        {/* DANGER ZONE */}
        <section className="py-8 space-y-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 font-black text-rsg-error">DANGER ZONE</h2>
          <div className="flex flex-col gap-4">
            <Button variant="destructive" className="w-full text-xs font-black uppercase tracking-widest py-6 outline-none focus-visible:ring-2 focus-visible:ring-rsg-error">
              Sign Out
            </Button>
            <div className="relative group/delete">
              <Button variant="outline" className="w-full text-xs font-black uppercase tracking-widest py-6 border-rsg-error/20 text-rsg-error/40 cursor-not-allowed" disabled>
                Delete Account
              </Button>
              <div className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-background/80 text-[10px] font-bold uppercase tracking-widest text-foreground pointer-events-none text-center px-4">
                Contact your administrator to delete this account
              </div>
            </div>
          </div>
        </section>

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
