import { useState, useRef } from "react";
import { useStoneAppIngestion } from "../hooks/useStoneAppIngestion";
import { useJobs, useImportJobs } from "../../../entities/job/api";
import { Job } from "../../../entities/job/types";
import { X, Upload, AlertTriangle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { FileDropzone } from "./components/FileDropzone";
import { ImportPreviewTable } from "./components/ImportPreviewTable";
import { SuccessOverlay } from "./components/SuccessOverlay";
import { useUserStore } from "../../../entities/user/store";
import { dict } from "../../../entities/i18n/dict";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportModal({ isOpen, onClose }: ImportModalProps) {
  const { data: existingJobs = [] } = useJobs();
  const { language } = useUserStore();
  const t = dict[language].admin;
  const { parseCSV, parsedData, error, isParsing, clearData } =
    useStoneAppIngestion(existingJobs);
  const { mutate: importJobs, isPending: isImporting } = useImportJobs();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedWoNumbers, setSelectedWoNumbers] = useState<Set<string>>(
    new Set(),
  );
  const [prevParsedData, setPrevParsedData] = useState<Job[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [importCount, setImportCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (parsedData !== prevParsedData) {
    setPrevParsedData(parsedData);
    if (parsedData.length > 0) {
      const newJobWoNumbers = (parsedData as any[])
        .filter((j) => !j.conflict)
        .map((j) => j.wo_number!);
      setSelectedWoNumbers(new Set(newJobWoNumbers));
    } else {
      setSelectedWoNumbers(new Set());
    }
  }

  const handleFile = (file: File) => {
    if (file.type === "text/csv" || file.name.endsWith(".csv")) {
      parseCSV(file);
    } else {
      alert(language === "es" ? "Por favor suba un archivo CSV válido." : "Please upload a valid CSV file.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const toggleSelectAll = () => {
    if (selectedWoNumbers.size === parsedData.length) {
      setSelectedWoNumbers(new Set());
    } else {
      setSelectedWoNumbers(new Set(parsedData.map((j) => j.wo_number!)));
    }
  };

  const toggleJob = (wo: string) => {
    const next = new Set(selectedWoNumbers);
    if (next.has(wo)) next.delete(wo);
    else next.add(wo);
    setSelectedWoNumbers(next);
  };

  const onFinalize = () => {
    const jobsToImport = parsedData.filter((j) =>
      selectedWoNumbers.has(j.wo_number!),
    );
    if (jobsToImport.length === 0) return;

    importJobs(jobsToImport, {
      onSuccess: () => {
        setImportCount(jobsToImport.length);
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          onClose();
          clearData();
        }, 2000);
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-rsg-surface border-2 border-rsg-border shadow-[10px_10px_0px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col max-h-[90vh] rounded-none"
      >
        <AnimatePresence>
          {showSuccess && <SuccessOverlay importCount={importCount} />}
        </AnimatePresence>

        <div className="h-14 border-b border-rsg-border px-6 flex items-center justify-between bg-rsg-surface">
          <div className="flex items-center gap-3">
            <Upload className="w-5 h-5 text-rsg-gold" />
            <h2 className="font-black uppercase tracking-[0.2em] text-rsg-text">
              {t.importStoneAppData}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-rsg-background transition-colors text-rsg-text/60 hover:text-rsg-text"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-rsg-background">
          {parsedData.length === 0 ? (
            <FileDropzone
              isDragging={isDragging}
              isParsing={isParsing}
              fileInputRef={fileInputRef}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onFileSelect={handleFile}
            />
          ) : (
            <ImportPreviewTable
              parsedData={parsedData}
              selectedWoNumbers={selectedWoNumbers}
              toggleSelectAll={toggleSelectAll}
              toggleJob={toggleJob}
              clearData={clearData}
              setSelectedWoNumbers={setSelectedWoNumbers}
            />
          )}

          {error && (
            <div className="mt-4 p-4 border border-red-500/50 bg-red-500/10 flex items-center gap-3 text-red-500 rounded-none">
              <AlertTriangle className="w-5 h-5" />
              <p className="text-[10px] font-black uppercase tracking-widest">
                {error}
              </p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-rsg-border bg-rsg-surface flex justify-end gap-4 rounded-none">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-rsg-border font-black uppercase tracking-widest text-[10px] text-rsg-text hover:bg-rsg-background transition-colors rounded-none"
          >
            {t.cancel}
          </button>
          <button
            disabled={selectedWoNumbers.size === 0 || isImporting}
            onClick={onFinalize}
            className={`px-8 py-3 bg-rsg-gold text-rsg-background font-black uppercase tracking-[0.2em] text-[10px] shadow-[4px_4px_0px_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 rounded-none
              ${selectedWoNumbers.size === 0 || isImporting ? "opacity-50 cursor-not-allowed grayscale" : "hover:scale-[1.02]"}`}
          >
            {isImporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-rsg-background" />
                {t.processingHydration}
              </>
            ) : (
              `${t.finalizeImport} (${selectedWoNumbers.size} ${t.selected})`
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
