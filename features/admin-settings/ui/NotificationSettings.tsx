import { Label } from "../../../components/ui/label";
import { Switch } from "../../../components/ui/switch";
import { Lock } from "lucide-react";

export function NotificationSettings() {
  return (
    <section className="py-8 space-y-6">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 font-black">NOTIFICATIONS</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm font-bold uppercase tracking-tight flex items-center gap-2">
              Job status change alerts
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-3 h-3 text-muted-foreground" />
            <Switch disabled />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm font-bold uppercase tracking-tight flex items-center gap-2">
              New assignment alerts
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-3 h-3 text-muted-foreground" />
            <Switch disabled />
          </div>
        </div>
      </div>
    </section>
  );
}
