"use client";

import { useRouter } from "next/navigation";
import { useJobs } from "../../../../entities/job/api";
import { Job } from "../../../../entities/job/types";
import { Printer, ChevronLeft } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, use } from "react";
import { ReportHeader } from "../../../../features/job-report/ui/ReportHeader";
import { ReportStatsGrid } from "../../../../features/job-report/ui/ReportStatsGrid";
import { ReportEvidenceGallery } from "../../../../features/job-report/ui/ReportEvidenceGallery";
import { ReportSignatureSection } from "../../../../features/job-report/ui/ReportSignatureSection";
import { useUserStore } from "../../../../entities/user/store";
import { dict } from "../../../../entities/i18n/dict";
import { JOB_STATUSES } from "../../../../lib/constants/statuses";

const formatTime = (dateStr: string | number, language: string) => {
  return new Intl.DateTimeFormat(language === "es" ? "es-ES" : "en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(dateStr));
};

export default function MasterJobReport({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: jobs, isLoading } = useJobs();
  const { language } = useUserStore();
  const t = dict[language].admin;

  const job = jobs?.find((j: Job) => j.id === id || j.legacy_id === id);

  useEffect(() => {
    document.title = job
      ? `Report - ${job.client_name} - ${job.wo_number || job.legacy_id}`
      : t.workOrderNotFound;
  }, [job, t.workOrderNotFound]);

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
          {t.workOrderNotFound}
        </h2>
        <button
          onClick={() => router.back()}
          className="mt-4 border border-border px-4 py-2 hover:bg-surface transition-colors"
        >
          {t.returnToJobs}
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

  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!job || isLoading) return;
    console.log("Printing job report:", job.id);
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

  const isPendingExecution = job.status === JOB_STATUSES.PENDING || job.status === JOB_STATUSES.ASSIGNED;
  const showCompletionData = !isPendingExecution;

  return (
    <div className="w-full bg-background print:bg-white min-h-[100dvh] flex flex-col md:h-screen overflow-hidden">
      {/* Top Bar - Hidden on Print */}
      <div className="w-full max-w-5xl mx-auto p-4 md:px-8 md:pt-8 md:pb-4 flex justify-between items-center print:hidden shrink-0">
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
          {t.backToDashboard}
        </button>
        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-2 bg-rsg-gold text-black px-4 py-2 font-semibold tracking-widest uppercase transition-opacity hover:opacity-90 active:scale-[0.98] rounded-md shadow-sm border-0 print:hidden h-10 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          {t.printReport}
        </button>
      </div>

      {/* Main Content Area - Scrollable on Web, Static on Print */}
      <div className="flex-1 overflow-y-auto print:overflow-visible p-4 md:px-8 md:pb-12 custom-scrollbar print:p-0">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-5xl mx-auto border-4 border-foreground print:border-black bg-card print:bg-white flex flex-col rounded-none shadow-[8px_8px_0px_rgba(0,0,0,0.1)] print:shadow-none print-certificate-border"
        >
          <div className="print-no-break">
            <ReportHeader job={job} headerWoId={headerWoId} />
          </div>
          
          {isPendingExecution && (
            <div className="bg-[#ff5f00] text-white p-4 text-center font-black uppercase tracking-[0.3em] border-b-4 border-foreground print:border-black print-no-break">
              {t.awaitingFieldExecution}
            </div>
          )}

          <div className="print-no-break">
            <ReportStatsGrid job={job} avgAccuracy={avgAccuracy} />
          </div>
          
          {showCompletionData && (
            <div className="flex flex-col">
              <div className="print-no-break">
                <ReportEvidenceGallery
                  allPhotos={allPhotos}
                  getProofMetadata={getProofMetadata}
                  formatTime={(dateStr) => formatTime(dateStr, language)}
                />
              </div>
              <div className="print-no-break">
                <ReportSignatureSection
                  signatureUrl={signatureUrl}
                  jobId={job.id}
                  updatedAt={job.updated_at}
                />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
