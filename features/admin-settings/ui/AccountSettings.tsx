import { useState } from "react";
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
  const { language, userName, setUserName } = useUserStore();
  const [localName, setLocalName] = useState(userName);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalName(e.target.value);
    setUserName(e.target.value); // Hot update the store but save button also exists globally
  };

  return (
    <section className="border border-border rounded-lg shadow-sm bg-card p-6 space-y-6">
      <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground border-b border-border pb-3">Security & Identity</h2>
      <div className="flex flex-col gap-2">
        <div className="py-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <Label className="text-[10px] uppercase font-black tracking-widest text-foreground">{language === "es" ? "Nombre a Mostrar" : "Display Name"}</Label>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">How your name appears in reports & audits</p>
          </div>
          <input 
            type="text" 
            value={localName}
            onChange={handleChange}
            className="md:w-72 bg-surface border-2 border-border px-4 py-2 text-sm font-bold focus:outline-none focus:border-rsg-gold transition-all h-10 outline-none rounded-md"
          />
        </div>
        <div className="h-[1px] w-full bg-border/50 my-2"></div>
        <div className="py-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <Label className="text-[10px] uppercase font-black tracking-widest text-foreground">Email Signature</Label>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Authenticated identification handle</p>
          </div>
          <div className="text-sm text-foreground/70 font-mono bg-muted/30 px-3 py-2 rounded-md border border-border">
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
