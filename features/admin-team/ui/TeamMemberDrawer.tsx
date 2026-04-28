import { useUserStore } from "../../../entities/user/store";
import { dict } from "../../../entities/i18n/dict";
import { X, HardHat, Shield, Eye, EyeOff, Edit2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { TeamStatusBadge } from "../../../entities/team/ui/TeamStatusBadge";
import { TeamMember } from "../../../entities/team/model/types";
import { useState } from "react";

interface TeamMemberDrawerProps {
  selectedMember: TeamMember | null;
  onClose: () => void;
}

export function TeamMemberDrawer({ selectedMember, onClose }: TeamMemberDrawerProps) {
  const { language } = useUserStore();
  const t = dict[language].admin;
  const [showPin, setShowPin] = useState(false);

  const handleClose = () => {
    onClose();
    setShowPin(false);
  };

  return (
    <AnimatePresence>
      {selectedMember && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
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
                {language === "es" ? "Detalles del Miembro" : "Member Details"}
              </h2>
              <button
                onClick={handleClose}
                className="p-2 hover:text-primary text-foreground/40 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 border-2 border-primary/20 bg-primary/10 text-primary flex items-center justify-center font-black text-2xl">
                  {selectedMember.initials}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedMember.name}</h3>
                  <div className="flex items-center gap-2 text-foreground/60">
                    {selectedMember.isInstaller ? <HardHat className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                    <span className="text-sm">{selectedMember.role}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-surface/50 border border-border">
                  <p className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest mb-2">
                    {language === "es" ? "Asignación Actual" : "Current Assignment"}
                  </p>
                  <div className="text-base font-bold flex items-center gap-2">
                    {selectedMember.job_id ? (
                      <>
                        <span className="text-primary font-mono whitespace-nowrap">WO# {selectedMember.job_id.replace("WO-", "")}</span>
                        <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 uppercase tracking-widest border border-primary/20">ON-SITE</span>
                      </>
                    ) : (
                      <span className="text-foreground/40 uppercase italic text-sm">{language === "es" ? "Ninguna" : "None"}</span>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-surface/50 border border-border">
                  <p className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest mb-2">
                    {t.statusHeader}
                  </p>
                  <TeamStatusBadge status={selectedMember.status} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest">Phone</span>
                  <span className="text-sm font-medium">{selectedMember.phone}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest">Email</span>
                  <span className="text-sm font-medium">{selectedMember.email}</span>
                </div>
              </div>

              <div className="p-4 bg-surface/50 border border-border relative group/pin">
                <p className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest mb-2">
                  {t.pin}
                </p>
                <div className="flex items-center justify-between">
                  <div className="font-mono text-lg tracking-[0.5em] bg-card border border-border px-3 py-1.5 rounded-none flex items-center min-w-[120px]">
                    {showPin ? selectedMember.pin : "••••"}
                  </div>
                  <button 
                    onClick={() => setShowPin(!showPin)}
                    className="p-2 hover:text-primary transition-colors text-foreground/40"
                  >
                    {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover/pin:opacity-100 transition-opacity pointer-events-none">
                   <span className="text-[8px] bg-foreground text-background px-1.5 py-0.5 uppercase tracking-tight">Contact admin to reset PIN</span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border bg-surface/30 flex flex-col gap-3">
              <button
                onClick={() => toast("Coming soon")}
                className="w-full flex items-center justify-center gap-2 bg-foreground text-background py-4 font-black uppercase tracking-[0.2em] transition-opacity hover:opacity-90 active:scale-[0.98]"
              >
                <Edit2 className="w-4 h-4" />
                {language === "es" ? "Editar Miembro" : "Edit Member"}
              </button>
              <button
                onClick={() => {
                  const confirmed = window.confirm(language === "es" ? "¿Eliminar este miembro?" : "Remove this member?");
                  if (confirmed) toast.error("Member deletion is restricted in demo mode");
                }}
                className="w-full flex items-center justify-center gap-2 border border-destructive/20 text-destructive hover:bg-destructive/10 py-4 font-black uppercase tracking-[0.2em] transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                {language === "es" ? "Eliminar Miembro" : "Remove Member"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
