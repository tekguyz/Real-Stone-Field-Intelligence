import { dict } from '../../../entities/i18n/dict';
import { Filter } from 'lucide-react';
import { useUserStore } from '../../../entities/user/store';

const statusColors = {
  'pending': 'text-foreground/40 bg-foreground/5 border-foreground/10',
  'assigned': 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  'in_progress': 'text-rsg-gold bg-rsg-gold/10 border-rsg-gold/20',
  'submitted_for_review': 'text-amber-950 bg-amber-500 border-amber-600 shadow-[0_0_10px_rgba(245,158,11,0.5)]',
  'verified': 'text-green-500 bg-green-500/10 border-green-500/20',
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
              className="px-4 py-2 text-xs font-bold uppercase tracking-widest border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 text-left flex justify-between items-center group"
            >
              Active
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse group-hover:scale-125 transition-transform" />
            </button>
            <button 
              onClick={() => setSelectedStatuses(['submitted_for_review'])}
              className="px-4 py-2 text-xs font-bold uppercase tracking-widest border border-amber-500/20 bg-amber-500/5 text-amber-600 hover:bg-amber-500/10 text-left flex justify-between items-center group"
            >
              Urgent
              <span className="w-2 h-2 rounded-full bg-amber-500 group-hover:scale-125 transition-transform" />
            </button>
            <button 
              onClick={() => setSelectedStatuses(['pending'])}
              className="px-4 py-2 text-xs font-bold uppercase tracking-widest border border-foreground/10 bg-foreground/5 text-foreground/60 hover:bg-foreground/10 text-left flex justify-between items-center group"
            >
              Pending
              <span className="w-2 h-2 rounded-full bg-foreground/20 group-hover:scale-125 transition-transform" />
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
