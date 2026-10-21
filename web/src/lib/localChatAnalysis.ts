import type { ChatAnalysis, ChatFlag, FlagType } from "./schemas";

type Rule = {
  type: FlagType;
  patterns: RegExp[];
  explanation: string;
  weight: number;
};

const RULES: Rule[] = [
  {
    type: "love_bombing",
    weight: 18,
    patterns: [
      /\b(falling for you|destiny|soulmate|meant to be|love of my life|marry me)\b/i,
      /\b(you'?re (the )?(most|so) (beautiful|special|perfect|stunning))\b/i,
      /\b(never felt (this|like) (way|this)|looking for someone real)\b/i,
      /❤️{2,}|\bmiss (your|you) (voice|touch|already)\b/i,
    ],
    explanation:
      "Intense affection or destiny talk very early is a classic romance-scam opener.",
  },
  {
    type: "off_platform",
    weight: 20,
    patterns: [
      /\b(whatsapp|telegram|signal|wickr|move (to|off)|add me (on|as)|my number is)\b/i,
      /\b(text me at|call me on|dm me on)\b/i,
      /\+\d{1,3}[\s-]?\d{6,}/,
    ],
    explanation:
      "Pushing the chat off the dating app reduces platform protections and is a common scam move.",
  },
  {
    type: "money_request",
    weight: 28,
    patterns: [
      /\b(send|wire|transfer|loan|deposit|gift ?card|crypto|usdt|bitcoin|btc|ethereum|paypal|western union|moneygram)\b/i,
      /\$\s?\d{2,}|₹\s?\d{2,}|\b\d{3,}\s?(dollars|usd|rupees)\b/i,
      /\b(pay (you|me) back|cover (the|her|his) (surgery|flight|fee|deposit))\b/i,
    ],
    explanation:
      "Any ask for money, gift cards, or crypto is a major red flag in early online dating.",
  },
  {
    type: "urgency",
    weight: 18,
    patterns: [
      /\b(today|tonight|right now|immediately|urgent|emergency|deadline|running out|act now|2 hours|few hours)\b/i,
      /\b(hospital|surgery|stranded|stuck|won't operate|time is running out)\b/i,
      /\bif you (loved|really cared|trusted) me\b/i,
    ],
    explanation:
      "Pressure to act fast stops you from verifying the story with friends or the platform.",
  },
  {
    type: "inconsistency",
    weight: 12,
    patterns: [
      /\b(offshore|oil (rig|platform)|peacekeeping|military deployment|un doctor|mining contract)\b/i,
      /\b(wifi isn'?t|can'?t video|camera broken|bad connection)\b/i,
      /\b(insurance won'?t cover|company (won'?t|will not) (pay|cover))\b/i,
    ],
    explanation:
      "Hard-to-verify jobs, broken video excuses, or sudden insurance gaps often appear in scripted scams.",
  },
];

function extractEvidence(chat: string, pattern: RegExp): string {
  const match = chat.match(pattern);
  if (!match) return "Pattern matched in conversation";
  const idx = match.index ?? 0;
  const start = Math.max(0, chat.lastIndexOf("\n", idx) + 1);
  let end = chat.indexOf("\n", idx);
  if (end === -1) end = Math.min(chat.length, idx + 120);
  return chat.slice(start, end).trim().slice(0, 160);
}

/**
 * Offline heuristic analyzer used when ANTHROPIC_API_KEY is missing.
 * Good enough for demos — not a substitute for a real model on novel chats.
 */
export function analyzeChatLocally(chat: string): ChatAnalysis {
  const flags: ChatFlag[] = [];
  let score = 8;

  for (const rule of RULES) {
    let hit = false;
    let evidence = "";
    for (const pattern of rule.patterns) {
      if (pattern.test(chat)) {
        hit = true;
        evidence = extractEvidence(chat, pattern);
        break;
      }
    }
    if (hit) {
      score += rule.weight;
      flags.push({
        type: rule.type,
        evidence,
        explanation: rule.explanation,
      });
    }
  }

  // Extra bump when multiple classic scam beats stack together
  if (flags.length >= 3) score += 12;
  if (flags.length >= 4) score += 10;

  const riskScore = Math.min(100, Math.max(0, Math.round(score)));
  const riskLevel: ChatAnalysis["riskLevel"] =
    riskScore >= 67 ? "high" : riskScore >= 34 ? "medium" : "low";

  const advice =
    riskLevel === "high"
      ? "Do not send money or crypto. Stay on the dating app, reverse-image-search any photos, and report the profile. Talk to a friend before responding further."
      : riskLevel === "medium"
        ? "Slow down. Keep the chat on-platform, ask for a live video call, and never share financial details. Treat money or urgency asks as deal-breakers."
        : "No strong scam patterns detected by the offline checker — still stay cautious, verify identity gradually, and never send money to someone you only know online.";

  return {
    riskScore,
    riskLevel,
    flags,
    advice:
      advice +
      " (Analyzed offline — no Anthropic key configured.)",
  };
}
