'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

interface SignaturePadProps {
  onSignatureChange: (dataUrl: string | null) => void;
  language: 'en' | 'es';
}

export function SignaturePad({ onSignatureChange, language }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // Resize canvas responsively
  useEffect(() => {
    if (!isActive) return;
    
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
        
        // Theme-aware pen color
        const isDark = document.documentElement.classList.contains('dark');
        ctx.strokeStyle = isDark ? '#eab308' : '#000000'; // RSG Gold in dark, Black in light
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [isActive]);

  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement> | PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    // clientX/Y are relative to viewport, rect.left/top are also relative to viewport.
    // This gives coordinate relative to canvas top-left.
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

  return (
    <div className="flex flex-col gap-2">
      <div 
        onClick={() => !isActive && setIsActive(true)}
        className={`relative w-full transition-all duration-300 overflow-hidden cursor-pointer rounded-sm border ${
          isActive ? 'h-48' : 'h-16'
        } ${isActive ? 'bg-white dark:bg-[#0a0a0a] border-primary/30' : 'bg-surface border-border/50 hover:border-primary/30'} flex flex-col items-center justify-center`}
      >
        {!isActive ? (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">
              {language === 'en' ? 'Tap To Sign (Optional)' : 'Toque para Firmar (Opcional)'}
            </span>
          </div>
        ) : (
          <div className="w-full h-full relative">
            <canvas
              ref={canvasRef}
              onPointerDown={startDrawing}
              onPointerMove={draw}
              onPointerUp={stopDrawing}
              onPointerOut={stopDrawing}
              className="w-full h-full touch-none"
            />
            
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={clearSignature}
                className="px-2 py-1 bg-foreground/5 hover:bg-foreground/10 text-[8px] font-black uppercase tracking-widest text-foreground/40 hover:text-foreground/60 transition-colors"
              >
                {language === 'en' ? 'Clear' : 'Borrar'}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsActive(false);
                }}
                className="px-2 py-1 bg-primary text-primary-foreground text-[8px] font-black uppercase tracking-widest"
              >
                {language === 'en' ? 'Done' : 'Listo'}
              </button>
            </div>

            {!hasSignature && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 transition-opacity">
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-black">
                   {language === 'en' ? 'Sign on the Slab' : 'Firme en el Slab'}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
