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
    <section className="py-8 space-y-6">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 font-black">ACCOUNT</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">{language === "es" ? "Nombre a Mostrar" : "Display Name"}</Label>
          <input 
            type="text" 
            defaultValue="Admin User"
            className="w-full bg-surface border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors h-10 outline-none focus-visible:ring-2 focus-visible:ring-rsg-gold"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Email</Label>
          <div className="w-full bg-muted/50 border border-border px-4 py-2 text-sm text-foreground/50 h-10 flex items-center">
            admin@realstone.com
          </div>
        </div>
        <div className="md:col-span-2">
          <Dialog>
            <DialogTrigger>
              <Button variant="outline" className="text-xs font-black uppercase tracking-widest h-10 outline-none focus-visible:ring-2 focus-visible:ring-rsg-gold">
                {language === "es" ? "Cambiar Contraseña" : "Change Password"}
              </Button>
            </DialogTrigger>
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
