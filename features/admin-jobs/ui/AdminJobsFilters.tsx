import { dict } from "../../../entities/i18n/dict";
import { Filter, ChevronDown, ChevronUp, Search, X } from "lucide-react";
import { useUserStore } from "../../../entities/user/store";
import { JOB_STATUSES, STATUS_SORT_ORDER, JobStatus } from "@/lib/constants/statuses";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { useState, useMemo } from "react";

import { Job } from "../../../entities/job/types";

function FilterAccordion({ title, count, defaultOpen = false, children }: { title: string, count?: number, defaultOpen?: boolean, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/50  last:border-0 py-1">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center justify-between w-full text-[11px] font-mono uppercase tracking-widest font-black text-foreground/70 hover:text-foreground transition-colors group"
      >
        <span>{title} {count !== undefined && count > 0 && `(${count})`}</span>
        <span className="text-foreground/30 group-hover:text-primary transition-colors">
          {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </span>
      </button>
      {isOpen && (
        <div className="pt-2 pb-1 flex flex-col gap-1.5">
          {children}
        </div>
      )}
    </div>
  );
}

export function AdminJobsFilters({
  isLoading,
  preset,
  setPreset,
  selectedStatuses,
  setSelectedStatuses,
  selectedCityFilters,
  setSelectedCityFilters,
  selectedInstallerFilters,
  setSelectedInstallerFilters,
  cities,
  installers,
  toggleFilter,
  allJobs,
}: {
  isLoading: boolean;
  preset: string | null;
  setPreset: React.Dispatch<React.SetStateAction<string | null>>;
  selectedStatuses: string[];
  setSelectedStatuses: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCityFilters: string[];
  setSelectedCityFilters: React.Dispatch<React.SetStateAction<string[]>>;
  selectedInstallerFilters: string[];
  setSelectedInstallerFilters: React.Dispatch<React.SetStateAction<string[]>>;
  cities: string[];
  installers: string[];
  toggleFilter: (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    value: string,
  ) => void;
  allJobs: Job[];
}) {
  const { language } = useUserStore();
  const t = dict[language].admin;

  const [installerSearch, setInstallerSearch] = useState("");

  const counts = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return {
      inProgress: allJobs.filter(j => j.status === JOB_STATUSES.ACTIVE).length,
      needsReview: allJobs.filter(j => j.status === JOB_STATUSES.REVIEW).length,
      unassigned: allJobs.filter(j => !j.installer_id).length,
      today: allJobs.filter(j => (j.scheduled_arrival || j.scheduled_date)?.split("T")[0] === today).length
    };
  }, [allJobs]);
  
  const handlePreset = (newPreset: string) => {
    if (preset === newPreset) {
      setPreset(null);
    } else {
      setPreset(newPreset);
      // Clear manual filters when selecting a preset to avoid confusion
      setSelectedStatuses([]);
      setSelectedCityFilters([]);
      setSelectedInstallerFilters([]);
    }
  };

  const clearAll = () => {
    setPreset(null);
    setSelectedStatuses([]);
    setSelectedCityFilters([]);
    setSelectedInstallerFilters([]);
    setInstallerSearch("");
  };

  const activeFiltersCount = selectedStatuses.length + selectedCityFilters.length + selectedInstallerFilters.length + (preset ? 1 : 0);

  const statusOptions = Object.values(JOB_STATUSES).sort((a, b) => STATUS_SORT_ORDER[a] - STATUS_SORT_ORDER[b]);

  const filteredInstallers = installers.filter(inst => inst && inst.toLowerCase().includes(installerSearch.toLowerCase()));

  return (
    <div className="flex flex-col gap-2 sticky overflow-y-auto" style={{ top: "var(--header-height, 4rem)", height: "calc(100vh - var(--header-height, 4rem))" }}>
      <div className="flex items-center justify-between pb-1 border-b border-border">
        <div className="flex items-center gap-2 text-xl font-medium tracking-tight">
          <Filter className="w-5 h-5 text-primary" />
          {t.filters}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAll}
            className="text-[9px] font-mono text-foreground/40 hover:text-rsg-gold transition-colors font-black tracking-widest uppercase flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            {t.clearAll}
          </button>
        )}
      </div>

      <div className="bg-card border border-border p-3 flex flex-col gap-0">
        
        <FilterAccordion title={t.smartPresets} defaultOpen={true}>
           <div className="grid grid-cols-1 gap-1.5">
              {[
                { label: "In Progress", value: "In Progress", count: counts.inProgress, color: "border-status-active-bg bg-status-active-bg/5 text-status-active-text hover:bg-status-active-bg/15" },
                { label: "Needs Review", value: "Needs Review", count: counts.needsReview, color: "border-status-review-bg bg-status-review-bg/5 text-status-review-text hover:bg-status-review-bg/15" },
                { label: "Unassigned", value: "Unassigned", count: counts.unassigned, color: "border-border/50 bg-surface text-foreground/60 hover:bg-surface/80" },
                { label: "Today", value: "Today", count: counts.today, color: "border-primary/30 bg-primary/5 text-primary hover:bg-primary/10" }
              ].map(p => (
                <button
                  key={p.value}
                  onClick={() => handlePreset(p.value)}
                  className={`px-3 py-2 text-[10px] font-black uppercase tracking-widest border text-left transition-colors flex items-center justify-between ${preset === p.value ? "ring-1 ring-primary " + p.color : "border-border/30 bg-surface/30 text-foreground/50 hover:bg-surface"}`}
                >
                  <span>{p.label} <span className="ml-1 opacity-40">({p.count})</span></span>
                  {preset === p.value && <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                </button>
              ))}
           </div>
        </FilterAccordion>

        <FilterAccordion title={t.status} count={selectedStatuses.length} defaultOpen={true}>
            {statusOptions.map((statusKey) => (
              <label
                key={statusKey}
                className="flex items-center gap-3 cursor-pointer group py-1"
              >
                <div className="relative flex items-center shrink-0">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded-none border-border text-primary focus:ring-primary/20 bg-transparent peer transition-all"
                    checked={selectedStatuses.includes(statusKey)}
                    onChange={() => {
                       setPreset(null);
                       toggleFilter(setSelectedStatuses, statusKey);
                    }}
                  />
                  <div className="absolute inset-0 scale-75 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none bg-primary" />
                </div>
                <StatusBadge status={statusKey as JobStatus} className="scale-[0.8] origin-left" />
              </label>
            ))}
        </FilterAccordion>

        <FilterAccordion title={t.city} count={selectedCityFilters.length}>
          {isLoading ? (
            <div className="flex gap-2 flex-col">
              <div className="h-3 bg-rsg-gold/5 animate-pulse w-1/2" />
            </div>
          ) : (
            <>
              {cities.map((city) => (
                <label
                  key={city}
                  className="flex items-center gap-3 cursor-pointer group py-1"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded-none border-border text-primary focus:ring-primary/20 bg-transparent transition-all shrink-0"
                    checked={selectedCityFilters.includes(city!)}
                    onChange={() => { setPreset(null); toggleFilter(setSelectedCityFilters, city!); }}
                  />
                  <span className="text-xs text-foreground/70 group-hover:text-foreground transition-colors uppercase font-mono truncate">
                    {city}
                  </span>
                </label>
              ))}
              {cities.length === 0 && (
                <span className="text-[10px] text-foreground/30 italic font-mono uppercase">
                  {t.noCities}
                </span>
              )}
            </>
          )}
        </FilterAccordion>

        <FilterAccordion title={t.installer} count={selectedInstallerFilters.length}>
          {isLoading ? (
            <div className="flex gap-2 flex-col">
              <div className="h-3 bg-rsg-gold/5 animate-pulse w-3/4" />
            </div>
          ) : (
            <>
              {installers.length > 6 && (
                <div className="relative mb-2">
                   <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-foreground/40" />
                   <input 
                      type="text" 
                      placeholder="Search..."
                      value={installerSearch}
                      onChange={e => setInstallerSearch(e.target.value)}
                      className="w-full bg-background border border-border pl-7 pr-2 py-1 text-[10px] font-mono focus:outline-none focus:border-primary"
                   />
                </div>
              )}
              
              {(!installerSearch || "unassigned".includes(installerSearch.toLowerCase())) && (
                <label className="flex items-center gap-3 cursor-pointer group py-1">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded-none border-border text-primary focus:ring-primary/20 bg-transparent transition-all shrink-0"
                    checked={selectedInstallerFilters.includes("unassigned")}
                    onChange={() => {
                      setPreset(null);
                      toggleFilter(setSelectedInstallerFilters, "unassigned");
                    }}
                  />
                  <span className="text-xs text-foreground/60 group-hover:text-foreground transition-colors uppercase font-mono italic">
                    {t.unassigned}
                  </span>
                </label>
              )}

              {filteredInstallers.sort().map((inst) => (
                <label
                  key={inst}
                  className="flex items-center gap-3 cursor-pointer group py-1"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded-none border-border text-primary focus:ring-primary/20 bg-transparent transition-all shrink-0"
                    checked={selectedInstallerFilters.includes(inst!)}
                    onChange={() => {
                      setPreset(null);
                      toggleFilter(setSelectedInstallerFilters, inst!);
                    }}
                  />
                  <span className="text-xs text-foreground/70 group-hover:text-foreground transition-colors uppercase font-mono truncate">
                    {inst!.replace("installer_", "")}
                  </span>
                </label>
              ))}
              {installers.length === 0 && (
                <span className="text-[10px] text-foreground/30 italic font-mono uppercase">
                  {t.noInstallers}
                </span>
              )}
            </>
          )}
        </FilterAccordion>

      </div>
    </div>
  );
}
