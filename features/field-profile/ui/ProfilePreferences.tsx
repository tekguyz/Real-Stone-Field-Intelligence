import { motion } from "motion/react";
import { Sun, Moon, Laptop, Bell, BellOff, Loader2 } from "lucide-react";
import { dict } from "../../../entities/i18n/dict";
import { usePushNotifications } from "../../notifications/hooks/usePushNotifications";

export function ProfilePreferences({ language, theme, handleLanguageToggle, handleThemeChange }: { language: "en" | "es", theme: string | undefined, handleLanguageToggle: any, handleThemeChange: any }) {
  const t = dict[language].field;
  const { isSubscribed, isSupported, subscribeUser, unsubscribeUser, loading } = usePushNotifications();

  return (
    <>
      <section>
        <h3 className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.2em] mb-2">
          {t.languageSelection}
        </h3>
        <div className="flex p-1 gap-1 border-2 border-border dark:border dark:border-primary/60 dark:shadow-none rounded-none">
          {(["en", "es"] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageToggle(lang)}
              className={`flex-1 h-12 flex items-center justify-center font-black text-[10px] uppercase tracking-widest transition-all rounded-none ${
                language === lang
                  ? "bg-rsg-gold text-black border-2 border-foreground"
                  : "border-0 text-foreground/40 hover:text-foreground/60 hover:bg-foreground/5"
              }`}
            >
              {lang === "en" ? "English" : "Español"}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.2em] mb-2">
           {language === "es" ? "Tema de Pantalla" : "Display Theme"}
        </h3>
        <div className="flex p-1 gap-1 border-2 border-border dark:border dark:border-primary/60 dark:shadow-none rounded-none">
          {[
            { id: "light", icon: Sun, label: language === "es" ? "Luz" : "Light" },
            { id: "dark", icon: Moon, label: language === "es" ? "Oscuro" : "Dark" },
            { id: "system", icon: Laptop, label: language === "es" ? "Auto" : "Auto" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleThemeChange(item.id)}
              className={`flex-1 h-12 flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all rounded-none ${
                theme === item.id
                  ? "bg-rsg-gold text-black border-2 border-foreground"
                  : "border-0 text-foreground/40 hover:text-foreground/60 hover:bg-foreground/5"
              }`}
            >
              <item.icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.2em] mb-2">
          {language === "es" ? "Notificaciones" : "Notifications"}
        </h3>
        <div className="p-3 flex flex-col gap-4 border-2 border-border dark:border dark:border-primary/60 dark:shadow-none rounded-none">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 flex items-center justify-center border-2 border-foreground rounded-none ${isSubscribed ? "bg-rsg-gold text-black" : "bg-foreground/5 text-foreground/40 border-transparent"}`}>
              {isSubscribed ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-black uppercase tracking-widest text-foreground">
                {language === "es" ? "Alertas Push" : "Push Alerts"}
              </span>
              <span className="text-[10px] font-mono font-bold text-foreground/40 uppercase tracking-widest leading-none mt-1">
                {!isSupported 
                  ? (language === "es" ? "No Soportado" : "Not Supported")
                  : isSubscribed 
                    ? (language === "es" ? "Activado" : "Enabled")
                    : (language === "es" ? "Desactivado" : "Disabled")}
              </span>
            </div>
          </div>

          <button
            onClick={() => isSubscribed ? unsubscribeUser() : subscribeUser()}
            disabled={!isSupported || loading}
            className={`rugged-button-sm h-11 px-6 flex items-center justify-center font-black text-[11px] uppercase tracking-widest transition-colors rounded-none ${
              isSubscribed 
                ? "bg-foreground/10 text-foreground hover:bg-foreground/20 shadow-none border-foreground/30" 
                : "bg-foreground text-background hover:opacity-90"
            } disabled:opacity-30 disabled:grayscale`}
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : isSubscribed ? (
              language === "es" ? "DESACTIVAR" : "DISABLE"
            ) : (
              language === "es" ? "ACTIVAR" : "ENABLE"
            )}
          </button>
        </div>
      </section>
    </>
  );
}
