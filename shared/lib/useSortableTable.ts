import { useState, useEffect, useMemo } from "react";
import { STATUS_SORT_ORDER } from "@/lib/constants/statuses";

export function useSortableTable<T>(
  data: T[],
  tableKey: string,
  defaultSort: { key: keyof T; direction: "asc" | "desc" }
) {
  const [sortConfig, setSortConfig] = useState<{ key: keyof T | null; direction: "asc" | "desc" | null }>(() => {
    return defaultSort;
  });

  useEffect(() => {
    const saved = typeof window !== "undefined" ? sessionStorage.getItem(`sort:${tableKey}`) : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTimeout(() => setSortConfig(parsed), 0);
      } catch (e) {
        // ignore
      }
    }
  }, [tableKey]);

  const handleSort = (key: keyof T) => {
    setSortConfig((prev) => {
      let newDirection: "asc" | "desc" | null = "asc";
      if (prev.key === key) {
        if (prev.direction === "asc") newDirection = "desc";
        else if (prev.direction === "desc") newDirection = null;
      }
      const newConfig = { key: newDirection ? key : null, direction: newDirection };
      sessionStorage.setItem(`sort:${tableKey}`, JSON.stringify(newConfig));
      return newConfig;
    });
  };

  const sortedData = useMemo(() => {
    const key = sortConfig.key;
    const direction = sortConfig.direction;
    if (!key || !direction) return data;
    
    return [...data].sort((a, b) => {
      let valA: any = a[key as keyof T];
      let valB: any = b[key as keyof T];
      
      // Handle missing values
      if (valA === undefined || valA === null) valA = "";
      if (valB === undefined || valB === null) valB = "";

      // Special case: Install Date chronological
      if (key === "scheduled_arrival" || key === "scheduled_date" || key === "install_date") {
         valA = (a as any).scheduled_arrival || (a as any).scheduled_date || (a as any).install_date || "";
         valB = (b as any).scheduled_arrival || (b as any).scheduled_date || (b as any).install_date || "";
      }

      // Special case: Status sort order
      if (key === "status") {
        valA = (STATUS_SORT_ORDER as any)[valA] || 99;
        valB = (STATUS_SORT_ORDER as any)[valB] || 99;
      }

      if (valA < valB) return direction === "asc" ? -1 : 1;
      if (valA > valB) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  return {
    sortedData,
    sortConfig,
    handleSort,
  };
}
