"use client";

import { useMemo, useState } from "react";
import { Lock, Shield } from "lucide-react";
import { ChatCheck } from "@/components/ChatCheck";
import { PhotoCheck } from "@/components/PhotoCheck";
import { TrustGauge } from "@/components/TrustGauge";
import { WarningBanner } from "@/components/WarningBanner";
import type { ChatAnalysis, PhotoAnalysis } from "@/lib/schemas";

function combineTrustScore(
  chat: ChatAnalysis | null,
  photo: PhotoAnalysis | null
): number | null {
  if (!chat && !photo) return null;

  const chatSafety = chat ? 100 - chat.riskScore : null;
  const photoAuth = photo ? photo.authenticityScore : null;

  if (chatSafety !== null && photoAuth !== null) {
    // Chat risk weighs slightly more for dating safety context
    return Math.round(chatSafety * 0.55 + photoAuth * 0.45);
  }
  if (chatSafety !== null) return Math.round(chatSafety);
  if (photoAuth !== null) return Math.round(photoAuth);
  return null;
}

export default function HomePage() {
  const [chatResult, setChatResult] = useState<ChatAnalysis | null>(null);
  const [photoResult, setPhotoResult] = useState<PhotoAnalysis | null>(null);

  const trustScore = useMemo(
    () => combineTrustScore(chatResult, photoResult),
    [chatResult, photoResult]
  );

  const showHighRiskBanner = chatResult?.riskLevel === "high";

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
      >
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-cyan-600/20 blur-3xl" />
        <div className="absolute -right-24 top-40 h-80 w-80 rounded-full bg-rose-600/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(30,41,59,0.9),_#020617_70%)]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14">
        <header className="mb-10 text-center sm:mb-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
            <Shield className="h-3.5 w-3.5 text-cyan-300" aria-hidden />
            FFECIO HACKS &apos;26 · Trust Before Connection
          </div>
          <h1 className="bg-gradient-to-br from-white via-slate-100 to-slate-400 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl">
            TrustLens
          </h1>
          <p className="mt-3 text-lg text-slate-400 sm:text-xl">
            Trust before connection.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500">
            A privacy-first safety layer for dating: check photo authenticity on
            your device, scan chats for romance-scam patterns, and see one Trust
            Score.
          </p>
        </header>

        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <PhotoCheck onAnalyzed={setPhotoResult} />
          <ChatCheck onAnalyzed={setChatResult} />
        </div>

        <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-black/30 backdrop-blur sm:p-8">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Trust Score</h2>
              <p className="text-sm text-slate-400">
                Combines chat risk and photo authenticity into one glanceable
                score
              </p>
            </div>
            {(chatResult || photoResult) && (
              <p className="text-xs text-slate-500">
                {chatResult && photoResult
                  ? "Weighted: 55% chat safety · 45% photo"
                  : chatResult
                    ? "Based on chat analysis only"
                    : "Based on photo analysis only"}
              </p>
            )}
          </div>

          {showHighRiskBanner && (
            <div className="mb-6">
              <WarningBanner />
            </div>
          )}

          <TrustGauge score={trustScore} />

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
              <p className="text-xs text-slate-500">Chat safety</p>
              <p className="text-lg font-semibold tabular-nums text-slate-100">
                {chatResult ? `${100 - chatResult.riskScore}/100` : "—"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
              <p className="text-xs text-slate-500">Photo authenticity</p>
              <p className="text-lg font-semibold tabular-nums text-slate-100">
                {photoResult ? `${photoResult.authenticityScore}/100` : "—"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
              <p className="text-xs text-slate-500">Combined trust</p>
              <p className="text-lg font-semibold tabular-nums text-slate-100">
                {trustScore !== null ? `${trustScore}/100` : "—"}
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-950/30 px-4 py-4">
            <div className="mb-2 flex items-center gap-2 text-cyan-200">
              <Lock className="h-4 w-4" aria-hidden />
              <h3 className="text-sm font-semibold">Privacy</h3>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              Photos never leave your device. Analysis runs in the browser with
              Canvas and Web Crypto — only a short SHA-256 fingerprint is shown
              locally. Chat text is sent only to our API (which calls Anthropic)
              when you click Analyze; nothing is stored in a database.
            </p>
          </div>
        </section>

        <footer className="mt-10 text-center text-xs text-slate-600">
          Built for FFECIO HACKS &apos;26 · Problem Statement #4
        </footer>
      </div>
    </main>
  );
}
