import { motion } from "motion/react";
import { Sun, Moon, Laptop } from "lucide-react";
import { dict } from "../../../entities/i18n/dict";

export function ProfilePreferences({ language, theme, handleLanguageToggle, handleThemeChange }: { language: "en" | "es", theme: string | undefined, handleLanguageToggle: any, handleThemeChange: any }) {
  const t = dict[language].field;

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
    </>
  );
}
