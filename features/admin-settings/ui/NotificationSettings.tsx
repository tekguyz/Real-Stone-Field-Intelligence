import { Label } from "../../../components/ui/label";
import { Switch } from "../../../components/ui/switch";
import { Lock } from "lucide-react";

export function NotificationSettings() {
  return (
    <section className="border border-border rounded-md shadow-sm bg-card p-4 space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground font-black border-b border-border pb-2">NOTIFICATIONS</h2>
      <div className="flex flex-col">
        <div className="flex items-center justify-between py-2.5 border-b border-border">
          <Label className="text-sm font-bold uppercase tracking-tight flex items-center gap-2">
            Job status change alerts
          </Label>
          <div className="flex items-center gap-2">
            <Lock className="w-3 h-3 text-muted-foreground/50" />
            <Switch disabled />
          </div>
        </div>
        <div className="flex items-center justify-between py-2.5">
          <Label className="text-sm font-bold uppercase tracking-tight flex items-center gap-2">
            New assignment alerts
          </Label>
          <div className="flex items-center gap-2">
            <Lock className="w-3 h-3 text-muted-foreground/50" />
            <Switch disabled />
          </div>
        </div>
      </div>
    </section>
  );
}
