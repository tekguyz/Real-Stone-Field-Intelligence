"use client";

import { useState, useRef, useEffect } from "react";
import { useUserStore } from "@/entities/user/store";
import { dict } from "@/entities/i18n/dict";
import {
  Send,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Paperclip,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ReportIssueFormProps {
  userRole: string;
  userEmail?: string | null;
  userName?: string;
}

export function ReportIssueForm({
  userRole,
  userEmail,
  userName,
}: ReportIssueFormProps) {
  const { language } = useUserStore();
  const t = dict[language].admin; // Use admin dict for shared report form if needed or common keys
  
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ticketNumber, setTicketNumber] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("submitting");
    setTicketNumber(""); // Reset ticket number for new submit

    const formData = new FormData(form);
    formData.append("form-name", "report-issue");
    formData.append("role", userRole);
    if (userEmail) formData.append("email", userEmail);
    if (userName) formData.append("name", userName);
    if (selectedFile) formData.append("attachment", selectedFile);

    try {
      const response = await fetch("/forms.html", {
        method: "POST",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
        body: formData,
      });

      if (response.ok) {
        setTicketNumber((Math.random() * 100000).toFixed(0));
        setStatus("success");
        form.reset();
        setSelectedFile(null);
      } else {
        throw new Error("Form submission failed");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMessage(language === "es" ? "Error al enviar el reporte. Por favor intente de nuevo." : "Failed to send report. Please try again.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-rsg-success/20 border-2 border-rsg-success p-8 flex flex-col items-center justify-center text-center gap-4 shadow-[4px_4px_0_px_var(--color-rsg-success)]"
      >
        <div className="w-16 h-16 bg-rsg-success flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="font-black uppercase tracking-[0.2em] text-xl text-foreground">
            {language === "es" ? "Reporte Transmitido" : "Report Transmitted"}
          </h3>
          <p className="text-xs text-foreground/70 mt-2 uppercase font-mono tracking-tighter max-w-[250px]">
            {language === "es" ? "Logística ha recibido su reporte. Ticket #" : "Logistics has received your report. Ticket #"}
            {ticketNumber}
          </p>
        </div>
        <button
          onClick={() => setStatus("idle")}
          className="bg-foreground text-background px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-rsg-gold hover:text-black transition-all mt-4"
        >
          {language === "es" ? "Nuevo Reporte" : "New Report"}
        </button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 bg-surface border border-border p-6"
    >
      <div className="flex items-center gap-3 mb-2">
        <AlertTriangle className="w-5 h-5 text-rsg-warning" />
        <h3 className="font-black uppercase tracking-tight text-lg">
          {language === "es" ? "Reportar Problema" : "Report Tool Issue"}
        </h3>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">
           {language === "es" ? "Asunto" : "Subject"}
        </label>
        <input
          required
          name="subject"
          type="text"
          placeholder={language === "es" ? "ej., Problemas de GPS, Formulario no guarda" : "e.g., GPS accuracy issues, Form not saving"}
          className="bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-rsg-gold transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">
           {language === "es" ? "Detalles" : "Details"}
        </label>
        <textarea
          required
          name="message"
          rows={4}
          placeholder={language === "es" ? "Describa el problema en detalle..." : "Describe the issue in detail..."}
          className="bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-rsg-gold transition-colors resize-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">
           {language === "es" ? "Adjunto (Opcional)" : "Attachment (Optional)"}
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-3 bg-background border border-border hover:border-rsg-gold transition-all text-sm font-bold uppercase tracking-widest"
          >
            <Paperclip className="w-4 h-4" />
            {selectedFile ? (language === "es" ? "Cambiar Archivo" : "Change File") : (language === "es" ? "Adjuntar Captura" : "Attach Screenshot")}
          </button>
          {selectedFile && (
            <div className="flex items-center gap-2 bg-foreground text-background px-3 py-1 text-[10px] font-black">
              <span className="truncate max-w-[150px]">
                {selectedFile.name}
              </span>
              <button type="button" onClick={() => setSelectedFile(null)}>
                <X className="w-3 h-3 hover:text-rsg-gold" />
              </button>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
        </div>
      </div>

      <button
        disabled={status === "submitting"}
        className="mt-2 w-full h-14 bg-foreground text-background font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all hover:bg-rsg-gold hover:text-black disabled:opacity-50"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{language === "es" ? "Transmitiendo..." : "Transmitting..."}</span>
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            <span>{language === "es" ? "Enviar Reporte" : "Submit Report"}</span>
          </>
        )}
      </button>

      {status === "error" && (
        <p className="text-[10px] font-bold text-rsg-error uppercase tracking-widest text-center mt-2">
          {errorMessage}
        </p>
      )}
    </form>

  );
}
