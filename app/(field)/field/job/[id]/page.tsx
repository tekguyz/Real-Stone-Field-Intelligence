"use client";

import { use } from "react";
import { useUserStore } from "../../../../../entities/user/store";
import { dict } from "../../../../../entities/i18n/dict";
import { useRouter } from "next/navigation";
import { useFieldJobDetail } from "../../../../../features/field-jobs/hooks/useFieldJobDetail";
import { StatusBadge } from "../../../../../components/ui/StatusBadge";
import {
  JobBlockScope,
} from "../../../../../features/field-jobs/ui/JobScopeDetailed";
import {
  JobBlockSite,
  JobBlockArrival,
} from "../../../../../features/field-jobs/ui/JobHeaderMeta";
import {
  DocumentationCapture,
  CapturedProofGrid,
} from "../../../../../features/field-jobs/ui/JobPhotoCapture";
import {
  JobActionFooter,
} from "../../../../../features/field-jobs/ui/JobActionFooter";
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
    cameraStatus,
    locationStatus,
    requestPermissions,
    handleStartJob,
    isAlreadyActive,
    isVerified,
  } = useFieldJobDetail(id);

  if (isJobsLoading) return <FieldJobDetailLoading />;
  if (!job) return <FieldJobDetailError language={language} t={t} />;

  const handleBackNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    router.back();
  };

  return (
    <div className="flex flex-col min-h-full bg-background pb-4">
      <FieldJobDetailHeader language={language} handleBackNavigation={handleBackNavigation} status={job.status} />

      <div className="p-3 flex flex-col gap-3">
        <section className="flex flex-col items-start gap-1 pb-1">
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground leading-tight pr-4">
            {job.client_name}
          </h1>
        </section>

        <div className="flex flex-col gap-4 bg-card border-2 border-border dark:border dark:border-primary/60 p-3 dark:shadow-none rounded-none">
          <JobBlockScope job={job} language={language} />
          <JobBlockSite job={job} language={language} />
          <JobBlockArrival scheduledDate={job.scheduled_arrival || job.scheduled_date} language={language} />
        </div>

        {!isAlreadyActive && !isVerified && job.status !== JOB_STATUSES.REVIEW && (
          <button
            onClick={handleStartJob}
            disabled={isSubmitting}
            className="rugged-button-boss w-full h-14 bg-rsg-gold text-black font-black uppercase tracking-widest text-lg transition-transform active:scale-95 disabled:opacity-50 rounded-none"
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
              requestPermissions={requestPermissions}
              handleCaptureImage={handleCaptureImage}
              isProcessing={isProcessing}
              processedPhotos={processedPhotos}
              removePhoto={removePhoto}
              signatureData={signatureData}
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

    </div>
  );
}
