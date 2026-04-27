"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSyncManager } from "@/shared/lib/useSyncManager";

export function SyncIndicator() {
  const { status, pendingCount, clearErrors } = useSyncManager();

  return (
    <AnimatePresence mode="popLayout">
      {status === "ONLINE" && pendingCount === 0 && (
        <motion.div
          key="online"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-2 bg-surface"
        >
          <div className="w-2 h-2 bg-primary rounded-none" />
        </motion.div>
      )}

      {status === "SYNCING" && (
        <motion.div
          key="syncing"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-2 px-2 py-1 bg-surface border border-primary relative overflow-hidden rounded-none"
        >
          <motion.div
            className="absolute inset-0 bg-primary/20"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
          <span className="text-[10px] font-black uppercase tracking-widest text-primary relative z-10 hidden sm:inline-block">
            Syncing
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-primary relative z-10 sm:hidden">
            Sync
          </span>
        </motion.div>
      )}

      {status === "OFFLINE" && (
        <motion.button
          key="offline"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => pendingCount > 0 && clearErrors()}
          className="flex items-center gap-2 px-2 py-1 bg-red-950 border border-red-600 rounded-none shadow-[0_0_10px_rgba(220,38,38,0.3)] cursor-pointer"
        >
          <div className="w-1.5 h-1.5 bg-red-500 rounded-none animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-red-500 whitespace-nowrap">
            {pendingCount > 0 ? `${pendingCount} PENDING` : "OFFLINE"}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
