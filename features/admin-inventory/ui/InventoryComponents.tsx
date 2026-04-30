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
                className="px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground text-left cursor-pointer hover:text-foreground transition-colors focus:bg-surface-2 outline-none border-b border-border"
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
                className="px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground text-left cursor-pointer hover:text-foreground transition-colors focus:bg-surface-2 outline-none border-b border-border"
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
                className="px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground text-left cursor-pointer hover:text-foreground transition-colors focus:bg-surface-2 outline-none border-b border-border"
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
                className="px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground text-left cursor-pointer hover:text-foreground transition-colors focus:bg-surface-2 outline-none border-b border-border"
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
                className="px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground text-left cursor-pointer hover:text-foreground transition-colors focus:bg-surface-2 outline-none border-b border-border"
                onClick={() => handleSort("job_legacy_id")}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleSort("job_legacy_id")}
              >
                <div className="flex items-center">
                  {t.jobLink}
                  <SortIcon columnKey="job_legacy_id" sortConfig={sortConfig} />
                </div>
              </th>
              <th className="px-4 py-2.5 border-b border-border w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedData.map((lot) => (
              <tr
                key={lot.id}
                tabIndex={0}
                className="hover:bg-surface-2 transition-colors cursor-pointer group outline-none focus:bg-surface-2 border-b border-border"
                onClick={() => setSelectedLot(lot)}
                onKeyDown={(e) => handleKeyDown(e, lot)}
              >
                <td className="px-4 py-2.5 text-sm font-mono text-muted-foreground group-hover:text-foreground transition-colors uppercase">
                  {lot.id}
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {lot.materialName}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
                      {lot.thickness}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-sm font-bold text-foreground">
                  {lot.slabs} SLABS
                </td>
                <td className="px-4 py-2.5">
                  {lot.status === "on-site" ? (
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-black uppercase tracking-widest bg-[var(--status-verified-bg)] text-[var(--status-verified-text)] rounded-sm">
                      <Building2 className="w-3 h-3" />
                      {t.onSiteWarehouse}
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-black uppercase tracking-widest bg-[var(--status-pending-bg)] text-[var(--status-pending-text)] rounded-sm">
                      <Truck className="w-3 h-3" />
                      {t.inTransit}
                    </div>
                  )}
                </td>
                <td className="px-4 py-2.5">
                  {lot.job_legacy_id ? (
                    <div className="flex items-center gap-2 group-hover:text-primary transition-colors">
                      <LinkIcon className="w-3 h-3 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="text-sm font-mono text-foreground">
                          {lot.job_legacy_id}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-tight truncate max-w-[120px]">
                          {lot.job_client}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest opacity-40">
                      UNASSIGNED STOCK
                    </span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-right">
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
        <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-border bg-card rounded-md">
          {selectedLot && (
            <div className="flex flex-col h-full">
              <div className="bg-surface p-6 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    LOT: {selectedLot.id.toUpperCase()}
                  </span>
                  <div className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded-sm ${selectedLot.status === "on-site" ? "bg-[var(--status-verified-bg)] text-[var(--status-verified-text)]" : "bg-[var(--status-pending-bg)] text-[var(--status-pending-text)]"}`}>
                    {selectedLot.status === "on-site" ? "ON-SITE" : "IN-TRANSIT"}
                  </div>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground uppercase">
                  {selectedLot.materialName}
                </h2>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mt-1">
                  Thickness: {selectedLot.thickness} • QTY: {selectedLot.slabs} SLABS
                </p>
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground border-b border-border pb-2">Assignment Details</h3>
                  {selectedLot.job_legacy_id ? (
                    <div className="bg-surface border border-border p-4 flex flex-col gap-3 rounded-md">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Linked Work Order</span>
                        <span className="text-sm font-semibold">{selectedLot.job_legacy_id}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Client Name</span>
                        <span className="text-sm font-semibold uppercase">{selectedLot.job_client}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-surface border border-dashed border-border p-4 text-center rounded-md">
                      <p className="text-xs text-muted-foreground uppercase font-semibold tracking-widest italic">Unassigned Stock Inventory</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground border-b border-border pb-2">Logistics</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-surface border border-border p-4 rounded-md">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Expected Date</p>
                      <p className="text-sm font-semibold">
                        {new Date(selectedLot.expected_date).toLocaleDateString(language === "es" ? "es-ES" : "en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                    <div className="bg-surface border border-border p-4 rounded-md">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Warehouse</p>
                      <p className="text-sm font-semibold">W1 - MAIN ST</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-auto p-5 bg-surface border-t border-border flex justify-end gap-3 rounded-b-md">
                <Button variant="outline" onClick={() => setSelectedLot(null)} className="text-xs font-semibold uppercase tracking-widest h-10 rounded-md">Close</Button>
                <Button onClick={() => toast.info("Printing Lot Label...")} className="bg-rsg-gold text-black text-xs font-semibold uppercase tracking-widest h-10 px-6 rounded-md hover:bg-rsg-gold/90 border-0">Print Label</Button>
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
    <div className="grid grid-cols-1 gap-3">
      <div className="bg-card border-l-4 border-l-rsg-gold p-4 border border-border hover:bg-surface-2 transition-colors rounded-lg cursor-default shadow-sm text-foreground">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
          TOTAL SLABS
        </p>
        <div className="text-3xl font-black tracking-tighter mt-1 underline decoration-primary decoration-1 underline-offset-4">
          {stats.total}
        </div>
      </div>

      <div className="bg-card border-l-4 border-l-[var(--status-verified-text)] p-4 border border-border hover:bg-surface-2 transition-colors rounded-lg cursor-default shadow-sm">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
          {t.onSiteWarehouse}
        </p>
        <div className="text-3xl font-black tracking-tighter text-foreground mt-1">
          {stats.onSite}
        </div>
      </div>

      <div className="bg-card border-l-4 border-l-[var(--status-urgent-text)] p-4 border border-border hover:bg-surface-2 transition-colors rounded-lg cursor-default shadow-sm">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
          {t.inTransit}
        </p>
        <div className="text-3xl font-black tracking-tighter text-foreground mt-1">
          {stats.inTransit}
        </div>
      </div>
    </div>
  );
}
