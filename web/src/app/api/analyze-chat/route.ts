import { NextResponse } from "next/server";
import { analyzeChatLocally } from "@/lib/localChatAnalysis";
import {
  AnalyzeChatRequestSchema,
  ChatAnalysisSchema,
  type ChatAnalysis,
} from "@/lib/schemas";

export const runtime = "nodejs";

function stripMarkdownFences(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fenced?.[1]) return fenced[1].trim();
  return trimmed;
}

const SYSTEM_PROMPT = `You are TrustLens, a romance-scam and online-dating safety analyst.
Analyze the pasted chat for classic romance-scam patterns.

Return ONLY valid JSON matching this exact shape (no markdown, no commentary):
{
  "riskScore": number 0-100,
  "riskLevel": "low" | "medium" | "high",
  "flags": [
    {
      "type": "love_bombing" | "off_platform" | "money_request" | "urgency" | "inconsistency" | "other",
      "evidence": "short quote from the chat",
      "explanation": "why this is a risk signal"
    }
  ],
  "advice": "practical, compassionate next-step advice for the user"
}

Guidelines:
- love_bombing: intense affection / destiny talk very early
- off_platform: push to WhatsApp, Telegram, email, etc.
- money_request: cash, gift cards, crypto, deposits, travel money
- urgency: deadlines, emergencies, "act now"
- inconsistency: story details that don't add up
- Be fair: flirty but normal chats can be low risk
- riskLevel: low (0-33), medium (34-66), high (67-100) — keep consistent with riskScore`;

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = AnalyzeChatRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const rawKey = process.env.ANTHROPIC_API_KEY?.trim() ?? "";
    const apiKey =
      rawKey &&
      !/^(your_key_here|sk-ant-x+|xxx+|changeme|placeholder)$/i.test(rawKey)
        ? rawKey
        : "";

    // No real Anthropic key → offline heuristic analyzer (demo-ready)
    if (!apiKey) {
      const local = ChatAnalysisSchema.parse(
        analyzeChatLocally(parsed.data.chat)
      );
      return NextResponse.json(local);
    }

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `Analyze this dating chat for scam risk:\n\n${parsed.data.chat}`,
          },
        ],
      }),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      console.error("Anthropic API error:", anthropicRes.status, errText);
      // Fall back so demos still work if the key is invalid / quota'd
      const local = ChatAnalysisSchema.parse(
        analyzeChatLocally(parsed.data.chat)
      );
      return NextResponse.json(local);
    }

    const anthropicJson: unknown = await anthropicRes.json();
    const contentBlocks =
      anthropicJson &&
      typeof anthropicJson === "object" &&
      "content" in anthropicJson &&
      Array.isArray((anthropicJson as { content: unknown }).content)
        ? (anthropicJson as { content: Array<{ type?: string; text?: string }> })
            .content
        : [];

    const text = contentBlocks
      .filter((b) => b.type === "text" && typeof b.text === "string")
      .map((b) => b.text ?? "")
      .join("\n");

    if (!text) {
      const local = ChatAnalysisSchema.parse(
        analyzeChatLocally(parsed.data.chat)
      );
      return NextResponse.json(local);
    }

    let jsonValue: unknown;
    try {
      jsonValue = JSON.parse(stripMarkdownFences(text));
    } catch {
      const local = ChatAnalysisSchema.parse(
        analyzeChatLocally(parsed.data.chat)
      );
      return NextResponse.json(local);
    }

    const analysis = ChatAnalysisSchema.safeParse(jsonValue);
    if (!analysis.success) {
      console.error("Zod validation failed:", analysis.error.flatten());
      const local = ChatAnalysisSchema.parse(
        analyzeChatLocally(parsed.data.chat)
      );
      return NextResponse.json(local);
    }

    const result: ChatAnalysis = analysis.data;
    return NextResponse.json(result);
  } catch (err) {
    console.error("analyze-chat error:", err);
    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}
