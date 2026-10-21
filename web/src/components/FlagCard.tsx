"use client";

import {
  AlertTriangle,
  Clock,
  DollarSign,
  HeartCrack,
  HelpCircle,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import type { ChatFlag, FlagType } from "@/lib/schemas";

const FLAG_META: Record<
  FlagType,
  { label: string; icon: LucideIcon; accent: string }
> = {
  love_bombing: {
    label: "Love bombing",
    icon: HeartCrack,
    accent: "border-pink-500/40 bg-pink-500/10 text-pink-200",
  },
  off_platform: {
    label: "Off-platform push",
    icon: Smartphone,
    accent: "border-sky-500/40 bg-sky-500/10 text-sky-200",
  },
  money_request: {
    label: "Money request",
    icon: DollarSign,
    accent: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
  },
  urgency: {
    label: "Urgency",
    icon: Clock,
    accent: "border-amber-500/40 bg-amber-500/10 text-amber-200",
  },
  inconsistency: {
    label: "Inconsistency",
    icon: AlertTriangle,
    accent: "border-orange-500/40 bg-orange-500/10 text-orange-200",
  },
  other: {
    label: "Other signal",
    icon: HelpCircle,
    accent: "border-violet-500/40 bg-violet-500/10 text-violet-200",
  },
};

type FlagCardProps = {
  flag: ChatFlag;
};

export function FlagCard({ flag }: FlagCardProps) {
  const meta = FLAG_META[flag.type];
  const Icon = meta.icon;

  return (
    <article
      className={`rounded-2xl border p-4 transition-colors ${meta.accent}`}
    >
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0" aria-hidden />
        <h4 className="text-sm font-semibold tracking-wide">{meta.label}</h4>
      </div>
      <blockquote className="mb-2 border-l-2 border-white/20 pl-3 text-sm italic text-white/80">
        &ldquo;{flag.evidence}&rdquo;
      </blockquote>
      <p className="text-sm leading-relaxed text-white/70">{flag.explanation}</p>
    </article>
  );
}
