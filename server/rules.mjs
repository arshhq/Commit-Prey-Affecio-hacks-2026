/** Mirrors lib/safety-analysis.ts rules for the Node proxy (no TS build step). */

const RULES = [
  {
    type: "money_request",
    weight: 34,
    patterns: [
      /\b(send|wire|transfer|loan|deposit|gift ?card|crypto|usdt|bitcoin|btc|paypal|venmo|cashapp|western union|moneygram)\b/i,
      /\$\s?\d{2,}|\b\d{3,}\s?(dollars|usd|bucks)\b/i,
      /\b(pay (you|me) back|cover (the|her|his) (surgery|flight|fee|deposit|rent))\b/i,
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
      /\b(falling for you|destiny|soulmate|meant to be)\b/i,
    ],
    explanation: "Affection or guilt used to push a decision can be coercive.",
  },
  {
    type: "sensitive_info",
    weight: 24,
    patterns: [
      /\b(otp|one[- ]time (code|password)|verification code|ssn|password|bank (login|account)|nude|private photo)\b/i,
      /\b(send (a )?selfie with|prove you('re| are) real)\b/i,
    ],
    explanation: "Asks for codes, financial logins, or intimate images deserve a hard stop.",
  },
  {
    type: "suspicious_link",
    weight: 22,
    patterns: [/https?:\/\/\S+/i, /\b(bit\.ly|tinyurl|t\.co|rb\.gy)\b/i],
    explanation: "Unexpected links—especially shortened ones—can lead to phishing.",
  },
  {
    type: "off_platform",
    weight: 20,
    patterns: [
      /\b(whatsapp|telegram|signal|wickr|move (to|off)|text me at|my number is|add me on)\b/i,
      /\+\d{1,3}[\s-]?\d{6,}/,
    ],
    explanation: "Moving off-platform reduces safety tools and accountability.",
  },
  {
    type: "urgency",
    weight: 14,
    patterns: [
      /\b(today|tonight|right now|urgent|emergency|deadline|running out|act now|expires?)\b/i,
      /\b(hospital|surgery|stranded|stuck)\b/i,
    ],
    explanation: "Artificial urgency limits your ability to verify the story.",
  },
];

function evidenceFor(text, pattern) {
  const match = text.match(pattern);
  if (!match) return text.slice(0, 120);
  const idx = match.index ?? 0;
  return text.slice(Math.max(0, idx - 24), Math.min(text.length, idx + match[0].length + 40)).trim();
}

function levelFromScore(score) {
  if (score >= 55) return "high";
  if (score >= 22) return "moderate";
  return "low";
}

export function analyzeMessageLocally(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) {
    return {
      riskLevel: "low",
      title: "Nothing to analyze",
      flags: [],
      suggestedReplies: [],
      limitations: "Empty message.",
      source: "rules",
    };
  }

  const flags = [];
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
  const title =
    riskLevel === "high"
      ? "Potential Red Flag Detected"
      : riskLevel === "moderate"
        ? "Worth a closer look"
        : "No major red flags in this text";

  const suggestedReplies = [
    "I hope things get better, but I can't help financially. Please use official channels.",
    "I'd rather stay on this app for now until we know each other better.",
    "I don't send money or personal codes to people I've just met.",
  ].slice(0, 3);

  return {
    riskLevel,
    title,
    flags,
    suggestedReplies,
    limitations:
      "Rules-based check. Not proof of scam intent; can miss novel tactics.",
    source: "rules",
  };
}
