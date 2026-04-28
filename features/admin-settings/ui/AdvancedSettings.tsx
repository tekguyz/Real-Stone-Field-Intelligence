import { useSettings } from "../hooks/useSettings";
import { Label } from "../../../components/ui/label";
import { Switch } from "../../../components/ui/switch";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";

export function AdvancedSettings() {
  const { demoMode, handleDemoModeChange, cacheSize, handleClearCache } = useSettings();

  return (
    <section className="py-8 space-y-6">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 font-black">ADVANCED</h2>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm font-bold uppercase tracking-tight">Demo Mode</Label>
            <p className="text-xs text-muted-foreground">Show demo banner</p>
          </div>
          <Switch checked={demoMode} onCheckedChange={handleDemoModeChange} className="focus-visible:ring-2 focus-visible:ring-rsg-gold" />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm font-bold uppercase tracking-tight">Offline Storage</Label>
            <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-tighter">Estimated cache size: {cacheSize}</p>
          </div>
        </div>

        <div>
          <Dialog>
            <DialogTrigger>
              <Button variant="outline" size="sm" className="text-[10px] font-black uppercase tracking-widest border-rsg-error/20 text-rsg-error hover:bg-rsg-error hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-rsg-error">
                Clear Offline Cache
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Clear Offline Data?</DialogTitle>
                <DialogDescription>
                  This will remove cached offline data. You&apos;ll need a connection to reload job data.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="ghost" onClick={() => {}} className="uppercase text-[10px] font-black tracking-widest">Cancel</Button>
                <Button variant="destructive" onClick={handleClearCache} className="uppercase text-[10px] font-black tracking-widest">Clear Cache</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}
