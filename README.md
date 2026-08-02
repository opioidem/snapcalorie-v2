# SnapCalorie V2

AI-powered calorie tracker with multiple vision sources for food detection. On-device (WebLLM) or cloud (OpenRouter, NVIDIA NIM, Groq, Custom).

**Live:** https://snapcalorie-v2.vercel.app

## Features

- **5 vision sources** for food detection:
  - **WebLLM** (on-device, no API key, fully private)
  - **OpenRouter** (free tier)
  - **NVIDIA NIM** (fast inference)
  - **Groq** (ultra-fast)
  - **Custom endpoint** (any OpenAI-compatible API)
- **5-page onboarding**: Profile, Stats, Activity, Goal, AI Setup
- **USDA FoodData Central** integration for accurate nutrition
- **Brutalist dark UI** with JetBrains Mono
- **localStorage persistence** - no auth, no backend
- **Date strip** + day rail + macro bars

## Tech Stack

- Next.js 16 + React 19 + TypeScript
- @mlc-ai/web-llm (Phi-3.5-vision-instruct)
- USDA FoodData Central API
- localStorage for persistence

## Setup

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm start
```

Deploy to Vercel:

```bash
vercel --prod
```

## Architecture

```
src/
  app/
    layout.tsx
    page.tsx              # Routing: onboarding OR dashboard
    globals.css           # Design system
  components/
    OnboardingFlow.tsx    # 5-step flow
    Dashboard.tsx         # Main app
    Camera.tsx            # Photo capture modal
    FoodResult.tsx        # Detection result UI
  lib/
    types.ts              # All TS interfaces
    storage.ts            # localStorage helpers
    fitness.ts            # BMR/TDEE calculations
    vision.ts             # 5 vision source implementations
    usda.ts               # USDA API client
```

## Android APK

A Capacitor-based Android wrapper is included in `android/`. Build with:

```bash
cd android && ./gradlew assembleDebug
```

The APK output is at `android/app/build/outputs/apk/debug/app-debug.apk`.

## License

MIT