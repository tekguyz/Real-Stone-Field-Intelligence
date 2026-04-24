'use client';

import { useState } from 'react';
import { useUserStore } from '../../../entities/user/store';
import { dict } from '../../../entities/i18n/dict';
import { useJobs } from '../../../entities/job/api';
import { Job } from '../../../entities/job/types';
import { 
  MapPin, 
  Search, 
  Filter,
  Plus,
  X,
  HardHat,
  ChevronRight,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const statusColors = {
  'pending': 'text-foreground/40 bg-foreground/5 border-foreground/10',
  'assigned': 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  'in_progress': 'text-rsg-gold bg-rsg-gold/10 border-rsg-gold/20',
  'submitted_for_review': 'text-amber-950 bg-amber-500 border-amber-600 shadow-[0_0_10px_rgba(245,158,11,0.5)]',
  'verified': 'text-green-500 bg-green-500/10 border-green-500/20',
};

export default function JobsPage() {
  const { language } = useUserStore();
  const t = dict[language].admin;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [search, setSearch] = useState('');

  const { data: jobs, isLoading, error } = useJobs();
  const currentJobs = jobs || [];

  // Derived list of cities and installers for filters
  const cities = Array.from(new Set(currentJobs.map(j => j.location.city)));
  const installers = Array.from(new Set(currentJobs.map(j => j.installer_id).filter(Boolean)));

  const filteredJobs = currentJobs.filter(job => 
    job.client_name.toLowerCase().includes(search.toLowerCase()) || 
    job.legacy_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">{t.workOrderManagement}</h1>
          <p className="text-foreground/50 mt-1 font-mono text-sm leading-none">ALL ACTIVE & PENDING INSTALLATIONS</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 bg-foreground text-background px-5 py-3 font-black tracking-[0.2em] uppercase transition-opacity hover:opacity-90 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          {t.newProject}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column (75%) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" />
            <input 
              type="text" 
              placeholder="Search by WO# or Client..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-3 bg-card border border-border text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="bg-card border border-border min-h-[500px]">
             {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-foreground/50 gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-rsg-gold" />
                  <span className="text-sm font-mono tracking-widest uppercase">Loading Work Orders...</span>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-red-500 gap-4">
                  <AlertTriangle className="w-8 h-8" />
                  <span className="text-sm">Database Sync Error</span>
                </div>
              ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-rsg-surface/50 text-foreground/60 font-medium border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-mono text-[10px] uppercase tracking-widest">{t.legacyId}</th>
                    <th className="px-6 py-4">{t.client} & {t.community}</th>
                    <th className="px-6 py-4">{t.scope}</th>
                    <th className="px-6 py-4">{t.installer}</th>
                    <th className="px-6 py-4">{t.status}</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredJobs.map(job => (
                    <tr key={job.id} className="hover:bg-rsg-surface/30 transition-colors group cursor-pointer">
                      <td className="px-6 py-4 font-mono text-xs text-foreground/50">{job.legacy_id}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground/90">{job.client_name}</span>
                          <div className="flex items-center gap-1 text-[10px] text-foreground/40 font-mono italic uppercase mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {job.location.community || job.location.city}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-foreground/80">{job.slab_info.slabs}x Slabs</span>
                          <span className="text-[10px] text-foreground/40 font-mono uppercase">{job.slab_info.material}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {job.installer_id ? (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-primary/20 flex items-center justify-center text-primary">
                              <HardHat className="w-3 h-3" />
                            </div>
                            <span className="text-sm font-medium">{job.installer_id.replace('installer_', '').toUpperCase()}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-foreground/40 font-mono italic">UNASSIGNED</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] border ${statusColors[job.status]}`}>
                          <div className={`w-1 h-1 ${statusColors[job.status].split(' ')[0].replace('text-', 'bg-')}`} />
                          {dict[language].status[job.status]}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <ChevronRight className="w-4 h-4 text-foreground/20 group-hover:text-primary transition-colors inline" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
            {!isLoading && !error && filteredJobs.length === 0 && (
              <div className="p-8 text-center text-foreground/50 text-sm">
                No matching work orders found.
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Filters (25%) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="flex items-center gap-2 text-xl font-medium tracking-tight">
            <Filter className="w-5 h-5 text-primary" />
            {t.filters}
          </div>

          <div className="bg-card border border-border p-5 flex flex-col gap-6">
            <div>
              <h3 className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest mb-3">{t.status}</h3>
              <div className="flex flex-col gap-2">
                {Object.keys(statusColors).map(statusKey => (
                  <label key={statusKey} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="rounded-none border-border text-primary focus:ring-primary/20 bg-transparent" />
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
                      <input type="checkbox" className="rounded-none border-border text-primary focus:ring-primary/20 bg-transparent" />
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
                  {installers.map(inst => (
                    <label key={inst} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="rounded-none border-border text-primary focus:ring-primary/20 bg-transparent" />
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
      </div>

      {/* Slide-over Form */}
      <AnimatePresence>
        {isFormOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="fixed inset-0 bg-background/40 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-border z-[110] flex flex-col"
            >
              <div className="p-6 border-b border-border flex justify-between items-center bg-surface/30">
                <h2 className="text-xl font-black tracking-tight uppercase">{t.createJob}</h2>
                <button 
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 hover:text-primary text-foreground/40 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                <div>
                  <label className="block text-xs font-mono text-foreground/50 uppercase mb-2">{t.client}</label>
                  <input type="text" className="w-full bg-surface/50 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" placeholder="Client Name" />
                </div>
                
                <div>
                  <label className="block text-[10px] font-mono text-foreground/50 uppercase tracking-[0.2em] mb-2">{t.location} Address</label>
                  <input type="text" className="w-full bg-surface/50 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" placeholder="123 Ocean Blvd" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-foreground/50 uppercase tracking-[0.2em] mb-2">{t.city}</label>
                    <input type="text" className="w-full bg-surface/50 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" placeholder="e.g. Jupiter" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-foreground/50 uppercase tracking-[0.2em] mb-2">Zip</label>
                    <input type="text" className="w-full bg-surface/50 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" placeholder="33458" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-foreground/50 uppercase tracking-[0.2em] mb-2">{t.material}</label>
                  <input type="text" className="w-full bg-surface/50 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" placeholder="Material Name" />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-foreground/50 uppercase tracking-[0.2em] mb-2">{t.installDate}</label>
                  <input type="date" className="w-full bg-surface/50 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-foreground/50 uppercase tracking-[0.2em] mb-2">{t.logistics} Notes</label>
                  <textarea rows={4} className="w-full bg-surface/50 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none transition-colors" placeholder="Gate codes, elevator restrictions, etc..." />
                </div>
              </div>

              <div className="p-6 border-t border-border bg-surface/30">
                <button 
                  onClick={() => setIsFormOpen(false)}
                  className="w-full bg-foreground text-background py-4 font-black uppercase tracking-[0.2em] transition-opacity hover:opacity-90 active:scale-[0.98]"
                >
                  Create Work Order
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
