import { useUserStore } from "../../user/store";
import { dict } from "../../i18n/dict";
import { TEAM_STATUSES, TeamStatus } from "../../../lib/constants/statuses";

export const TeamStatusBadge = ({ status }: { status: TeamStatus }) => {
  const { language } = useUserStore();
  const t = dict[language].admin;

  const config = {
    [TEAM_STATUSES.ACTIVE]: "bg-[var(--status-verified-bg)]/10 text-[var(--status-verified-text)] border-[var(--status-verified-bg)]/20",
    [TEAM_STATUSES.ON_SITE]: "bg-[var(--status-active-bg)]/10 text-[var(--status-active-text)] border-[var(--status-active-bg)]/20",
    [TEAM_STATUSES.OFFLINE]: "bg-muted text-muted-foreground border-border",
  };

  const labels = {
    [TEAM_STATUSES.ACTIVE]: t.active,
    [TEAM_STATUSES.ON_SITE]: t.onSite,
    [TEAM_STATUSES.OFFLINE]: language === "es" ? "Desconectado" : "Offline",
  };

  return (
    <div className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest border rounded-none ${config[status]}`}>
      {labels[status]}
    </div>
  );
};
