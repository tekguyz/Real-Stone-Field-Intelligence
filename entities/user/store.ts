import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'admin' | 'installer_juan' | 'installer_carlos';
export type Language = 'en' | 'es';

interface UserState {
  activeRole: Role;
  language: Language;
  isDevMode: boolean;
  manualThemeOverride: boolean;
  isSidebarOpen: boolean;
  setRole: (role: Role) => void;
  setLanguage: (lang: Language) => void;
  setDevMode: (devMode: boolean) => void;
  setManualThemeOverride: (override: boolean) => void;
  toggleSidebar: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      activeRole: 'admin',
      language: 'en',
      isDevMode: true,
      manualThemeOverride: false,
      isSidebarOpen: true,
      setRole: (role) => set({ activeRole: role, manualThemeOverride: false }), // Reset override on role change
      setLanguage: (lang) => set({ language: lang }),
      setDevMode: (devMode) => set({ isDevMode: devMode }),
      setManualThemeOverride: (override) => set({ manualThemeOverride: override }),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    }),
    {
      name: 'rsg-user-storage',
    }
  )
);
