'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

interface SignaturePadProps {
  onSignatureChange: (dataUrl: string | null) => void;
  onUnattendedChange: (isUnattended: boolean) => void;
  language: 'en' | 'es';
}

export function SignaturePad({ onSignatureChange, onUnattendedChange, language }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [isUnattended, setIsUnattended] = useState(false);

  // Resize canvas responsively
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // To handle high DPI displays, scale the canvas internal resolution
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
        // Text color logic handled via parsing the CSS variable during draw or setting a hex.
        // We'll use currentColor fallback by grabbing it dynamically or applying a fixed color.
        ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--color-foreground') || 'currentColor';
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

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
    if (isUnattended) return;
    setIsDrawing(true);
    setHasSignature(true);
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--color-foreground').trim() || 'black';
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || isUnattended) return;
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

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasSignature(false);
    onSignatureChange(null);
  };

  const handleUnattendedToggle = () => {
    const nextState = !isUnattended;
    setIsUnattended(nextState);
    onUnattendedChange(nextState);
    if (nextState) clearSignature();
  };

  return (
    <div className="flex flex-col gap-3">
      <div 
        className={`relative w-full h-48 bg-surface border-2 overflow-hidden transition-all duration-300 ${isUnattended ? 'border-border opacity-50 pointer-events-none' : 'border-primary/20'}`}
      >
        <canvas
          ref={canvasRef}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerOut={stopDrawing}
          className="w-full h-full touch-none cursor-crosshair"
        />
        {!hasSignature && !isUnattended && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-foreground/30 font-bold uppercase tracking-widest text-xs">
              {language === 'en' ? 'Client Signature' : 'Firma del Cliente'}
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center px-1">
        <button
          onClick={clearSignature}
          disabled={!hasSignature || isUnattended}
          className="text-xs font-bold uppercase tracking-widest text-foreground/50 hover:text-foreground disabled:opacity-30"
        >
          {language === 'en' ? 'Clear' : 'Borrar'}
        </button>

        <label className="flex items-center gap-2 cursor-pointer group">
          <div className={`w-5 h-5 border flex items-center justify-center transition-colors ${isUnattended ? 'bg-primary border-primary' : 'border-foreground/30 group-hover:border-primary'}`}>
            {isUnattended && <Check className="w-3.5 h-3.5 text-background" strokeWidth={3} />}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/70 group-hover:text-foreground transition-colors">
            {language === 'en' ? 'Site Unattended' : 'Sitio Desatendido'}
          </span>
          <input 
            type="checkbox" 
            className="hidden" 
            checked={isUnattended}
            onChange={handleUnattendedToggle}
          />
        </label>
      </div>
    </div>
  );
}
