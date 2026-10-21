import type { Scenario } from "@/types";

export const DEMO_SCENARIOS: Scenario[] = [
  {
    id: "money-early",
    title: "Too good to be true",
    riskLabel: "Medium Risk",
    riskLevel: "moderate",
    summary: "Someone escalates intimacy quickly, then asks for money for a family emergency.",
    lessons: [
      "Love-bombing can soften you up before a request.",
      "Real emergencies rarely require crypto or gift cards from a stranger.",
      "Keep the conversation on-platform until trust is earned slowly.",
    ],
    steps: [
      {
        id: "s1",
        from: "them",
        text: "I feel like I've known you forever already. You're different from everyone else.",
        choices: [
          {
            id: "a",
            label: "That's sweet — tell me more about your week.",
            safer: true,
            feedback: "Good: stay warm but keep the pace grounded.",
          },
          {
            id: "b",
            label: "I think I'm falling for you too ❤️",
            safer: false,
            feedback: "Matching intense affection early can accelerate a scam script.",
          },
        ],
      },
      {
        id: "s2",
        from: "them",
        text: "My mom needs emergency surgery and insurance won't cover it. Can you send $900 in USDT today? I'll pay you back Friday.",
        choices: [
          {
            id: "a",
            label: "I don't send money to people I've just met. Hope she's okay.",
            safer: true,
            feedback: "Clear boundary. Money requests from new contacts are a major red flag.",
          },
          {
            id: "b",
            label: "How do I send USDT? I want to help.",
            safer: false,
            feedback: "Sending crypto to someone you only know online is a classic romance-scam outcome.",
          },
        ],
      },
      {
        id: "s3",
        from: "narrator",
        text: "Scenario complete. Notice how affection + urgency + off-platform money combined.",
      },
    ],
  },
  {
    id: "private-info",
    title: "Boundary testing",
    riskLabel: "High Risk",
    riskLevel: "high",
    summary: "A match pressures you for private photos and account codes.",
    lessons: [
      "Codes and OTPs should never be shared.",
      "Pressure after refusal is itself a signal.",
      "You can leave without explaining yourself.",
    ],
    steps: [
      {
        id: "s1",
        from: "them",
        text: "Send a selfie with today's date so I know you're real. Then share the code I text you.",
        choices: [
          {
            id: "a",
            label: "I don't share codes. We can video call on the app instead.",
            safer: true,
            feedback: "Great alternative that doesn't expose account recovery paths.",
          },
          {
            id: "b",
            label: "Okay, what's the code for?",
            safer: false,
            feedback: "Engaging on codes can lead to account takeover.",
          },
        ],
      },
      {
        id: "s2",
        from: "them",
        text: "If you trusted me you'd just do it. Don't be difficult.",
        choices: [
          {
            id: "a",
            label: "I'm going to pause this chat. Take care.",
            safer: true,
            feedback: "Leaving under pressure is a healthy safety move.",
          },
          {
            id: "b",
            label: "Sorry — I'll send it.",
            safer: false,
            feedback: "Guilt can override your judgment. Trust that discomfort.",
          },
        ],
      },
      {
        id: "s3",
        from: "narrator",
        text: "You practiced resisting coercion. Shame-based pressure is a warning sign.",
      },
    ],
  },
  {
    id: "suspicious-link",
    title: "Suspicious link",
    riskLabel: "Medium Risk",
    riskLevel: "moderate",
    summary: "Someone sends a shortened link claiming to be a ticket or video invite.",
    lessons: [
      "Shortened links hide destinations.",
      "Ask to stay inside the app's video tools.",
      "Never enter passwords on unexpected pages.",
    ],
    steps: [
      {
        id: "s1",
        from: "them",
        text: "Join my private video room: http://bit.ly/meet-now-xx — hurry, link expires.",
        choices: [
          {
            id: "a",
            label: "I don't open shortened links. Use the in-app call.",
            safer: true,
            feedback: "Perfect. Keep media inside the trusted app surface.",
          },
          {
            id: "b",
            label: "Opening it now…",
            safer: false,
            feedback: "Phishing pages often impersonate login screens.",
          },
        ],
      },
      {
        id: "s2",
        from: "them",
        text: "It's just a Google form to RSVP. Enter your email and password so I know it's you.",
        choices: [
          {
            id: "a",
            label: "I never enter passwords on links from chat. Let's call in-app.",
            safer: true,
            feedback: "Credential requests via surprise links are phishing, not RSVPs.",
          },
          {
            id: "b",
            label: "Alright, logging in so we can meet.",
            safer: false,
            feedback: "Entering credentials on an unexpected page can hand over your account.",
          },
        ],
      },
      {
        id: "s3",
        from: "narrator",
        text: "Scenario complete. Urgency + opaque links + password asks deserve extra skepticism.",
      },
    ],
  },
];
