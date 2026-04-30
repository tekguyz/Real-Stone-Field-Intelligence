import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useUserStore } from "../../../entities/user/store";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { dict } from "../../../entities/i18n/dict";

export function useSettings() {
  const router = useRouter();
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
    toast.success(t.preferencesSaved || "Preferences saved");
    
    // Auto-exit settings after save
    setTimeout(() => {
      setSaved(false);
      router.push("/command-center");
    }, 1200);
  };

  return {
    language,
    setLanguage,
    theme,
    t,
    saved,
    showReportForm,
    setShowReportForm,
    demoMode,
    reduceMotion,
    cacheSize,
    handleDemoModeChange,
    handleReduceMotionChange,
    handleClearCache,
    handleThemeChange,
    handleSave,
  };
}
