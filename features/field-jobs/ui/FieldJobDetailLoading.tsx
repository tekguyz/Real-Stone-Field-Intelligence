import { Loader2 } from "lucide-react";

export function FieldJobDetailLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );
}
