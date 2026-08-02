# SnapCalorie V2 - Build Log

## Phase 1: Project Setup & Architecture — 2026-08-02 01:19

### Completed
- Scaffolded Next.js 16 app with TypeScript
- Installed dependencies: @mlc-ai/web-llm, uuid
- Designed architecture for multiple vision sources

### Architecture Decisions
- **No Firebase Auth** — Using localStorage for user profile persistence
- **Multiple Vision Sources**:
  1. **WebLLM (on-device)**: Phi-3.5-vision-instruct — privacy-first, no API key needed
  2. **OpenRouter**: Free models including vision (user provides API key)
  3. **NVIDIA NIM**: Free-tier vision models (llama-3.2-11b-vision)
  4. **Groq**: Fast inference with vision models
  5. **User's custom endpoint**: Any OpenAI-compatible API

### Folder Structure
```
/src
├── /app
│   ├── /onboarding — 5-page flow
│   ├── /dashboard — Main app
│   └── /api/vision — Vision API routes
├── /lib
│   ├── vision.ts — Multi-source vision orchestration
│   ├── usda.ts — USDA FoodData Central API
│   └── storage.ts — localStorage helpers
├── /components
│   ├── Camera.tsx — Photo capture
│   ├── FoodResult.tsx — Detection results
│   └── OnboardingFlow.tsx
└── /styles
    └── brutalist.css — Dark UI with purple accent
```

### Tech Stack
- Next.js 16 + TypeScript
- @mlc-ai/web-llm for on-device inference
- localStorage for persistence (no auth)
- USDA FDC API for nutrition data
- Multiple OpenAI-compatible vision endpoints

---

## Phase 2: Implementation (in progress)
