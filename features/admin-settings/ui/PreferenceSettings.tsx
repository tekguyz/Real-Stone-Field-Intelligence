import { useSettings } from "../hooks/useSettings";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Calendar, Clock, Sun, Moon, Laptop } from "lucide-react";

export function PreferenceSettings() {
  const { language, setLanguage, theme, t, handleThemeChange } = useSettings();

  return (
    <section className="border border-border rounded-md shadow-sm bg-card p-4 space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground font-black border-b border-border pb-2">PREFERENCES</h2>
      
      <div className="flex flex-col">
        <div className="py-2.5 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-2">
          <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">{t.languagePref}</Label>
          <Select value={language} onValueChange={(val: any) => setLanguage(val)}>
            <SelectTrigger className="md:w-64 bg-surface h-9 outline-none focus-visible:ring-2 focus-visible:ring-rsg-gold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English (US)</SelectItem>
              <SelectItem value="es">Español (ES)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="py-2.5 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-2">
          <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-rsg-gold" />
              {language === "es" ? "Formato de Fecha" : "Date Format"}
            </div>
          </Label>
          <Select defaultValue="MM/DD/YYYY">
            <SelectTrigger className="md:w-64 bg-surface h-9 outline-none focus-visible:ring-2 focus-visible:ring-rsg-gold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
              <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="py-2.5 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-2">
          <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-rsg-gold" />
              {language === "es" ? "Formato de Hora" : "Time Format"}
            </div>
          </Label>
          <div className="flex gap-1 md:w-64">
            <Button variant="outline" className="flex-1 text-[10px] font-black uppercase tracking-widest h-8 bg-rsg-gold text-black border-0">12H</Button>
            <Button variant="outline" className="flex-1 text-[10px] font-black uppercase tracking-widest h-8 text-muted-foreground bg-muted border-0">24H</Button>
          </div>
        </div>

        <div className="py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-2">
          <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">{t.defaultTheme}</Label>
          <div className="flex bg-surface border border-border p-0.5 rounded-sm w-full md:w-64 h-9">
            {[
              { id: "light", icon: Sun, label: language === "es" ? "Luz" : "Light" },
              { id: "dark", icon: Moon, label: language === "es" ? "Oscuro" : "Dark" },
              { id: "system", icon: Laptop, label: language === "es" ? "Auto" : "Auto" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleThemeChange(item.id)}
                className={`flex-1 flex items-center justify-center gap-1 px-2 text-[9px] font-black uppercase tracking-widest transition-all outline-none rounded-xs ${
                  theme === item.id
                    ? "bg-rsg-gold text-black shadow-sm"
                    : "text-foreground/40 hover:text-foreground/70 hover:bg-foreground/5"
                }`}
              >
                <item.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
