import { Label } from "../../../components/ui/label";
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
import { useUserStore } from "../../../entities/user/store";

export function AccountSettings() {
  const { language } = useUserStore();

  return (
    <section className="border border-border rounded-md shadow-sm bg-card p-4 space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground font-black border-b border-border pb-2">ACCOUNT</h2>
      <div className="flex flex-col">
        <div className="py-2.5 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-2">
          <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">{language === "es" ? "Nombre a Mostrar" : "Display Name"}</Label>
          <input 
            type="text" 
            defaultValue="Admin User"
            className="md:w-64 bg-surface border border-border px-3 py-1.5 text-sm focus:outline-none focus:border-rsg-gold transition-colors h-9 outline-none rounded-sm"
          />
        </div>
        <div className="py-2.5 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-2">
          <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Email</Label>
          <div className="text-sm text-foreground/70 font-mono">
            admin@realstone.com
          </div>
        </div>
        <div className="py-2.5 flex items-center justify-between">
          <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">{language === "es" ? "Seguridad" : "Security"}</Label>
          <Dialog>
            <DialogTrigger render={
              <Button variant="outline" className="text-[10px] font-black uppercase tracking-widest h-8 outline-none focus-visible:ring-2 focus-visible:ring-rsg-gold">
                {language === "es" ? "Cambiar Contraseña" : "Change Password"}
              </Button>
            } />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{language === "es" ? "Cambiar Contraseña" : "Change Password"}</DialogTitle>
                <DialogDescription>
                  This feature is restricted in demo mode.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button onClick={() => {}} className="uppercase text-xs font-bold">Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}
