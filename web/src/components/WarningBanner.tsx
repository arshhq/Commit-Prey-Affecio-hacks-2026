"use client";

import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";

export function WarningBanner() {
  return (
    <motion.div
      role="alert"
      initial={{ opacity: 0, y: -12, scale: 0.98 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        boxShadow: [
          "0 0 0 0 rgba(239, 68, 68, 0.0)",
          "0 0 24px 2px rgba(239, 68, 68, 0.35)",
          "0 0 0 0 rgba(239, 68, 68, 0.0)",
        ],
      }}
      transition={{
        opacity: { duration: 0.35 },
        y: { duration: 0.35 },
        scale: { duration: 0.35 },
        boxShadow: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
      }}
      className="flex items-start gap-3 rounded-2xl border border-red-500/50 bg-gradient-to-r from-red-950/90 to-red-900/60 px-4 py-3 text-red-50"
    >
      <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-300" aria-hidden />
      <p className="text-sm font-medium leading-relaxed sm:text-base">
        Stop. This conversation shows classic romance-scam patterns.
      </p>
    </motion.div>
  );
}
