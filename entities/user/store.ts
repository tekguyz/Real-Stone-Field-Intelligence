import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "admin" | "installer_juan" | "installer_carlos";
export type Language = "en" | "es";

interface UserState {
  activeRole: Role;
  userName: string;
  language: Language;
  isDevMode: boolean;
  manualThemeOverride: boolean;
  isSidebarOpen: boolean;
  _hasHydrated: boolean;
  setRole: (role: Role) => void;
  setUserName: (name: string) => void;
  setLanguage: (lang: Language) => void;
  setDevMode: (devMode: boolean) => void;
  setManualThemeOverride: (override: boolean) => void;
  toggleSidebar: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      activeRole: "admin",
      userName: "Admin User",
      language: "en",
      isDevMode: true,
      manualThemeOverride: false,
      isSidebarOpen: true,
      _hasHydrated: false,
      setRole: (role) => set({ activeRole: role, manualThemeOverride: false }), // Reset override on role change
      setUserName: (name) => set({ userName: name }),
      setLanguage: (lang) => set({ language: lang }),
      setDevMode: (devMode) => set({ isDevMode: devMode }),
      setManualThemeOverride: (override) =>
        set({ manualThemeOverride: override }),
      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "rsg-user-storage",
      onRehydrateStorage: (state) => {
        return () => state.setHasHydrated(true);
      },
    },
  ),
);
