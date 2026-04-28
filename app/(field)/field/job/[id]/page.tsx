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
  } = useFieldJobDetail(id);

  if (isJobsLoading) return <FieldJobDetailLoading />;
  if (!job) return <FieldJobDetailError language={language} t={t} />;

  const handleBackNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    const hasUnsavedChanges = processedPhotos.length > 0 || signatureData !== null;
    const isVerified = job.status === JOB_STATUSES.VERIFIED;
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

      <div className="p-4 sm:p-6 flex flex-col gap-6">
        <section className="flex justify-between items-start">
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground leading-tight pr-4">
            {job.client_name}
          </h1>
          <StatusBadge status={job.status} />
        </section>

        <div className="flex flex-col gap-6 bg-card border border-border p-3 sm:p-4">
          <JobBlockScope job={job} language={language} />
          <JobBlockSite job={job} language={language} />
          <JobBlockArrival scheduledDate={job.scheduled_arrival || job.scheduled_date} language={language} />
        </div>

        {job.photos && job.photos.length > 0 && <CapturedProofGrid photos={job.photos} language={language} />}

        {job.status === JOB_STATUSES.VERIFIED || job.status === JOB_STATUSES.REVIEW ? (
          <FieldJobDetailVerified language={language} status={job.status} />
        ) : (
          <div className="mt-2">
            <DocumentationCapture
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
