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
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-8 bg-zinc-900 border-t-4 border-rsg-gold text-white font-mono rounded-none"
      >
        <button 
          onClick={() => setShow(false)} 
          className="absolute top-2 right-2 p-2 focus:outline-none hover:bg-white/10 transition-colors rounded-none"
        >
          <X className="w-5 h-5 text-white/50" />
        </button>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black border-2 border-rsg-gold flex items-center justify-center font-sans font-black text-xs">
              <span className="text-rsg-gold uppercase">RSG</span>
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.1em] text-rsg-gold">Install Native App</p>
              <p className="text-[10px] text-white/70 uppercase">Required for optimal performance</p>
            </div>
          </div>
          <div className="bg-black p-3 border-2 border-white/10 flex items-center gap-2 text-xs uppercase">
            <span>Tap</span>
            <Share className="w-4 h-4 text-rsg-gold" />
            <span>then</span>
            <PlusSquare className="w-4 h-4 text-rsg-gold" />
            <span>Add to Home Screen</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
