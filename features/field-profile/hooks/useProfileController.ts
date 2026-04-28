import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useUserStore } from "../../../entities/user/store";
import { dict } from "../../../entities/i18n/dict";

export function useProfileController() {
  const { activeRole, language, setLanguage, setManualThemeOverride } = useUserStore();
  const { theme, setTheme } = useTheme();
  const t = dict[language].field;
  const router = useRouter();

  const [showReportForm, setShowReportForm] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    setManualThemeOverride(true);
  };

  const handleLanguageToggle = (lang: "en" | "es") => {
    if (language !== lang) setLanguage(lang);
  };

  const handleLogout = () => {
    router.push("/login");
  };

  const fullName =
    activeRole.split("_")[1]?.charAt(0).toUpperCase() +
      activeRole.split("_")[1]?.slice(1) || "Installer";
  const initials =
    activeRole.split("_")[1]?.substring(0, 2).toUpperCase() || "IN";

  return {
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
  };
}
