import type { Conversation } from "@/types";

export const DEMO_CONVERSATIONS: Conversation[] = [
  {
    id: "c-alex",
    profileId: "alex",
    preview: "Can you help with the hospital deposit today?",
    unread: 2,
    messages: [
      {
        id: "m1",
        sender: "them",
        text: "Hey! Your profile stopped me mid-scroll. You feel like destiny somehow.",
        timestamp: "10:02",
      },
      {
        id: "m2",
        sender: "me",
        text: "Haha that's intense for day one — how's your week?",
        timestamp: "10:05",
      },
      {
        id: "m3",
        sender: "them",
        text: "Lonely on this offshore job. Can we move to WhatsApp? +44 7700 900123",
        timestamp: "10:08",
      },
      {
        id: "m4",
        sender: "them",
        text: "My mom collapsed. Surgeons need a $4,800 deposit TODAY. Crypto is fastest — USDT. If you cared you'd help.",
        timestamp: "10:14",
      },
    ],
  },
  {
    id: "c-jordan",
    profileId: "jordan",
    preview: "Dumpling place this weekend?",
    unread: 0,
    messages: [
      {
        id: "m1",
        sender: "them",
        text: "That hiking photo looks amazing. Cascade range?",
        timestamp: "Yesterday",
      },
      {
        id: "m2",
        sender: "me",
        text: "Yep — rainy but worth it. You cook much?",
        timestamp: "Yesterday",
      },
      {
        id: "m3",
        sender: "them",
        text: "Always. There's a great dumpling place downtown if you ever want a low-key meetup in public.",
        timestamp: "Yesterday",
      },
    ],
  },
  {
    id: "c-linh",
    profileId: "linh",
    preview: "Coffee + film cameras?",
    unread: 1,
    messages: [
      {
        id: "m1",
        sender: "them",
        text: "Saw you like film cameras — what do you shoot with?",
        timestamp: "Mon",
      },
      {
        id: "m2",
        sender: "me",
        text: "An old Contax mostly. You?",
        timestamp: "Mon",
      },
      {
        id: "m3",
        sender: "them",
        text: "Olympus. Coffee + camera walk sometime? Totally fine if you'd rather keep chatting here first.",
        timestamp: "Tue",
      },
    ],
  },
];
