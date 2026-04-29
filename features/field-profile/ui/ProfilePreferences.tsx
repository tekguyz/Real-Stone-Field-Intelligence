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
        <div className="bg-surface border border-border flex p-1">
          {(["en", "es"] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageToggle(lang)}
              className={`flex-1 h-12 flex items-center justify-center font-bold text-[10px] uppercase tracking-[0.2em] transition-all relative ${
                language === lang
                  ? "text-primary-foreground z-10"
                  : "text-foreground/40 hover:text-foreground/60 hover:bg-foreground/5"
              }`}
            >
              {language === lang && (
                <motion.div
                  layoutId="lang-pill-field"
                  className="absolute inset-0 bg-primary -z-10"
                  transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                />
              )}
              {lang === "en" ? "English" : "Español"}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.2em] mb-2">
           {language === "es" ? "Tema de Pantalla" : "Display Theme"}
        </h3>
        <div className="bg-surface border border-border flex p-1">
          {[
            { id: "light", icon: Sun, label: language === "es" ? "Luz" : "Light" },
            { id: "dark", icon: Moon, label: language === "es" ? "Oscuro" : "Dark" },
            { id: "system", icon: Laptop, label: language === "es" ? "Auto" : "Auto" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleThemeChange(item.id)}
              className={`flex-1 h-12 flex items-center justify-center gap-2 font-bold text-[10px] uppercase tracking-[0.2em] transition-all relative ${
                theme === item.id
                  ? "text-primary-foreground z-10"
                  : "text-foreground/40 hover:text-foreground/60 hover:bg-foreground/5"
              }`}
            >
              {theme === item.id && (
                <motion.div
                  layoutId="theme-pill-field"
                  className="absolute inset-0 bg-primary -z-10"
                  transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                />
              )}
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
        <div className="bg-surface border-2 border-foreground p-4 flex items-center justify-between shadow-[4px_4px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isSubscribed ? "bg-rsg-gold/20 text-rsg-gold" : "bg-foreground/5 text-foreground/40"}`}>
              {isSubscribed ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase tracking-widest text-foreground">
                {language === "es" ? "Alertas Push" : "Push Alerts"}
              </span>
              <span className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest">
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
            className={`h-10 px-4 flex items-center justify-center font-black text-[10px] uppercase tracking-widest border-2 border-foreground transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
              isSubscribed 
                ? "bg-foreground text-background shadow-[2px_2px_0px_rgba(0,0,0,0.1)]" 
                : "bg-rsg-gold text-foreground shadow-[2px_2px_0px_rgba(0,0,0,1)]"
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
