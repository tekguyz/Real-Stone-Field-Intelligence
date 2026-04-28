"use client";

import { Job } from "../../../entities/job";
import { MapPin, ShieldCheck } from "lucide-react";
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
    <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-8">
      {/* Logistics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Arrival Time Block */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest">
            {t.arrivalTime}
          </span>
          <div className="bg-rsg-surface/50 px-3 border border-border flex items-center h-[44px] w-full rounded-none">
            <span className="text-xs font-black text-foreground uppercase tracking-widest truncate leading-none">
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
          <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest flex items-center gap-1">
            {t.installer}
            {isAssignmentLocked && <ShieldCheck className="w-2.5 h-2.5 text-rsg-gold" />}
          </span>
          <Select
            disabled={isAssignmentLocked}
            value={job.installer_id || "unassigned"}
            onValueChange={(val) => onUpdateInstaller(job.id, val)}
          >
            <SelectTrigger 
              className={`w-full! bg-rsg-surface/50! border-border! border! px-3 rounded-none focus:ring-0! ring-0! outline-none! uppercase text-foreground h-[44px]! font-black text-xs tracking-widest leading-none shadow-none! [&>svg]:hidden ${
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
              className="z-[1001] rounded-none min-w-[var(--radix-select-trigger-width)] bg-popover border border-border shadow-xl"
            >
              <SelectItem value="unassigned" className="text-xs uppercase font-black tracking-widest py-3 flex items-center">
                {t.unassigned}
              </SelectItem>
              {installers.map((inst) => (
                <SelectItem 
                  key={inst} 
                  value={inst} 
                  className="text-xs uppercase font-black tracking-widest py-3 flex items-center cursor-pointer"
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
        <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest">
          {t.siteInformation}
        </span>
        <div className="bg-rsg-surface/50 p-4 border border-border">
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
        <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest">
          {t.scope}
        </span>
        <div className="flex flex-col gap-3">
          {job.stoneapp_parts?.map((part, i) => (
            <div
              key={i}
              className="border border-border p-4 bg-rsg-surface/20 flex flex-col gap-2 border-l-4 border-l-primary"
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
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.2em] mb-3">
          {t.logistics}
        </span>
        <div className="bg-amber-500/5 border border-amber-500/20 p-4">
          <p className="text-sm text-foreground/80 leading-relaxed font-bold">
            "{job.logistics_notes || t.noLogistics}"
          </p>
        </div>
      </div>

      {/* Verified Proofs */}
      {allPhotos.length > 0 && (
        <div className="flex flex-col gap-4">
          <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest">
            {t.fieldDocumentation} ({allPhotos.length})
          </span>
          <div className="grid grid-cols-2 gap-3">
            {allPhotos.map((url, i) => {
              const meta = getProofMetadata(url);
              return (
                <div
                  key={i}
                  className="aspect-square bg-foreground/5 border border-border relative group overflow-hidden"
                >
                  <Image
                    src={url}
                    alt={`Proof ${i + 1}`}
                    fill
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-center">
                    <span className="text-[10px] font-mono text-white uppercase relative z-10">
                      Proof {i + 1}
                    </span>
                    {meta?.lat && meta?.lng && (
                      <button
                        onClick={() =>
                          window.open(
                            `http://googleusercontent.com/maps.google.com/maps?q=${meta.lat},${meta.lng}`,
                            "_blank",
                          )
                        }
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
              <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest">
                {t.clientSignature}
              </span>
              <div className="bg-[#f0f0f0] p-4 border border-border h-32 flex items-center justify-center relative rounded-none">
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
  );
}