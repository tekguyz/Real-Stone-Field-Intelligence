import { CheckCircle2, Clock } from "lucide-react";
import { JOB_STATUSES } from "../../../lib/constants/statuses";

export function FieldJobDetailVerified({ language, status }: { language: string; status?: string }) {
  const isReview = status === JOB_STATUSES.REVIEW;

  return (
    <div className={`${isReview ? "bg-rsg-gold text-[oklch(var(--rsg-background))]" : "bg-rsg-success text-[oklch(var(--rsg-background))]"} px-6 py-8 flex flex-col items-center justify-center text-center gap-3 mt-4 border-2 border-foreground shadow-[var(--rugged-shadow-md)] relative overflow-hidden`}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-foreground text-background px-4 py-0.5 text-[8px] font-black uppercase tracking-[0.4em] whitespace-nowrap">
        {language === "es" ? "BLOQUEO DE SEGURIDAD" : "SECURITY LOCK"}
      </div>
      {isReview ? (
        <Clock className="w-12 h-12 mt-2 opacity-80" />
      ) : (
        <CheckCircle2 className="w-12 h-12 mt-2 opacity-80" />
      )}
      <div className="font-black uppercase tracking-[0.35em] text-xl leading-none">
        {isReview 
          ? (language === "es" ? "PENDIENTE REVISIÓN" : "PENDING REVIEW")
          : (language === "es" ? "TRABAJO VERIFICADO" : "JOB VERIFIED")
        }
      </div>
      <div className="w-16 h-1 bg-current opacity-20 my-1" />
      <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed max-w-[280px]">
        {language === "es" ? (
          isReview 
            ? <>DOCUMENTACIÓN EN REVISIÓN.<br />ACCESO DE EDICIÓN REVOCADO.</>
            : <>DOCUMENTACIÓN FINALIZADA.<br />SITIO INMUTABLE.</>
        ) : (
          isReview
            ? <>DOCUMENTATION PENDING REVIEW.<br />EDITING ACCESS REVOKED.</>
            : <>DOCUMENTATION FINALIZED.<br />SITE RECORD IS IMMUTABLE.</>
        )}
      </p>
    </div>
  );
}
