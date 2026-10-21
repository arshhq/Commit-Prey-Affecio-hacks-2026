import { isSupabaseConfigured } from "@/lib/supabase";

export type BackendStatus = {
  supabaseAuth: "configured" | "missing";
  aiProxy: "configured" | "missing";
  geminiKeyInApp: "never"; // keys must not live in the client
  offlineDemo: "available";
};

/** Non-secret status for Settings / diagnostics. */
export function getBackendStatus(): BackendStatus {
  const proxy = process.env.EXPO_PUBLIC_AI_PROXY_URL?.trim() ?? "";
  return {
    supabaseAuth: isSupabaseConfigured ? "configured" : "missing",
    aiProxy: proxy.length > 0 ? "configured" : "missing",
    geminiKeyInApp: "never",
    offlineDemo: "available",
  };
}
