import { useState, useRef } from "react";
import { useStoneAppIngestion } from "../hooks/useStoneAppIngestion";
import { useJobs, useImportJobs } from "../../../entities/job/api";
import { Job } from "../../../entities/job/types";
import { X, Upload, AlertTriangle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { FileDropzone } from "./components/FileDropzone";
import { ImportPreviewTable } from "./components/ImportPreviewTable";
import { useUserStore } from "../../../entities/user/store";
import { dict } from "../../../entities/i18n/dict";
import { toast } from "sonner";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportModal({ isOpen, onClose }: ImportModalProps) {
  const { data: existingJobs = [] } = useJobs();
  const { language } = useUserStore();
  const t = dict[language].admin;
  const { parseCSV, parsedData, error, isParsing, hasParsed, clearData } =
    useStoneAppIngestion(existingJobs);
  const { mutate: importJobs, isPending: isImporting } = useImportJobs();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedWoNumbers, setSelectedWoNumbers] = useState<Set<string>>(
    new Set(),
  );
  const [prevParsedData, setPrevParsedData] = useState<Job[]>([]);
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
      toast.error(language === "es" ? "Por favor suba un archivo CSV válido." : "Please upload a valid CSV file.");
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
        toast.success(language === "es" ? "Trabajos importados con éxito." : "Jobs imported successfully.");
        onClose();
        clearData();
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
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-surface border border-border shadow-xl overflow-hidden flex flex-col max-h-[90vh] rounded-md"
      >
        <div className="h-14 border-b border-border px-6 flex items-center justify-between bg-surface">
          <div className="flex items-center gap-3">
            <Upload className="w-5 h-5 text-rsg-gold" />
            <h2 className="font-semibold uppercase tracking-widest text-foreground text-sm">
              {t.importStoneAppData}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent transition-colors text-muted-foreground hover:text-foreground rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 bg-background">
          {!hasParsed ? (
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
          ) : parsedData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-border bg-surface rounded-md">
              <AlertTriangle className="w-12 h-12 text-rsg-gold mb-4 opacity-50" />
              <p className="text-sm font-semibold uppercase tracking-widest text-foreground">
                No unimported records found
              </p>
              <p className="text-xs uppercase font-medium text-muted-foreground mt-2">
                All records in this file might have errors or are empty.
              </p>
              <button 
                onClick={clearData}
                className="mt-6 px-4 py-2 border border-border bg-background hover:bg-accent text-xs font-semibold uppercase tracking-widest transition-colors rounded-md"
               >
                 Try Another File
              </button>
            </div>
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
            <div className="mt-4 p-4 border border-red-500/50 bg-red-500/10 flex items-center gap-3 text-red-500 rounded-md">
              <AlertTriangle className="w-5 h-5" />
              <p className="text-xs font-semibold uppercase tracking-widest">
                {error}
              </p>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-border bg-surface flex justify-end gap-3 rounded-b-md">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-border font-semibold uppercase tracking-widest text-xs text-foreground hover:bg-accent transition-colors rounded-md"
          >
            {t.cancel}
          </button>
          <button
            disabled={selectedWoNumbers.size === 0 || isImporting}
            onClick={onFinalize}
            className={`px-6 py-2 bg-rsg-gold text-black font-semibold uppercase tracking-widest text-xs shadow-sm transition-all flex items-center gap-2 rounded-md
              ${selectedWoNumbers.size === 0 || isImporting ? "opacity-50 cursor-not-allowed grayscale" : "hover:bg-rsg-gold/90"}`}
          >
            {isImporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
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
