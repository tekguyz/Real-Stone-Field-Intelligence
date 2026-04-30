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
    <section className="border border-border rounded-md shadow-sm bg-card p-4 space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground font-black border-b border-border pb-2">ADVANCED</h2>
      
      <div className="flex flex-col">
        <div className="flex items-center justify-between py-2.5 border-b border-border">
          <div className="space-y-0.5">
            <Label className="text-sm font-bold uppercase tracking-tight">Demo Mode</Label>
            <p className="text-[10px] text-muted-foreground uppercase font-semibold">Enable Global UI Banner overlays</p>
          </div>
          <Switch checked={demoMode} onCheckedChange={handleDemoModeChange} className="focus-visible:ring-2 focus-visible:ring-rsg-gold data-[state=checked]:bg-rsg-gold" />
        </div>

        <div className="flex items-center justify-between py-2.5 border-b border-border">
          <div className="space-y-0.5">
            <Label className="text-sm font-bold uppercase tracking-tight">Offline Storage</Label>
            <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-tighter">Estimated cache size: {cacheSize}</p>
          </div>
        </div>

        <div className="py-2.5 flex items-center justify-between">
          <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">System Maintenance</Label>
          <Dialog>
            <DialogTrigger render={
              <Button variant="outline" size="sm" className="text-[10px] font-black uppercase tracking-widest border-rsg-error/20 text-rsg-error hover:bg-rsg-error hover:text-white transition-colors h-8">
                Clear Cache
              </Button>
            } />
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
