import { Search } from "lucide-react";
import { InventoryLot } from "../hooks/useInventoryController";
import { dict } from "../../../entities/i18n/dict";
import { Building2, Truck, Link as LinkIcon, ChevronRight, ArrowUpDown } from "lucide-react";
import { useSortableTable } from "../../../shared/lib/useSortableTable";

const SortIcon = ({ 
  columnKey, 
  sortConfig 
}: { 
  columnKey: string;
  sortConfig: { key: any; direction: "asc" | "desc" | null };
}) => {
  const isActive = sortConfig.key === columnKey;
  return (
    <ArrowUpDown className={`w-3 h-3 ml-1 transition-colors ${isActive && sortConfig.direction ? "text-rsg-gold" : "text-foreground/20"}`} />
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
        className="w-full pl-9 pr-4 py-3 bg-card border border-border text-sm focus:outline-none focus:border-primary transition-colors"
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

  const { sortedData, sortConfig, handleSort } = useSortableTable(lots, "inventory", { key: "id", direction: "asc" });

  return (
    <div className="bg-card border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-surface sticky top-0 z-10 border-b border-border">
            <tr>
              <th 
                className="px-4 py-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground text-left cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort("id")}
              >
                <div className="flex items-center">
                  {t.lotNumber}
                  <SortIcon columnKey="id" sortConfig={sortConfig} />
                </div>
              </th>
              <th 
                className="px-4 py-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground text-left cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort("materialName")}
              >
                <div className="flex items-center">
                  {t.materialType}
                  <SortIcon columnKey="materialName" sortConfig={sortConfig} />
                </div>
              </th>
              <th 
                className="px-4 py-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground text-left cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort("slabs")}
              >
                <div className="flex items-center">
                  Quantity
                  <SortIcon columnKey="slabs" sortConfig={sortConfig} />
                </div>
              </th>
              <th 
                className="px-4 py-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground text-left cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center">
                  {t.status}
                  <SortIcon columnKey="status" sortConfig={sortConfig} />
                </div>
              </th>
              <th className="px-4 py-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground text-left cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort("job_legacy_id")}
              >
                <div className="flex items-center">
                  {t.jobLink}
                  <SortIcon columnKey="job_legacy_id" sortConfig={sortConfig} />
                </div>
              </th>
              <th className="px-4 py-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground text-left"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedData.map((lot) => (
              <tr
                key={lot.id}
                className="hover:bg-rsg-surface/30 transition-colors group cursor-pointer"
              >
                <td className="px-4 py-4 text-sm font-medium text-foreground">
                  {lot.id.toUpperCase()}
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {lot.materialName}
                    </span>
                    <span className="text-xs text-muted-foreground uppercase">
                      {lot.thickness}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm font-medium text-foreground">
                  {lot.slabs} SLABS
                </td>
                <td className="px-4 py-4">
                  {lot.status === "on-site" ? (
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest bg-status-verified-bg/10 text-status-verified-text border border-status-verified-bg/20">
                      <Building2 className="w-3 h-3" />
                      {t.onSiteWarehouse}
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest bg-status-pending-bg/10 text-status-pending-text border border-status-pending-bg/20">
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
                        <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                          {lot.job_client}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground italic uppercase">
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
        <div className="p-8 text-center text-foreground/50 text-sm">
          No matching lots found.
        </div>
      )}
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
      <div className="bg-card border-l-8 border-foreground p-4 border-y border-r border-border hover:bg-surface/50 transition-colors">
        <p className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.2em]">
          TOTAL SLABS
        </p>
        <div className="text-3xl font-bold text-foreground mt-1">
          {stats.total}
        </div>
      </div>

      <div className="bg-card border-l-8 border-rsg-success p-4 border-y border-r border-border hover:bg-surface/50 transition-colors">
        <p className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.2em]">
          {t.onSiteWarehouse}
        </p>
        <div className="text-3xl font-bold text-foreground mt-1">
          {stats.onSite}
        </div>
      </div>

      <div className="bg-card border-l-8 border-rsg-gold p-4 border-y border-r border-border hover:bg-surface/50 transition-colors">
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
