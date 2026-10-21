# Commit-Prey-Affecio-hacks-2026

Privacy-first trust layer for online dating: detects fake photos and romance-scam chats, entirely in the browser. Built for AFFECIO HACKS '26.

# TrustLens

> Trust before connection.

**Live demo:** [https://trustlens-lovat.vercel.app](https://trustlens-lovat.vercel.app)

TrustLens is a privacy-first safety layer for online dating and social discovery. It helps users spot fake profiles and romance scams *before* they get emotionally or financially invested.

**Built for AFFECIO HACKS '26 — Problem Statement #4: Trust Before Connection**

## Features
- **Photo Authenticity Check:** Error Level Analysis, metadata and pixel checks, all client-side
- **Scam Chat Detector:** flags love-bombing, off-platform requests, urgency and money asks (works offline; Claude API optional)
- **Live Risk Meter:** real-time trust score with clear, gentle warnings
- **Privacy by Design:** photos never leave the device; only SHA-256 hashes are used

## Tech Stack
Next.js 14 (App Router), TypeScript, Tailwind CSS, HTML5 Canvas API, Web Crypto API, Claude API (optional), Lucide React, Framer Motion, Zod, Vercel

## Run locally
```bash
pnpm install
pnpm dev
```

Optional: add `ANTHROPIC_API_KEY` to `.env.local` for Claude-powered chat analysis. Without it, the offline detector still works for demos.

## Team — Commit&Prey
* Arshdeep
