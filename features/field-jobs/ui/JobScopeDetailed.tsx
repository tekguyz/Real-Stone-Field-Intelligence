import { useState } from "react";
import { Job } from "../../../entities/job/types";
import { summarizeJobScope } from "../../../shared/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

export function JobBlockScope({
  job,
  language,
}: {
  job: Job;
  language: "en" | "es";
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const scopeText = summarizeJobScope(job.stoneapp_parts);
  const parts = job.stoneapp_parts || [];

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.2em]">
        {"Job Scope"}
      </h3>
      <div className="p-3 sm:p-4 border border-border dark:border-primary/60 bg-surface/30">
        <p className="text-sm font-bold italic leading-tight text-foreground/90">
          {scopeText}
        </p>

        {parts.length > 0 && (
          <div className="mt-4 flex flex-col">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              View Details
            </button>
            
            {isExpanded && (
              <div className="mt-3 flex flex-col gap-2 border-t border-border/50 pt-3">
                {parts.map((part, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row sm:items-center sm:flex-wrap gap-1 sm:gap-2 text-xs font-medium text-foreground py-1 border-b border-border/20 last:border-0 uppercase tracking-tight"
                  >
                    <span className="font-extrabold text-foreground">
                      {part.partType}:
                    </span>
                    <span>{part.material}</span>
                    <span className="text-foreground/30 hidden sm:inline">•</span>
                    <span className="font-mono text-[10px] text-primary">
                      {part.edgeProfile}
                    </span>
                    <span className="text-foreground/30 hidden sm:inline">•</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{part.thickness}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
