import { dict } from '../../../entities/i18n/dict';
import { Filter } from 'lucide-react';
import { useUserStore } from '../../../entities/user/store';
import { JobStatus } from '../../../entities/job';

const statusColors: Record<JobStatus, string> = {
  'verified': 'bg-rsg-success text-rsg-surface border-rsg-border',
  'in_progress': 'bg-rsg-gold text-rsg-surface border-rsg-border',
  'submitted_for_review': 'bg-rsg-gold/50 text-rsg-text border-rsg-border',
  'assigned': 'bg-rsg-surface text-rsg-text border-rsg-border',
  'pending': 'bg-rsg-warning text-rsg-surface border-rsg-border',
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
  toggleFilter: (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => void;
}) {
  const { language } = useUserStore();
  const t = dict[language].admin;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 text-xl font-medium tracking-tight">
        <Filter className="w-5 h-5 text-primary" />
        {t.filters}
      </div>

      <div className="bg-card border border-border p-5 flex flex-col gap-6">
        <div>
          <h3 className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest mb-3">Smart Presets</h3>
          <div className="grid grid-cols-1 gap-2">
            <button 
              onClick={() => setSelectedStatuses(['in_progress', 'assigned'])}
              className="px-4 py-2 text-xs font-bold uppercase tracking-widest border border-rsg-gold bg-rsg-gold/10 text-rsg-text hover:bg-rsg-gold/20 text-left flex justify-between items-center group"
            >
              Active
              <span className="w-2 h-2 rounded-none bg-rsg-gold animate-pulse group-hover:scale-125 transition-transform" />
            </button>
            <button 
              onClick={() => setSelectedStatuses(['submitted_for_review'])}
              className="px-4 py-2 text-xs font-bold uppercase tracking-widest border border-rsg-warning bg-rsg-warning/10 text-rsg-warning hover:bg-rsg-warning/20 text-left flex justify-between items-center group"
            >
              Review
              <span className="w-2 h-2 rounded-none bg-rsg-warning group-hover:scale-125 transition-transform" />
            </button>
            <button 
              onClick={() => setSelectedStatuses(['pending'])}
              className="px-4 py-2 text-xs font-bold uppercase tracking-widest border border-rsg-border/30 bg-rsg-surface text-rsg-text/60 hover:bg-rsg-surface/80 text-left flex justify-between items-center group"
            >
              Pending
              <span className="w-2 h-2 rounded-none bg-rsg-border/20 group-hover:scale-125 transition-transform" />
            </button>
            <button 
              onClick={() => setSelectedStatuses([])}
              className="px-4 py-1.5 text-[10px] font-mono text-foreground/40 hover:text-primary transition-colors text-right"
            >
              CLEAR ALL
            </button>
          </div>
        </div>

        <div className="h-px bg-border" />

        <div>
          <h3 className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest mb-3">{t.status}</h3>
          <div className="flex flex-col gap-2">
            {Object.keys(statusColors).map(statusKey => (
              <label key={statusKey} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="rounded-none border-border text-primary focus:ring-primary/20 bg-transparent" 
                  checked={selectedStatuses.includes(statusKey)}
                  onChange={() => toggleFilter(setSelectedStatuses, statusKey)}
                />
                <span className="text-sm text-foreground/70 group-hover:text-foreground transition-colors">
                  {dict[language].status[statusKey as keyof typeof dict.en.status]}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="h-px bg-border" />

        <div>
          <h3 className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest mb-3">{t.city}</h3>
          {isLoading ? (
            <div className="flex gap-2 flex-col">
              <div className="h-4 bg-rsg-gold/10 animate-pulse w-1/2" />
              <div className="h-4 bg-rsg-gold/10 animate-pulse w-2/3" />
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {cities.slice(0, 5).map(city => (
                <label key={city} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="rounded-none border-border text-primary focus:ring-primary/20 bg-transparent" 
                    checked={selectedCityFilters.includes(city!)}
                    onChange={() => toggleFilter(setSelectedCityFilters, city!)}
                  />
                  <span className="text-sm text-foreground/70 group-hover:text-foreground transition-colors">{city}</span>
                </label>
              ))}
              {cities.length === 0 && <span className="text-xs text-foreground/40 italic">No cities available</span>}
            </div>
          )}
        </div>

        <div className="h-px bg-border" />
        
        <div>
          <h3 className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest mb-3">{t.installer}</h3>
          {isLoading ? (
            <div className="flex gap-2 flex-col">
               <div className="h-4 bg-rsg-gold/10 animate-pulse w-3/4" />
               <div className="h-4 bg-rsg-gold/10 animate-pulse w-1/2" />
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="rounded-none border-border text-primary focus:ring-primary/20 bg-transparent" 
                  checked={selectedInstallerFilters.includes('unassigned')}
                  onChange={() => toggleFilter(setSelectedInstallerFilters, 'unassigned')}
                />
                <span className="text-sm text-foreground/70 group-hover:text-foreground transition-colors uppercase italic">
                  UNASSIGNED
                </span>
              </label>
              {installers.map(inst => (
                <label key={inst} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="rounded-none border-border text-primary focus:ring-primary/20 bg-transparent" 
                    checked={selectedInstallerFilters.includes(inst!)}
                    onChange={() => toggleFilter(setSelectedInstallerFilters, inst!)}
                  />
                  <span className="text-sm text-foreground/70 group-hover:text-foreground transition-colors uppercase">
                    {inst!.replace('installer_', '')}
                  </span>
                </label>
              ))}
              {installers.length === 0 && <span className="text-xs text-foreground/40 italic">No installers assigned</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
