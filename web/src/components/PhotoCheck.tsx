"use client";

import { useCallback, useRef, useState, type DragEvent, type ChangeEvent } from "react";
import { Fingerprint, ImagePlus, Loader2, ScanEye, Upload } from "lucide-react";
import { analyzePhoto } from "@/lib/forensics";
import type { PhotoAnalysis } from "@/lib/schemas";

type PhotoCheckProps = {
  onAnalyzed: (result: PhotoAnalysis | null) => void;
};

function scoreTone(score: number): string {
  if (score >= 67) return "text-emerald-400";
  if (score >= 34) return "text-amber-400";
  return "text-red-400";
}

export function PhotoCheck({ onAnalyzed }: PhotoCheckProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PhotoAnalysis | null>(null);

  const processFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Please choose an image file (JPEG, PNG, WebP, etc.).");
        return;
      }

      setError(null);
      setLoading(true);
      onAnalyzed(null);

      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      try {
        const analysis = await analyzePhoto(file);
        setResult(analysis);
        onAnalyzed(analysis);
      } catch (err) {
        console.error(err);
        setResult(null);
        onAnalyzed(null);
        setError(
          err instanceof Error ? err.message : "Could not analyze this photo."
        );
      } finally {
        setLoading(false);
      }
    },
    [onAnalyzed, previewUrl]
  );

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void processFile(file);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void processFile(file);
  };

  return (
    <section className="flex h-full flex-col rounded-3xl border border-white/10 bg-slate-900/60 p-5 shadow-xl shadow-black/20 backdrop-blur sm:p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300">
          <ScanEye className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Photo Authenticity</h2>
          <p className="text-sm text-slate-400">
            Analyzed 100% on-device — never uploaded
          </p>
        </div>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative mb-4 flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-8 transition-colors ${
          dragging
            ? "border-cyan-400 bg-cyan-500/10"
            : "border-white/15 bg-slate-950/40 hover:border-cyan-500/40 hover:bg-slate-950/60"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onChange}
        />
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Selected photo preview"
            className="max-h-40 rounded-xl object-contain"
          />
        ) : (
          <>
            <Upload className="mb-2 h-8 w-8 text-slate-400" aria-hidden />
            <p className="text-center text-sm text-slate-300">
              Drop a profile photo here, or click to browse
            </p>
            <p className="mt-1 text-xs text-slate-500">Stays on this device</p>
          </>
        )}
      </div>

      {loading && (
        <div className="mb-4 flex items-center gap-2 text-sm text-cyan-300">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Running ELA, noise, and metadata checks…
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/40 bg-red-950/50 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      {!result && !loading && !error && (
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl bg-slate-950/30 px-4 py-8 text-center text-slate-500">
          <ImagePlus className="mb-2 h-8 w-8 opacity-50" aria-hidden />
          <p className="text-sm">No photo analyzed yet</p>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Authenticity score
              </p>
              <p
                className={`text-3xl font-bold tabular-nums ${scoreTone(result.authenticityScore)}`}
              >
                {result.authenticityScore}
                <span className="text-base font-normal text-slate-500">/100</span>
              </p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1 font-mono text-xs text-slate-300">
              <Fingerprint className="h-3.5 w-3.5" aria-hidden />
              {result.fingerprint}
            </div>
          </div>

          {result.elaImageDataUrl && (
            <div>
              <p className="mb-1 text-xs text-slate-500">ELA heatmap (amplified)</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.elaImageDataUrl}
                alt="Error level analysis heatmap"
                className="w-full rounded-xl border border-white/10"
              />
            </div>
          )}

          <ul className="space-y-2">
            {result.signals.map((signal) => (
              <li
                key={signal.name}
                className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2"
              >
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-slate-200">
                    {signal.name}
                  </span>
                  <span
                    className={`text-sm font-semibold tabular-nums ${scoreTone(signal.score)}`}
                  >
                    {signal.score}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-slate-400">
                  {signal.explanation}
                </p>
              </li>
            ))}
          </ul>

          <p className="text-xs leading-relaxed text-slate-500">
            Disclaimer: These are lightweight client-side heuristics (ELA, noise,
            metadata). They are not forensic proof that a photo is real or fake.
          </p>
        </div>
      )}
    </section>
  );
}
