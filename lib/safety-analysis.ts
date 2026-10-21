import type { RiskLevel, SafetyAnalysis, SafetyFlag, SafetyFlagType } from "@/types";

type Rule = {
  type: SafetyFlagType;
  patterns: RegExp[];
  explanation: string;
  weight: number;
};

const RULES: Rule[] = [
  {
    type: "money_request",
    weight: 34,
    patterns: [
      /\b(send|wire|transfer|loan|deposit|gift ?card|crypto|usdt|bitcoin|btc|paypal|venmo|cashapp|western union|moneygram)\b/i,
      /\$\s?\d{2,}|\b\d{3,}\s?(dollars|usd|bucks)\b/i,
      /\b(pay (you|me) back|cover (the|her|his) (surgery|flight|fee|deposit|rent))\b/i,
      /\b(i('ll| will) reimburse|invest with me|guaranteed returns)\b/i,
    ],
    explanation:
      "Requests for money, crypto, or gift cards from a new contact are a major warning sign.",
  },
  {
    type: "emotional_pressure",
    weight: 18,
    patterns: [
      /\bif you (loved|cared|trusted) me\b/i,
      /\b(don't abandon|don't be difficult|you're the only one|prove (your )?love)\b/i,
      /\b(falling for you|destiny|soulmate|meant to be|marry me)\b/i,
      /\b(after all i('ve| have) done|you owe me)\b/i,
    ],
    explanation: "Affection or guilt used to push a decision can be coercive.",
  },
  {
    type: "sensitive_info",
    weight: 24,
    patterns: [
      /\b(otp|one[- ]time (code|password)|verification code|ssn|social security|password|bank (login|account)|routing number|nude|private photo|id (card|photo))\b/i,
      /\b(send (a )?selfie with|prove you('re| are) real|share (your )?location live)\b/i,
      /\b(what('s| is) your (full )?address|mother'?s maiden)\b/i,
    ],
    explanation: "Asks for codes, financial logins, or intimate images deserve a hard stop.",
  },
  {
    type: "suspicious_link",
    weight: 22,
    patterns: [
      /https?:\/\/\S+/i,
      /\b(bit\.ly|tinyurl|t\.co|rb\.gy|drive\.google|forms\.gle|docs\.google)\b/i,
      /\b(click (this|the) link|login (here|now)|verify (your )?account (here|now))\b/i,
    ],
    explanation: "Unexpected links—especially shortened ones—can lead to phishing.",
  },
  {
    type: "off_platform",
    weight: 20,
    patterns: [
      /\b(whatsapp|telegram|signal|wickr|move (to|off)|text me at|my number is|add me on)\b/i,
      /\+\d{1,3}[\s-]?\d{6,}/,
      /\b(email me instead|dm me on (ig|insta|snap))\b/i,
    ],
    explanation: "Moving off-platform reduces safety tools and accountability.",
  },
  {
    type: "urgency",
    weight: 14,
    patterns: [
      /\b(today|tonight|right now|urgent|emergency|deadline|running out|act now|expires?|within (an? )?\d+ hours?)\b/i,
      /\b(hospital|surgery|stranded|stuck|deportation|customs hold)\b/i,
      /\b(limited time|last chance|before (midnight|noon))\b/i,
    ],
    explanation: "Artificial urgency limits your ability to verify the story.",
  },
];

const FLAG_TYPES: SafetyFlagType[] = [
  "money_request",
  "emotional_pressure",
  "sensitive_info",
  "suspicious_link",
  "off_platform",
  "urgency",
  "other",
];

function evidenceFor(text: string, pattern: RegExp): string {
  const match = text.match(pattern);
  if (!match) return text.slice(0, 120);
  const idx = match.index ?? 0;
  const start = Math.max(0, idx - 24);
  const end = Math.min(text.length, idx + match[0].length + 40);
  return text.slice(start, end).trim();
}

function levelFromScore(score: number): RiskLevel {
  if (score >= 55) return "high";
  if (score >= 22) return "moderate";
  return "low";
}

function titleFor(level: RiskLevel): string {
  if (level === "high") return "Potential Red Flag Detected";
  if (level === "moderate") return "Worth a closer look";
  return "No major red flags in this text";
}

function suggestions(flags: SafetyFlag[]): string[] {
  const base = [
    "I'm not comfortable with that. Let's keep chatting here for now.",
    "I don't send money or personal codes to people I've just met.",
  ];
  if (flags.some((f) => f.type === "money_request")) {
    base.unshift(
      "I hope things get better, but I can't help financially. Please use official channels."
    );
  }
  if (flags.some((f) => f.type === "suspicious_link")) {
    base.unshift(
      "I don't open shortened or unexpected links. Happy to use the in-app call instead."
    );
  }
  if (flags.some((f) => f.type === "off_platform")) {
    base.unshift(
      "I'd rather stay on this app for now until we know each other better."
    );
  }
  if (flags.some((f) => f.type === "sensitive_info")) {
    base.unshift(
      "I won't share codes, passwords, or private photos. We can video call here instead."
    );
  }
  return [...new Set(base)].slice(0, 3);
}

/** Runtime validation for proxy / Gemini payloads — never trust raw JSON. */
export function validateSafetyAnalysis(input: unknown): SafetyAnalysis | null {
  if (!input || typeof input !== "object") return null;
  const obj = input as Record<string, unknown>;
  const rawLevel = String(obj.riskLevel ?? "").toLowerCase();
  const riskLevel: RiskLevel | null =
    rawLevel === "high" || rawLevel === "critical"
      ? "high"
      : rawLevel === "moderate" || rawLevel === "medium" || rawLevel === "med"
        ? "moderate"
        : rawLevel === "low"
          ? "low"
          : null;
  if (!riskLevel) {
    return null;
  }
  if (typeof obj.title !== "string" || !obj.title.trim()) return null;
  if (!Array.isArray(obj.flags)) return null;
  if (!Array.isArray(obj.suggestedReplies)) return null;
  if (typeof obj.limitations !== "string") return null;

  const flags: SafetyFlag[] = [];
  for (const raw of obj.flags) {
    if (!raw || typeof raw !== "object") continue;
    const f = raw as Record<string, unknown>;
    const type = f.type;
    if (typeof type !== "string" || !FLAG_TYPES.includes(type as SafetyFlagType)) {
      continue;
    }
    if (typeof f.evidence !== "string" || typeof f.explanation !== "string") {
      continue;
    }
    flags.push({
      type: type as SafetyFlagType,
      evidence: f.evidence.slice(0, 240),
      explanation: f.explanation.slice(0, 400),
    });
  }

  const suggestedReplies = obj.suggestedReplies
    .filter((r): r is string => typeof r === "string" && r.trim().length > 0)
    .map((r) => r.slice(0, 280))
    .slice(0, 5);

  return {
    riskLevel,
    title: obj.title.slice(0, 120),
    flags,
    suggestedReplies,
    limitations: obj.limitations.slice(0, 500),
    source: obj.source === "ai" ? "ai" : "rules",
  };
}

/** Deterministic on-device analysis. Always available; not proof of intent. */
export function analyzeMessageLocally(text: string): SafetyAnalysis {
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      riskLevel: "low",
      title: "Nothing to analyze",
      flags: [],
      suggestedReplies: [],
      limitations: "Empty message — paste or select text first.",
      source: "rules",
    };
  }

  const flags: SafetyFlag[] = [];
  let score = 4;

  for (const rule of RULES) {
    for (const pattern of rule.patterns) {
      if (pattern.test(trimmed)) {
        flags.push({
          type: rule.type,
          evidence: evidenceFor(trimmed, pattern),
          explanation: rule.explanation,
        });
        score += rule.weight;
        break;
      }
    }
  }

  if (flags.length >= 3) score += 12;
  if (
    flags.some((f) => f.type === "money_request") &&
    flags.some((f) => f.type === "urgency")
  ) {
    score += 10;
  }

  const riskLevel = levelFromScore(score);

  return {
    riskLevel,
    title: titleFor(riskLevel),
    flags,
    suggestedReplies: suggestions(flags),
    limitations:
      "Rules-based check for education/demo. It is not proof someone is a scammer and can miss novel tactics or false-alarm on real emergencies.",
    source: "rules",
  };
}

/**
 * Analyze a message. Uses on-device rules by default.
 * If EXPO_PUBLIC_AI_PROXY_URL is set, POSTs { text } to that HTTPS/server proxy
 * (e.g. local Gemini proxy). The proxy holds GEMINI_API_KEY — never the app.
 */
export async function analyzeMessage(text: string): Promise<SafetyAnalysis> {
  const local = analyzeMessageLocally(text);
  const proxy = process.env.EXPO_PUBLIC_AI_PROXY_URL?.trim();
  if (!proxy) return local;

  try {
    const res = await fetch(proxy, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) return local;
    const data: unknown = await res.json();
    const validated = validateSafetyAnalysis(data);
    if (!validated) return local;
    // Preserve proxy source ("ai" | "rules") — do not claim AI when Gemini fell back.
    return {
      ...validated,
      source: validated.source === "ai" ? "ai" : "rules",
      // Prefer proxy flags but keep a safety net if empty on a high-signal text
      flags: validated.flags.length > 0 ? validated.flags : local.flags,
      suggestedReplies:
        validated.suggestedReplies.length > 0
          ? validated.suggestedReplies
          : local.suggestedReplies,
    };
  } catch {
    return local;
  }
}

/** Exported for tests / diagnostics — rule catalog size. */
export function getSafetyRuleCount(): number {
  return RULES.length;
}
