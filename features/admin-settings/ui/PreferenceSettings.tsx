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
    <section className="py-8 space-y-6">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 font-black">PREFERENCES</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">{t.languagePref}</Label>
          <Select value={language} onValueChange={(val: any) => setLanguage(val)}>
            <SelectTrigger className="w-full bg-surface h-10 outline-none focus-visible:ring-2 focus-visible:ring-rsg-gold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English (US)</SelectItem>
              <SelectItem value="es">Español (ES)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {language === "es" ? "Formato de Fecha" : "Date Format"}
            </div>
          </Label>
          <Select defaultValue="MM/DD/YYYY">
            <SelectTrigger className="w-full bg-surface h-10 outline-none focus-visible:ring-2 focus-visible:ring-rsg-gold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
              <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {language === "es" ? "Formato de Hora" : "Time Format"}
            </div>
          </Label>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 text-[10px] font-black uppercase tracking-widest h-10 bg-primary/10 border-primary/20 text-primary">12H</Button>
            <Button variant="outline" className="flex-1 text-[10px] font-black uppercase tracking-widest h-10 text-muted-foreground">24H</Button>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">{t.defaultTheme}</Label>
        <div className="flex bg-surface border border-border p-1 rounded-none w-full max-w-sm">
          {[
            { id: "light", icon: Sun, label: language === "es" ? "Luz" : "Light" },
            { id: "dark", icon: Moon, label: language === "es" ? "Oscuro" : "Dark" },
            { id: "system", icon: Laptop, label: language === "es" ? "Auto" : "Auto" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleThemeChange(item.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-[9px] font-black uppercase tracking-widest transition-all outline-none focus-visible:ring-2 focus-visible:ring-rsg-gold ${
                theme === item.id
                  ? "bg-foreground text-background shadow-sm"
                  : "text-foreground/40 hover:text-foreground/70 hover:bg-foreground/5"
              }`}
            >
              <item.icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
