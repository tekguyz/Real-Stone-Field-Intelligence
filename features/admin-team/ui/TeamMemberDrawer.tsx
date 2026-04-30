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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
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

            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
              <div className="flex items-center gap-4 py-2">
                <div className="w-16 h-16 border-2 border-primary/20 bg-primary/10 text-primary flex items-center justify-center font-black text-2xl">
                  {selectedMember.initials}
                </div>
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-tight">{selectedMember.name}</h3>
                  <div className="flex items-center gap-2 text-foreground/60">
                    {selectedMember.isInstaller ? <HardHat className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                    <span className="text-xs uppercase font-bold tracking-widest">{selectedMember.role}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-surface/50 border border-border">
                  <p className="text-xs font-semibold text-foreground/40 uppercase tracking-widest mb-1">
                    {language === "es" ? "Asignación Actual" : "Current Assignment"}
                  </p>
                  <div className="text-base font-bold flex items-center gap-2">
                    {selectedMember.job_id ? (
                      <>
                        <span className="text-rsg-gold font-mono whitespace-nowrap">WO#{selectedMember.job_id.replace("WO-", "")}</span>
                        <span className="text-[10px] bg-rsg-gold text-black px-1.5 py-0.5 uppercase tracking-widest font-black">ON-SITE</span>
                      </>
                    ) : (
                      <span className="text-foreground/40 uppercase italic text-sm">{language === "es" ? "Ninguna" : "None"}</span>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-surface/50 border border-border">
                  <p className="text-xs font-semibold text-foreground/40 uppercase tracking-widest mb-2">
                    {t.statusHeader}
                  </p>
                  <TeamStatusBadge status={selectedMember.status} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1 p-3 bg-surface/30 border border-border">
                  <span className="text-[10px] font-semibold text-foreground/40 uppercase tracking-widest">Phone</span>
                  <span className="text-sm font-mono">{selectedMember.phone}</span>
                </div>
                <div className="flex flex-col gap-1 p-3 bg-surface/30 border border-border">
                  <span className="text-[10px] font-semibold text-foreground/40 uppercase tracking-widest">Pin Access</span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm tracking-widest">
                      {showPin ? selectedMember.pin : "••••"}
                    </span>
                    <button 
                      onClick={() => setShowPin(!showPin)}
                      className="p-1 hover:text-rsg-gold transition-colors text-foreground/40"
                    >
                      {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1 p-3 bg-surface/30 border border-border">
                <span className="text-[10px] font-semibold text-foreground/40 uppercase tracking-widest">Email</span>
                <span className="text-sm font-medium">{selectedMember.email}</span>
              </div>
            </div>

            <div className="p-5 border-t border-border bg-surface/30 flex flex-col gap-2">
              <button
                onClick={() => toast("Coming soon")}
                className="w-full flex items-center justify-center gap-2 bg-foreground text-background h-10 font-black uppercase tracking-widest transition-opacity hover:opacity-90 active:scale-[0.98] rounded-md"
              >
                <Edit2 className="w-3.5 h-3.5" />
                {language === "es" ? "Editar Miembro" : "Edit Member"}
              </button>
              <button
                onClick={() => {
                  const confirmed = window.confirm(language === "es" ? "¿Eliminar este miembro?" : "Remove this member?");
                  if (confirmed) toast.error("Member deletion is restricted in demo mode");
                }}
                className="w-full flex items-center justify-center gap-2 border border-rsg-error text-rsg-error hover:bg-rsg-error hover:text-white h-10 font-black uppercase tracking-widest transition-colors rounded-md"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {language === "es" ? "Eliminar Miembro" : "Remove Member"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
