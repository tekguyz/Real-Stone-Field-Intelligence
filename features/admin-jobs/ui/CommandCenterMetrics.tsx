import { dict } from "../../../entities/i18n/dict";
import { useUserStore } from "../../../entities/user/store";
import { JOB_STATUSES } from "../../../lib/constants/statuses";

interface CommandCenterMetricsProps {
  stats: {
    pending: number;
    active: number;
    review: number;
  };
  verifiedCount: number;
  isLoading: boolean;
}

export function CommandCenterMetrics({ stats, verifiedCount, isLoading }: CommandCenterMetricsProps) {
  const { language } = useUserStore();
  const t = dict[language].admin;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-medium tracking-tight tracking-tighter uppercase font-mono text-[10px] text-foreground/40">{t.metrics}</h2>
        <div className="grid grid-cols-4 lg:grid-cols-2 gap-2 lg:gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-rsg-gold/5 animate-pulse h-20 border border-border"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xl font-medium tracking-tight tracking-tighter uppercase font-mono text-[10px] text-foreground/40">{t.metrics}</h2>
      <div className="grid grid-cols-4 lg:grid-cols-2 gap-2 lg:gap-3">
        {[
          {
            label: t.backlog,
            value: stats.pending,
            color: "border-l-zinc-500",
            sub: t.pendingCount,
          },
          {
            label: t.inField,
            value: stats.active,
            color: "border-l-rsg-gold",
            sub: t.activeCount,
          },
          {
            label: t.actionReq,
            value: stats.review,
            color: "border-l-rsg-warning",
            sub: t.reviewCount,
          },
          {
            label: t.verifiedShort,
            value: verifiedCount,
            color: "border-l-rsg-success",
            sub: t.completed,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`bg-card p-2 lg:p-4 border border-border transition-colors hover:bg-surface/50 border-l-2 ${stat.color} flex flex-col justify-between rounded-md`}
          >
            <p className="text-[9px] lg:text-xs font-semibold text-muted-foreground uppercase tracking-wider lg:tracking-widest leading-none truncate" title={stat.label}>
              {stat.label}
            </p>
            <div className="flex items-baseline gap-1 mt-1 lg:mt-2">
              <span className="text-base lg:text-2xl font-black tracking-tight text-foreground leading-none">
                {stat.value}
              </span>
            </div>
            <p className="text-[8px] lg:text-[10px] font-medium text-muted-foreground/80 uppercase mt-0.5 lg:mt-1 truncate hidden sm:block">
              {stat.sub}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
