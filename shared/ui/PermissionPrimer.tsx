'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Camera, MapPin, ShieldCheck, X } from 'lucide-react';

interface PermissionPrimerProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  language: 'en' | 'es';
}

export function PermissionPrimer({ isOpen, onClose, onContinue, language }: PermissionPrimerProps) {
  const content = {
    en: {
      header: 'FIELD DOCUMENTATION',
      body: 'To comply with the "Proof of Work" standards, RSG-OS needs to capture the photo and stamp it with your current GPS coordinates.',
      action: 'Continue to Capture',
      security: 'Secure & Encrypted'
    },
    es: {
      header: 'DOCUMENTACIÓN DE CAMPO',
      body: 'Para cumplir con los estándares de "Prueba de Trabajo", RSG-OS necesita capturar la foto y marcarla con sus coordenadas GPS actuales.',
      action: 'Continuar a Capturar',
      security: 'Seguro y Encriptado'
    }
  };

  const t = content[language];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[110] pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-sm bg-background border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] pointer-events-auto overflow-hidden"
            >
              <div className="bg-foreground text-background p-4 flex justify-between items-center">
                <span className="font-mono text-[10px] font-black uppercase tracking-[0.3em]">
                  {t.header}
                </span>
                <button onClick={onClose} className="hover:text-primary transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 flex flex-col gap-8">
                <div className="flex gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="w-12 h-12 bg-primary/10 border-2 border-primary flex items-center justify-center text-primary">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div className="w-12 h-12 bg-blue-500/10 border-2 border-blue-500 flex items-center justify-center text-blue-500">
                      <MapPin className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold leading-relaxed text-foreground/80">
                      {t.body}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <button
                    onClick={onContinue}
                    className="w-full h-14 bg-foreground text-background font-black uppercase tracking-[0.2em] text-sm hover:bg-foreground/90 transition-all active:scale-[0.98]"
                  >
                    {t.action}
                  </button>
                  
                  <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-foreground/40 uppercase font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    {t.security}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
