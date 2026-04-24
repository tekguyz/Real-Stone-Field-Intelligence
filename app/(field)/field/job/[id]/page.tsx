'use client';

import { useState, use } from 'react';
import { useUserStore } from '../../../../../entities/user/store';
import { dict } from '../../../../../entities/i18n/dict';
import { useJobs, useUpdateJobStatus } from '../../../../../entities/job/api';
import { processImage, ProcessedImage } from '../../../../../shared/lib/image-processor';
import { SignaturePad } from '../../../../../shared/ui/SignaturePad';
import { SyncIndicator } from '../../../../../shared/ui/SyncIndicator';
import { useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Camera, 
  MapPin, 
  CheckCircle2, 
  Loader2, 
  Upload,
  Image as ImageIcon,
  Trash2,
  ImagePlus,
  Clock,
  Navigation
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';

export default function FieldJobDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { language, isDevMode } = useUserStore();
  const t = dict[language].field;
  
  const { data: jobs, isLoading: isJobsLoading } = useJobs();
  const updateStatus = useUpdateJobStatus();
  const queryClient = useQueryClient();

  const [processedPhotos, setProcessedPhotos] = useState<ProcessedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [isUnattended, setIsUnattended] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const job = jobs?.find(j => j.id === id || j.legacy_id === id);

  if (isJobsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-6 bg-background h-screen">
        <Link href="/field" className="flex items-center gap-2 text-primary mb-6">
          <ArrowLeft className="w-5 h-5" />
          {t.back}
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Job not found</h1>
      </div>
    );
  }

  const handleCaptureImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    try {
      // Process one or multiple files sequentially
      const newPhotos: ProcessedImage[] = [];
      for (let i = 0; i < files.length; i++) {
         const processed = await processImage(files[i]);
         newPhotos.push(processed);
      }
      
      if (isDevMode) {
        // Interceptor mockup delay
        await new Promise(res => setTimeout(res, 1000));
      }

      setProcessedPhotos(prev => [...newPhotos, ...prev]);
    } catch (err) {
      console.error("Image processing failed", err);
    } finally {
      setIsProcessing(false);
      // Reset input value to allow picking the same file again if desired
      e.target.value = '';
    }
  };

  const removePhoto = (index: number) => {
    setProcessedPhotos(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].previewUrl);
      updated.splice(index, 1);
      return updated;
    });
  };

  const isFormValid = processedPhotos.length > 0 && (isUnattended || signatureData !== null);

  const handleSubmitReview = async () => {
    if (!isFormValid || !job) return;
    setIsSubmitting(true);
    
    try {
      const { jobService } = await import('../../../../../entities/job/api');
      
      // 1. Upload Photos Sequentially (will hit interceptor if offline)
      for (const photo of processedPhotos) {
        // slight delay to ensure Dexie insertion timing handles order
        await new Promise(r => setTimeout(r, 10)); 
         await jobService.uploadPhoto(photo.blob, job.id, isDevMode);
      }
      
      // 2. Upload Signature
      if (signatureData) {
        await jobService.uploadSignature(signatureData, job.id, isDevMode);
      }
      
      // 3. Final State Update
      await jobService.updateJobStatus(job.id, 'submitted_for_review', isDevMode);

      // Optimistically update cache 
      queryClient.setQueryData(['jobs', isDevMode], (old: any) => {
        if (!old) return old;
        return old.map((j: any) => 
          j.id === job.id ? { ...j, status: 'submitted_for_review' } : j
        );
      });
      // Fire invalidation in background just in case
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} ${d.getHours() >= 12 ? 'PM' : 'AM'}`;
  };

  return (
    <div className="flex flex-col min-h-full bg-background pb-12">
      {/* Neo-Brutalist Strict Header - Exactly h-14 */}
      <div className="h-14 px-4 bg-surface border-b border-border sticky top-0 z-20 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/field" className="text-foreground/50 hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-primary uppercase tracking-[0.2em] font-bold">{job.legacy_id}</span>
            <h1 className="text-sm font-black tracking-widest text-foreground uppercase truncate max-w-[200px]">{job.client_name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SyncIndicator />
          <div className={`px-2 py-0.5 border text-[8px] font-black uppercase tracking-widest hidden sm:block ${
            job.status === 'in_progress' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-foreground/5 text-foreground/40 border-border'
          }`}>
            {dict[language].status[job.status]}
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-6 pt-6">
        
        {/* Work Order Scope & Logistics */}
        <section className="flex flex-col gap-4">
          <div className="bg-card border border-border p-5">
            <h3 className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.2em] mb-3">
              {language === 'en' ? 'Scope of Work' : 'Alcance del Trabajo'}
            </h3>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-bold text-foreground">
                {job.slab_info.slabs}x {job.slab_info.material}
              </p>
              <div className="flex gap-4 border-t border-border pt-2 mt-1">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-foreground/40">Finish</span>
                  <span className="text-xs text-foreground/80 font-bold">{job.slab_info.finish}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-foreground/40">Thickness</span>
                  <span className="text-xs text-foreground/80 font-bold">{job.slab_info.thickness}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 flex items-center justify-center shrink-0 border border-primary/20 bg-primary/5">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-foreground/40 mb-1">Location</span>
                <p className="font-bold text-sm text-foreground">{job.location.address}</p>
                <p className="text-xs text-foreground/60">{job.location.city}, {job.location.state}</p>
              </div>
            </div>
            {job.logistics_notes && (
              <div className="p-4 bg-primary/5 border border-primary/10 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/40" />
                <p className="text-xs text-foreground/80 font-bold leading-relaxed">
                  {job.logistics_notes}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Documentation Actions */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-black tracking-tight text-foreground uppercase">
              {language === 'en' ? 'Job Documentation' : 'Documentación'}
            </h2>
            <p className="text-xs text-foreground/40 leading-relaxed max-w-sm">
              Capture installation photos and client signature to unblock submitting the worksheet.
            </p>
          </div>

          {/* Photo Capture Section */}
          <div className="flex flex-col gap-4 bg-card border border-border p-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col items-center justify-center h-16 bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold uppercase tracking-[0.2em] cursor-pointer hover:bg-primary/20 active:scale-[0.98] transition-all">
                <Camera className="w-5 h-5 mb-1" />
                Capture
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleCaptureImage} />
              </label>
              
              <label className="flex flex-col items-center justify-center h-16 bg-surface border border-border text-[10px] font-bold uppercase tracking-[0.2em] cursor-pointer hover:bg-foreground/5 text-foreground/60 active:scale-[0.98] transition-all">
                <ImagePlus className="w-5 h-5 mb-1" />
                Gallery
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleCaptureImage} />
              </label>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <AnimatePresence mode="popLayout">
                {isProcessing && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="aspect-square bg-surface border border-dashed border-primary/20 flex flex-col items-center justify-center text-primary gap-2 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                    <Loader2 className="w-6 h-6 animate-spin relative z-10" />
                    <span className="text-[10px] font-mono uppercase font-bold relative z-10 tracking-widest">Optimizing</span>
                  </motion.div>
                )}
                
                {processedPhotos.map((photo, i) => (
                  <motion.div 
                    key={`${photo.previewUrl}-${i}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="relative aspect-square overflow-hidden border border-border group bg-black"
                  >
                    <img src={photo.previewUrl} alt="Proof" className="w-full h-full object-cover opacity-90" />
                    
                    {/* Metadata Badge */}
                    <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur border border-white/10 p-1.5 flex flex-col gap-0.5">
                      <div className="flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 text-primary" />
                        <span className="text-[8px] font-mono text-white/90">{formatTime(photo.metadata.timestamp)}</span>
                      </div>
                      {photo.metadata.lat && (
                        <div className="flex items-center gap-1">
                          <Navigation className="w-2.5 h-2.5 text-blue-400" />
                          <span className="text-[8px] font-mono text-white/90">GPS Locked</span>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={() => removePhoto(i)}
                      className="absolute top-2 right-2 flex items-center justify-center w-6 h-6 bg-red-500/80 text-white hover:bg-red-500 border border-white/10 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {processedPhotos.length === 0 && !isProcessing && (
              <div className="py-6 flex flex-col items-center justify-center border border-dashed border-border text-foreground/30 gap-2 bg-foreground/[0.02]">
                <ImageIcon className="w-6 h-6 opacity-50" />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em]">No Photos</p>
              </div>
            )}
          </div>

          {/* Signature Integration */}
          <div className="bg-card border border-border p-4 flex flex-col gap-4">
            <h3 className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.2em] mb-1">Authorization</h3>
            <SignaturePad 
              onSignatureChange={setSignatureData}
              onUnattendedChange={setIsUnattended}
              language={language}
            />
          </div>
        </section>

        {/* Master Submission Gate */}
        <section className="pt-4 border-t border-border">
          {job.status === 'submitted_for_review' ? (
            <div className="bg-amber-500/5 border-l-4 border-amber-500 border-y border-r border-amber-500/20 p-6 flex flex-col items-center text-center gap-3">
               <CheckCircle2 className="w-10 h-10 text-amber-500 opacity-80" />
               <div className="font-black text-amber-600 uppercase tracking-widest text-sm">Office Verification</div>
               <p className="text-xs text-amber-700/70 font-medium max-w-[250px]">
                  Documentation secured. Await HQ review before closing site.
               </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleSubmitReview}
                disabled={updateStatus.isPending || !isFormValid}
                className={`w-full h-14 font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${
                  isFormValid 
                    ? 'bg-foreground text-background hover:opacity-90' 
                    : 'bg-surface border border-border text-foreground/30 cursor-not-allowed'
                }`}
              >
                {updateStatus.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {language === 'en' ? 'Complete Job' : 'Completar Trabajo'}
              </button>
              
              {!isFormValid && (
                <div className="flex flex-col items-center gap-1 mt-2">
                  {processedPhotos.length === 0 && (
                    <span className="text-[10px] font-bold text-amber-500/80 uppercase tracking-widest">
                      • Capture at least 1 photo
                    </span>
                  )}
                  {!signatureData && !isUnattended && (
                    <span className="text-[10px] font-bold text-amber-500/80 uppercase tracking-widest">
                      • Client signature required
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
