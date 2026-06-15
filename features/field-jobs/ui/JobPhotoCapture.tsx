import { ProcessedImage } from "../../../shared/lib/image-processor";
import { SignaturePad } from "../../../shared/ui/SignaturePad";
import {
  Trash2,
  Clock,
  Image as ImageIcon,
  Loader2,
  Camera,
  RefreshCw,
  AlertOctagon,
  Upload,
  CheckCircle2,
  Navigation as GpsIcon,
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

import { dict } from "../../../entities/i18n/dict";

const formatTime = (ts: number) => {
  const d = new Date(ts);
  const hours = d.getHours();
  const h12 = hours % 12 || 12;
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  return `${h12}:${minutes} ${ampm}`;
};

interface DocumentationCaptureProps {
  cameraStatus: any;
  locationStatus: any;
  handleCaptureImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isProcessing: boolean;
  processedPhotos: ProcessedImage[];
  removePhoto: (index: number) => Promise<void>;
  setSignatureData: (dataUrl: string | null) => void;
  language: "en" | "es";
  onImageClick?: (url: string) => void;
  requestPermissions?: any;
  signatureData?: any;
}

export function DocumentationCapture({
  cameraStatus,
  locationStatus,
  handleCaptureImage,
  isProcessing,
  processedPhotos,
  removePhoto,
  setSignatureData,
  language,
  onImageClick,
}: DocumentationCaptureProps) {
  const t = dict[language].field;
  
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-black tracking-tight text-foreground uppercase">
          {t.jobDocumentation}
        </h2>
        <p className="text-xs text-foreground/40 leading-relaxed max-w-sm">
          {t.capturePhotosDesc}
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full">
        {cameraStatus === "denied" || locationStatus === "denied" ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 border-2 border-rsg-warning bg-rsg-warning/10 flex flex-col gap-3 rounded-none shadow-[var(--rugged-shadow-sm)]"
          >
            <div className="flex items-center gap-3 text-rsg-warning">
              <AlertOctagon className="w-7 h-7" />
              <span className="text-[11px] font-black uppercase tracking-widest leading-tight">{t.systemWarning}</span>
            </div>
            <p className="text-[10px] leading-relaxed text-foreground/80 font-bold uppercase">{t.securityProtocols}</p>
            <button onClick={() => window.location.reload()} className="rugged-button-sm w-full h-11 bg-rsg-warning text-black font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 rounded-none">
              <RefreshCw className="w-3.5 h-3.5" />
              {t.grantAccess}
            </button>
          </motion.div>
        ) : (
          <div className="flex gap-2">
            <div className="flex-1">
              <button onClick={() => document.getElementById("camera-input")?.click()} className="rugged-button-boss w-full h-12 bg-rsg-gold text-black flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest active:scale-95 transition-transform rounded-none">
                <Camera className="w-5 h-5 transition-transform group-active:scale-95" />
                {t.captureButton}
              </button>
              <input id="camera-input" type="file" accept="image/*" capture="environment" className="hidden" onChange={handleCaptureImage} />
            </div>
            <div className="flex-1">
              <button onClick={() => document.getElementById("gallery-input")?.click()} className="rugged-button-boss w-full h-12 bg-rsg-gold text-black flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest active:scale-95 transition-transform rounded-none">
                <Upload className="w-5 h-5" />
                {t.uploadButton}
              </button>
              <input id="gallery-input" type="file" accept="image/*" multiple className="hidden" onChange={handleCaptureImage} />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence mode="popLayout">
            {isProcessing && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="aspect-square bg-surface border border-dashed border-primary/20 flex flex-col items-center justify-center text-primary relative overflow-hidden rounded-none">
                <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                <Loader2 className="w-6 h-6 animate-spin relative z-10" />
              </motion.div>
            )}

            {processedPhotos.map((photo: ProcessedImage, i: number) => (
              <motion.div
                key={`${photo.previewUrl}-${i}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-square overflow-hidden border border-border group bg-black cursor-pointer rounded-none"
                onClick={() => onImageClick ? onImageClick(photo.previewUrl) : window.dispatchEvent(new CustomEvent('open-lightbox', { detail: photo.previewUrl }))}
              >
                <Image src={photo.previewUrl} alt="Proof" fill className="object-cover opacity-90" referrerPolicy="no-referrer" />
                <div className="absolute inset-x-0 bottom-0 bg-zinc-900/90 p-2 flex flex-col gap-1 w-full pointer-events-none">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-white">
                    <Clock className="w-3.5 h-3.5 text-rsg-gold" />
                    <span>{formatTime(photo.metadata.gps_time)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-white">
                    <GpsIcon className="w-3.5 h-3.5 text-white" />
                    <span>{t.gpsVerified}</span>
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); removePhoto(i); }} className="absolute top-2 right-2 flex items-center justify-center w-6 h-6 bg-red-500/80 text-white hover:bg-red-500 border border-white/10 transition-colors z-10">
                  <Trash2 className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {processedPhotos.length === 0 && !isProcessing && (
          <div className="py-4 flex flex-col items-center justify-center border border-dashed border-border text-foreground/30 gap-1 bg-foreground/[0.02]">
            <ImageIcon className="w-5 h-5 opacity-50" />
            <p className="text-[9px] font-bold uppercase tracking-[0.2em]">{t.noPhotosAttached}</p>
          </div>
        )}
      </div>

      <div className="pt-2">
        <SignaturePad onSignatureChange={setSignatureData} language={language} />
      </div>
    </section>
  );
}

export function CapturedProofGrid({
  photos,
  language,
}: {
  photos: string[];
  language: "en" | "es";
}) {
  const t = dict[language].field;

  if (!photos || photos.length === 0) return null;

  return (
    <div className="bg-card border border-border dark:border-primary/60 p-4 flex flex-col gap-3 rounded-none">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">{t.capturedProof}</span>
      </div>
      <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
        {photos.map((src, i) => (
          <div key={i} className="aspect-square relative overflow-hidden bg-foreground/5 border border-border/50">
            <Image src={src} alt={`Proof ${i}`} fill className="object-cover" referrerPolicy="no-referrer" />
          </div>
        ))}
      </div>
    </div>
  );
}
