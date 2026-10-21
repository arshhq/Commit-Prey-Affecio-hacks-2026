export type VerificationStatus = "verified" | "unverified" | "self_reported";

export type VerificationItem = {
  id: string;
  label: string;
  status: VerificationStatus;
  detail: string;
  demoOnly?: boolean;
};

export type DemoProfile = {
  id: string;
  name: string;
  age: number;
  city: string;
  bio: string;
  interests: string[];
  photoGradient: [string, string];
  verifications: VerificationItem[];
  completeness: number;
  photoSignal: number;
  behaviorSignal: number;
  notes: string;
};

export type RiskLevel = "low" | "moderate" | "high";

export type SafetyFlagType =
  | "money_request"
  | "emotional_pressure"
  | "sensitive_info"
  | "suspicious_link"
  | "off_platform"
  | "urgency"
  | "other";

export type SafetyFlag = {
  type: SafetyFlagType;
  evidence: string;
  explanation: string;
};

export type SafetyAnalysis = {
  riskLevel: RiskLevel;
  title: string;
  flags: SafetyFlag[];
  suggestedReplies: string[];
  limitations: string;
  source: "rules" | "ai";
};

export type ChatMessage = {
  id: string;
  sender: "them" | "me" | "system";
  text: string;
  timestamp: string;
};

export type Conversation = {
  id: string;
  profileId: string;
  preview: string;
  unread: number;
  messages: ChatMessage[];
};

export type ScenarioChoice = {
  id: string;
  label: string;
  safer: boolean;
  feedback: string;
};

export type ScenarioStep = {
  id: string;
  from: "them" | "narrator";
  text: string;
  choices?: ScenarioChoice[];
};

export type Scenario = {
  id: string;
  title: string;
  riskLabel: string;
  riskLevel: RiskLevel;
  summary: string;
  lessons: string[];
  steps: ScenarioStep[];
};

export type PrivacySettings = {
  visibleToEveryone: boolean;
  showApproximateLocation: boolean;
  showCollege: boolean;
  screenshotNotifications: boolean;
  allowMessageRequests: boolean;
};

export type MeetPlan = {
  placeName: string;
  placeNote: string;
  checklist: {
    safetyTips: boolean;
    shareWithFriend: boolean;
    emergencyContacts: boolean;
    checkInReminder: boolean;
  };
  friendName: string;
  notes: string;
};
