"use client";

import { useState } from "react";
import { useUserStore } from "../../../entities/user/store";
import { dict } from "../../../entities/i18n/dict";
import { Plus, X, Shield, HardHat, Phone, Mail } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const mockTeam = [
  {
    id: "u-1",
    name: "Admin User",
    initials: "AD",
    role: "Office Admin",
    status: "active", // online in office
    pin: "****",
    isInstaller: false,
  },
  {
    id: "u-2",
    name: "Juan Perez",
    initials: "JP",
    role: "Lead Installer",
    status: "on-site", // out in the field
    pin: "****",
    job_id: "WO-8402",
    isInstaller: true,
  },
  {
    id: "u-3",
    name: "Carlos Ruiz",
    initials: "CR",
    role: "Installer",
    status: "on-site",
    pin: "****",
    job_id: "WO-8418",
    isInstaller: true,
  },
  {
    id: "u-4",
    name: "Michael Scott",
    initials: "MS",
    role: "Operations Manager",
    status: "active",
    pin: "****",
    isInstaller: false,
  },
  {
    id: "u-5",
    name: "David Silva",
    initials: "DS",
    role: "Installer",
    status: "inactive",
    pin: "****",
    isInstaller: true,
  },
];

export default function TeamPage() {
  const { language } = useUserStore();
  const t = dict[language].admin;
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {t.installationTeam}
          </h1>
          <p className="text-foreground/50 mt-1 font-mono text-sm leading-none">
            PERSONNEL & ACCESS CONTROL
          </p>
        </div>
        <button
          onClick={() => setIsInviteOpen(true)}
          className="flex items-center gap-2 bg-foreground text-background px-5 py-3 font-black tracking-[0.2em] uppercase transition-opacity hover:opacity-90 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          {t.inviteMember}
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockTeam.map((member) => (
          <div
            key={member.id}
            className={`relative bg-card border p-6 flex flex-col transition-all overflow-hidden ${
              member.status === "on-site"
                ? "border-primary/50 bg-gradient-to-br from-card to-primary/5"
                : "border-border"
            }`}
          >
            {member.status === "on-site" && (
              <div className="absolute top-0 right-0 w-2 h-full bg-primary" />
            )}

            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 border border-primary/20 bg-primary/10 text-primary flex items-center justify-center font-black text-lg">
                {member.initials}
              </div>
              <div
                className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${
                  member.status === "on-site"
                    ? "bg-primary/20 text-primary"
                    : member.status === "active"
                      ? "bg-green-500/10 text-green-500"
                      : "bg-foreground/5 text-foreground/40"
                }`}
              >
                {member.status === "on-site"
                  ? t.onSite
                  : member.status === "active"
                    ? t.active
                    : "Offline"}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-xl">{member.name}</h3>
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
                  Current Assignment
                </p>
                <div className="text-sm font-semibold">
                  {t.legacyId} {member.job_id}
                </div>
              </div>
            )}

            <div className="w-full mt-6 pt-5 border-t border-border flex justify-between items-center text-sm">
              <div className="flex gap-3">
                <button className="text-foreground/40 hover:text-primary transition-colors">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="text-foreground/40 hover:text-primary transition-colors">
                  <Mail className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.2em]">
                  {t.pin}:
                </span>
                <span className="font-mono bg-surface border border-border px-2 py-0.5 text-foreground/80">
                  {member.pin}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Invite Member Slide-over */}
      <AnimatePresence>
        {isInviteOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInviteOpen(false)}
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
                  onClick={() => setIsInviteOpen(false)}
                  className="p-2 hover:text-primary text-foreground/40 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                <div>
                  <label className="block text-[10px] font-mono text-foreground/50 uppercase tracking-[0.2em] mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-surface/50 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                    placeholder="e.g. John Doe"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-foreground/50 uppercase tracking-[0.2em] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full bg-surface/50 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                    placeholder="john@realstone.com"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-foreground/50 uppercase tracking-[0.2em] mb-2">
                    {t.role}
                  </label>
                  <select className="w-full bg-surface/50 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary appearance-none transition-colors">
                    <option>Installer</option>
                    <option>Lead Installer</option>
                    <option>Office Admin</option>
                    <option>Operations Manager</option>
                  </select>
                </div>

                <div className="p-4 bg-surface/50 border border-border mt-2">
                  <h3 className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.2em] mb-1">
                    Access PIN
                  </h3>
                  <p className="text-xs text-foreground/60 leading-relaxed font-bold">
                    A secure 4-digit PIN will be automatically generated and
                    sent to their email for field app access.
                  </p>
                </div>
              </div>

              <div className="p-6 border-t border-border bg-surface/30 flex gap-3 flex-col sm:flex-row">
                <button
                  onClick={() => setIsInviteOpen(false)}
                  className="flex-1 py-4 border border-border bg-foreground/[0.03] text-foreground hover:bg-foreground/10 font-black tracking-[0.2em] uppercase transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 bg-foreground text-background py-4 font-black uppercase tracking-[0.2em] transition-opacity hover:opacity-90">
                  Send Invite
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
