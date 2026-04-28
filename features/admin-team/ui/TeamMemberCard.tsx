import { useUserStore } from "../../../entities/user/store";
import { dict } from "../../../entities/i18n/dict";
import { HardHat, Shield, Phone, Mail } from "lucide-react";
import { TEAM_STATUSES } from "../../../lib/constants/statuses";
import { TeamStatusBadge } from "../../../entities/team/ui/TeamStatusBadge";
import { TeamMember } from "../../../entities/team/model/types";

interface TeamMemberCardProps {
  member: TeamMember;
  onSelect: (member: TeamMember) => void;
}

export function TeamMemberCard({ member, onSelect }: TeamMemberCardProps) {
  const { language } = useUserStore();
  const t = dict[language].admin;

  return (
    <div
      onClick={() => onSelect(member)}
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(member)}
      className={`relative bg-card border p-6 flex flex-col transition-all overflow-hidden cursor-pointer hover:border-primary/30 hover:bg-rsg-surface-2 group outline-none focus-visible:ring-2 focus-visible:ring-rsg-gold focus-visible:ring-inset ${
        member.status === TEAM_STATUSES.ON_SITE
          ? "border-primary/50 bg-gradient-to-br from-card to-primary/5"
          : "border-border"
      }`}
    >
      {member.status === TEAM_STATUSES.ON_SITE && (
        <div className="absolute top-0 right-0 w-2 h-full bg-primary" />
      )}

      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 flex-shrink-0 border border-primary/20 bg-primary/10 text-primary flex items-center justify-center font-black text-lg">
          {member.initials}
        </div>
        <TeamStatusBadge status={member.status} />
      </div>

      <div>
        <h3 className="font-bold text-xl group-hover:text-primary transition-colors">{member.name}</h3>
        <div className="flex items-center gap-2 text-foreground/60 mt-1">
          {member.isInstaller ? (
            <HardHat className="w-4 h-4" />
          ) : (
            <Shield className="w-4 h-4" />
          )}
          <span className="text-sm">{member.role}</span>
        </div>
      </div>

      {member.job_id && (
        <div className="mt-4 p-3 bg-surface/50 border border-border">
          <p className="text-[10px] font-mono text-foreground/40 uppercase mb-1">
            {language === "es" ? "Asignación:" : "Assignment:"}
          </p>
          <div className="text-sm font-bold font-mono text-primary">
            WO# {member.job_id.replace("WO-", "")}
          </div>
        </div>
      )}

      <div className="w-full mt-6 pt-5 border-t border-border flex justify-between items-center text-sm">
        <div className="flex gap-3">
          <div className="text-foreground/40">
            <Phone className="w-4 h-4" />
          </div>
          <div className="text-foreground/40">
            <Mail className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.2em]">
            {t.pin}:
          </span>
          <span className="font-mono bg-surface border border-border px-2 py-0.5 text-foreground/80 text-xs">
            ••••
          </span>
        </div>
      </div>
    </div>
  );
}
