#!/usr/bin/env node
/**
 * Secure Message Guard proxy for TrustLens.
 * Holds GEMINI_API_KEY on the server only. Point the Expo app at:
 *   EXPO_PUBLIC_AI_PROXY_URL=http://localhost:8787/analyze-message
 *
 * Loads project-root .env if present (never commit that file).
 * Without GEMINI_API_KEY, falls back to the same rules-based detector.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { analyzeMessageLocally } from "./rules.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const raw = fs.readFileSync(filePath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const s = line.trim();
    if (!s || s.startsWith("#") || !s.includes("=")) continue;
    const eq = s.indexOf("=");
    const key = s.slice(0, eq).trim();
    let val = s.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    // Do not override a key already present in the process environment
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

loadEnvFile(path.join(ROOT, ".env"));
loadEnvFile(path.join(ROOT, ".env.local"));

const PORT = Number(process.env.ANALYZE_PORT || 8787);
const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.trim() || "";
const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";

const FLAG_TYPES = new Set([
  "money_request",
  "emotional_pressure",
  "sensitive_info",
  "suspicious_link",
  "off_platform",
  "urgency",
  "other",
]);

function send(res, status, body) {
  const json = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type",
  });
  res.end(json);
}

function stripFences(text) {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();
  return trimmed;
}

/** Extract the first JSON object from model output (handles prose wrappers). */
function parseJsonObject(text) {
  const cleaned = stripFences(text);
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }
    throw new Error("Gemini JSON parse failed");
  }
}

function normalizeRiskLevel(raw) {
  const v = String(raw || "").toLowerCase().trim();
  if (v === "high" || v === "critical") return "high";
  if (v === "moderate" || v === "medium" || v === "med") return "moderate";
  if (v === "low") return "low";
  return null;
}

function normalizeAiPayload(ai, local) {
  const riskLevel = normalizeRiskLevel(ai?.riskLevel) || local.riskLevel;
  const flags = Array.isArray(ai?.flags)
    ? ai.flags
        .filter(
          (f) =>
            f &&
            typeof f === "object" &&
            FLAG_TYPES.has(String(f.type)) &&
            typeof f.evidence === "string" &&
            typeof f.explanation === "string"
        )
        .map((f) => ({
          type: f.type,
          evidence: String(f.evidence).slice(0, 240),
          explanation: String(f.explanation).slice(0, 400),
        }))
        .slice(0, 5)
    : [];
  const suggestedReplies = Array.isArray(ai?.suggestedReplies)
    ? ai.suggestedReplies
        .filter((r) => typeof r === "string" && r.trim())
        .map((r) => r.slice(0, 280))
        .slice(0, 3)
    : [];

  return {
    riskLevel,
    title:
      typeof ai?.title === "string" && ai.title.trim()
        ? ai.title.slice(0, 120)
        : local.title,
    flags: flags.length ? flags : local.flags,
    suggestedReplies: suggestedReplies.length
      ? suggestedReplies
      : local.suggestedReplies,
    limitations:
      (typeof ai?.limitations === "string" && ai.limitations) ||
      "Gemini-assisted analysis with rules fallback. Not proof of scam intent.",
    source: "ai",
  };
}

async function callGeminiOnce(text) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
  const prompt = `You are TrustLens Message Guard. Analyze ONE dating-app message for romance-scam risk patterns.
Return ONLY a single JSON object (no markdown fences, no commentary) with this shape:
{
  "riskLevel": "low" | "moderate" | "high",
  "title": string,
  "flags": [{ "type": "money_request"|"emotional_pressure"|"sensitive_info"|"suspicious_link"|"off_platform"|"urgency"|"other", "evidence": string, "explanation": string }],
  "suggestedReplies": string[],
  "limitations": string,
  "source": "ai"
}
Rules: quote exact evidence; do NOT call the sender a scammer; explain uncertainty; max 5 flags; max 3 suggested replies that set boundaries.
Use riskLevel "moderate" (never "medium").`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `${prompt}\n\nMessage:\n${text}` }] }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!res.ok) {
    // Avoid logging response bodies that might echo request metadata
    const err = new Error(`Gemini HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }

  const data = await res.json();
  const raw =
    data?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("\n") ||
    "";
  if (!raw.trim()) throw new Error("Gemini empty response");
  const parsed = parseJsonObject(raw);
  return { ...parsed, source: "ai" };
}

async function analyzeWithGemini(text) {
  try {
    return await callGeminiOnce(text);
  } catch (err) {
    // One retry on transient capacity errors
    if (err?.status === 503 || err?.status === 429) {
      await new Promise((r) => setTimeout(r, 1200));
      return await callGeminiOnce(text);
    }
    throw err;
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    send(res, 204, {});
    return;
  }

  if (req.method === "GET" && (req.url === "/health" || req.url === "/")) {
    send(res, 200, {
      ok: true,
      gemini: Boolean(GEMINI_API_KEY),
      model: GEMINI_API_KEY ? MODEL : null,
      endpoint: "/analyze-message",
    });
    return;
  }

  if (req.method !== "POST" || req.url !== "/analyze-message") {
    send(res, 404, { error: "Not found" });
    return;
  }

  let body = "";
  for await (const chunk of req) body += chunk;
  let text = "";
  try {
    text = String(JSON.parse(body)?.text ?? "");
  } catch {
    send(res, 400, { error: "Invalid JSON body" });
    return;
  }

  const local = analyzeMessageLocally(text);

  if (!GEMINI_API_KEY) {
    send(res, 200, local);
    return;
  }

  try {
    const ai = await analyzeWithGemini(text);
    send(res, 200, normalizeAiPayload(ai, local));
  } catch (err) {
    console.error(
      "[analyze-message] Gemini failed, using rules:",
      err?.message || "unknown"
    );
    send(res, 200, local);
  }
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} already in use — not starting a duplicate proxy.`);
    process.exit(1);
  }
  throw err;
});

// Bind all interfaces so both localhost (IPv4/IPv6) and 127.0.0.1 work from Expo web.
server.listen(PORT, () => {
  console.log(
    `TrustLens analyze proxy on http://localhost:${PORT}/analyze-message`
  );
  console.log(
    GEMINI_API_KEY
      ? `Gemini enabled (${MODEL})`
      : "GEMINI_API_KEY not set — rules-only mode"
  );
});
