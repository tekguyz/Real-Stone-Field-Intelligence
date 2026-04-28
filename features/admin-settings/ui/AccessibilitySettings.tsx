import { useSettings } from "../hooks/useSettings";
import { Label } from "../../../components/ui/label";
import { Switch } from "../../../components/ui/switch";

export function AccessibilitySettings() {
  const { language, reduceMotion, handleReduceMotionChange } = useSettings();

  return (
    <section className="py-8 space-y-6">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 font-black">ACCESSIBILITY</h2>
      <div className="flex items-center justify-between py-2">
        <div className="space-y-0.5">
          <Label className="text-sm font-bold uppercase tracking-tight">{language === "es" ? "Reducir Movimiento" : "Reduce Motion"}</Label>
        </div>
        <Switch checked={reduceMotion} onCheckedChange={handleReduceMotionChange} className="focus-visible:ring-2 focus-visible:ring-rsg-gold" />
      </div>
      <p className="text-xs text-muted-foreground italic">
        Text size follows your device&apos;s system font scale setting
      </p>
    </section>
  );
}
