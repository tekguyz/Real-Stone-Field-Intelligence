import { Job } from "../../../entities/job/types";
import { dict } from "../../../entities/i18n/dict";
import { ProcessedImage } from "../../../shared/lib/image-processor";
import { SignaturePad } from "../../../shared/ui/SignaturePad";
import { summarizeJobScope } from "../../../shared/lib/utils";
import { JOB_STATUSES } from "../../../lib/constants/statuses";
import { useState } from "react";
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
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

export function JobBlockScope({
  job,
  language,
}: {
  job: Job;
  language: "en" | "es";
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const scopeText = summarizeJobScope(job.stoneapp_parts);
  const parts = job.stoneapp_parts || [];
  const displayParts = isExpanded ? parts : parts.slice(0, 3);
  const hasMore = parts.length > 3;

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.2em]">
        {"Job Scope"}
      </h3>
      <div className="bg-surface/50 border-l-2 border-primary pl-3 py-1">
        <p className="text-sm font-bold italic leading-tight text-foreground/90">
          {scopeText}
        </p>
      </div>

      {parts.length > 0 && (
        <div className="flex flex-col gap-1 mt-1">
          {displayParts.map((part, i) => (
            <div
              key={i}
              className="flex flex-wrap items-center gap-x-2 text-xs font-medium text-foreground/80 py-1 border-b border-border/20 last:border-0 uppercase tracking-tight"
            >
              <span className="font-extrabold text-foreground">
                {part.partType}:
              </span>
              <span>{part.material}</span>
              <span className="text-foreground/30">•</span>
              <span className="font-mono text-[10px] text-primary">
                {part.edgeProfile}
              </span>
              <span className="text-foreground/30">•</span>
              <span className="font-mono text-[10px]">{part.thickness}</span>
            </div>
          ))}

          {hasMore && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-1 flex items-center justify-center gap-2 py-2 w-full bg-surface/50 border border-border/50 text-[10px] font-black uppercase tracking-widest hover:bg-surface transition-colors"
            >
              {isExpanded ? (
                <>
                  Collapse Job Scope <ChevronUp className="w-3 h-3" />
                </>
              ) : (
                <>
                  View Full Job Scope ({parts.length}){" "}
                  <ChevronDown className="w-3 h-3" />
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function JobBlockSite({
  job,
  language,
}: {
  job: Job;
  language: "en" | "es";
}) {
  const community = job.community_name ? job.community_name.toUpperCase() : "";

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.2em]">
        {language === "en" ? "Project Site" : "Sitio del Proyecto"}
      </h3>
      <div className="flex items-start gap-3 border border-border p-3 sm:p-4 bg-surface/30">
        <button
          onClick={() => {
            const query = encodeURIComponent(job.address);
            window.open(
              `https://www.google.com/maps/search/?api=1&query=${query}`,
              "_blank",
            );
          }}
          className="w-11 h-11 flex items-center justify-center shrink-0 bg-foreground text-background active:scale-[0.95] transition-transform border border-border"
        >
          <MapPin className="w-4 h-4 fill-primary stroke-foreground" />
        </button>
        <div className="flex flex-col gap-1 w-full">
          <p className="font-bold text-sm text-foreground leading-tight underline decoration-foreground/20 underline-offset-2">
            {job.address}
          </p>
          {community && (
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#f97316] dark:text-rsg-gold font-bold">
              {community}
            </span>
          )}
          {job.logistics_notes && (
            <div className="mt-2 pt-2 border-t border-border/50 text-[11px] text-[#ea580c] dark:text-rsg-gold font-bold leading-tight uppercase tracking-tight">
              <span className="font-black uppercase tracking-widest text-[9px] mr-1 opacity-60">
                Logistics:
              </span>
              {job.logistics_notes}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function JobBlockArrival({
  scheduledDate,
  language,
}: {
  scheduledDate: string | null;
  language: "en" | "es";
}) {
  let timeStr = "WAITING TO BE ROUTED";
  if (scheduledDate) {
    try {
      const d = new Date(scheduledDate);
      timeStr = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
        .format(d)
        .toUpperCase();
    } catch {}
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.2em]">
        {language === "en" ? "Scheduled Arrival" : "Llegada Programada"}
      </h3>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center shrink-0 bg-foreground/5 text-foreground/50 border border-border">
          <Clock className="w-4 h-4" />
        </div>
        <p className="font-bold text-sm text-foreground leading-tight">
          {timeStr}
        </p>
      </div>
    </div>
  );
}

const formatTime = (ts: number) => {
  const d = new Date(ts);
  const hours = d.getHours();
  const h12 = hours % 12 || 12;
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  return `${h12}:${minutes} ${ampm}`;
};

export function DocumentationCapture({
  permissionStatus,
  checkPermissions,
  handleCaptureImage,
  isProcessing,
  processedPhotos,
  removePhoto,
  setSignatureData,
  language,
}: any) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-black tracking-tight text-foreground uppercase">
          {language === "en" ? "Job Documentation" : "Documentación"}
        </h2>
        <p className="text-xs text-foreground/40 leading-relaxed max-w-sm">
          Capture installation photos and an optional client signature to secure
          your work.
        </p>
      </div>

      <div className="rugged-card flex flex-col gap-4 w-full max-w-full overflow-hidden">
        {permissionStatus === "denied" ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border-2 border-amber-500 bg-amber-500/5 flex flex-col gap-4 shadow-[var(--rugged-shadow-sm)]"
          >
            <div className="flex items-center gap-3 text-amber-600">
              <AlertOctagon className="w-8 h-8" />
              <span className="text-sm font-black uppercase tracking-widest leading-tight">
                PERMISSION DENIED:
                <br />
                CAMERA & LOCATION LOCKED
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-6 h-6 shrink-0 bg-amber-500 text-white flex items-center justify-center font-mono text-xs font-bold">
                  1
                </div>
                <p className="text-[11px] leading-relaxed text-foreground/80">
                  Open browser settings (three dots or &quot;AA&quot; icon) in
                  your address bar.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 shrink-0 bg-amber-500 text-white flex items-center justify-center font-mono text-xs font-bold">
                  2
                </div>
                <p className="text-[11px] leading-relaxed text-foreground/80">
                  Select &quot;Site Settings&quot; and reset permissions for
                  Camera and Location.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 shrink-0 bg-amber-500 text-white flex items-center justify-center font-mono text-xs font-bold">
                  3
                </div>
                <p className="text-[11px] leading-relaxed text-foreground/80">
                  Reload this page and tap &quot;Take Photo&quot; again.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="rugged-button-boss w-full h-12 bg-amber-500 text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Retry Permissions
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={async () => {
                const granted = await checkPermissions("camera");
                if (granted) document.getElementById("camera-input")?.click();
              }}
              className="rugged-button-boss flex-1 h-20 bg-rsg-gold text-black flex flex-col items-center justify-center text-[10px] font-black uppercase tracking-widest border-2 border-foreground"
            >
              <Camera className="w-6 h-6 mb-1" />
              Capture
            </button>
            <input
              id="camera-input"
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleCaptureImage}
            />

            <button
              onClick={async () => {
                const granted = await checkPermissions("gallery");
                if (granted) document.getElementById("gallery-input")?.click();
              }}
              className="rugged-button-boss flex-1 h-20 bg-rsg-gold text-black flex flex-col items-center justify-center text-[10px] font-black uppercase tracking-widest border-2 border-foreground"
            >
              <ImagePlus className="w-6 h-6 mb-1" />
              Gallery
            </button>
            <input
              id="gallery-input"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleCaptureImage}
            />
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
                <span className="text-[10px] font-mono uppercase font-bold relative z-10 tracking-widest">
                  Optimizing
                </span>
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
                    <span className="text-[8px] font-mono text-white/90">
                      {formatTime(photo.metadata.timestamp)}
                    </span>
                  </div>
                  {photo.metadata.lat && photo.metadata.lng ? (
                    <div className="flex items-center gap-1">
                      <Navigation className="w-2.5 h-2.5 text-rsg-success" />
                      <span className="text-[8px] font-mono text-white/90">
                        GPS LOCKED
                      </span>
                    </div>
                  ) : photo.metadata.location_status ===
                    "timeout_unavailable" ? (
                    <div className="flex items-center gap-1">
                      <Navigation className="w-2.5 h-2.5 text-rsg-warning" />
                      <span className="text-[8px] font-mono text-white/80">
                        GPS: TIMEOUT
                      </span>
                    </div>
                  ) : photo.metadata.location_status === "denied" ? (
                    <div className="flex items-center gap-1">
                      <Navigation className="w-2.5 h-2.5 text-rsg-error" />
                      <span className="text-[8px] font-mono text-white/80">
                        GPS: DENIED
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Navigation className="w-2.5 h-2.5 text-rsg-text opacity-50" />
                      <span className="text-[8px] font-mono text-white/80">
                        GPS: UNAVAIL
                      </span>
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
            <p className="text-[10px] font-bold uppercase tracking-[0.2em]">
              No Photos
            </p>
          </div>
        )}
      </div>

      <div className="rugged-card flex flex-col gap-4 w-full">
        <h3 className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest mb-1">
          Authorization (Optional)
        </h3>
        <SignaturePad
          onSignatureChange={setSignatureData}
          language={language}
        />
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
  if (!photos || photos.length === 0) return null;

  return (
    <div className="bg-card border border-border p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">
          Captured Proof
        </span>
      </div>
      <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
        {photos.map((src, i) => (
          <div
            key={i}
            className="aspect-square relative overflow-hidden bg-foreground/5 border border-border/50"
          >
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
  language,
}: any) {
  const isSubmitted =
    jobStatus === JOB_STATUSES.REVIEW || jobStatus === JOB_STATUSES.VERIFIED;

  return (
    <section className="pt-4 border-t border-border">
      {isSubmitted ? (
        <div className="bg-primary/5 border-2 border-foreground shadow-[var(--rugged-shadow-sm)] p-4 flex flex-col items-center text-center gap-3">
          <CheckCircle2 className="w-10 h-10 text-primary opacity-80" />
          <div className="font-black text-primary uppercase tracking-widest text-sm">
            Office Verification
          </div>
          <p className="text-[10px] text-foreground/60 font-bold uppercase tracking-widest max-w-[250px] leading-relaxed">
            Job documentation secured.
            <br />
            Site verification in progress.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <button
            onClick={handleSubmitReview}
            disabled={isSubmitting || !isFormValid}
            className={`w-full h-16 font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all border-2 border-foreground shadow-[var(--rugged-shadow-md)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
              isFormValid
                ? "bg-rsg-gold text-black"
                : "bg-surface text-foreground/30 border-dashed cursor-not-allowed shadow-none active:translate-x-0 active:translate-y-0"
            }`}
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {language === "en" ? "Complete Job" : "Completar Trabajo"}
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
