import { Button } from "../../../components/ui/button";

export function DangerZone() {
  return (
    <section className="border border-rsg-error/20 rounded-md shadow-sm bg-rsg-error/5 p-4 space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-rsg-error font-black border-b border-rsg-error/10 pb-2">DANGER ZONE</h2>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between py-1">
          <div className="space-y-0.5">
            <span className="text-sm font-bold uppercase tracking-tight text-rsg-error">Session</span>
            <p className="text-[10px] text-rsg-error/60 uppercase font-semibold">Instant logout</p>
          </div>
          <Button variant="destructive" className="text-[10px] font-black uppercase tracking-widest h-8 px-6 outline-none">
            Sign Out
          </Button>
        </div>
        
        <div className="relative group/delete flex items-center justify-between py-2.5 border-t border-rsg-error/10">
          <div className="space-y-0.5">
            <span className="text-sm font-bold uppercase tracking-tight text-rsg-error/40">Account Deletion</span>
            <p className="text-[10px] text-rsg-error/40 uppercase font-semibold italic">Permanent removal</p>
          </div>
          <Button variant="outline" className="text-[10px] font-black uppercase tracking-widest h-8 px-6 border-rsg-error/20 text-rsg-error/40 cursor-not-allowed" disabled>
            Delete
          </Button>
          <div className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-background/80 text-[10px] font-bold uppercase tracking-widest text-foreground pointer-events-none text-center px-4 rounded-sm border border-border">
            Contact your administrator to delete this account
          </div>
        </div>
      </div>
    </section>
  );
}
