import { dict } from "../../../entities/i18n/dict";
import { Filter } from "lucide-react";
import { useUserStore } from "../../../entities/user/store";
import { JobStatus } from "../../../entities/job";

const statusColors: Record<JobStatus, string> = {
  verified: "bg-rsg-success text-white",
  in_progress: "bg-rsg-gold text-black",
  submitted_for_review: "bg-rsg-warning text-black",
  assigned: "bg-foreground text-background",
  pending: "bg-zinc-500 text-white",
};

export function AdminJobsFilters({
  isLoading,
  selectedStatuses,
  setSelectedStatuses,
  selectedCityFilters,
  setSelectedCityFilters,
  selectedInstallerFilters,
  setSelectedInstallerFilters,
  cities,
  installers,
  toggleFilter,
}: {
  isLoading: boolean;
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
}) {
  const { language } = useUserStore();
  const t = dict[language].admin;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 text-xl font-medium tracking-tight">
        <Filter className="w-5 h-5 text-primary" />
        {t.filters}
      </div>

      <div className="bg-card border border-border p-4 flex flex-col gap-4">
        <div>
          <h3 className="text-[9px] font-mono text-foreground/40 uppercase tracking-widest mb-2 font-black">
            {t.smartPresets}
          </h3>
          <div className="grid grid-cols-1 gap-1.5">
            <button
              onClick={() => setSelectedStatuses(["assigned", "in_progress"])}
              className="px-3 py-2 text-[10px] font-black uppercase tracking-widest border border-rsg-gold bg-rsg-gold/5 text-rsg-text/80 hover:bg-rsg-gold/15 text-left transition-colors"
            >
              {dict[language].status.in_progress}
            </button>
            <button
              onClick={() => setSelectedStatuses(["submitted_for_review"])}
              className="px-3 py-2 text-[10px] font-black uppercase tracking-widest border border-rsg-warning bg-rsg-warning/5 text-rsg-warning hover:bg-rsg-warning/15 text-left transition-colors"
            >
              {dict[language].status.submitted_for_review}
            </button>
            <button
              onClick={() => setSelectedStatuses(["pending"])}
              className="px-3 py-2 text-[10px] font-black uppercase tracking-widest border border-border/30 bg-rsg-surface text-rsg-text/40 hover:bg-rsg-surface/80 text-left transition-colors"
            >
              {dict[language].status.pending}
            </button>
            <button
              onClick={() => setSelectedStatuses([])}
              className="px-4 py-1 text-[9px] font-mono text-foreground/30 hover:text-primary transition-colors text-right font-black tracking-widest uppercase mt-1"
            >
              {t.clearAll}
            </button>
          </div>
        </div>

        <div className="h-px bg-border/50" />

        <div>
          <h3 className="text-[9px] font-mono text-foreground/40 uppercase tracking-widest mb-2 font-black">
            {t.status}
          </h3>
          <div className="flex flex-col gap-0.5">
            {Object.keys(statusColors).map((statusKey) => (
              <label
                key={statusKey}
                className="flex items-center gap-3 cursor-pointer group py-1.5"
              >
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded-none border-border text-primary focus:ring-primary/20 bg-transparent peer transition-all"
                    checked={selectedStatuses.includes(statusKey)}
                    onChange={() => toggleFilter(setSelectedStatuses, statusKey)}
                  />
                  <div className={`absolute inset-0 scale-75 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none ${
                    statusKey === 'pending' ? 'bg-[oklch(var(--status-pending))]' :
                    statusKey === 'submitted_for_review' ? 'bg-[oklch(var(--status-review))]' :
                    statusKey === 'in_progress' ? 'bg-[oklch(var(--status-active))]' :
                    statusKey === 'verified' ? 'bg-[oklch(var(--status-verified))]' :
                    'bg-[oklch(var(--status-assigned))]'
                  }`} />
                </div>
                <span className="text-xs text-foreground/60 group-hover:text-foreground transition-colors uppercase font-mono">
                  {
                    dict[language].status[
                      statusKey as keyof typeof dict.en.status
                    ]
                  }
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="h-px bg-border/50" />

        <div>
          <h3 className="text-[9px] font-mono text-foreground/40 uppercase tracking-widest mb-2 font-black">
            {t.city}
          </h3>
          {isLoading ? (
            <div className="flex gap-2 flex-col">
              <div className="h-3 bg-rsg-gold/5 animate-pulse w-1/2" />
              <div className="h-3 bg-rsg-gold/5 animate-pulse w-2/3" />
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {cities.slice(0, 5).map((city) => (
                <label
                  key={city}
                  className="flex items-center gap-3 cursor-pointer group py-1.5"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded-none border-border text-primary focus:ring-primary/20 bg-transparent transition-all"
                    checked={selectedCityFilters.includes(city!)}
                    onChange={() => toggleFilter(setSelectedCityFilters, city!)}
                  />
                  <span className="text-xs text-foreground/60 group-hover:text-foreground transition-colors uppercase font-mono">
                    {city}
                  </span>
                </label>
              ))}
              {cities.length === 0 && (
                <span className="text-[10px] text-foreground/30 italic font-mono uppercase">
                  {t.noCities}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="h-px bg-border/50" />

        <div>
          <h3 className="text-[9px] font-mono text-foreground/40 uppercase tracking-widest mb-2 font-black">
            {t.installer}
          </h3>
          {isLoading ? (
            <div className="flex gap-2 flex-col">
              <div className="h-3 bg-rsg-gold/5 animate-pulse w-3/4" />
              <div className="h-3 bg-rsg-gold/5 animate-pulse w-1/2" />
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              <label className="flex items-center gap-3 cursor-pointer group py-1.5">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded-none border-border text-primary focus:ring-primary/20 bg-transparent transition-all"
                  checked={selectedInstallerFilters.includes("unassigned")}
                  onChange={() =>
                    toggleFilter(setSelectedInstallerFilters, "unassigned")
                  }
                />
                <span className="text-xs text-foreground/60 group-hover:text-foreground transition-colors uppercase font-mono italic">
                  {t.unassigned}
                </span>
              </label>
              {installers.map((inst) => (
                <label
                  key={inst}
                  className="flex items-center gap-3 cursor-pointer group py-1.5"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded-none border-border text-primary focus:ring-primary/20 bg-transparent transition-all"
                    checked={selectedInstallerFilters.includes(inst!)}
                    onChange={() =>
                      toggleFilter(setSelectedInstallerFilters, inst!)
                    }
                  />
                  <span className="text-xs text-foreground/60 group-hover:text-foreground transition-colors uppercase font-mono">
                    {inst!.replace("installer_", "")}
                  </span>
                </label>
              ))}
              {installers.length === 0 && (
                <span className="text-[10px] text-foreground/30 italic font-mono uppercase">
                  {t.noInstallers}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
