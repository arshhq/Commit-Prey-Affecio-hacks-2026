import { z } from "zod";

export const FlagTypeSchema = z.enum([
  "love_bombing",
  "off_platform",
  "money_request",
  "urgency",
  "inconsistency",
  "other",
]);

export const ChatFlagSchema = z.object({
  type: FlagTypeSchema,
  evidence: z.string(),
  explanation: z.string(),
});

export const ChatAnalysisSchema = z.object({
  riskScore: z.number().min(0).max(100),
  riskLevel: z.enum(["low", "medium", "high"]),
  flags: z.array(ChatFlagSchema),
  advice: z.string(),
});

export const AnalyzeChatRequestSchema = z.object({
  chat: z.string().min(1, "Chat text is required").max(50000),
});

export type FlagType = z.infer<typeof FlagTypeSchema>;
export type ChatFlag = z.infer<typeof ChatFlagSchema>;
export type ChatAnalysis = z.infer<typeof ChatAnalysisSchema>;
export type AnalyzeChatRequest = z.infer<typeof AnalyzeChatRequestSchema>;

export type PhotoSignal = {
  name: string;
  score: number;
  explanation: string;
};

export type PhotoAnalysis = {
  authenticityScore: number;
  fingerprint: string;
  hasExif: boolean;
  elaScore: number;
  noiseScore: number;
  smoothnessScore: number;
  signals: PhotoSignal[];
  elaImageDataUrl: string | null;
};
