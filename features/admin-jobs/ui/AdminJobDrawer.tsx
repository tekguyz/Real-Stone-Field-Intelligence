import { Job, JobStatusBadge } from '../../../entities/job';
import { dict } from '../../../entities/i18n/dict';
import { X, MapPin, Loader2, ShieldCheck, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUserStore } from '../../../entities/user/store';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export function AdminJobDrawer({
  selectedJob,
  onClose,
  onUpdateInstaller,
  onVerifyJob,
  isVerifying = false
}: {
  selectedJob: Job | null;
  onClose: () => void;
  onUpdateInstaller: (jobId: string, installerId: string) => void;
  onVerifyJob?: (jobId: string) => void;
  isVerifying?: boolean;
}) {
  const { language, isDevMode } = useUserStore();
  const t = dict[language].admin;
  const [localCaptures, setLocalCaptures] = useState<{photos: string[], proofs?: any[], signature: string | null}>({photos: [], proofs: [], signature: null});

  useEffect(() => {
    if (!selectedJob) return;

    const loadCaptures = () => {
      if (isDevMode) {
        const stored = sessionStorage.getItem(`field_captures_${selectedJob.id}`);
        if (stored) {
          setLocalCaptures(JSON.parse(stored));
        } else {
          setLocalCaptures({photos: [], proofs: [], signature: null});
        }
      }
    };

    loadCaptures();
    window.addEventListener('field_capture_update', loadCaptures);
    return () => window.removeEventListener('field_capture_update', loadCaptures);
  }, [selectedJob, isDevMode]);

  const allPhotos = Array.from(new Set([...(selectedJob?.photos || []), ...localCaptures.photos]));
  // Fallback map pin logic using generated proofs or stored captured_proof
  const getProofMetadata = (url: string) => {
    const fromJob = selectedJob?.captured_proof?.find(p => p.url === url);
    if (fromJob) return fromJob;
    const fromLocal = localCaptures.proofs?.find(p => p.url === url);
    if (fromLocal) return fromLocal;
    return null;
  };

  const activeSignature = selectedJob?.signature_url || localCaptures.signature;

  const displayId = selectedJob?.wo_number || selectedJob?.legacy_id?.substring(0,8) || '';
  const headerWoId = displayId.startsWith('WO-') ? displayId : 'WO-' + displayId;

  return (
    <AnimatePresence>
      {selectedJob && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/40 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-card border-l border-border z-[110] flex flex-col"
          >
            <div className="p-4 md:p-6 border-b border-border flex justify-between items-start bg-surface/30 pb-4">
              <div className="flex flex-col gap-1">
                 <span className="font-mono text-[10px] text-foreground/40 block uppercase tracking-[0.2em]">{headerWoId}</span>
                 <div className="flex items-center gap-3">
                   <h2 className="text-lg font-black tracking-tight uppercase leading-none">{selectedJob.client_name}</h2>
                   <JobStatusBadge status={selectedJob.status} className="w-fit scale-90 origin-left" />
                 </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-foreground/5 text-foreground/40 hover:text-foreground transition-colors"
                title="Close Drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-8">
              {/* Logistics Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                   <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest">Arrival Time</span>
                   <div className="bg-surface/50 px-3 py-2 border border-border flex items-center justify-between h-[42px]">
                      <span className="text-xs font-black text-foreground/90 uppercase tracking-tight truncate">
                        {selectedJob.scheduled_arrival || selectedJob.scheduled_date ? (
                          new Intl.DateTimeFormat('en-US', { 
                            weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true 
                          }).format(new Date(selectedJob.scheduled_arrival || selectedJob.scheduled_date || '')).toUpperCase()
                        ) : 'AWAITING'}
                      </span>
                   </div>
                </div>
                <div className="flex flex-col gap-2">
                   <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest">Installer</span>
                   <select 
                     className={`bg-card w-full border border-border px-3 py-2 text-xs font-black rounded-none focus:outline-none focus:border-rsg-gold font-mono uppercase text-foreground appearance-none h-[42px] ${selectedJob.status === 'verified' ? 'opacity-50 cursor-not-allowed' : ''}`}
                     value={selectedJob.installer_id || 'unassigned'}
                     onChange={(e) => onUpdateInstaller(selectedJob.id, e.target.value)}
                     disabled={selectedJob.status === 'verified'}
                     style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                   >
                     <option value="unassigned" className="bg-background text-foreground py-2">UNASSIGNED</option>
                     <option value="installer_juan" className="bg-background text-foreground py-2">JUAN</option>
                     <option value="installer_carlos" className="bg-background text-foreground py-2">CARLOS</option>
                   </select>
                </div>
              </div>

              {/* Site info */}
              <div className="flex flex-col gap-2">
                 <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest">Site Information</span>
                 <div className="bg-surface/50 p-4 border border-border">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground/90 text-sm leading-tight">{selectedJob.address}</p>
                      </div>
                    </div>
                  </div>
              </div>

              {/* Install Scope */}
              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest">{t.installationScope} ({selectedJob.stoneapp_parts?.length || 0})</span>
                <div className="flex flex-col gap-3">
                  {selectedJob.stoneapp_parts?.map((part, i) => (
                    <div key={i} className="border border-border p-4 bg-surface/20 flex flex-col gap-2 border-l-4 border-l-primary">
                      <div className="flex justify-between items-center pr-2">
                        <span className="text-xs font-black uppercase text-foreground">{part.partType}</span>
                        <span className="text-[10px] font-mono text-primary font-bold">{part.slabId}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-y-1 gap-x-4">
                         <div className="flex justify-between text-[10px]">
                            <span className="text-foreground/40 font-mono uppercase">Material</span>
                            <span className="font-bold text-foreground/80">{part.material}</span>
                         </div>
                         <div className="flex justify-between text-[10px]">
                            <span className="text-foreground/40 font-mono uppercase">Profile</span>
                            <span className="font-bold text-foreground/80">{part.edgeProfile}</span>
                         </div>
                         <div className="flex justify-between text-[10px]">
                            <span className="text-foreground/40 font-mono uppercase">Thick</span>
                            <span className="font-bold text-foreground/80">{part.thickness}</span>
                         </div>
                         <div className="flex justify-between text-[10px]">
                            <span className="text-foreground/40 font-mono uppercase">Seams</span>
                            <span className="font-bold text-foreground/80">{part.seams}</span>
                         </div>
                      </div>
                    </div>
                  ))}
                  {(!selectedJob.stoneapp_parts || selectedJob.stoneapp_parts.length === 0) && (
                    <div className="p-8 text-center border border-dashed border-border bg-foreground/[0.02]">
                      <span className="text-[10px] font-mono text-foreground/30 uppercase tracking-widest italic">No installation scope data</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Logistics Notes */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.2em] mb-3">{t.logistics}</span>
                <div className="bg-amber-500/5 border border-amber-500/20 p-4">
                  <p className="text-sm text-foreground/80 leading-relaxed font-bold">
                    &quot;{selectedJob.logistics_notes || 'No special logistics recorded for this work order.'}&quot;
                  </p>
                </div>
              </div>

              {/* Verified Proofs */}
              {allPhotos.length > 0 && (
                <div className="flex flex-col gap-4">
                  <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest">Field Documentation ({allPhotos.length})</span>
                  <div className="grid grid-cols-2 gap-3">
                    {allPhotos.map((url, i) => {
                      const meta = getProofMetadata(url);
                      return (
                        <div key={i} className="aspect-square bg-foreground/5 border border-border relative group overflow-hidden">
                          <Image 
                            src={url} 
                            alt={`Proof ${i+1}`} 
                            fill
                            className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-center">
                            <span className="text-[10px] font-mono text-white uppercase relative z-10">Proof {i+1}</span>
                            {meta?.lat && meta?.lng && (
                              <button 
                                onClick={() => window.open(`https://maps.google.com/?q=${meta.lat},${meta.lng}`, '_blank')}
                                className="bg-rsg-gold text-background p-1.5 hover:opacity-80 transition-opacity z-10 border border-transparent"
                                title="Open GPS Coordinate in Maps"
                              >
                                <MapPin className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                   {activeSignature && (
                    <div className="flex flex-col gap-2 mt-4">
                       <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest">Client Signature</span>
                       <div className="bg-[var(--color-sig-bg)] p-4 border border-border h-32 flex items-center justify-center relative rounded-sm">
                          <Image 
                            src={activeSignature} 
                            alt="Signature" 
                            fill 
                            className="object-contain p-4" 
                            referrerPolicy="no-referrer"
                          />
                       </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-border bg-surface/30 flex flex-col gap-6">
              {onVerifyJob && selectedJob.status === 'submitted_for_review' && (
                <button 
                  onClick={() => onVerifyJob(selectedJob.id)}
                  disabled={isVerifying}
                  className="w-full bg-rsg-success text-white py-4 font-black tracking-[0.2em] uppercase hover:opacity-90 transition-opacity flex items-center justify-center gap-2 border border-rsg-success"
                >
                  {isVerifying ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <ShieldCheck className="w-5 h-5" />
                  )}
                  Verify & Close Work Order
                </button>
              )}
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={onClose}
                  className="w-full h-14 border border-foreground/20 text-foreground font-black uppercase tracking-[0.2em] transition-colors bg-surface hover:bg-foreground/5 rounded-none"
                >
                  CLOSE
                </button>
                <a 
                  href={`/admin/reports/${selectedJob.id}`}
                  className="flex items-center justify-center w-full h-14 bg-foreground text-background font-black uppercase tracking-[0.2em] transition-all hover:bg-rsg-gold hover:text-black rounded-none shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
                >
                  VIEW REPORT
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
