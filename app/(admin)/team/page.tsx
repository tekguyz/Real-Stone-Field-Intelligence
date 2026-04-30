"use client";

import { useState } from "react";
import { useUserStore } from "../../../entities/user/store";
import { dict } from "../../../entities/i18n/dict";
import { Plus, Users } from "lucide-react";
import { EmptyState } from "../../../components/ui/EmptyState";
import { mockTeam } from "../../../entities/team/model/mock";
import { TeamMember } from "../../../entities/team/model/types";
import { TeamMemberCard } from "../../../features/admin-team/ui/TeamMemberCard";
import { TeamMemberDrawer } from "../../../features/admin-team/ui/TeamMemberDrawer";
import { InviteMemberDrawer } from "../../../features/admin-team/ui/InviteMemberDrawer";

export default function TeamPage() {
  const { language } = useUserStore();
  const t = dict[language].admin;
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  return (
    <div className="flex flex-col gap-4 pb-10">
      {/* Header */}
      <div className="flex justify-between items-start bg-surface -mx-8 -mt-8 px-8 py-3 mb-0">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground uppercase leading-none">
            {t.installationTeam}
          </h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mt-2 leading-none">
            {language === "es" ? "PERSONAL Y CONTROL DE ACCESO" : "PERSONNEL & ACCESS CONTROL"}
          </p>
        </div>
        <button
          onClick={() => setIsInviteOpen(true)}
          className="flex items-center gap-2 bg-rsg-gold text-black px-4 py-2 font-semibold tracking-widest uppercase transition-opacity hover:opacity-90 active:scale-[0.98] rounded-md shadow-sm border-0 h-10"
        >
          <Plus className="w-4 h-4" />
          {t.inviteMember}
        </button>
      </div>

      <div className="mt-2">
        {/* Grid */}
        {mockTeam.length === 0 ? (
        <EmptyState 
          icon={Users}
          headline={language === "es" ? "Sin miembros" : "No team members"}
          subline={language === "es" ? "Invita a tu primer miembro para comenzar" : "Invite your first team member to get started"}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {mockTeam.map((member) => (
            <TeamMemberCard 
              key={member.id} 
              member={member} 
              onSelect={setSelectedMember} 
            />
          ))}
        </div>
      )}

      {/* Member Details Slide-over */}
      <TeamMemberDrawer 
        selectedMember={selectedMember} 
        onClose={() => setSelectedMember(null)} 
      />

      {/* Invite Member Slide-over */}
      <InviteMemberDrawer 
        isOpen={isInviteOpen} 
        onClose={() => setIsInviteOpen(false)} 
      />
      </div>
    </div>
  );
}

