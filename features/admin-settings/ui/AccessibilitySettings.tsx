import { useSettings } from "../hooks/useSettings";
import { Label } from "../../../components/ui/label";
import { Switch } from "../../../components/ui/switch";

export function AccessibilitySettings() {
  const { language, reduceMotion, handleReduceMotionChange } = useSettings();

  return (
    <section className="border border-border rounded-md shadow-sm bg-card p-4 space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground font-black border-b border-border pb-2">ACCESSIBILITY</h2>
      <div className="flex flex-col">
        <div className="flex items-center justify-between py-2.5 border-b border-border">
          <Label className="text-sm font-bold uppercase tracking-tight">{language === "es" ? "Reducir Movimiento" : "Reduce Motion"}</Label>
          <Switch checked={reduceMotion} onCheckedChange={handleReduceMotionChange} className="focus-visible:ring-2 focus-visible:ring-rsg-gold shadow-sm data-[state=checked]:bg-rsg-gold" />
        </div>
        <div className="py-2.5">
          <p className="text-xs text-muted-foreground italic">
            Text size follows your device&apos;s system font scale setting
          </p>
        </div>
      </div>
    </section>
  );
}
