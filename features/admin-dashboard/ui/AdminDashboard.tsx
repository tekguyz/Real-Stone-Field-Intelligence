"use client";

import { useJobs } from "../../../entities/job/api";
import { dict } from "../../../entities/i18n/dict";
import { useUserStore } from "../../../entities/user/store";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { JOB_STATUSES } from "@/lib/constants/statuses";

export default function AdminDashboard() {
  const { language } = useUserStore();
  const t = dict[language].admin;
  const { data: jobs, isLoading } = useJobs();

  const currentJobs = jobs || [];

  const stats = {
    total: currentJobs.length,
    pending: currentJobs.filter(j => j.status === JOB_STATUSES.PENDING).length,
    active: currentJobs.filter(j => j.status === JOB_STATUSES.ACTIVE).length,
    review: currentJobs.filter(j => j.status === JOB_STATUSES.REVIEW).length,
    verified: currentJobs.filter(j => j.status === JOB_STATUSES.VERIFIED).length,
  };

  const statusData = [
    { name: t.pendingCount, value: stats.pending, color: "var(--status-pending-text)" },
    { name: t.activeCount, value: stats.active, color: "var(--status-active-text)" },
    { name: t.reviewCount, value: stats.review, color: "var(--status-review-text)" },
    { name: "Verified", value: stats.verified, color: "var(--status-verified-text)" },
  ].filter(d => d.value > 0);

  // Mock trend data for visualization
  const trendData = [
    { name: "Mon", jobs: 12 },
    { name: "Tue", jobs: 19 },
    { name: "Wed", jobs: 15 },
    { name: "Thu", jobs: 22 },
    { name: "Fri", jobs: 30 },
    { name: "Sat", jobs: 8 },
    { name: "Sun", jobs: 3 },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-rsg-gold border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Hydrating Intelligence...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Header */}
      <div className="flex flex-col">
        <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase leading-none">
          {t.dashboard}
        </h1>
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-2 leading-none">
          Operational Intelligence Overview
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Volume", value: stats.total, icon: TrendingUp, delta: "+12%", up: true },
          { label: "Active Field Units", value: stats.active, icon: Users, delta: "+3", up: true },
          { label: "Pending Verification", value: stats.review, icon: AlertTriangle, delta: "-5%", up: false },
          { label: "Avg. Cycle Time", value: "4.2d", icon: Clock, delta: "-0.5d", up: false },
        ].map((metric, i) => (
          <div key={i} className="bg-card border border-border p-4 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <metric.icon className="w-12 h-12" />
            </div>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{metric.label}</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-foreground">{metric.value}</span>
              <div className={`flex items-center text-[10px] font-bold ${metric.up ? "text-rsg-success" : "text-rsg-error"}`}>
                {metric.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {metric.delta}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Trend */}
        <div className="lg:col-span-2 bg-card border border-border p-6 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black uppercase tracking-widest">Weekly Installation Velocity</h3>
            <span className="text-[10px] font-mono text-muted-foreground uppercase">Last 7 Days</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(var(--rsg-border)/0.5)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: "oklch(var(--rsg-text)/0.5)" }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: "oklch(var(--rsg-text)/0.5)" }}
                />
                <RechartsTooltip 
                  cursor={{ fill: "oklch(var(--rsg-text)/0.05)" }}
                  contentStyle={{ 
                    backgroundColor: "oklch(var(--rsg-surface))", 
                    border: "2px solid oklch(var(--rsg-text))",
                    borderRadius: "0px",
                    fontWeight: "900",
                    textTransform: "uppercase",
                    fontSize: "10px"
                  }}
                />
                <Bar dataKey="jobs" fill="oklch(var(--rsg-gold))">
                  {trendData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 4 ? "oklch(var(--rsg-gold))" : "oklch(var(--rsg-text)/0.1)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-card border border-border p-6 shadow-sm flex flex-col gap-4">
          <h3 className="text-sm font-black uppercase tracking-widest">Pipeline Distribution</h3>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: "oklch(var(--rsg-surface))", 
                    border: "2px solid oklch(var(--rsg-text))",
                    borderRadius: "0px",
                    fontWeight: "900",
                    textTransform: "uppercase",
                    fontSize: "10px"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-foreground">{stats.total}</span>
              <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Total Jobs</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-auto">
            {statusData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] font-bold uppercase tracking-tight text-foreground/70">{item.name}</span>
                </div>
                <span className="text-xs font-black">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
