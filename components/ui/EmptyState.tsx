"use client";

import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  headline: string;
  subline: string;
}

export function EmptyState({ icon: Icon, headline, subline }: EmptyStateProps) {
  return (
    <div className="py-16 flex flex-col items-center justify-center text-center gap-2">
      <div className="w-16 h-16 bg-accent flex items-center justify-center border border-border mb-2 rounded-md">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold tracking-tight uppercase">
        {headline}
      </h3>
      <p className="text-sm text-muted-foreground uppercase tracking-widest max-w-xs mx-auto">
        {subline}
      </p>
    </div>
  );
}
