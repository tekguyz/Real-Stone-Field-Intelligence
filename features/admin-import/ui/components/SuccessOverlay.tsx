import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";

interface SuccessOverlayProps {
  importCount: number;
}

export function SuccessOverlay({ importCount }: SuccessOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[110] bg-rsg-gold flex flex-col items-center justify-center text-rsg-background text-center p-8 rounded-none"
    >
      <CheckCircle2 className="w-20 h-20 mb-4 text-rsg-background" />
      <h3 className="text-4xl font-black uppercase tracking-tighter italic text-rsg-background">
        SUCCESS: {importCount} JOBS IMPORTED
      </h3>
      <p className="font-mono text-xs uppercase tracking-widest mt-2 opacity-80 text-rsg-background">
        Hydration Complete • Dashboard Updated
      </p>
    </motion.div>
  );
}
