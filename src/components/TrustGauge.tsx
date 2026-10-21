"use client";

import { motion } from "framer-motion";

type TrustGaugeProps = {
  score: number | null;
  label?: string;
};

function gaugeColor(score: number): string {
  if (score >= 67) return "#34d399";
  if (score >= 34) return "#fbbf24";
  return "#f87171";
}

function describe(score: number): string {
  if (score >= 67) return "Relatively reassuring";
  if (score >= 34) return "Proceed with caution";
  return "High concern";
}

export function TrustGauge({ score, label = "Trust Score" }: TrustGaugeProps) {
  const safe = score === null ? 0 : Math.min(100, Math.max(0, score));
  const progress = score === null ? 0 : safe / 100;
  const color = score === null ? "#64748b" : gaugeColor(safe);

  // Semicircle arc: from π (left) to 0 (right), radius 90, center 100,110
  const r = 90;
  const cx = 100;
  const cy = 110;
  const circumference = Math.PI * r;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox="0 0 200 130"
        className="h-40 w-full max-w-xs"
        role="img"
        aria-label={
          score === null
            ? `${label}: not yet calculated`
            : `${label}: ${safe} out of 100`
        }
      >
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="rgba(148,163,184,0.25)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <motion.path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ type: "spring", stiffness: 60, damping: 18 }}
        />
        <text
          x={cx}
          y={cy - 18}
          textAnchor="middle"
          className="fill-white"
          style={{ fontSize: 36, fontWeight: 700 }}
        >
          {score === null ? "—" : Math.round(safe)}
        </text>
        <text
          x={cx}
          y={cy + 8}
          textAnchor="middle"
          className="fill-slate-400"
          style={{ fontSize: 12 }}
        >
          {label}
        </text>
      </svg>
      <p className="mt-1 text-sm text-slate-400">
        {score === null
          ? "Run a photo or chat check to see your score"
          : describe(safe)}
      </p>
    </div>
  );
}
