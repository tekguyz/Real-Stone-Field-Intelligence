'use client';

import { useUserStore } from '../../../entities/user/store';
import { dict } from '../../../entities/i18n/dict';
import { summarizeJobScope } from '../../../shared/lib/utils';
import { useCommandCenterController } from '../../../features/admin-jobs/hooks/useCommandCenterController';
import { CommandCenterTable } from '../../../features/admin-jobs/ui/CommandCenterTable';
import { AdminJobDrawer } from '../../../features/admin-jobs/ui/AdminJobDrawer';
import { TrendingUp, AlertTriangle, Database } from 'lucide-react';
import { ImportModal } from '../../../features/admin-import/ui/ImportModal';
import { useState } from 'react';

export default function CommandCenterPage() {
  const { language } = useUserStore();
  const t = dict[language].admin;
  const [isImportOpen, setIsImportOpen] = useState(false);
  
  const {
    selectedJob,
    setSelectedJob,
    currentJobs,
    isLoading,
    error,
    handleVerify,
    handleUpdateInstaller,
    isVerifying,
    stats
  } = useCommandCenterController();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">{t.commandCenter}</h1>
          <p className="text-foreground/50 mt-1 font-mono text-sm leading-none">REAL-TIME OPS CONTROL PANEL</p>
        </div>
        <button 
          onClick={() => setIsImportOpen(true)}
          className="flex items-center gap-2 bg-foreground text-background px-5 py-3 font-black tracking-[0.2em] uppercase transition-opacity hover:opacity-90 active:scale-[0.98] border border-primary border-r-4 border-b-4 shadow-sm"
        >
          <Database className="w-4 h-4 text-rsg-gold" />
          IMPORT DATA
        </button>
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

          <CommandCenterTable 
            jobs={currentJobs} 
            isLoading={isLoading} 
            error={error} 
            onJobSelect={setSelectedJob}
          />
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
                  <p className="text-[10px] font-mono text-foreground/40 mt-1 uppercase leading-snug truncate">WO: {job.legacy_id} • {summarizeJobScope(job.stoneapp_parts)}</p>
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

      <AdminJobDrawer 
        selectedJob={selectedJob} 
        onClose={() => setSelectedJob(null)} 
        onUpdateInstaller={handleUpdateInstaller}
        onVerifyJob={handleVerify}
        isVerifying={isVerifying}
      />
      
      <ImportModal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} />
    </div>
  );
}

