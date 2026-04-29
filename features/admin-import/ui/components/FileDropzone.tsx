import { Upload, Loader2 } from "lucide-react";
import { RefObject } from "react";
import { useUserStore } from "../../../../entities/user/store";
import { dict } from "../../../../entities/i18n/dict";

interface FileDropzoneProps {
  isDragging: boolean;
  isParsing: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (file: File) => void;
}

export function FileDropzone({
  isDragging,
  isParsing,
  fileInputRef,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
}: FileDropzoneProps) {
  const { language } = useUserStore();
  const t = dict[language].admin;

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`h-64 border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all cursor-pointer bg-background rounded-md
        ${isDragging ? "border-rsg-gold bg-rsg-gold/5" : "border-border hover:border-rsg-gold/50"}`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
        className="hidden"
        accept=".csv"
      />
      <div className="w-16 h-16 bg-surface border border-border flex items-center justify-center rounded-md">
        <Upload className="w-8 h-8 text-rsg-gold" />
      </div>
      <div className="text-center">
        <p className="font-semibold uppercase tracking-widest text-sm text-foreground">
          {t.dragStoneAppCsv}
        </p>
        <p className="text-xs font-medium uppercase text-muted-foreground mt-1 tracking-widest">
          {t.clickToBrowse}
        </p>
      </div>
      {isParsing && (
        <div className="flex items-center gap-2 text-rsg-gold font-semibold animate-pulse mt-2">
          <Loader2 className="w-4 h-4 animate-spin text-rsg-gold" />
          <span className="text-xs uppercase tracking-widest text-rsg-gold">
            {t.parsingEngineActive}
          </span>
        </div>
      )}
    </div>
  );
}
