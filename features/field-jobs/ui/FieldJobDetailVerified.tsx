import { CheckCircle2, Clock } from "lucide-react";
import { JOB_STATUSES } from "../../../lib/constants/statuses";

export function FieldJobDetailVerified({ language, status }: { language: string; status?: string }) {
  const isReview = status === JOB_STATUSES.REVIEW;

  return (
    <div className={`${isReview ? "bg-rsg-gold" : "bg-rsg-success"} text-rsg-surface px-6 py-5 flex flex-col items-center justify-center text-center gap-3 mt-4 border-2 border-rsg-border relative overflow-hidden`}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-rsg-border text-rsg-surface px-3 py-0.5 text-[8px] font-black uppercase tracking-[0.4em]">
        {language === "es" ? "Bloqueo de Seguridad" : "Security Lock"}
      </div>
      {isReview ? (
        <Clock className="w-10 h-10 text-rsg-surface mt-2" />
      ) : (
        <CheckCircle2 className="w-10 h-10 text-rsg-surface mt-2" />
      )}
      <div className="font-black uppercase tracking-[0.3em] text-lg leading-none">
        {isReview 
          ? (language === "es" ? "PENDIENTE DE REVISIÓN" : "PENDING REVIEW")
          : (language === "es" ? "TRABAJO VERIFICADO" : "JOB VERIFIED")
        }
      </div>
      <div className="w-16 h-0.5 bg-rsg-surface/30 my-1" />
      <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-rsg-surface/80 leading-relaxed">
        {language === "es" ? (
          isReview 
            ? <>Documentación en revisión por la oficina.<br />El acceso de edición ha sido revocado.</>
            : <>Documentación finalizada vía HQ.<br />El registro del sitio es inmutable.</>
        ) : (
          isReview
            ? <>Documentation is pending office review.<br />Editing access has been revoked.</>
            : <>DOCUMENTATION FINALIZED via HQ.<br />Site record is immutable.</>
        )}
      </p>
    </div>
  );
}
