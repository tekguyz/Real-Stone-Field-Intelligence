import { Job } from "../../../entities/job";
import { dict } from "../../../entities/i18n/dict";
import { motion, AnimatePresence } from "motion/react";
import { useUserStore } from "../../../entities/user/store";
import { useState, useEffect } from "react";
import { AdminJobDrawerHeader } from "./AdminJobDrawerHeader";
import { AdminJobDrawerContent } from "./AdminJobDrawerContent";
import { AdminJobDrawerFooter } from "./AdminJobDrawerFooter";

export function AdminJobDrawer({
  selectedJob,
  onClose,
  onUpdateInstaller,
  onVerifyJob,
  isVerifying = false,
  installers = ["installer_juan", "installer_carlos"],
}: {
  selectedJob: Job | null;
  onClose: () => void;
  onUpdateInstaller: (jobId: string, installerId: string | null) => void;
  onVerifyJob?: (jobId: string) => void;
  isVerifying?: boolean;
  installers?: string[];
}) {
  const { language, isDevMode, activeRole } = useUserStore();
  const t = dict[language].admin;
  const [localCaptures, setLocalCaptures] = useState<{
    photos: string[];
    proofs?: any[];
    signature: string | null;
  }>({ photos: [], proofs: [], signature: null });

  useEffect(() => {
    if (!selectedJob) return;

    const loadCaptures = () => {
      if (isDevMode) {
        const stored = sessionStorage.getItem(
          `field_captures_${selectedJob.id}`,
        );
        if (stored) {
          setLocalCaptures(JSON.parse(stored));
        } else {
          setLocalCaptures({ photos: [], proofs: [], signature: null });
        }
      }
    };

    loadCaptures();
    window.addEventListener("field_capture_update", loadCaptures);
    return () =>
      window.removeEventListener("field_capture_update", loadCaptures);
  }, [selectedJob, isDevMode]);

  const allPhotos = Array.from(
    new Set([...(selectedJob?.photos || []), ...localCaptures.photos]),
  );

  const getProofMetadata = (url: string) => {
    const fromJob = selectedJob?.captured_proof?.find((p) => p.url === url);
    if (fromJob) return fromJob;
    const fromLocal = localCaptures.proofs?.find((p) => p.url === url);
    if (fromLocal) return fromLocal;
    return null;
  };

  const activeSignature = selectedJob?.signature_url || localCaptures.signature;

  return (
    <AnimatePresence>
      {selectedJob && (
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
            transition={{ type: "spring", damping: 30, stiffness: 400, mass: 1.5 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-card border-l border-border z-[110] flex flex-col"
          >
            <AdminJobDrawerHeader 
              job={selectedJob} 
              onClose={onClose} 
              t={t} 
            />

            <AdminJobDrawerContent
              job={selectedJob}
              t={t}
              language={language}
              installers={installers}
              onUpdateInstaller={onUpdateInstaller}
              localCaptures={localCaptures}
              allPhotos={allPhotos}
              getProofMetadata={getProofMetadata}
              activeSignature={activeSignature}
            />

            <AdminJobDrawerFooter
              job={selectedJob}
              onClose={onClose}
              onVerifyJob={onVerifyJob}
              isVerifying={isVerifying}
              activeRole={activeRole}
              t={t}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
