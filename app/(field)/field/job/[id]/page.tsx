'use client';

import { use } from 'react';
import { useUserStore } from '../../../../../entities/user/store';
import { dict } from '../../../../../entities/i18n/dict';
import { SyncIndicator } from '../../../../../shared/ui/SyncIndicator';
import { PermissionPrimer } from '../../../../../shared/ui/PermissionPrimer';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useFieldJobDetail } from '../../../../../features/field-jobs/hooks/useFieldJobDetail';
import { 
  InstallationScopeList, 
  JobLogisticsCard, 
  DocumentationCapture, 
  JobActionFooter 
} from '../../../../../features/field-jobs/ui/JobDetailComponents';

export default function FieldJobDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { language } = useUserStore();
  const t = dict[language].field;
  
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
    isUnattended,
    setIsUnattended,
    showPrimer,
    setShowPrimer,
    permissionStatus,
    checkPermissions,
    handleContinueCapture
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
        <Link href="/field" className="flex items-center gap-2 text-primary mb-6">
          <ArrowLeft className="w-5 h-5" />
          {t.back}
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Job not found</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-background pb-12">
      <div className="h-14 px-4 bg-surface border-b border-border sticky top-0 z-20 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/field" className="text-foreground/50 hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-primary uppercase tracking-[0.2em] font-bold">{job.legacy_id}</span>
            <h1 className="text-sm font-black tracking-widest text-foreground uppercase truncate max-w-[200px]">{job.client_name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SyncIndicator />
          <div className={`px-2 py-0.5 border text-[8px] font-black uppercase tracking-widest hidden sm:block ${
            job.status === 'in_progress' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-foreground/5 text-foreground/40 border-border'
          }`}>
            {dict[language].status[job.status]}
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-6 pt-6">
        <section className="flex flex-col gap-4">
          <InstallationScopeList job={job} language={language} />
          <JobLogisticsCard address={job.address} title={t.navigateToSite} />
        </section>

        <DocumentationCapture 
          permissionStatus={permissionStatus}
          checkPermissions={checkPermissions}
          handleCaptureImage={handleCaptureImage}
          isProcessing={isProcessing}
          processedPhotos={processedPhotos}
          removePhoto={removePhoto}
          setSignatureData={setSignatureData}
          setIsUnattended={setIsUnattended}
          language={language}
        />

        <JobActionFooter 
          jobStatus={job.status}
          isFormValid={isFormValid}
          isSubmitting={isSubmitting}
          handleSubmitReview={handleSubmitReview}
          processedPhotosLength={processedPhotos.length}
          signatureData={signatureData}
          isUnattended={isUnattended}
          language={language}
        />
      </div>

      <PermissionPrimer 
        isOpen={showPrimer}
        onClose={() => setShowPrimer(false)}
        onContinue={handleContinueCapture}
        language={language}
      />
    </div>
  );
}

