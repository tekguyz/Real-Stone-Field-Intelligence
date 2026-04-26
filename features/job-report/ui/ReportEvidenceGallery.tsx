"use client";

import { MapPin } from "lucide-react";
import { CapturedProof } from "../../../entities/job/types";
import Image from "next/image";

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
  return (
    <div className="p-6 md:p-10 border-b-4 border-foreground print:border-black">
      <h3 className="font-black uppercase tracking-[0.2em] text-lg mb-6 flex items-center gap-2">
        Field Evidence
        <span className="bg-rsg-success text-white px-2 py-0.5 text-xs">
          VERIFIED
        </span>
      </h3>

      {allPhotos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 print:grid-cols-3 gap-6">
          {allPhotos.map((url, i) => {
            const meta = getProofMetadata(url);
            return (
              <div
                key={i}
                className="flex flex-col border-2 border-foreground print:border-black bg-surface print:bg-white break-inside-avoid"
              >
                <div className="aspect-video w-full relative bg-foreground/5 print:bg-black/5">
                  <Image
                    src={url}
                    alt={`Evidence ${i + 1}`}
                    fill
                    priority={i < 2}
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-3 border-t-2 border-foreground print:border-black flex flex-col gap-2 bg-foreground text-background print:bg-white print:text-black h-full">
                  {meta ? (
                    <>
                      <div className="flex justify-between items-center text-[10px] font-mono uppercase border-b border-background/20 print:border-black/20 pb-1">
                        <span>IMG_REF_{i + 1}</span>
                        <span>{formatTime(meta.timestamp)}</span>
                      </div>
                      {meta.lat && meta.lng ? (
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-mono text-rsg-gold print:text-black font-bold flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {meta.lat.toFixed(6)}, {meta.lng.toFixed(6)}
                          </span>
                          <span className="text-[9px] font-mono text-background/60 print:text-black/60">
                            ACCURACY:{" "}
                            {meta.accuracy
                              ? meta.accuracy.toFixed(1) + "M"
                              : "UNKNOWN"}
                          </span>
                        </div>
                      ) : meta.location_status === "timeout_unavailable" ? (
                        <div className="flex items-center gap-1 text-rsg-warning print:text-black mt-1">
                          <MapPin className="w-3 h-3" />
                          <span className="text-[10px] font-mono font-bold">
                            GPS LOCK FAILED - OVERRIDE
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 bg-foreground text-background print:bg-white print:text-black print:border-2 print:border-black px-2 py-1 mt-1">
                          <span className="text-[10px] font-mono font-bold tracking-widest">
                            GPS METADATA UNAVAILABLE
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-[10px] font-mono text-background/40 print:text-black/40 uppercase">
                        No Metadata Verified
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="w-full py-12 border-2 border-dashed border-border bg-foreground/5 print:bg-black/5 flex flex-col items-center justify-center gap-2">
          <span className="text-sm font-bold uppercase tracking-widest text-foreground/40">
            No photo evidence attached.
          </span>
        </div>
      )}
    </div>
  );
}
