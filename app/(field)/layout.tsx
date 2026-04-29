"use client";

import { useUserStore } from "../../entities/user/store";
import { ThemeForcer } from "../../shared/ui/ThemeForcer";
import { BottomNav } from "../../shared/ui/BottomNav";

export default function FieldLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { activeRole, _hasHydrated } = useUserStore();

  // Silent Cut: If admin, suppress field UI entirely during redirect
  if (_hasHydrated && activeRole === "admin") {
    return null;
  }

  return (
    <div className="field-rugged flex flex-1 overflow-hidden bg-background justify-center pt-safe">
      <div className="w-full max-w-md bg-background flex flex-col relative h-[100dvh]">
        <main className="flex-1 overflow-y-auto pb-24 px-1">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
