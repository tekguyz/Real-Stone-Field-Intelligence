import { Job } from '../../../entities/job/types';
import { dict } from '../../../entities/i18n/dict';
import { ProcessedImage } from '../../../shared/lib/image-processor';
import { SignaturePad } from '../../../shared/ui/SignaturePad';
import { 
  MapPin, 
  Trash2, 
  Clock, 
  Navigation,
  Image as ImageIcon,
  Loader2,
  Camera,
  ImagePlus,
  RefreshCw,
  LifeBuoy,
  AlertOctagon,
  Upload,
  CheckCircle2
} from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';

export function InstallationScopeList({ job, language }: { job: Job, language: 'en' | 'es' }) {
  const t = dict[language].admin;
  return (
    <div className="bg-card border border-border overflow-hidden">
      <div className="bg-foreground/5 px-5 py-3 border-b border-border">
        <h3 className="text-[10px] font-mono text-foreground/60 uppercase tracking-[0.2em]">
          {t.installationScope}
        </h3>
      </div>
      
      <div className="divide-y divide-border">
        {job.stoneapp_parts && job.stoneapp_parts.length > 0 ? (
          job.stoneapp_parts.map((part, i) => (
            <div key={i} className="p-4 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-black uppercase tracking-widest text-foreground">
                  {part.partType}
                </span>
                <span className="text-[10px] font-mono text-primary font-bold">
                  {part.slabId}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[8px] uppercase tracking-widest text-foreground/40 font-mono">Material</span>
                  <span className="text-[10px] font-bold text-foreground/80 truncate">{part.material}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[8px] uppercase tracking-widest text-foreground/40 font-mono">Profile</span>
                  <span className="text-[10px] font-bold text-foreground/80">{part.edgeProfile}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[8px] uppercase tracking-widest text-foreground/40 font-mono">Thickness</span>
                  <span className="text-[10px] font-bold text-foreground/80">{part.thickness}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[8px] uppercase tracking-widest text-foreground/40 font-mono">Seams</span>
                  <span className="text-[10px] font-bold text-foreground/80">{part.seams}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center">
            <span className="text-[10px] font-mono uppercase text-foreground/30">No Parts Loaded</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function JobLogisticsCard({ address, title }: { address: string, title?: string }) {
  return (
    <div className="bg-surface border border-border p-5">
      <div className="flex items-start gap-4">
        <button 
          onClick={() => {
            const query = encodeURIComponent(address);
            window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
          }}
          className="w-10 h-10 flex items-center justify-center shrink-0 border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors"
          title={title}
        >
          <MapPin className="w-4 h-4 text-primary" />
        </button>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-foreground/40 mb-1">Project Site</span>
          <p className="font-bold text-sm text-foreground leading-tight">{address}</p>
          <div className="flex items-center gap-1.5 mt-1">
             <div className="w-1 h-1 bg-foreground/20 rounded-full" />
             <span className="text-[10px] uppercase font-mono tracking-widest text-foreground/40 font-bold">Verified Destination</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const formatTime = (ts: number) => {
  const d = new Date(ts);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} ${d.getHours() >= 12 ? 'PM' : 'AM'}`;
};

export function DocumentationCapture({
  permissionStatus,
  checkPermissions,
  handleCaptureImage,
  isProcessing,
  processedPhotos,
  removePhoto,
  setSignatureData,
  language
}: any) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-black tracking-tight text-foreground uppercase">
          {language === 'en' ? 'Job Documentation' : 'Documentación'}
        </h2>
        <p className="text-xs text-foreground/40 leading-relaxed max-w-sm">
          Capture installation photos and an optional client signature to secure your work.
        </p>
      </div>

      <div className="flex flex-col gap-4 bg-card border border-border p-4">
        {permissionStatus === 'denied' ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 border-4 border-amber-500 bg-amber-500/5 flex flex-col gap-5"
          >
            <div className="flex items-center gap-3 text-amber-600">
              <AlertOctagon className="w-8 h-8" />
              <span className="text-sm font-black uppercase tracking-widest leading-tight">
                PERMISSION DENIED:<br />CAMERA & LOCATION LOCKED
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-6 h-6 shrink-0 bg-amber-500 text-white flex items-center justify-center font-mono text-xs font-bold">1</div>
                <p className="text-[11px] leading-relaxed text-foreground/80">Open browser settings (three dots or &quot;AA&quot; icon) in your address bar.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 shrink-0 bg-amber-500 text-white flex items-center justify-center font-mono text-xs font-bold">2</div>
                <p className="text-[11px] leading-relaxed text-foreground/80">Select &quot;Site Settings&quot; and reset permissions for Camera and Location.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 shrink-0 bg-amber-500 text-white flex items-center justify-center font-mono text-xs font-bold">3</div>
                <p className="text-[11px] leading-relaxed text-foreground/80">Reload this page and tap &quot;Take Photo&quot; again.</p>

              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button 
                onClick={() => window.location.reload()}
                className="w-full h-12 bg-amber-500 text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-amber-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retry Permissions
              </button>
              <button className="flex items-center justify-center gap-2 text-[10px] font-mono text-foreground/40 uppercase font-bold py-2">
                <LifeBuoy className="w-3.5 h-3.5" />
                Contact Dispatch
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={async () => {
                const granted = await checkPermissions('camera');
                if (granted) document.getElementById('camera-input')?.click();
              }}
              className="flex flex-col items-center justify-center h-16 bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold uppercase tracking-[0.2em] cursor-pointer hover:bg-primary/20 active:scale-[0.98] transition-all"
            >
              <Camera className="w-5 h-5 mb-1" />
              Capture
            </button>
            <input id="camera-input" type="file" accept="image/*" capture="environment" className="hidden" onChange={handleCaptureImage} />
            
            <button 
              onClick={async () => {
                const granted = await checkPermissions('gallery');
                if (granted) document.getElementById('gallery-input')?.click();
              }}
              className="flex flex-col items-center justify-center h-16 bg-surface border border-border text-[10px] font-bold uppercase tracking-[0.2em] cursor-pointer hover:bg-foreground/5 text-foreground/60 active:scale-[0.98] transition-all"
            >
              <ImagePlus className="w-5 h-5 mb-1" />
              Gallery
            </button>
            <input id="gallery-input" type="file" accept="image/*" multiple className="hidden" onChange={handleCaptureImage} />
          </div>
        )}

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
            
            {processedPhotos.map((photo: ProcessedImage, i: number) => (
              <motion.div 
                key={`${photo.previewUrl}-${i}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-square overflow-hidden border border-border group bg-black"
              >
                <Image 
                  src={photo.previewUrl} 
                  alt="Proof" 
                  fill 
                  className="object-cover opacity-90"
                  referrerPolicy="no-referrer"
                />
                
                <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur border border-white/10 p-1.5 flex flex-col gap-0.5">
                  <div className="flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-primary" />
                    <span className="text-[8px] font-mono text-white/90">{formatTime(photo.metadata.timestamp)}</span>
                  </div>
                  {photo.metadata.isGpsLocked ? (
                    <div className="flex items-center gap-1">
                      <Navigation className="w-2.5 h-2.5 text-blue-400" />
                      <span className="text-[8px] font-mono text-white/90">GPS LOCKED</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Navigation className="w-2.5 h-2.5 text-amber-400 animate-pulse" />
                      <span className="text-[8px] font-mono text-white/80">GPS: SEARCHING...</span>
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

      <div className="bg-card border border-border p-4 flex flex-col gap-4">
        <h3 className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.2em] mb-1">Authorization (Optional)</h3>
        <SignaturePad 
          onSignatureChange={setSignatureData}
          language={language}
        />
      </div>
    </section>
  );
}

export function CapturedProofGrid({ photos, language }: { photos: string[], language: 'en' | 'es' }) {
  if (!photos || photos.length === 0) return null;
  
  return (
    <div className="bg-card border border-border p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
         <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Captured Proof</span>
      </div>
      <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
        {photos.map((src, i) => (
          <div key={i} className="aspect-square relative overflow-hidden bg-foreground/5 border border-border/50">
            <Image 
              src={src} 
              alt={`Proof ${i}`} 
              fill 
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function JobActionFooter({
  jobStatus,
  isFormValid,
  isSubmitting,
  handleSubmitReview,
  processedPhotosLength,
  language
}: any) {
  const isSubmitted = jobStatus === 'submitted_for_review' || jobStatus === 'completed';
  
  return (
    <section className="pt-4 border-t border-border">
      {isSubmitted ? (
        <div className="bg-primary/5 border-l-4 border-primary border-y border-r border-primary/20 p-6 flex flex-col items-center text-center gap-3">
           <CheckCircle2 className="w-10 h-10 text-primary opacity-80" />
           <div className="font-black text-primary uppercase tracking-widest text-sm">Office Verification</div>
           <p className="text-[10px] text-foreground/60 font-bold uppercase tracking-widest max-w-[250px] leading-relaxed">
              Job documentation secured.<br />Site verification in progress.
           </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <button 
            onClick={handleSubmitReview}
            disabled={isSubmitting || !isFormValid}
            className={`w-full h-14 font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${
              isFormValid 
                ? 'bg-foreground text-background hover:opacity-90' 
                : 'bg-surface border border-border text-foreground/30 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {language === 'en' ? 'Complete Job' : 'Completar Trabajo'}
          </button>
          
          {!isFormValid && (
            <div className="flex flex-col items-center gap-1 mt-2">
              {processedPhotosLength === 0 && (
                <span className="text-[10px] font-bold text-amber-500/80 uppercase tracking-widest">
                  • Capture at least 1 photo
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
