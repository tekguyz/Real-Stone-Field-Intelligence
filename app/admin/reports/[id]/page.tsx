"use client";

import { useParams, useRouter } from "next/navigation";
import { useJobs } from "../../../../entities/job/api";
import { Job } from "../../../../entities/job/types";
import { Printer, ChevronLeft } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { ReportHeader } from "../../../../features/job-report/ui/ReportHeader";
import { ReportStatsGrid } from "../../../../features/job-report/ui/ReportStatsGrid";
import { ReportEvidenceGallery } from "../../../../features/job-report/ui/ReportEvidenceGallery";
import { ReportSignatureSection } from "../../../../features/job-report/ui/ReportSignatureSection";

const formatTime = (dateStr: string | number) => {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(dateStr));
};

export default function MasterJobReport() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { data: jobs, isLoading } = useJobs();

  const job = jobs?.find((j: Job) => j.id === id || j.legacy_id === id);

  useEffect(() => {
    document.title = job
      ? `Report - ${job.client_name} - ${job.wo_number || job.legacy_id}`
      : "Job Report";
  }, [job]);

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto p-8 font-mono flex flex-col gap-8 animate-pulse">
        <div className="h-12 bg-border w-1/3"></div>
        <div className="h-8 bg-border w-1/4"></div>
        <div className="grid grid-cols-3 gap-6">
          <div className="h-32 bg-border"></div>
          <div className="h-32 bg-border"></div>
          <div className="h-32 bg-border"></div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center font-mono">
        <h2 className="text-xl font-bold uppercase tracking-widest text-foreground">
          Job Not Found
        </h2>
        <button
          onClick={() => router.back()}
          className="mt-4 border border-border px-4 py-2 hover:bg-surface transition-colors"
        >
          RETURN TO JOBS
        </button>
      </div>
    );
  }

  const devOverridesRaw =
    typeof window !== "undefined"
      ? sessionStorage.getItem("rsg-dev-overrides")
      : "{}";
  const devOverrides = JSON.parse(devOverridesRaw || "{}");
  const jobOverrides = devOverrides[job.id] || {};
  let signatureUrl = job.signature_url || jobOverrides.signature_url;

  const fieldCapturesRaw =
    typeof window !== "undefined"
      ? sessionStorage.getItem(`field_captures_${job.id}`)
      : "{}";
  const fieldCaptures = JSON.parse(fieldCapturesRaw || "{}");

  if (!signatureUrl && fieldCaptures.signature) {
    signatureUrl = fieldCaptures.signature;
  }

  const allPhotos = Array.from(
    new Set([...(job?.photos || []), ...(fieldCaptures.photos || [])]),
  );

  const getProofMetadata = (url: string) => {
    const fromJob = job?.captured_proof?.find((p) => p.url === url);
    if (fromJob) return fromJob;
    const fromLocal = fieldCaptures.proofs?.find((p: any) => p.url === url);
    if (fromLocal) return fromLocal;
    return null;
  };

  const displayId = job?.wo_number || job?.legacy_id.substring(0, 8);
  const headerWoId = displayId?.startsWith("WO-")
    ? displayId
    : "WO-" + displayId;

  const handlePrint = () => {
    window.print();
  };

  const accuracies = Array.from(allPhotos)
    .map((url: string) => getProofMetadata(url)?.accuracy)
    .filter((acc): acc is number => Boolean(acc));
  const avg =
    accuracies.length > 0
      ? accuracies.reduce((a, b) => a + b, 0) / accuracies.length
      : null;
  const avgAccuracy =
    avg !== null
      ? avg <= 10
        ? `HIGH ACCURACY (±${avg.toFixed(1)}M)`
        : `MODERATE (±${avg.toFixed(1)}M)`
      : "UNKNOWN";

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 bg-background print:bg-white print:p-0 min-h-screen">
      <div className="flex justify-between items-center mb-8 print:hidden">
        <button
          onClick={() => {
            if (window.history.length > 1) {
              router.back();
            } else {
              router.push("/command-center");
            }
          }}
          className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] hover:text-rsg-gold transition-colors group cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>
        <button
          onClick={handlePrint}
          className="btn-brutal px-6 py-2 flex items-center gap-2 hover:bg-rsg-gold hover:text-black transition-all cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
        >
          <Printer className="w-4 h-4" />
          PRINT REPORT
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full border-4 border-foreground print:border-black bg-card print:bg-white flex flex-col rounded-none"
      >
        <ReportHeader job={job} headerWoId={headerWoId} />
        <ReportStatsGrid job={job} avgAccuracy={avgAccuracy} />
        <ReportEvidenceGallery
          allPhotos={allPhotos}
          getProofMetadata={getProofMetadata}
          formatTime={formatTime}
        />
        <ReportSignatureSection
          signatureUrl={signatureUrl}
          jobId={job.id}
          updatedAt={job.updated_at}
        />
      </motion.div>
    </div>
  );
}
