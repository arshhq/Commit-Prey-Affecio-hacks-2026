# TrustLens

**Same vibes. Less risks. More real.**

Privacy-first safety layer for dating & social discovery — Affecio Hacks ’26 · *Trust Before Connection*.

## Live demo

**https://trustlens-lovat.vercel.app**

## What’s in this repo

Expo + React Native app (root) with:

- Onboarding + **demo mode** (no backend required)
- Profile & verification clarity (simulated badges clearly labeled)
- **Live Message Guard** (on-device rules; optional secure Gemini proxy)
- Trust Insights + **Trust Sandbox** scenarios
- **Privacy Shield**, **Safe Meet Planner**, **VibeSync**

Archived Next.js web MVP lives under [`web/`](./web) (that’s what’s deployed at the live link above).

### Run the mobile app

```bash
npm install
npx expo start
```

Then open iOS Simulator, Android emulator, Expo Go, or press `w` for web.

Optional Message Guard proxy (server-side Gemini key only):

```bash
# .env (gitignored) — never put GEMINI_API_KEY in EXPO_PUBLIC_*
# EXPO_PUBLIC_AI_PROXY_URL=http://127.0.0.1:8787/analyze-message
# GEMINI_API_KEY=…
npm run server:analyze
```

Without credentials, use **Enter demo mode** — Message Guard still works offline via rules.

### Structure

```
app/           Expo Router screens (auth, tabs, chat, sandbox, …)
components/    UI + feature components
lib/           supabase, safety-analysis, config
server/        secure Gemini analyze proxy
store/         zustand auth / settings / chat
data/          demo profiles, chats, scenarios
constants/     design tokens
web/           archived Next.js TrustLens web app
```

### Team

Commit&Prey · Affecio Hacks ’26
