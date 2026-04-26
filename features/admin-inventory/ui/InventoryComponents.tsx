import { Search } from "lucide-react";
import { InventoryLot } from "../hooks/useInventoryController";
import { dict } from "../../../entities/i18n/dict";
import { Building2, Truck, Link as LinkIcon, ChevronRight } from "lucide-react";

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

  return (
    <div className="bg-card border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-rsg-surface/50 text-foreground/60 font-medium border-b border-border">
            <tr>
              <th className="px-6 py-4 font-mono text-[10px] uppercase tracking-widest">
                {t.lotNumber}
              </th>
              <th className="px-6 py-4">{t.materialType}</th>
              <th className="px-6 py-4">Quantity</th>
              <th className="px-6 py-4">{t.status}</th>
              <th className="px-6 py-4">{t.jobLink}</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {lots.map((lot) => (
              <tr
                key={lot.id}
                className="hover:bg-rsg-surface/30 transition-colors group cursor-pointer"
              >
                <td className="px-6 py-4 font-mono text-xs font-semibold text-primary">
                  {lot.id.toUpperCase()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground/90">
                      {lot.materialName}
                    </span>
                    <span className="text-[10px] text-foreground/40 font-mono uppercase">
                      {lot.thickness}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-xs">
                  {lot.slabs} SLABS
                </td>
                <td className="px-6 py-4">
                  {lot.status === "on-site" ? (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] border border-rsg-success/20 bg-rsg-success/10 text-rsg-success">
                      <Building2 className="w-3 h-3" />
                      {t.onSiteWarehouse}
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] border border-rsg-gold/20 bg-rsg-gold/10 text-rsg-gold">
                      <Truck className="w-3 h-3" />
                      {t.inTransit}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  {lot.job_legacy_id ? (
                    <div className="flex items-center gap-2 group-hover:text-primary transition-colors">
                      <LinkIcon className="w-3 h-3 text-foreground/40" />
                      <div className="flex flex-col">
                        <span className="font-mono text-[10px] leading-none mb-1">
                          {lot.job_legacy_id}
                        </span>
                        <span className="text-xs text-foreground/70 truncate max-w-[120px]">
                          {lot.job_client}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-[10px] text-foreground/30 font-mono italic">
                      UNASSIGNED STOCK
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <ChevronRight className="w-4 h-4 text-foreground/20 group-hover:text-primary transition-colors inline" />
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
