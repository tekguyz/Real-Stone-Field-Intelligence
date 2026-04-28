import { useUserStore } from "../../../entities/user/store";
import { dict } from "../../../entities/i18n/dict";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

interface InviteMemberDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteMemberDrawer({ isOpen, onClose }: InviteMemberDrawerProps) {
  const { language } = useUserStore();
  const t = dict[language].admin;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-card border-l border-border z-[110] flex flex-col"
          >
            <div className="p-6 border-b border-border flex justify-between items-center bg-surface/30">
              <h2 className="text-xl font-black tracking-tight uppercase">
                {t.inviteMember}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:text-primary text-foreground/40 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              <div>
                <label className="block text-[10px] font-mono text-foreground/50 uppercase tracking-[0.2em] mb-2">
                  {t.fullName}
                </label>
                <input
                  type="text"
                  className="w-full bg-surface/50 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  placeholder={language === "es" ? "e.g. Juan Pérez" : "e.g. John Doe"}
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-foreground/50 uppercase tracking-[0.2em] mb-2">
                  {t.emailAddress}
                </label>
                <input
                  type="email"
                  className="w-full bg-surface/50 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  placeholder="john@realstone.com"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-foreground/50 uppercase tracking-[0.2em] mb-2">
                  {t.userRole}
                </label>
                <Select defaultValue="installer">
                  <SelectTrigger className="w-full bg-surface/50 border border-border h-12 text-sm focus:ring-1 focus:ring-primary rounded-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="installer">{language === "es" ? "Instalador" : "Installer"}</SelectItem>
                    <SelectItem value="lead">{language === "es" ? "Instalador Principal" : "Lead Installer"}</SelectItem>
                    <SelectItem value="admin">{language === "es" ? "Admin de Oficina" : "Office Admin"}</SelectItem>
                    <SelectItem value="ops">{language === "es" ? "Gerente de Operaciones" : "Operations Manager"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-surface/50 border border-border mt-2">
                <h3 className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.2em] mb-1">
                  {t.pin}
                </h3>
                <p className="text-xs text-foreground/60 leading-relaxed font-bold uppercase">
                  {language === "es" 
                    ? "Se generará automáticamente un PIN seguro de 4 dígitos y se enviará a su correo electrónico."
                    : "A secure 4-digit PIN will be automatically generated and sent to their email."}
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-border bg-surface/30 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 border border-border bg-foreground/[0.03] text-foreground hover:bg-foreground/10 font-black tracking-widest uppercase transition-colors text-xs"
              >
                {t.cancel}
              </button>
              <button
                onClick={() => {
                  console.log("Invite sent successfully");
                  onClose();
                }}
                className="flex-1 bg-foreground text-background py-3 font-black uppercase tracking-widest transition-opacity hover:opacity-90 text-xs"
              >
                {language === "es" ? "ENVIAR" : "SEND"}
              </button>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
