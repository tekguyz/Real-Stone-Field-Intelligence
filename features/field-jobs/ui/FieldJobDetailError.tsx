import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function FieldJobDetailError({ language, t }: { language: string, t: any }) {
  return (
    <div className="p-6 bg-background h-screen">
      <Link href="/field" className="flex items-center gap-2 text-primary mb-6">
        <ArrowLeft className="w-5 h-5" />
        {t.back}
      </Link>
      <h1 className="text-2xl font-bold text-foreground">
        {language === "es" ? "Trabajo no encontrado" : "Job not found"}
      </h1>
    </div>
  );
}
