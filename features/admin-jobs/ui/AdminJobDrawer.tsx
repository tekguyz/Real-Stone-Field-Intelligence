import { Job } from '../../../entities/job/types';
import { dict } from '../../../entities/i18n/dict';
import { X, MapPin, Loader2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUserStore } from '../../../entities/user/store';
import Image from 'next/image';

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
  const { language } = useUserStore();
  const t = dict[language].admin;

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
            <div className="p-6 border-b border-border flex justify-between items-start bg-surface/30">
              <div className="flex flex-col">
                 <span className="font-mono text-[10px] text-primary mb-1 block uppercase tracking-[0.2em]">{selectedJob.legacy_id}</span>
                 <h2 className="text-xl font-black tracking-tight uppercase">{selectedJob.client_name}</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:text-primary text-foreground/40 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
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
                      <span className="text-xs font-mono text-foreground/30 uppercase tracking-widest italic">No installation scope data</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Logistics */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.2em] mb-3">{t.logistics}</span>
                <div className="bg-amber-500/5 border border-amber-500/20 p-4">
                  <p className="text-sm text-foreground/80 leading-relaxed font-bold">
                    &quot;{selectedJob.logistics_notes || 'No special logistics recorded for this work order.'}&quot;
                  </p>
                </div>
              </div>

              {/* Assignment */}
              <div className="flex flex-col gap-2">
                 <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest">Assign Installer</span>
                 <select 
                   className="bg-surface/50 border border-border px-4 py-3 text-sm rounded-none focus:outline-none focus:border-primary font-mono uppercase"
                   value={selectedJob.installer_id || 'unassigned'}
                   onChange={(e) => onUpdateInstaller(selectedJob.id, e.target.value)}
                 >
                   <option value="unassigned">UNASSIGNED</option>
                   <option value="installer_juan">JUAN</option>
                   <option value="installer_carlos">CARLOS</option>
                 </select>
              </div>

              {/* Verified Proofs */}
              {(selectedJob.photos?.length || 0) > 0 && (
                <div className="flex flex-col gap-4">
                  <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest">Field Documentation ({selectedJob.photos?.length})</span>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedJob.photos?.map((url, i) => (
                      <div key={i} className="aspect-square bg-foreground/5 border border-border relative group overflow-hidden">
                        <Image 
                          src={url} 
                          alt={`Proof ${i+1}`} 
                          fill
                          className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-[10px] font-mono text-white uppercase relative z-10">Proof {i+1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {selectedJob.signature_url && (
                    <div className="flex flex-col gap-2 mt-4">
                       <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest">Client Signature</span>
                       <div className="bg-white p-4 border border-border h-32 flex items-center justify-center relative">
                          <Image 
                            src={selectedJob.signature_url} 
                            alt="Signature" 
                            fill 
                            className="object-contain p-4 invert brightness-0" 
                            referrerPolicy="no-referrer"
                          />
                       </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-border bg-surface/30 flex flex-col gap-3">
              {onVerifyJob && selectedJob.status === 'submitted_for_review' && (
                <button 
                  onClick={() => onVerifyJob(selectedJob.id)}
                  disabled={isVerifying}
                  className="w-full bg-green-600 text-white py-4 font-black tracking-[0.2em] uppercase hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
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
                  className="w-full h-14 border border-foreground/20 text-foreground font-black uppercase tracking-[0.2em] transition-colors hover:bg-foreground/5 rounded-none"
                >
                  Close
                </button>
                <a 
                  href={`/admin/jobs/${selectedJob.id}`}
                  className="flex items-center justify-center w-full h-14 bg-foreground text-background font-black uppercase tracking-[0.2em] transition-opacity hover:opacity-90 rounded-none"
                >
                  Full Record
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
