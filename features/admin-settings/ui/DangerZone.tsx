import { Button } from "../../../components/ui/button";

export function DangerZone() {
  return (
    <section className="py-8 space-y-6">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 font-black text-rsg-error">DANGER ZONE</h2>
      <div className="flex flex-col gap-4">
        <Button variant="destructive" className="w-full text-xs font-black uppercase tracking-widest py-6 outline-none focus-visible:ring-2 focus-visible:ring-rsg-error">
          Sign Out
        </Button>
        <div className="relative group/delete">
          <Button variant="outline" className="w-full text-xs font-black uppercase tracking-widest py-6 border-rsg-error/20 text-rsg-error/40 cursor-not-allowed" disabled>
            Delete Account
          </Button>
          <div className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-background/80 text-[10px] font-bold uppercase tracking-widest text-foreground pointer-events-none text-center px-4">
            Contact your administrator to delete this account
          </div>
        </div>
      </div>
    </section>
  );
}
