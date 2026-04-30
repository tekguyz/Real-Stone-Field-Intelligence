"use client";

import { useUserStore } from "../../../entities/user/store";
import { dict } from "../../../entities/i18n/dict";
import { Package } from "lucide-react";
import { useInventoryController } from "../../../features/admin-inventory/hooks/useInventoryController";
import {
  InventoryFilters,
  InventoryTable,
  InventoryMetrics,
} from "../../../features/admin-inventory/ui/InventoryComponents";

export default function InventoryPage() {
  const { language } = useUserStore();
  const t = dict[language].admin;

  const { search, setSearch, stats, filteredLots } = useInventoryController();

  return (
    <div className="flex flex-col gap-4 pb-10">
      {/* Header */}
      <div className="flex justify-between items-center bg-surface -mx-8 -mt-8 px-8 py-4 mb-6 border-b border-border shadow-sm">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-foreground uppercase leading-none">
            {t.slabInventory}
          </h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1 leading-none">
            {language === "es" ? "STOCK DE LOTES Y ASIGNACIÓN DE MATERIAL" : "MASTER MATERIAL TRACKING LOG"}
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-start">
        {/* Left Column: Slab Inventory Table */}
        <div className="flex-1 flex flex-col gap-4 w-full">
          <InventoryFilters search={search} setSearch={setSearch} />
          <InventoryTable lots={filteredLots} language={language} />
        </div>

        {/* Right Column - Metrics */}
        <div className="w-full lg:w-72 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xl font-medium tracking-tight">
            <Package className="w-5 h-5 text-primary" />
            Inventory Metrics
          </div>
          <InventoryMetrics stats={stats} language={language} />
        </div>
      </div>
    </div>
  );
}
