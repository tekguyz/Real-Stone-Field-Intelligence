'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';

interface SignaturePadProps {
  onSignatureChange: (dataUrl: string | null) => void;
  language: 'en' | 'es';
}

export function SignaturePad({ onSignatureChange, language }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Resize canvas responsively
  useEffect(() => {
    if (!isActive) return;
    
    // Slight delay to ensure modal is fully rendered
    const timeout = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const resizeCanvas = () => {
        const parent = canvas.parentElement;
        if (!parent) return;
        const rect = parent.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.scale(dpr, dpr);
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.lineWidth = 3;
          
          // Theme-aware pen color using the computed token or fallback
          const computedPen = getComputedStyle(document.documentElement).getPropertyValue('--color-sig-pen').trim();
          const isDark = document.documentElement.classList.contains('dark');
          ctx.strokeStyle = computedPen || (isDark ? '#eab308' : '#000000');
        }
      };
      
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      return () => window.removeEventListener('resize', resizeCanvas);
    }, 50);
    return () => clearTimeout(timeout);
  }, [isActive]);

  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement> | PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasSignature(true);
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const dataUrl = canvasRef.current?.toDataURL('image/png') || null;
      onSignatureChange(dataUrl);
    }
  };

  const clearSignature = (e: React.MouseEvent) => {
    e.stopPropagation();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasSignature(false);
    onSignatureChange(null);
  };

  const handleDone = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsActive(false);
    if (hasSignature) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* The Slab Trigger */}
      <button 
        type="button"
        onClick={() => setIsActive(true)}
        className="w-full h-12 bg-surface hover:bg-surface/80 border border-border/50 hover:border-primary/30 flex items-center justify-center transition-colors rounded-sm"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">
          {hasSignature ? 
            (language === 'en' ? 'Signature Secured (Edit)' : 'Firma Asegurada (Editar)') :
            (language === 'en' ? 'Tap To Sign (Optional)' : 'Toque para Firmar (Opcional)')}
        </span>
      </button>
      
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center gap-2 mt-1 px-3 py-2 bg-primary/10 border border-primary/20 rounded-sm w-fit self-center"
          >
            <Check className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              {language === 'en' ? 'Signature Secured' : 'Firma Asegurada'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col bg-background/90 backdrop-blur-sm p-4 md:p-12 items-center justify-center"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl h-[60vh] bg-[var(--color-sig-bg)] border border-border/50 shadow-2xl flex flex-col overflow-hidden rounded-md"
            >
              <div className="absolute top-4 left-4 pointer-events-none">
                 <span className="text-xs font-black uppercase tracking-[0.2em] opacity-30" style={{ color: 'var(--color-sig-pen)' }}>
                    {language === 'en' ? 'Client Authorization' : 'Autorización del Cliente'}
                 </span>
              </div>
              
              <div className="absolute top-3 right-3 flex gap-2 z-10">
                <button
                  onClick={clearSignature}
                  className="px-4 py-2 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-foreground/80 transition-colors rounded-sm"
                >
                  {language === 'en' ? 'Clear' : 'Borrar'}
                </button>
                <button
                  onClick={handleDone}
                  className="px-4 py-2 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded-sm"
                >
                  {language === 'en' ? 'Done' : 'Listo'}
                </button>
              </div>

              <div className="flex-1 w-full h-full relative cursor-crosshair">
                <canvas
                  ref={canvasRef}
                  onPointerDown={startDrawing}
                  onPointerMove={draw}
                  onPointerUp={stopDrawing}
                  onPointerOut={stopDrawing}
                  className="w-full h-full touch-none"
                />
                
                {!hasSignature && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 transition-opacity">
                    <span className="text-[12px] font-mono uppercase tracking-[0.3em] font-black" style={{ color: 'var(--color-sig-pen)' }}>
                       {language === 'en' ? 'Sign Here' : 'Firme Aquí'}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
