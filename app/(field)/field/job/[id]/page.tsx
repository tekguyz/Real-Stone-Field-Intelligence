"use client";

import { use } from "react";
import { useUserStore } from "../../../../../entities/user/store";
import { dict } from "../../../../../entities/i18n/dict";
import { PermissionPrimer } from "../../../../../features/field-jobs/ui/PermissionPrimer";
import { useRouter } from "next/navigation";
import { useFieldJobDetail } from "../../../../../features/field-jobs/hooks/useFieldJobDetail";
import { StatusBadge } from "../../../../../components/ui/StatusBadge";
import {
  JobBlockScope,
  JobBlockSite,
  JobBlockArrival,
  DocumentationCapture,
  JobActionFooter,
  CapturedProofGrid,
} from "../../../../../features/field-jobs/ui/JobDetailComponents";
import { FieldJobDetailLoading } from "../../../../../features/field-jobs/ui/FieldJobDetailLoading";
import { FieldJobDetailError } from "../../../../../features/field-jobs/ui/FieldJobDetailError";
import { FieldJobDetailVerified } from "../../../../../features/field-jobs/ui/FieldJobDetailVerified";
import { FieldJobDetailHeader } from "../../../../../features/field-jobs/ui/FieldJobDetailHeader";
import { JOB_STATUSES } from "../../../../../lib/constants/statuses";

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
    handleStartJob,
    isAlreadyActive,
    isVerified,
  } = useFieldJobDetail(id);

  if (isJobsLoading) return <FieldJobDetailLoading />;
  if (!job) return <FieldJobDetailError language={language} t={t} />;

  const handleBackNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    const hasUnsavedChanges = processedPhotos.length > 0 || signatureData !== null;
    if (!isVerified && !isSubmitting && hasUnsavedChanges) {
      if (!window.confirm(language === "es" ? "Los cambios no guardados se perderán. ¿Salir de todos modos?" : "Unsaved changes will be lost. Exit anyway?")) {
        return;
      }
    }
    router.push("/field");
  };

  return (
    <div className="flex flex-col min-h-full bg-background pb-12">
      <FieldJobDetailHeader language={language} handleBackNavigation={handleBackNavigation} />

      <div className="p-3 flex flex-col gap-3">
        <section className="flex justify-between items-start">
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground leading-tight pr-4">
            {job.client_name}
          </h1>
          <StatusBadge status={job.status} variant="rugged" />
        </section>

        <div className="flex flex-col gap-4 bg-card border-2 border-foreground p-3 shadow-[var(--rugged-shadow-sm)]">
          <JobBlockScope job={job} language={language} />
          <JobBlockSite job={job} language={language} />
          <JobBlockArrival scheduledDate={job.scheduled_arrival || job.scheduled_date} language={language} />
        </div>

        {!isAlreadyActive && !isVerified && job.status !== JOB_STATUSES.REVIEW && (
          <button
            onClick={handleStartJob}
            disabled={isSubmitting}
            className="w-full h-14 bg-rsg-gold text-black font-black uppercase tracking-widest text-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all disabled:opacity-50"
          >
            {isSubmitting ? "..." : (language === "es" ? "INICIAR TRABAJO" : "START JOB")}
          </button>
        )}

        {job.photos && job.photos.length > 0 && <CapturedProofGrid photos={job.photos} language={language} />}

        {job.status === JOB_STATUSES.VERIFIED || job.status === JOB_STATUSES.REVIEW ? (
          <FieldJobDetailVerified language={language} status={job.status} />
        ) : (
          <div className="mt-2">
            <DocumentationCapture
              cameraStatus={cameraStatus}
              locationStatus={locationStatus}
              permissionStatus={cameraStatus === "granted" || locationStatus === "granted" ? "granted" : "pending"}
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
              handleStartJob={handleStartJob}
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
