import { Search, Building2, Truck, Link as LinkIcon, ChevronRight, ArrowUpDown, X, Info, PackageSearch } from "lucide-react";
import { InventoryLot } from "../hooks/useInventoryController";
import { dict } from "../../../entities/i18n/dict";
import { useSortableTable } from "../../../shared/lib/useSortableTable";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { EmptyState } from "../../../components/ui/EmptyState";

const SortIcon = ({ 
  columnKey, 
  sortConfig 
}: { 
  columnKey: string;
  sortConfig: { key: any; direction: "asc" | "desc" | null };
}) => {
  const isActive = sortConfig.key === columnKey;
  return (
    <ArrowUpDown className={`w-3 h-3 ml-2 transition-colors ${isActive && sortConfig.direction ? "text-rsg-gold" : "text-foreground/20"}`} />
  );
};

export function InventoryFilters({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (s: string) => void;
}) {
  return (
    <div className="relative">
      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" />
      <input
        type="text"
        placeholder="Search by Lot # or Material..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full pl-9 pr-4 py-3 bg-card border border-border text-sm focus:outline-none focus:border-primary transition-colors h-12"
      />
    </div>
  );
}

export function InventoryTable({
  lots,
  language,
}: {
  lots: InventoryLot[];
  language: "en" | "es";
}) {
  const t = dict[language].admin;
  const [selectedLot, setSelectedLot] = useState<InventoryLot | null>(null);

  const { sortedData, sortConfig, handleSort } = useSortableTable(lots, "inventory", { key: "id", direction: "asc" });

  const handleKeyDown = (e: React.KeyboardEvent, lot: InventoryLot) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelectedLot(lot);
    }
  };

  return (
    <div className="bg-card border border-border overflow-hidden min-h-[400px]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-surface sticky top-0 z-10 border-b border-border">
            <tr>
              <th 
                tabIndex={0}
                className="px-4 py-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground text-left cursor-pointer hover:text-foreground transition-colors focus:bg-rsg-surface-2 outline-none"
                onClick={() => handleSort("id")}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleSort("id")}
              >
                <div className="flex items-center">
                  {t.lotNumber}
                  <SortIcon columnKey="id" sortConfig={sortConfig} />
                </div>
              </th>
              <th 
                tabIndex={0}
                className="px-4 py-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground text-left cursor-pointer hover:text-foreground transition-colors focus:bg-rsg-surface-2 outline-none"
                onClick={() => handleSort("materialName")}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleSort("materialName")}
              >
                <div className="flex items-center">
                  {t.materialType}
                  <SortIcon columnKey="materialName" sortConfig={sortConfig} />
                </div>
              </th>
              <th 
                tabIndex={0}
                className="px-4 py-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground text-left cursor-pointer hover:text-foreground transition-colors focus:bg-rsg-surface-2 outline-none"
                onClick={() => handleSort("slabs")}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleSort("slabs")}
              >
                <div className="flex items-center">
                  Quantity
                  <SortIcon columnKey="slabs" sortConfig={sortConfig} />
                </div>
              </th>
              <th 
                tabIndex={0}
                className="px-4 py-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground text-left cursor-pointer hover:text-foreground transition-colors focus:bg-rsg-surface-2 outline-none"
                onClick={() => handleSort("status")}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleSort("status")}
              >
                <div className="flex items-center">
                  {t.status}
                  <SortIcon columnKey="status" sortConfig={sortConfig} />
                </div>
              </th>
              <th 
                tabIndex={0}
                className="px-4 py-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground text-left cursor-pointer hover:text-foreground transition-colors focus:bg-rsg-surface-2 outline-none"
                onClick={() => handleSort("job_legacy_id")}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleSort("job_legacy_id")}
              >
                <div className="flex items-center">
                  {t.jobLink}
                  <SortIcon columnKey="job_legacy_id" sortConfig={sortConfig} />
                </div>
              </th>
              <th className="px-4 py-4 border-b border-border w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {sortedData.map((lot) => (
              <tr
                key={lot.id}
                tabIndex={0}
                className="hover:bg-rsg-surface-2 transition-colors cursor-pointer group outline-none focus:bg-rsg-surface-2"
                onClick={() => setSelectedLot(lot)}
                onKeyDown={(e) => handleKeyDown(e, lot)}
              >
                <td className="px-4 py-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
                  {lot.id.toUpperCase()}
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {lot.materialName}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">
                      {lot.thickness}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 text-xs font-black text-foreground uppercase tracking-widest">
                  {lot.slabs} SLABS
                </td>
                <td className="px-4 py-4">
                  {lot.status === "on-site" ? (
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 text-[9px] font-black uppercase tracking-widest bg-status-verified-bg/10 text-status-verified-text border border-status-verified-bg/20">
                      <Building2 className="w-3 h-3" />
                      {t.onSiteWarehouse}
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 text-[9px] font-black uppercase tracking-widest bg-status-pending-bg/10 text-status-pending-text border border-status-pending-bg/20">
                      <Truck className="w-3 h-3" />
                      {t.inTransit}
                    </div>
                  )}
                </td>
                <td className="px-4 py-4">
                  {lot.job_legacy_id ? (
                    <div className="flex items-center gap-2 group-hover:text-primary transition-colors">
                      <LinkIcon className="w-3 h-3 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">
                          {lot.job_legacy_id}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase font-black tracking-tight truncate max-w-[120px]">
                          {lot.job_client}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest opacity-40">
                      UNASSIGNED STOCK
                    </span>
                  )}
                </td>
                <td className="px-4 py-4 text-right">
                  <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors inline" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {lots.length === 0 && (
        <EmptyState 
          icon={PackageSearch}
          headline={language === "es" ? "No se encontró material" : "No Material Found"}
          subline={language === "es" ? "Refina tus criterios de búsqueda o filtros" : "Refine your search or filter criteria"}
        />
      )}

      {/* Lot Quick Detail Drawer (Using Dialog as Drawer) */}
      <Dialog open={!!selectedLot} onOpenChange={() => setSelectedLot(null)}>
        <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-border bg-card">
          {selectedLot && (
            <div className="flex flex-col h-full">
              <div className="bg-rsg-surface p-8 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono font-black italic uppercase tracking-widest text-muted-foreground">
                    LOT: {selectedLot.id.toUpperCase()}
                  </span>
                  <div className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest border rounded-none ${selectedLot.status === "on-site" ? "bg-status-verified-bg/10 text-status-verified-text border-status-verified-bg/20" : "bg-status-pending-bg/10 text-status-pending-text border-status-pending-bg/20"}`}>
                    {selectedLot.status === "on-site" ? "ON-SITE" : "IN-TRANSIT"}
                  </div>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground uppercase">
                  {selectedLot.materialName}
                </h2>
                <p className="text-xs text-muted-foreground uppercase font-black tracking-[0.2em] mt-1">
                  Thickness: {selectedLot.thickness} • QTY: {selectedLot.slabs} SLABS
                </p>
              </div>

              <div className="p-8 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 border-b border-border pb-2">Assignment Details</h3>
                  {selectedLot.job_legacy_id ? (
                    <div className="bg-rsg-surface border border-border p-4 flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase">Linked Work Order</span>
                        <span className="text-sm font-bold">{selectedLot.job_legacy_id}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase">Client Name</span>
                        <span className="text-sm font-bold uppercase">{selectedLot.job_client}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-rsg-surface/50 border border-dashed border-border p-4 text-center">
                      <p className="text-xs text-muted-foreground uppercase font-black tracking-widest italic">Unassigned Stock Inventory</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 border-b border-border pb-2">Logistics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-rsg-surface border border-border p-4">
                      <p className="text-[9px] font-mono text-muted-foreground uppercase mb-1">Expected Date</p>
                      <p className="text-sm font-bold">
                        {new Date(selectedLot.expected_date).toLocaleDateString(language === "es" ? "es-ES" : "en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                    <div className="bg-rsg-surface border border-border p-4">
                      <p className="text-[9px] font-mono text-muted-foreground uppercase mb-1">Warehouse</p>
                      <p className="text-sm font-bold">W1 - MAIN ST</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-auto p-6 bg-rsg-surface border-t border-border flex justify-end gap-3">
                <Button variant="outline" onClick={() => setSelectedLot(null)} className="text-[10px] font-black uppercase tracking-widest h-10">Close</Button>
                <Button onClick={() => toast.info("Printing Lot Label...")} className="text-[10px] font-black uppercase tracking-widest h-10 px-6">Print Label</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function InventoryMetrics({
  stats,
  language,
}: {
  stats: any;
  language: "en" | "es";
}) {
  const t = dict[language].admin;

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-card border-l-8 border-foreground p-4 border-y border-r border-border hover:bg-rsg-surface/50 transition-all active:scale-[0.98] cursor-default">
        <p className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.2em]">
          TOTAL SLABS
        </p>
        <div className="text-3xl font-bold text-foreground mt-1">
          {stats.total}
        </div>
      </div>

      <div className="bg-card border-l-8 border-status-verified-bg p-4 border-y border-r border-border hover:bg-rsg-surface/50 transition-all active:scale-[0.98] cursor-default">
        <p className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.2em]">
          {t.onSiteWarehouse}
        </p>
        <div className="text-3xl font-bold text-foreground mt-1">
          {stats.onSite}
        </div>
      </div>

      <div className="bg-card border-l-8 border-status-pending-bg p-4 border-y border-r border-border hover:bg-rsg-surface/50 transition-all active:scale-[0.98] cursor-default">
        <p className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.2em]">
          {t.inTransit}
        </p>
        <div className="text-3xl font-bold text-foreground mt-1">
          {stats.inTransit}
        </div>
      </div>
    </div>
  );
}
