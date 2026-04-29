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
            className="w-full max-w-sm bg-card border-x-2 border-foreground shadow-[var(--rugged-shadow-md)] p-1 flex flex-col gap-6"
            style={{ borderRadius: "0px" }}
          >
            {/* Header */}
            <div className="bg-rsg-gold px-4 py-4 flex justify-between items-center border-2 border-foreground">
              <span className="font-black text-[12px] uppercase tracking-[0.3em] text-[oklch(var(--rsg-background))]">
                {language === "en"
                  ? "SYSTEM INITIALIZATION"
                  : "INICIALIZACIÓN DEL SISTEMA"}
              </span>
              <button
                onClick={onClose}
                className="rugged-button-sm p-1.5 bg-foreground text-background"
              >
                <X className="w-4 h-4" strokeWidth={3} />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 pb-5 flex flex-col gap-8">
              <p className="text-sm font-black leading-relaxed text-foreground uppercase tracking-tight">
                {language === "en"
                  ? "PRE-FLIGHT CHECKLIST: AUTHORIZE SENSORS TO CAPTURE VERIFIED DOCUMENTATION."
                  : "LISTA DE CONTROL: AUTORIZA LOS SENSORES PARA CAPTURAR DOCUMENTACIÓN VERIFICADA."}
              </p>

              <div className="flex flex-col gap-4">
                {/* Camera Item */}
                <div className="flex items-center gap-4 border-2 border-foreground p-3 bg-foreground/5 shadow-[var(--rugged-shadow-sm)]">
                  <div
                    className={`w-12 h-12 border-2 border-foreground flex items-center justify-center shrink-0 ${cameraStatus === "granted" ? "bg-rsg-success text-[oklch(var(--rsg-background))]" : cameraStatus === "denied" ? "bg-rsg-error text-white" : "bg-surface text-foreground"}`}
                  >
                    <Camera className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="font-black uppercase tracking-widest text-sm">
                      {language === "en" ? "Camera" : "Cámara"}
                    </div>
                    <div className="font-mono text-[9px] text-foreground/40 font-bold uppercase tracking-widest">
                      {language === "en"
                        ? "VISUAL PROOF"
                        : "PRUEBA VISUAL"}
                    </div>
                  </div>
                  <div>
                    {cameraStatus === "granted" && (
                      <CheckCircle2 className="w-6 h-6 text-rsg-success" strokeWidth={3} />
                    )}
                    {cameraStatus === "denied" && (
                      <AlertTriangle className="w-6 h-6 text-rsg-error" strokeWidth={3} />
                    )}
                    {cameraStatus !== "granted" &&
                      cameraStatus !== "denied" && (
                        <span className="font-mono text-[9px] uppercase font-black text-rsg-warning border-2 border-rsg-warning/30 px-2 py-1">
                          WAITING
                        </span>
                      )}
                  </div>
                </div>

                {/* Location Item */}
                <div className="flex items-center gap-4 border-2 border-foreground p-3 bg-foreground/5 shadow-[var(--rugged-shadow-sm)]">
                  <div
                    className={`w-12 h-12 border-2 border-foreground flex items-center justify-center shrink-0 ${locationStatus === "granted" ? "bg-rsg-success text-[oklch(var(--rsg-background))]" : locationStatus === "denied" ? "bg-rsg-error text-white" : "bg-surface text-foreground"}`}
                  >
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="font-black uppercase tracking-widest text-sm">
                      {language === "en" ? "Location" : "Ubicación"}
                    </div>
                    <div className="font-mono text-[9px] text-foreground/40 font-bold uppercase tracking-widest">
                      {language === "en"
                        ? "GPS VALIDATION"
                        : "VALIDACIÓN GPS"}
                    </div>
                  </div>
                  <div>
                    {locationStatus === "granted" && (
                      <CheckCircle2 className="w-6 h-6 text-rsg-success" strokeWidth={3} />
                    )}
                    {locationStatus === "denied" && (
                      <AlertTriangle className="w-6 h-6 text-rsg-error" strokeWidth={3} />
                    )}
                    {locationStatus !== "granted" &&
                      locationStatus !== "denied" && (
                        <span className="font-mono text-[9px] uppercase font-black text-rsg-warning border-2 border-rsg-warning/30 px-2 py-1">
                          WAITING
                        </span>
                      )}
                  </div>
                </div>
              </div>

              {isDenied ? (
                <div className="flex flex-col gap-3 p-4 bg-rsg-error/10 border-2 border-rsg-error shadow-[var(--rugged-shadow-sm)]">
                  <div className="font-black uppercase tracking-widest text-rsg-error flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    {language === "en" ? "ACCESS BLOCKED" : "ACCESO BLOQUEADO"}
                  </div>
                  <div className="text-[10px] font-mono text-foreground/60 leading-relaxed uppercase font-bold">
                    {language === "en"
                      ? "SETTINGS > PRIVACY > PERMISSIONS > ALLOW REAL STONE"
                      : "AJUSTES > PRIVACIDAD > PERMISOS > PERMITIR REAL STONE"}
                  </div>
                </div>
              ) : (
                <button
                  className="rugged-button-boss h-20 bg-foreground text-background font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3"
                  onClick={onContinue}
                >
                  <Settings className="w-6 h-6 text-rsg-gold" />
                  {language === "en"
                    ? "INITIALIZE SENSORS"
                    : "INICIALIZAR SENSORES"}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
