'use client';

import { useUserStore } from '../../../entities/user/store';
import { dict } from '../../../entities/i18n/dict';
import { Package } from 'lucide-react';
import { useInventoryController } from '../../../features/admin-inventory/hooks/useInventoryController';
import { InventoryFilters, InventoryTable, InventoryMetrics } from '../../../features/admin-inventory/ui/InventoryComponents';

export default function InventoryPage() {
  const { language } = useUserStore();
  const t = dict[language].admin;
  
  const { search, setSearch, stats, filteredLots } = useInventoryController();

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">{t.slabInventory}</h1>
          <p className="text-foreground/50 mt-1 font-mono text-sm leading-none">MASTER MATERIAL TRACKING LOG</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column (75%) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <InventoryFilters search={search} setSearch={setSearch} />
          <InventoryTable lots={filteredLots} language={language} />
        </div>

        {/* Right Column - Metrics (25%) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
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
