"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  Camera,
  MapPin,
  X,
  CheckCircle2,
  AlertTriangle,
  Settings,
} from "lucide-react";
import { PermissionState } from "../../../shared/lib/usePermissions";

interface PermissionPrimerProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  language: "en" | "es";
  cameraStatus: PermissionState;
  locationStatus: PermissionState;
}

export function PermissionPrimer({
  isOpen,
  onClose,
  onContinue,
  language,
  cameraStatus,
  locationStatus,
}: PermissionPrimerProps) {
  const isDenied = cameraStatus === "denied" || locationStatus === "denied";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/90 backdrop-blur-sm z-[100] flex flex-col p-6 items-center justify-center overflow-auto"
        >
          <div
            className="w-full max-w-sm bg-card border-2 border-border shadow-[8px_8px_0px_0px_var(--color-border)] p-1 flex flex-col gap-6"
            style={{ borderRadius: "0px" }}
          >
            {/* Header */}
            <div className="bg-rsg-gold px-4 py-3 flex justify-between items-center border border-border">
              <span className="font-mono text-[12px] font-black uppercase tracking-[0.2em] text-[#1f1f1f]">
                {language === "en"
                  ? "FIELD ACCESS REQUIRED"
                  : "ACCESO DE CAMPO REQUERIDO"}
              </span>
              <button
                onClick={onClose}
                className="hover:opacity-70 transition-opacity text-[#1f1f1f]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 pb-5 flex flex-col gap-8">
              <p className="text-sm font-bold leading-relaxed text-foreground/80 uppercase tracking-tight">
                {language === "en"
                  ? "Pre-Flight Checklist: Authorize sensors to capture verified job documentation."
                  : "Lista de Control: Autoriza los sensores para capturar documentación de trabajo verificada."}
              </p>

              <div className="flex flex-col gap-4">
                {/* Camera Item */}
                <div className="flex items-center gap-4 border border-border p-3 bg-surface">
                  <div
                    className={`w-10 h-10 border-2 border-border flex items-center justify-center shrink-0 ${cameraStatus === "granted" ? "bg-rsg-success text-white" : cameraStatus === "denied" ? "bg-rsg-error text-white" : "bg-surface text-foreground"}`}
                  >
                    <Camera className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-black uppercase tracking-widest text-sm">
                      {language === "en" ? "Camera" : "Cámara"}
                    </div>
                    <div className="font-mono text-[10px] text-foreground/60 uppercase">
                      {language === "en"
                        ? "Proof of Work"
                        : "Prueba de Trabajo"}
                    </div>
                  </div>
                  <div>
                    {cameraStatus === "granted" && (
                      <CheckCircle2 className="w-5 h-5 text-rsg-success" />
                    )}
                    {cameraStatus === "denied" && (
                      <AlertTriangle className="w-5 h-5 text-rsg-error" />
                    )}
                    {cameraStatus !== "granted" &&
                      cameraStatus !== "denied" && (
                        <span className="font-mono text-[10px] uppercase font-bold text-rsg-warning bg-rsg-warning/10 px-2 py-1 border border-rsg-warning/20">
                          Pending
                        </span>
                      )}
                  </div>
                </div>

                {/* Location Item */}
                <div className="flex items-center gap-4 border border-border p-3 bg-surface">
                  <div
                    className={`w-10 h-10 border-2 border-border flex items-center justify-center shrink-0 ${locationStatus === "granted" ? "bg-rsg-success text-white" : locationStatus === "denied" ? "bg-rsg-error text-white" : "bg-surface text-foreground"}`}
                  >
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-black uppercase tracking-widest text-sm">
                      {language === "en" ? "Location" : "Ubicación"}
                    </div>
                    <div className="font-mono text-[10px] text-foreground/60 uppercase">
                      {language === "en"
                        ? "Site Verification"
                        : "Verificación de Sitio"}
                    </div>
                  </div>
                  <div>
                    {locationStatus === "granted" && (
                      <CheckCircle2 className="w-5 h-5 text-rsg-success" />
                    )}
                    {locationStatus === "denied" && (
                      <AlertTriangle className="w-5 h-5 text-rsg-error" />
                    )}
                    {locationStatus !== "granted" &&
                      locationStatus !== "denied" && (
                        <span className="font-mono text-[10px] uppercase font-bold text-rsg-warning bg-rsg-warning/10 px-2 py-1 border border-rsg-warning/20">
                          Pending
                        </span>
                      )}
                  </div>
                </div>
              </div>

              {isDenied ? (
                <div className="flex flex-col gap-3 p-4 bg-rsg-error/10 border-2 border-rsg-error">
                  <div className="font-black uppercase tracking-widest text-rsg-error flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    {language === "en" ? "Access Blocked" : "Acceso Bloqueado"}
                  </div>
                  <div className="text-xs font-mono text-rsg-text/80 leading-relaxed uppercase">
                    {language === "en"
                      ? "Settings > Privacy > Camera & Location > Allow Real Stone"
                      : "Ajustes > Privacidad > Cámara y Ubicación > Permitir Real Stone"}
                  </div>
                </div>
              ) : (
                <button
                  className="btn-brutal w-full py-4 relative group"
                  onClick={onContinue}
                >
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    <Settings className="w-5 h-5" />
                    {language === "en"
                      ? "INITIALIZE SENSORS"
                      : "INICIALIZAR SENSORES"}
                  </div>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
