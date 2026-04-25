import { Upload, Loader2 } from 'lucide-react';
import { RefObject } from 'react';

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
  onFileSelect
}: FileDropzoneProps) {
  return (
    <div 
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`h-64 border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all cursor-pointer bg-rsg-background
        ${isDragging ? 'border-rsg-gold bg-rsg-gold/5' : 'border-rsg-border hover:border-rsg-gold/50'}`}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
        className="hidden" 
        accept=".csv"
      />
      <div className="w-16 h-16 bg-rsg-surface border border-rsg-border flex items-center justify-center rounded-none">
        <Upload className="w-8 h-8 text-rsg-gold font-bold" />
      </div>
      <div className="text-center">
        <p className="font-black uppercase tracking-widest text-sm text-rsg-text opacity-100">Drag StoneApp CSV Here</p>
        <p className="text-[10px] uppercase font-mono text-rsg-text mt-1 tracking-widest opacity-100">or click to browse local files</p>
      </div>
      {isParsing && (
        <div className="flex items-center gap-2 text-rsg-gold font-bold animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin text-rsg-gold" />
          <span className="text-[10px] uppercase tracking-widest text-rsg-gold">Parsing Engine Active...</span>
        </div>
      )}
    </div>
  );
}
