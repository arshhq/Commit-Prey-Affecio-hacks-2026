import { create } from "zustand";
import { DEMO_CONVERSATIONS } from "@/data/demo-chats";
import type { ChatMessage, Conversation, SafetyAnalysis } from "@/types";

type ChatState = {
  conversations: Conversation[];
  activeId: string | null;
  lastAnalysis: SafetyAnalysis | null;
  dismissedWarning: boolean;
  setActive: (id: string | null) => void;
  setAnalysis: (analysis: SafetyAnalysis | null) => void;
  dismissWarning: () => void;
  appendMessage: (conversationId: string, message: ChatMessage) => void;
  resetAnalysis: () => void;
};

export const useChatStore = create<ChatState>((set) => ({
  conversations: DEMO_CONVERSATIONS,
  activeId: null,
  lastAnalysis: null,
  dismissedWarning: false,
  setActive: (activeId) =>
    set({ activeId, lastAnalysis: null, dismissedWarning: false }),
  setAnalysis: (lastAnalysis) =>
    set({ lastAnalysis, dismissedWarning: false }),
  dismissWarning: () => set({ dismissedWarning: true }),
  resetAnalysis: () => set({ lastAnalysis: null, dismissedWarning: false }),
  appendMessage: (conversationId, message) =>
    set((s) => ({
      conversations: s.conversations.map((c) =>
        c.id === conversationId
          ? { ...c, messages: [...c.messages, message], preview: message.text }
          : c
      ),
    })),
}));
