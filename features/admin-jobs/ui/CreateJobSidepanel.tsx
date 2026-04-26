import { dict } from "../../../entities/i18n/dict";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useUserStore } from "../../../entities/user/store";

export function CreateJobSidepanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { language } = useUserStore();
  const t = dict[language].admin;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-border z-[110] flex flex-col"
          >
            <div className="p-6 border-b border-border flex justify-between items-center bg-surface/30">
              <h2 className="text-xl font-black tracking-tight uppercase">
                {t.createJob}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:text-primary text-foreground/40 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              <div>
                <label className="block text-xs font-mono text-foreground/50 uppercase mb-2">
                  {t.client}
                </label>
                <input
                  type="text"
                  className="w-full bg-surface/50 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  placeholder="Client Name"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-foreground/50 uppercase tracking-[0.2em] mb-2">
                  {t.location} Address
                </label>
                <input
                  type="text"
                  className="w-full bg-surface/50 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  placeholder="123 Ocean Blvd"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-foreground/50 uppercase tracking-[0.2em] mb-2">
                    {t.city}
                  </label>
                  <input
                    type="text"
                    className="w-full bg-surface/50 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                    placeholder="e.g. Jupiter"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-foreground/50 uppercase tracking-[0.2em] mb-2">
                    Zip
                  </label>
                  <input
                    type="text"
                    className="w-full bg-surface/50 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                    placeholder="33458"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-foreground/50 uppercase tracking-[0.2em] mb-2">
                  {t.material}
                </label>
                <input
                  type="text"
                  className="w-full bg-surface/50 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  placeholder="Material Name"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-foreground/50 uppercase tracking-[0.2em] mb-2">
                  {t.installDate}
                </label>
                <input
                  type="date"
                  className="w-full bg-surface/50 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-foreground/50 uppercase tracking-[0.2em] mb-2">
                  {t.logistics} Notes
                </label>
                <textarea
                  rows={4}
                  className="w-full bg-surface/50 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none transition-colors"
                  placeholder="Gate codes, elevator restrictions, etc..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-border bg-surface/30">
              <button
                onClick={onClose}
                className="w-full bg-foreground text-background py-4 font-black uppercase tracking-[0.2em] transition-opacity hover:opacity-90 active:scale-[0.98]"
              >
                Create Work Order
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
