'use client';

import React, { useEffect, useState } from 'react';
import { Share, PlusSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function IOSInstallBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Detect iOS Safari
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };

    const isSafari = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /safari/.test(userAgent) && !/chrome|crios|fxios/.test(userAgent);
    };

    // Check if running as standalone PWA
    const isStandalone = () => {
      return ('standalone' in window.navigator && (window.navigator as any).standalone) || 
             window.matchMedia('(display-mode: standalone)').matches;
    };

    if (isIos() && isSafari() && !isStandalone()) {
      // Use setTimeout to avoid synchronous setState in effect lint error
      setTimeout(() => setShow(true), 0);
    }
  }, []);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 200 }}
        animate={{ y: 0 }}
        exit={{ y: 200 }}
        className="fixed bottom-0 left-0 right-0 z-[100] p-6 pb-12 bg-rsg-surface border-t-2 border-rsg-border shadow-[0_-10px_40px_rgba(0,0,0,0.3)] font-mono rounded-none"
      >
        <button 
          onClick={() => setShow(false)} 
          className="absolute top-4 right-4 p-2 bg-rsg-background border-2 border-rsg-border"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black border-2 border-rsg-gold flex items-center justify-center font-sans font-black">
              <span className="text-rsg-gold text-lg tracking-tighter">RS</span>
            </div>
            <div className="flex flex-col">
              <span className="text-rsg-gold font-black uppercase tracking-widest text-xs">Field Ops System</span>
              <h2 className="text-xl font-black uppercase tracking-tight text-rsg-text">Install App</h2>
            </div>
          </div>
          
          <div className="bg-rsg-background p-4 border-2 border-rsg-border flex flex-col gap-2">
            <div className="flex items-center gap-3 text-sm">
              <span className="flex-1">1. Tap the Share button</span>
              <Share className="w-5 h-5 text-rsg-gold" />
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="flex-1">2. Select &apos;Add to Home Screen&apos;</span>
              <PlusSquare className="w-5 h-5 text-rsg-gold" />
            </div>
          </div>
          <p className="text-[10px] uppercase text-rsg-text/40 tracking-[0.2em] text-center">Industrial Intelligence • v3.5</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
