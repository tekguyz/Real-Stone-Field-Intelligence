'use client';

import { useState } from 'react';
import { useUserStore } from '../../../entities/user/store';
import { dict } from '../../../entities/i18n/dict';
import { useJobs, useUpdateJobStatus } from '../../../entities/job/api';
import { Job } from '../../../entities/job/types';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  PlayCircle, 
  MapPin, 
  HardHat, 
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  X,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const statusIcons = {
  'pending': Clock,
  'assigned': AlertCircle,
  'in_progress': PlayCircle,
  'submitted_for_review': AlertTriangle,
  'verified': CheckCircle2,
};

const statusColors = {
  'pending': 'text-foreground/40 bg-foreground/5 border-foreground/10',
  'assigned': 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  'in_progress': 'text-rsg-gold bg-rsg-gold/10 border-rsg-gold/20',
  'submitted_for_review': 'text-amber-950 bg-amber-500 border-amber-600 shadow-[0_0_10px_rgba(245,158,11,0.5)]', // Gatekeeper state
  'verified': 'text-green-500 bg-green-500/10 border-green-500/20',
};

export default function CommandCenterPage() {
  const { language } = useUserStore();
  const t = dict[language].admin;
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const { data: jobs, isLoading, error } = useJobs();
  const updateStatus = useUpdateJobStatus();

  const currentJobs = jobs || [];

  const handleVerify = async (jobId: string) => {
    await updateStatus.mutateAsync({ jobId, status: 'verified' });
    setSelectedJob(null);
  };

  const stats = {
    pending: currentJobs.filter(j => j.status === 'pending').length,
    active: currentJobs.filter(j => j.status === 'in_progress' || j.status === 'assigned').length,
    review: currentJobs.filter(j => j.status === 'submitted_for_review').length,
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">{t.commandCenter}</h1>
          <p className="text-foreground/50 mt-1 font-mono text-sm leading-none">REAL-TIME OPS CONTROL PANEL</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Live Pipeline (75%) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-medium tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              {t.livePipeline}
            </h2>
            <span className="text-xs font-mono text-foreground/40">{currentJobs.length} TOTAL RECORDS</span>
          </div>

          <div className="bg-card border border-border min-h-[400px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-foreground/50 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-rsg-gold" />
                <span className="text-sm font-mono tracking-widest uppercase">Syncing Pipeline...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-red-500 gap-4">
                <AlertTriangle className="w-8 h-8" />
                <span className="text-sm">Database Sync Error</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-rsg-surface/50 text-foreground/60 font-medium border-b border-border">
                    <tr>
                      <th className="px-6 py-4 font-mono text-[10px] uppercase tracking-widest">{t.legacyId}</th>
                      <th className="px-6 py-4">{t.client}</th>
                      <th className="px-6 py-4">{t.material}</th>
                      <th className="px-6 py-4">{t.status}</th>
                      <th className="px-6 py-4">{t.installDate}</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {currentJobs.map(job => (
                      <tr 
                        key={job.id} 
                        className="hover:bg-rsg-surface/30 transition-colors cursor-pointer group"
                        onClick={() => setSelectedJob(job)}
                      >
                        <td className="px-6 py-4 font-mono text-xs text-foreground/50">{job.legacy_id}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground/90">{job.client_name}</span>
                            <span className="text-[10px] text-foreground/40 font-mono italic uppercase">{job.location.community || job.location.city}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-foreground/80">{job.slab_info.material}</td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] border ${statusColors[job.status]}`}>
                            <div className={`w-1 h-1 ${statusColors[job.status].split(' ')[0].replace('text-', 'bg-')}`} />
                            {dict[language].status[job.status]}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-foreground/70 font-mono text-xs">
                          {new Date(job.install_date).toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES', { month: 'short', day: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <ChevronRight className="w-4 h-4 text-foreground/20 group-hover:text-primary transition-colors" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {currentJobs.length === 0 && (
                  <div className="p-8 text-center text-foreground/50 text-sm">
                    No active work orders.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Metrics & Alerts (25%) */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          {/* Quick Metrics */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-medium tracking-tight">{t.metrics}</h2>
            
            {isLoading ? (
               <div className="grid grid-cols-1 gap-3">
                 {[1, 2, 3].map(i => (
                   <div key={i} className="bg-rsg-gold/5 animate-pulse h-24 border-y border-r border-border min-w-[200px]" />
                 ))}
               </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {[
                  { label: t.pendingCount, value: stats.pending, color: 'border-foreground/10', sub: 'BACKLOG' },
                  { label: t.activeCount, value: stats.active, color: 'border-primary/30', sub: 'ON FIELD' },
                  { label: t.reviewCount, value: stats.review, color: 'border-amber-500/30', sub: 'ACTION REQ' }
                ].map(stat => (
                  <div key={stat.label} className={`bg-card border-l-8 ${stat.color} p-4 border-y border-r border-border transition-colors hover:bg-surface/50`}>
                    <p className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.2em]">{stat.sub}</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                      <span className="text-xs font-medium text-foreground/60">{stat.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Priority Alerts */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-medium tracking-tight">{t.alerts}</h2>
            {isLoading ? (
              <div className="grid grid-cols-1 gap-3">
                {[1, 2].map(i => (
                  <div key={i} className="bg-primary/5 animate-pulse h-28 border border-border min-w-[200px]" />
                ))}
              </div>
            ) : (
            <div className="flex flex-col gap-3">
              {currentJobs.filter(j => j.status === 'submitted_for_review').slice(0, 3).map(job => (
                <div 
                  key={`alert-${job.id}`} 
                  onClick={() => setSelectedJob(job)}
                  className="bg-primary/5 border border-primary/20 p-4 border-l-8 cursor-pointer hover:bg-primary/10 transition-colors group"
                >
                  <div className="flex items-center gap-2 text-amber-600 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Review required</span>
                  </div>
                  <p className="text-sm font-semibold group-hover:text-primary">{job.client_name}</p>
                  <p className="text-[10px] font-mono text-foreground/40 mt-1 uppercase leading-snug truncate">WO: {job.legacy_id} • {job.slab_info.material}</p>
                </div>
              ))}
              {stats.review === 0 && (
                <div className="p-4 border border-dashed border-border text-center">
                  <p className="text-xs text-foreground/50">No priority alerts.</p>
                </div>
              )}
            </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Drawer */}
      <AnimatePresence>
        {selectedJob && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJob(null)}
              className="fixed inset-0 bg-background/40 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-border z-[110] flex flex-col pt-10"
            >
              <div className="p-6 border-b border-border flex justify-between items-start bg-surface/30">
                <div>
                  <span className="font-mono text-[10px] text-primary mb-1 block uppercase tracking-[0.2em]">{selectedJob.legacy_id}</span>
                  <h2 className="text-2xl font-black tracking-tight">{selectedJob.client_name}</h2>
                </div>
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="p-2 hover:text-primary text-foreground/40 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
                {/* Location */}
                <section>
                  <h3 className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.2em] mb-3">{t.location}</h3>
                  <div className="bg-surface/50 p-4 border border-border">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground/90">{selectedJob.location.address}</p>
                        <p className="text-sm text-foreground/60">{selectedJob.location.city}, {selectedJob.location.state} {selectedJob.location.zip}</p>
                        {selectedJob.location.community && (
                          <div className="mt-2 text-[11px] bg-primary/10 text-primary px-2 py-0.5 inline-block font-bold">
                            {selectedJob.location.community.toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Slabs */}
                <section>
                  <h3 className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.2em] mb-3">{t.material}</h3>
                  <div className="bg-surface/50 p-4 border border-border flex justify-between items-center">
                    <div>
                      <p className="font-bold text-foreground/90">{selectedJob.slab_info.material}</p>
                      <p className="text-sm text-foreground/60 font-mono tracking-[0.1em]">{selectedJob.slab_info.finish} • {selectedJob.slab_info.thickness}</p>
                    </div>
                    <div className="text-center">
                      <span className="text-2xl font-black text-primary">{selectedJob.slab_info.slabs}</span>
                      <p className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.2em]">Slabs</p>
                    </div>
                  </div>
                </section>

                {/* Logistics */}
                <section>
                  <h3 className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.2em] mb-3">{t.logistics}</h3>
                  <div className="bg-amber-500/5 border border-amber-500/20 p-4">
                    <p className="text-sm text-foreground/80 leading-relaxed font-bold">
                      "{selectedJob.logistics_notes || 'No special logistics recorded for this work order.'}"
                    </p>
                  </div>
                </section>

                {/* Installer */}
                {selectedJob.installer_id && (
                  <section>
                    <h3 className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.2em] mb-3">Field Team</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 border border-primary/20 bg-primary/10 flex items-center justify-center text-primary">
                        <HardHat className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">{selectedJob.installer_id.replace('installer_', '').toUpperCase()}</p>
                        <p className="text-xs text-foreground/50 font-mono">Lead Installer</p>
                      </div>
                    </div>
                  </section>
                )}
              </div>

              <div className="p-6 border-t border-border bg-surface/30 flex flex-col gap-3">
                {selectedJob.status === 'submitted_for_review' && (
                  <button 
                    onClick={() => handleVerify(selectedJob.id)}
                    disabled={updateStatus.isPending}
                    className="w-full bg-green-600 text-white py-4 font-black tracking-[0.2em] uppercase hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    {updateStatus.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-5 h-5" />
                    )}
                    Verify & Close Work Order
                  </button>
                )}
                <button className="w-full border border-border bg-foreground/[0.03] text-foreground hover:bg-foreground/10 py-4 font-black tracking-[0.2em] uppercase transition-colors">
                  Open Full Record
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
