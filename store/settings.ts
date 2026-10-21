import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { MeetPlan, PrivacySettings } from "@/types";

type SettingsState = {
  demoMode: boolean;
  privacy: PrivacySettings;
  meetPlan: MeetPlan;
  setDemoMode: (value: boolean) => void;
  setPrivacy: (patch: Partial<PrivacySettings>) => void;
  setMeetPlan: (patch: Partial<MeetPlan>) => void;
  toggleChecklist: (key: keyof MeetPlan["checklist"]) => void;
  resetPrivacy: () => void;
};

const defaultPrivacy: PrivacySettings = {
  visibleToEveryone: true,
  showApproximateLocation: false,
  showCollege: false,
  screenshotNotifications: true,
  allowMessageRequests: true,
};

const defaultMeet: MeetPlan = {
  placeName: "Blue Bottle Coffee — Downtown",
  placeNote: "Busy café · Demo map pin (not live GPS)",
  checklist: {
    safetyTips: false,
    shareWithFriend: false,
    emergencyContacts: false,
    checkInReminder: false,
  },
  friendName: "",
  notes: "",
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      demoMode: true,
      privacy: defaultPrivacy,
      meetPlan: defaultMeet,
      setDemoMode: (demoMode) => set({ demoMode }),
      setPrivacy: (patch) =>
        set((s) => ({ privacy: { ...s.privacy, ...patch } })),
      setMeetPlan: (patch) =>
        set((s) => ({ meetPlan: { ...s.meetPlan, ...patch } })),
      toggleChecklist: (key) =>
        set((s) => ({
          meetPlan: {
            ...s.meetPlan,
            checklist: {
              ...s.meetPlan.checklist,
              [key]: !s.meetPlan.checklist[key],
            },
          },
        })),
      resetPrivacy: () => set({ privacy: defaultPrivacy }),
    }),
    {
      name: "trustlens-settings",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
