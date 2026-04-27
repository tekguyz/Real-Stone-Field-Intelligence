"use client";

import Image from "next/image";
import { useUserStore } from "../../../entities/user/store";
import { dict } from "../../../entities/i18n/dict";

interface ReportSignatureSectionProps {
  signatureUrl?: string | null;
  jobId: string;
  updatedAt?: string;
}

export function ReportSignatureSection({
  signatureUrl,
  jobId,
}: ReportSignatureSectionProps) {
  const { language } = useUserStore();
  const t = dict[language].admin;

  return (
    <div className="p-6 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-surface print:bg-white print:break-inside-avoid">
      <div className="flex flex-col gap-2 w-full max-w-sm">
        <h3 className="font-black uppercase tracking-widest text-xs border-b border-border print:border-black/20 pb-2">
          {language === "es" ? "Autorización del Cliente" : "Client Authorization"}
        </h3>
        {signatureUrl ? (
          <div className="w-full h-32 border-2 border-foreground print:border-black bg-white flex items-center justify-center p-2 relative">
            <Image
              src={signatureUrl}
              alt="Signature"
              fill
              className="object-contain p-2"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          <div className="data-slab bg-foreground text-background print:bg-black print:text-white px-4 py-3 font-mono text-sm tracking-widest uppercase">
            {language === "es" ? "NO SE REQUIERE FIRMA" : "NO SIGNATURE REQUIRED"}
          </div>
        )}
      </div>

      <div className="flex flex-col items-end text-right">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40">
          {language === "es" ? "Token de Autorización Digital" : "Digital Authorization Token"}
        </span>
        <span className="font-mono text-xs text-foreground/80 print:text-black break-all max-w-[300px] uppercase">
          SIG-{jobId.substring(0, 8)}-
          {Math.abs(
            jobId
              .split("")
              .reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0),
          ).toString(16)}
        </span>
      </div>
    </div>
  );
}
