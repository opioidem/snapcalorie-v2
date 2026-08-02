<div align="center">

# 🍽️ SnapCalorie V2

**AI-powered calorie tracker with multiple vision sources**

Track what you eat by snapping a photo. On-device or cloud AI — you choose.

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org)

[Web App](https://snapcalorie-v2.vercel.app) · [Android APK](https://github.com/opioidem/snapcalorie-v2/releases/latest) · [Report Bug](https://github.com/opioidem/snapcalorie-v2/issues)

</div>

---

## What is SnapCalorie?

SnapCalorie lets you **log food by taking a photo**. An AI vision model identifies what's on your plate, looks up nutrition data from the USDA FoodData Central database, and logs calories + macros automatically.

You can choose from **5 different vision sources** — from fully private on-device inference to fast cloud APIs — or search the USDA database manually.

## Features

### 🔍 Multiple AI Vision Sources

| Source | Type | API Key | Privacy |
|--------|------|---------|---------|
| **WebLLM** (Phi-3.5 Vision) | On-device | ❌ Not needed | 🔒 Fully private |
| **OpenRouter** | Cloud | ✅ Required | ⚠️ Sent to provider |
| **NVIDIA NIM** | Cloud | ✅ Required | ⚠️ Sent to provider |
| **Groq** | Cloud | ✅ Required | ⚠️ Sent to provider |
| **Custom Endpoint** | Cloud | ✅ Required | Depends on provider |

### 📊 Calorie Tracking

- Daily calorie targets computed via **Mifflin-St Jeor BMR**
- Macro tracking (protein, carbs, fat) with visual bars
- Day rail showing macro composition at a glance
- Date strip for navigating between days

### 🎯 Onboarding

5-step personalized setup:

1. **Profile** — Name, age, sex
2. **Stats** — Weight and height
3. **Activity** — Sedentary to extra active
4. **Goal** — Lose weight, maintain, or build muscle
5. **AI Setup** — Choose your vision source and enter API keys

### 🥗 USDA Integration

- Searches [USDA FoodData Central](https://fdc.nal.usda.gov/) for accurate nutrition
- Free API key available (increases rate limits)
- Falls back to AI estimates when USDA has no match

### 📱 Android APK

- Built with **Capacitor 7** wrapping the web app
- WebView-based — runs the same code as the web version
- Available in [Releases](https://github.com/opioidem/snapcalorie-v2/releases)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org) + React 19 |
| Language | [TypeScript](https://www.typescriptlang.org) |
| On-device AI | [@mlc-ai/web-llm](https://github.com/mlc-ai/web-llm) (Phi-3.5 Vision) |
| Nutrition Data | [USDA FoodData Central API](https://fdc.nal.usda.gov/) |
| Storage | localStorage (no backend, no auth) |
| Styling | Custom brutalist CSS system |
| Android | [Capacitor 7](https://capacitorjs.com) |
| Hosting | [Vercel](https://vercel.com) |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18+
- [npm](https://www.npmjs.com) or equivalent
- For Android: [Android SDK](https://developer.android.com/studio) + JDK 17+

### Web App

```bash
# Clone
git clone https://github.com/opioidem/snapcalorie-v2.git
cd snapcalorie-v2

# Install
npm install

# Development
npm run dev

# Production build
npm run build
npm start
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Android APK

```bash
# Build static export
npm run build

# Sync to Android
npx cap sync android

# Build APK
cd android
./gradlew assembleDebug

# APK location
# android/app/build/outputs/apk/debug/app-debug.apk
```

### Install APK via ADB

```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

## Project Structure

```
snapcalorie-v2/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout + metadata
│   │   ├── page.tsx             # Routes to onboarding or dashboard
│   │   └── globals.css          # Design system (CSS custom properties)
│   ├── components/
│   │   ├── OnboardingFlow.tsx   # 5-step onboarding
│   │   ├── Dashboard.tsx        # Main app (hero, macros, food log)
│   │   ├── Camera.tsx           # Photo capture modal
│   │   └── FoodResult.tsx       # Detection result + USDA confirmation
│   └── lib/
│       ├── types.ts             # TypeScript interfaces
│       ├── storage.ts           # localStorage helpers
│       ├── fitness.ts           # BMR/TDEE/macro calculations
│       ├── vision.ts            # 5 vision source implementations
│       └── usda.ts              # USDA FoodData Central API client
├── android/                     # Capacitor Android project
├── capacitor.config.ts          # Capacitor configuration
├── next.config.ts               # Next.js static export config
└── package.json
```

## How It Works

```
📸 Take Photo
    ↓
🔍 Vision Source (user's choice)
    ↓ WebLLM / OpenRouter / NVIDIA / Groq / Custom
    ↓
📝 Identify Food Name + Estimate Nutrition
    ↓
🗄️ USDA FoodData Central Lookup
    ↓ (accurate data if found)
    ↓
✅ Confirm & Log
    ↓
📊 Update Dashboard (calories, macros, day rail)
```

## Configuration

All settings are stored in **localStorage** — no accounts, no backend.

| Key | Description |
|-----|-------------|
| `snapcal_profile` | User profile (age, weight, height, goals) |
| `snapcal_api_keys` | API keys for vision sources |
| `snapcal_food_log` | All logged food entries |
| `snapcal_vision_source` | Selected vision source ID |
| `snapcal_onboarding_complete` | Whether onboarding is done |

## Privacy

- **No tracking, no analytics, no accounts**
- All data stays in your browser's localStorage
- On-device (WebLLM) mode sends **zero data** to external servers
- Cloud vision sources send images to the selected provider (see their privacy policies)
- USDA API calls include only the food name (no images, no personal data)

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments

- [USDA FoodData Central](https://fdc.nal.usda.gov/) — nutrition data
- [MLC-AI WebLLM](https://github.com/mlc-ai/web-llm) — on-device LLM inference
- [Capacitor](https://capacitorjs.com) — native mobile wrapper
- [Next.js](https://nextjs.org) — React framework

## Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<div align="center">

**Built with ❤️ using AI-powered food detection**

[⬆ Back to top](#-snapcalorie-v2)

</div>
