"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";
import { useUserStore } from "../../entities/user/store";

export function ThemeForcer({ theme }: { theme: "light" | "dark" }) {
  const { setTheme } = useTheme();
  const { manualThemeOverride, activeRole } = useUserStore();

  useEffect(() => {
    // Only force if there's no manual override
    if (!manualThemeOverride) {
      setTheme(theme);
    }
  }, [theme, setTheme, manualThemeOverride, activeRole]);

  return null;
}
