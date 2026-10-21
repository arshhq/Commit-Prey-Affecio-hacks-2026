import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

type AuthState = {
  hydrated: boolean;
  isAuthenticated: boolean;
  demoSession: boolean;
  email: string;
  displayName: string;
  setHydrated: (v: boolean) => void;
  enterDemo: (name?: string) => void;
  signInEmail: (email: string, password: string) => Promise<string | null>;
  signUpEmail: (email: string, password: string, name: string) => Promise<string | null>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      hydrated: true,
      isAuthenticated: false,
      demoSession: false,
      email: "",
      displayName: "You",
      setHydrated: (hydrated) => set({ hydrated }),
      enterDemo: (name = "You") =>
        set({
          isAuthenticated: true,
          demoSession: true,
          displayName: name,
          email: "demo@trustlens.app",
        }),
      signInEmail: async (email, password) => {
        const supabase = getSupabase();
        if (!supabase || !isSupabaseConfigured) {
          get().enterDemo(email.split("@")[0] || "You");
          return null;
        }
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) return error.message;
        set({
          isAuthenticated: true,
          demoSession: false,
          email: email.trim(),
          displayName: email.split("@")[0] || "You",
        });
        return null;
      },
      signUpEmail: async (email, password, name) => {
        const supabase = getSupabase();
        if (!supabase || !isSupabaseConfigured) {
          get().enterDemo(name || email.split("@")[0]);
          return null;
        }
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { display_name: name } },
        });
        if (error) return error.message;
        set({
          isAuthenticated: true,
          demoSession: false,
          email: email.trim(),
          displayName: name || email.split("@")[0],
        });
        return null;
      },
      signOut: async () => {
        const supabase = getSupabase();
        if (supabase && isSupabaseConfigured) {
          await supabase.auth.signOut();
        }
        set({
          isAuthenticated: false,
          demoSession: false,
          email: "",
          displayName: "You",
        });
      },
    }),
    {
      name: "trustlens-auth",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
      // safety: if rehydrate is slow, still unlock UI shortly after mount via setHydrated callers
      partialize: (s) => ({
        isAuthenticated: s.isAuthenticated,
        demoSession: s.demoSession,
        email: s.email,
        displayName: s.displayName,
      }),
    }
  )
);
