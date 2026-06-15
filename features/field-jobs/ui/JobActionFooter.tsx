import { JOB_STATUSES } from "../../../lib/constants/statuses";
import { Loader2, Upload, CheckCircle2 } from "lucide-react";

export function JobActionFooter({
  jobStatus,
  isFormValid,
  isSubmitting,
  handleSubmitReview,
  handleStartJob,
  processedPhotosLength,
  language,
}: any) {
  const isSubmitted =
    jobStatus === JOB_STATUSES.REVIEW || jobStatus === JOB_STATUSES.VERIFIED;
  const isNotStarted = jobStatus === JOB_STATUSES.ASSIGNED || jobStatus === JOB_STATUSES.PENDING;

  return (
    <section className="pt-4 border-t border-border">
      {isSubmitted ? (
        <div className="bg-primary/5 border-2 border-border dark:border dark:border-primary/60 dark:shadow-none p-4 flex flex-col items-center text-center gap-3 rounded-none">
          <CheckCircle2 className="w-10 h-10 text-primary opacity-80" />
          <div className="font-black text-primary uppercase tracking-widest text-sm">
            Office Verification
          </div>
          <p className="text-[10px] text-foreground/60 font-bold uppercase tracking-widest max-w-[250px] leading-relaxed">
            Job documentation secured.
            <br />
            Site verification in progress.
          </p>
        </div>
      ) : isNotStarted ? (
        <div className="flex flex-col gap-3">
          <button
            onClick={handleStartJob}
            disabled={isSubmitting}
            className="rugged-button-boss w-full h-14 bg-rsg-gold text-black font-black uppercase tracking-widest text-lg transition-transform active:scale-95 disabled:opacity-50 rounded-none"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (language === "es" ? "INICIAR TRABAJO" : "START JOB")}
          </button>
          <p className="text-[10px] text-center font-bold text-muted-foreground uppercase tracking-widest">
            {language === "es" ? "Debes iniciar el trabajo antes de capturar fotos" : "You must start the job before capturing proof"}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <button
            onClick={handleSubmitReview}
            disabled={isSubmitting || !isFormValid}
            className={`rugged-button-boss w-full h-14 font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-transform active:scale-95 rounded-none ${
              isFormValid
                ? "bg-rsg-gold text-black"
                : "bg-surface text-foreground/30 border border-border cursor-not-allowed shadow-none active:scale-100"
            }`}
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {language === "en" ? "Complete Job" : "Completar Trabajo"}
          </button>

          {!isFormValid && (
            <div className="flex flex-col items-center gap-1 mt-2">
              {processedPhotosLength === 0 && (
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                  • Capture at least 1 photo
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
