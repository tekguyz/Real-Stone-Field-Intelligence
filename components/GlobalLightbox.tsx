"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import Image from "next/image";

export function GlobalLightbox() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const handleOpen = (e: any) => {
      if (e.detail) {
        setImageUrl(e.detail);
      }
    };
    window.addEventListener("open-lightbox", handleOpen);
    return () => window.removeEventListener("open-lightbox", handleOpen);
  }, []);

  return (
    <AnimatePresence>
      {imageUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md"
          onClick={() => setImageUrl(null)}
        >
          <button
            onClick={() => setImageUrl(null)}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors z-50"
          >
            <X className="w-6 h-6" />
          </button>
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-5xl h-[80vh] mx-auto rounded-lg overflow-hidden flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full">
              <Image
                src={imageUrl}
                alt="Enlarged"
                fill
                className="object-contain rounded-md"
                priority
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
