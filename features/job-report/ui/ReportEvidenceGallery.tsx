"use client";

import { Navigation, Clock, MapPin } from "lucide-react";
import { CapturedProof } from "../../../entities/job/types";
import Image from "next/image";
import { useUserStore } from "../../../entities/user/store";
import { dict } from "../../../entities/i18n/dict";

interface ReportEvidenceGalleryProps {
  allPhotos: string[];
  getProofMetadata: (url: string) => CapturedProof | null;
  formatTime: (dateStr: string | number) => string;
}

export function ReportEvidenceGallery({
  allPhotos,
  getProofMetadata,
  formatTime,
}: ReportEvidenceGalleryProps) {
  const { language } = useUserStore();
  const t = dict[language];

  return (
    <div className="p-6 md:p-10 border-b border-border print:border-black">
      <h3 className="font-semibold uppercase tracking-widest text-lg mb-6 flex items-center gap-3">
        {t.admin.fieldEvidence}
        <span className="bg-[var(--status-verified-bg)] text-[var(--status-verified-text)] border border-[var(--status-verified-text)]/20 rounded-md px-2 py-1 text-[10px] font-black shadow-sm">
          {t.status.verified}
        </span>
      </h3>

      {allPhotos.length > 0 ? (
        <div className="grid grid-cols-3 gap-3 print:gap-2">
          {allPhotos.map((url, i) => {
            const meta = getProofMetadata(url);
            return (
              <div
                key={i}
                className="flex flex-col border border-border print:border-black bg-card print:bg-white print:break-inside-avoid rounded-md overflow-hidden shadow-sm relative group cursor-pointer"
                onClick={() => {
                  const evt = new CustomEvent('open-lightbox', { detail: url });
                  window.dispatchEvent(evt);
                }}
              >
                <div className="aspect-square w-full relative bg-foreground/5 print:bg-black/5">
                  <Image
                    src={url}
                    alt={`Evidence ${i + 1}`}
                    fill
                    priority={i < 2}
                    className="object-cover transition-transform group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-zinc-900/90 p-2 flex flex-col gap-1 w-full pointer-events-none print:hidden">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-white">
                      <Clock className="w-3.5 h-3.5 text-rsg-gold" />
                      <span>{meta ? formatTime(meta.timestamp) : "UNKNOWN"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-white">
                      <Navigation className="w-3.5 h-3.5 text-white fill-white" />
                      <span>GPS: VERIFIED</span>
                    </div>
                  </div>
                </div>
                <div className="p-3 border-t border-border print:border-black flex flex-col gap-2 bg-muted/20 print:bg-white h-full">
                  {meta ? (
                    <>
                      <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground print:text-black uppercase border-b border-border print:border-black/10 pb-1">
                        <span>IMG_REF_{i + 1}</span>
                        <span>{formatTime(meta.timestamp)}</span>
                      </div>
                      {meta.lat && meta.lng ? (
                        <div className="flex flex-col gap-1 mt-1">
                          <span className="text-sm font-mono text-foreground flex items-center gap-1.5 leading-none mt-1">
                            <MapPin className="w-3.5 h-3.5 text-rsg-gold print:text-black" />
                            {meta.lat.toFixed(6)}, {meta.lng.toFixed(6)}
                          </span>
                          <span className="text-[10px] text-muted-foreground print:text-black">
                            {t.admin.accuracyLabel}:{" "}
                            {meta.accuracy
                              ? meta.accuracy.toFixed(1) + "M"
                              : t.admin.unknown}
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1 mt-1">
                           <div className="flex items-center">
                            <span className="text-[10px] font-mono font-semibold tracking-widest uppercase text-muted-foreground print:text-black">
                              GPS NOT AVAILABLE
                            </span>
                          </div>
                          {meta.location_status === "gallery" && (
                             <span className="text-[9px] font-mono text-muted-foreground print:text-black uppercase italic mt-1">
                              MANUAL UPLOAD (NO EXIF)
                            </span>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-[10px] font-mono text-muted-foreground print:text-foreground uppercase">
                        {t.admin.noMetadataVerified}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="w-full py-12 border border-dashed border-border bg-foreground/5 print:bg-black/5 flex flex-col items-center justify-center gap-2 rounded-md">
          <span className="text-sm font-semibold uppercase tracking-widest text-muted-foreground print:text-foreground">
            {t.admin.noPhotoEvidence}
          </span>
        </div>
      )}
    </div>
  );
}