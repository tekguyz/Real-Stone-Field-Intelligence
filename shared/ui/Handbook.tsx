"use client";

import { motion } from "motion/react";
import { 
  BookOpen, 
  Lightbulb, 
  Camera, 
  ShieldCheck, 
  ChevronRight, 
  Info,
  MapPin,
  Clock
} from "lucide-react";
import { dict } from "../../entities/i18n/dict";

export interface HandbookItem {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: "flow" | "pro-tips" | "status" | "awards";
  badges?: string[];
}

export function Handbook({ language }: { language: "en" | "es" }) {
  const guides: HandbookItem[] = [
    {
      id: "pro-flow",
      category: "flow",
      title: "Quick Start: The 3-Step Pro Flow",
      description: "Initialize Sensors → Capture Proofs → Verify Job. Following this sequence ensures 100% data integrity and instant admin approval.",
      icon: Clock,
      badges: ["QUICK START", "ESSENTIAL"]
    },
    {
      id: "sunlight-mastery",
      category: "pro-tips",
      title: "Sunlight Mastery",
      description: "Pro-tips for high-quality photos: Avoid sunlight glare by positioning against the light, clean your lens before capture, and use steady framing.",
      icon: Camera,
      badges: ["PRO TIP", "QUALITY"]
    },
    {
      id: "status-keys",
      category: "status",
      title: "Understanding Status Badges",
      description: "Gold = Verified (GPS + Signature Locked). Grey = Awaiting Field Work. Orange = Review Required. Green = Completed.",
      icon: Info,
      badges: ["VISUAL KEY"]
    },
    {
      id: "gold-badge",
      category: "awards",
      title: "Earning the Gold Badge",
      description: "Using the 'Live Camera' is the key to locking GPS coordinates. Gallery uploads often strip metadata, risking manual review delays.",
      icon: ShieldCheck,
      badges: ["VERIFIED", "RSG GOLD"]
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guides.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group flex flex-col bg-surface border-2 border-foreground p-6 relative overflow-hidden transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(var(--rsg-gold-rgb),0.3)] cursor-default"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-foreground text-background flex items-center justify-center border-b-2 border-r-2 border-rsg-gold">
                <item.icon className="w-6 h-6" />
              </div>
              <div className="flex flex-wrap gap-1 justify-end">
                {item.badges?.map((b) => (
                  <span key={b} className="text-[9px] font-black tracking-widest px-1.5 py-0.5 bg-foreground/5 border border-foreground/10 uppercase">
                    {b}
                  </span>
                ))}
              </div>
            </div>

            <h4 className="text-sm font-black uppercase tracking-widest mb-2 group-hover:text-rsg-gold transition-colors">
              {item.title}
            </h4>
            <p className="text-xs text-foreground/70 leading-relaxed font-medium">
              {item.description}
            </p>

            <div className="mt-4 pt-4 border-t border-foreground/10 flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-foreground/40">
                {item.category}
              </span>
              <ChevronRight className="w-4 h-4 text-foreground/20" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
