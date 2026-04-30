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
      className={`relative bg-card border p-4 flex flex-col transition-all overflow-hidden cursor-pointer hover:border-primary/30 hover:bg-rsg-surface-2 group rounded-md outline-none focus-visible:ring-2 focus-visible:ring-rsg-gold focus-visible:ring-offset-1 ${
        member.status === TEAM_STATUSES.ON_SITE
          ? "border-primary/50"
          : "border-border"
      }`}
    >
      {member.status === TEAM_STATUSES.ON_SITE && (
        <div className="absolute top-0 right-0 w-1.5 h-full bg-primary" />
      )}

      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 flex-shrink-0 border border-primary/20 bg-primary/10 text-primary flex items-center justify-center font-bold text-base rounded-md">
          {member.initials}
        </div>
        <TeamStatusBadge status={member.status} />
      </div>

      <div>
        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{member.name}</h3>
        <div className="flex items-center gap-2 text-muted-foreground mt-1">
          {member.isInstaller ? (
            <HardHat className="w-3.5 h-3.5" />
          ) : (
            <Shield className="w-3.5 h-3.5" />
          )}
          <span className="text-xs uppercase font-medium tracking-widest">{member.role}</span>
        </div>
      </div>

      {member.job_id && (
        <div className="mt-4 p-3 bg-surface border border-border rounded-md">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">
            {language === "es" ? "Asignación:" : "Assignment:"}
          </p>
          <div className="text-sm font-mono text-rsg-gold font-bold">
            WO# {member.job_id.replace("WO-", "")}
          </div>
        </div>
      )}

      <div className="w-full mt-4 pt-4 border-t border-border flex justify-between items-center text-xs">
        <div className="flex gap-3">
          <div className="text-muted-foreground">
            <Phone className="w-4 h-4" />
          </div>
          <div className="text-muted-foreground">
            <Mail className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
            {t.pin}:
          </span>
          <span className="font-mono bg-surface border border-border px-2 py-0.5 text-foreground/80 text-[10px] rounded">
            ••••
          </span>
        </div>
      </div>
    </div>
  );
}
