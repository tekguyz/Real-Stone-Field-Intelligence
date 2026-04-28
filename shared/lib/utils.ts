import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { JobScopePart } from "@/entities/job/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function summarizeJobScope(parts: JobScopePart[] | null): string {
  if (!parts || parts.length === 0) return "No Job Scope";

  const mainParts = parts.slice(0, 2).map((p) => p.partType);
  if (parts.length > 2) {
    return `${mainParts.join(", ")} +${parts.length - 2} more`;
  }
  return mainParts.join(", ");
}

export function formatInstallerName(id: string | null | undefined): string {
  if (!id || id === "unassigned") return "UNASSIGNED";
  // Logic to handle "installer_name" -> "NAME"
  return id.replace(/installer_/i, "").replace(/_/g, " ").toUpperCase();
}
