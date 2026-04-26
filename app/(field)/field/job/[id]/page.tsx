"use client";

import { use, useEffect } from "react";
import { useUserStore } from "../../../../../entities/user/store";
import { dict } from "../../../../../entities/i18n/dict";
import { SyncIndicator } from "../../../../../shared/ui/SyncIndicator";
import { PermissionPrimer } from "../../../../../features/field-jobs/ui/PermissionPrimer";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFieldJobDetail } from "../../../../../features/field-jobs/hooks/useFieldJobDetail";
import { JobStatusBadge } from "../../../../../entities/job";
import {
  JobBlockScope,
  JobBlockSite,
  JobBlockArrival,
  DocumentationCapture,
  JobActionFooter,
  CapturedProofGrid,
} from "../../../../../features/field-jobs/ui/JobDetailComponents";

export default function FieldJobDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { language } = useUserStore();
  const t = dict[language].field;
  const router = useRouter();

  const {
    job,
    isJobsLoading,
    isSubmitting,
    isFormValid,
    handleSubmitReview,
    processedPhotos,
    handleCaptureImage,
    removePhoto,
    isProcessing,
    signatureData,
    setSignatureData,
    showPrimer,
    setShowPrimer,
    cameraStatus,
    locationStatus,
    checkPermissions,
    handleContinueCapture,
  } = useFieldJobDetail(id);

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
        <Link
          href="/field"
          className="flex items-center gap-2 text-primary mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          {t.back}
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Job not found</h1>
      </div>
    );
  }

  const handleBackNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    const hasUnsavedChanges =
      processedPhotos.length > 0 || signatureData !== null;
    const isSealed = job.status === "verified";
    if (!isSealed && !isSubmitting && hasUnsavedChanges) {
      if (!window.confirm("Unsaved changes will be lost. Exit anyway?")) {
        return;
      }
    }
    router.push("/field");
  };

  return (
    <div className="flex flex-col min-h-full bg-background pb-12">
      {/* 100% Solid Header per acceptance criteria */}
      <div className="h-14 px-4 bg-background border-b border-border sticky top-0 z-20 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackNavigation}
            className="text-foreground/50 hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-mono text-xs text-foreground/40 uppercase tracking-[0.2em] font-bold">
            {language === "en" ? "Job Details" : "Detalles"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <SyncIndicator />
        </div>
      </div>

      <div className="p-4 sm:p-6 flex flex-col gap-6">
        {/* Block 1 (Header) */}
        <section className="flex justify-between items-start">
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground leading-tight pr-4">
            {job.client_name}
          </h1>
          <JobStatusBadge status={job.status} />
        </section>

        <div className="flex flex-col gap-6 bg-card border border-border p-3 sm:p-4">
          {/* Block 2 (Installation Scope) */}
          <JobBlockScope job={job} language={language} />

          {/* Block 3 (Project Site) */}
          <JobBlockSite job={job} language={language} />

          {/* Block 4 (Scheduled Arrival) */}
          <JobBlockArrival
            scheduledDate={job.scheduled_arrival || job.scheduled_date}
            language={language}
          />
        </div>

        {/* Display captured proof if it exists */}
        {job.photos && job.photos.length > 0 && (
          <CapturedProofGrid photos={job.photos} language={language} />
        )}

        {/* Verification Lock or Capture */}
        {job.status === "verified" ? (
          <div className="bg-rsg-success text-rsg-surface px-6 py-5 flex flex-col items-center justify-center text-center gap-3 mt-4 border-2 border-rsg-border relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-rsg-border text-rsg-surface px-3 py-0.5 text-[8px] font-black uppercase tracking-[0.4em]">
              Security Lock
            </div>
            <CheckCircle2 className="w-10 h-10 text-rsg-surface mt-2" />
            <div className="font-black uppercase tracking-[0.3em] text-lg leading-none">
              JOB SEALED & VERIFIED
            </div>
            <div className="w-16 h-0.5 bg-rsg-surface/30 my-1" />
            <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-rsg-surface/80 leading-relaxed">
              DOCUMENTATION FINALIZED via HQ.
              <br />
              Site record is immutable.
            </p>
          </div>
        ) : (
          <div className="mt-2">
            <DocumentationCapture
              permissionStatus={
                cameraStatus === "granted" || locationStatus === "granted"
                  ? "granted"
                  : "pending"
              }
              checkPermissions={checkPermissions}
              handleCaptureImage={handleCaptureImage}
              isProcessing={isProcessing}
              processedPhotos={processedPhotos}
              removePhoto={removePhoto}
              setSignatureData={setSignatureData}
              language={language}
            />

            <JobActionFooter
              jobStatus={job.status}
              isFormValid={isFormValid}
              isSubmitting={isSubmitting}
              handleSubmitReview={handleSubmitReview}
              processedPhotosLength={processedPhotos.length}
              language={language}
            />
          </div>
        )}
      </div>

      <PermissionPrimer
        isOpen={showPrimer}
        onClose={() => setShowPrimer(false)}
        onContinue={handleContinueCapture}
        language={language}
        cameraStatus={cameraStatus}
        locationStatus={locationStatus}
      />
    </div>
  );
}
