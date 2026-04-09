# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Next.js version warning:** This project uses Next.js 16 with breaking changes from older versions. APIs, conventions, and file structure may differ from training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
```

No test runner is configured. Required env vars: `GROQ_API_KEY`, `OPENROUTER_API_KEY` (in `.env`).

## Architecture Overview

**SystemSim** is a desktop-only system design interview simulator built with Next.js App Router, React 19, Zustand, and React Flow (`@xyflow/react`).

### Core Data Flow

1. User drags components from `ComponentPalette` → dropped on `DesignCanvas` → stored in `canvasStore` (nodes/edges)
2. **Simulation**: `runSimulation(nodes, edges, RPS)` in `src/engine/simulator.ts` runs Kahn's topological sort to propagate QPS, compute per-node utilization/latency, detect bottlenecks → results stored in `simulationStore`
3. **Scoring**: `scoreDesign(nodes, edges)` in `src/scoring/scorer.ts` runs 5 rule files (20pts each) → returns 100pt score + feedback
4. **AI Feedback**: POST `/api/getResponse` → Groq LLM via OpenAI-compatible SDK → structured feedback

### Key Directories

- `src/data/` — All static content: 30 components (`components.ts`), 35 problems (`problems.ts`), interview guides (`interviewData.ts`), trade-off cards, learning path
- `src/store/` — Zustand stores, all persisted to localStorage: `canvasStore`, `appStore`, `simulationStore`, `interviewStore`, `savedDesignsStore`
- `src/engine/` — Pure simulation logic (`simulator.ts` = Kahn's algo, `constants.ts` = thresholds)
- `src/scoring/rules/` — One file per scoring dimension: `scalability`, `availability`, `latency`, `cost`, `tradeoffs`
- `src/components/canvas/` — React Flow canvas, custom `ComponentNode`/`TextNode`, `AnimatedEdge` with protocol badges
- `src/components/sidebar/` — Left 280px panel (Components | Problems | Learn tabs)
- `src/components/panel/` — Right 300px panel (Props | Simulate | Score | Capacity | Trade-offs tabs)
- `src/components/interview/` — 6-phase interview mode FSM (managed by `interviewStore`)
- `src/config/prompts/` — JSON system prompts for Groq LLM
- `src/utils/backend/config/` — Groq client init (`chat.ts`) and model name (`model.js`)

### Important Patterns

**Zustand + localStorage persistence:**
```typescript
export const useCanvasStore = create<CanvasState>()(
  persist((set) => ({ ... }), { name: "systemsim-canvas" })
);
```

**Scoring rules** each export `score${Category}(nodes, edges): CategoryScore` returning `{ score, maxScore: 20, feedback[], passed[] }`. Rules check for component presence and connectivity patterns using component `id` strings from `src/data/components.ts`.

**Simulation** assigns QPS to entry nodes (no incoming edges), then fans out: load balancers split evenly, all other nodes propagate 100% to each downstream. Longest-path latency is computed separately.

**Interview mode** is a 6-phase FSM: Requirements (5min) → Estimation → API Design → Data Model → High-Level Design (15min, canvas work) → Deep Dive (10min). State lives in `interviewStore`.

**React Flow custom types** are registered in `src/components/canvas/nodes/nodeTypes.ts` and `src/components/canvas/edges/edgeTypes.ts` — new node/edge types must be added here.

### Keyboard Shortcuts

`Ctrl+Enter` simulate · `Ctrl+Shift+S` score · `Ctrl+S` save · `Ctrl+O` load · `Ctrl+E` export PNG · `Delete` remove selected node
