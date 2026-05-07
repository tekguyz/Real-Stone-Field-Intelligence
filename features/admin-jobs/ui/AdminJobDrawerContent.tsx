"use client";

import { Job } from "../../../entities/job";
import { MapPin, ShieldCheck, Clock, Navigation } from "lucide-react";
import Image from "next/image";
import { formatInstallerName } from "../../../shared/lib/utils";
import { dict } from "../../../entities/i18n/dict";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { JOB_STATUSES } from "../../../lib/constants/statuses";

const formatTime = (ts: number | string) => {
  try {
    const d = new Date(ts);
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(d).toUpperCase();
  } catch {
    return "UNKNOWN";
  }
};

export function AdminJobDrawerContent({
  job,
  t,
  language,
  installers,
  onUpdateInstaller,
  allPhotos,
  getProofMetadata,
  activeSignature,
}: {
  job: Job;
  t: any;
  language: "en" | "es";
  installers: string[];
  onUpdateInstaller: (jobId: string, installerId: string | null) => void;
  allPhotos: string[];
  getProofMetadata: (url: string) => any;
  activeSignature: string | null;
}) {
  const isAssignmentLocked = job.status === JOB_STATUSES.VERIFIED;

  return (
    <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
      {/* Logistics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Arrival Time Block */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            {t.arrivalTime}
          </span>
          <div className="bg-surface p-3 border border-border flex items-center h-[44px] w-full rounded-md">
            <span className="font-mono text-sm text-foreground truncate">
              {job.scheduled_arrival || job.scheduled_date
                ? new Intl.DateTimeFormat(language === "es" ? "es-ES" : "en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })
                    .format(new Date(job.scheduled_arrival || job.scheduled_date || ""))
                    .toUpperCase()
                : t.awaiting}
            </span>
          </div>
        </div>

        {/* Installer Block - Forced 44px Height & Width Symmetry */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
            {t.installer}
            {isAssignmentLocked && <ShieldCheck className="w-2.5 h-2.5 text-rsg-gold" />}
          </span>
          <Select
            disabled={isAssignmentLocked}
            value={job.installer_id || "unassigned"}
            onValueChange={(val) => onUpdateInstaller(job.id, val)}
          >
            <SelectTrigger 
              className={`w-full! bg-surface! border-border! border! px-3 rounded-md focus:ring-2 focus:ring-rsg-gold focus:ring-offset-1 outline-none! uppercase text-foreground h-[44px]! tracking-widest leading-none shadow-none! [&>svg]:hidden ${
                isAssignmentLocked ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              <SelectValue>
                {job.installer_id ? formatInstallerName(job.installer_id) : t.unassigned}
              </SelectValue>
            </SelectTrigger>
            
            <SelectContent 
              side="bottom" 
              sideOffset={4} 
              align="start" 
              className="z-[1001] rounded-md min-w-[var(--radix-select-trigger-width)] bg-popover border border-border shadow-md"
            >
              <SelectItem value="unassigned" className="text-sm uppercase font-medium py-2 flex items-center">
                {t.unassigned}
              </SelectItem>
              {installers.map((inst) => (
                <SelectItem 
                  key={inst} 
                  value={inst} 
                  className="text-sm uppercase font-medium py-2 flex items-center cursor-pointer"
                >
                  {formatInstallerName(inst)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Site info */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          {t.siteInformation}
        </span>
        <div className="bg-surface p-4 border border-border rounded-md">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground/90 text-sm leading-tight">
                {job.address}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Install Scope */}
      <div className="flex flex-col gap-4">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          {t.scope}
        </span>
        <div className="flex flex-col gap-3">
          {job.stoneapp_parts?.map((part, i) => (
            <div
              key={i}
              className="border border-border p-4 bg-surface flex flex-col gap-2 border-l-2 border-l-primary rounded-md"
            >
              <div className="flex justify-between items-center pr-2">
                <span className="text-xs font-black uppercase text-foreground">
                  {part.partType}
                </span>
                <span className="text-[10px] font-mono text-primary font-bold">
                  {part.slabId}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-y-1 gap-x-4">
                <div className="flex justify-between text-[10px]">
                  <span className="text-foreground/40 font-mono uppercase">
                    {t.material}
                  </span>
                  <span className="font-bold text-foreground/80">
                    {part.material}
                  </span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-foreground/40 font-mono uppercase">
                    {dict[language].field.profile}
                  </span>
                  <span className="font-bold text-foreground/80">
                    {part.edgeProfile}
                  </span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-foreground/40 font-mono uppercase">
                    {dict[language].field.thickness}
                  </span>
                  <span className="font-bold text-foreground/80">
                    {part.thickness}
                  </span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-foreground/40 font-mono uppercase">
                    Seams
                  </span>
                  <span className="font-bold text-foreground/80">
                    {part.seams}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {(!job.stoneapp_parts || job.stoneapp_parts.length === 0) && (
            <div className="p-8 text-center border border-dashed border-border bg-foreground/[0.02]">
              <span className="text-[10px] font-mono text-foreground/30 uppercase tracking-widest italic">
                {t.noScopeData}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Logistics Notes */}
      <div className="flex flex-col gap-2 relative">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">
          {t.logistics}
        </span>
        <div className="bg-accent/50 border border-border p-4 rounded-md">
          <p className="text-sm text-foreground/80 leading-relaxed font-medium">
            &quot;{job.logistics_notes || t.noLogistics}&quot;
          </p>
        </div>
      </div>

      {/* Verified Proofs */}
      {allPhotos.length > 0 && (
        <div className="flex flex-col gap-4">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            {t.fieldDocumentation} ({allPhotos.length})
          </span>
          <div className="grid grid-cols-2 gap-3">
            {allPhotos.map((url, i) => {
              const meta = getProofMetadata(url);
              return (
                <div
                  key={i}
                  className="aspect-square bg-foreground/5 border border-border relative group overflow-hidden rounded-md cursor-pointer"
                  onClick={() => {
                    const evt = new CustomEvent('open-lightbox', { detail: url });
                    window.dispatchEvent(evt);
                  }}
                >
                  <Image
                    src={url}
                    alt={`Proof ${i + 1}`}
                    fill
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-zinc-900/90 p-2 flex flex-col gap-1 w-full pointer-events-none">
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
              );
            })}
          </div>
          {activeSignature ? (
            <div className="flex flex-col gap-2 mt-4">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                {t.clientSignature}
              </span>
              <div className="p-4 border border-border h-32 flex items-center justify-center relative rounded-md bg-zinc-100 dark:bg-zinc-800/40">
                <Image
                  src={activeSignature}
                  alt="Signature"
                  fill
                  className="object-contain p-4 invert dark:invert-0"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <span className="text-[10px] text-muted-foreground italic font-mono tracking-widest leading-none">No signature captured.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}