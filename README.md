<div align="center">

<a href="https://github.com/vijaygupta18/system-design-simulator">
  <img src="public/banner.svg" alt="SystemForge" width="900"/>
</a>

<br/><br/>

**The open-source system design interview simulator.**

Build real architectures · simulate production traffic · get scored like a real interview.

<br/>

[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![ReactFlow](https://img.shields.io/badge/ReactFlow_v12-FF0072?style=for-the-badge)](https://reactflow.dev)

[![CI](https://img.shields.io/github/actions/workflow/status/vijaygupta18/system-design-simulator/ci.yml?branch=main&style=flat-square&label=CI)](https://github.com/vijaygupta18/system-design-simulator/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/github/license/vijaygupta18/system-design-simulator?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-22c55e.svg?style=flat-square)](#contributing)
[![Stars](https://img.shields.io/github/stars/vijaygupta18/system-design-simulator?style=flat-square)](https://github.com/vijaygupta18/system-design-simulator/stargazers)

<br/>

[**Quick Start**](#-quick-start) · [**Features**](#-features) · [**35 Problems**](#-35-design-problems) · [**Tech Stack**](#-tech-stack) · [**Contributing**](#-contributing)

</div>

---

## Overview

Most system design prep is passive — reading articles, watching videos, memorizing diagrams. **SystemForge makes it active.**

You drag real infrastructure components onto a canvas, wire them into an architecture, run production-scale traffic through it, and get scored across the five dimensions an interviewer actually evaluates. Think of it as a **flight simulator for system design interviews** — a safe place to fail, iterate, and build the intuition that reading alone can't give you.

It runs entirely in your browser. No account, no backend, no data leaves your machine.

```
  Pick a problem  →  Drag & wire components  →  Simulate traffic  →  Get scored  →  Iterate
```

---

## Table of Contents

- [Features](#-features)
  - [35 Infrastructure Components](#35-infrastructure-components)
  - [Traffic Simulation](#traffic-simulation)
  - [Connectivity-Aware Scoring](#connectivity-aware-scoring)
  - [Interview Practice Mode](#interview-practice-mode)
  - [Concept Library & Trade-off Cards](#concept-library--trade-off-cards)
  - [Learning Path](#learning-path)
  - [Mobile & Tablet](#mobile--tablet)
- [35 Design Problems](#-35-design-problems)
- [Quick Start](#-quick-start)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Tech Stack](#-tech-stack)
- [Project Structure](#project-structure)
- [Contributing](#-contributing)
- [Support](#-support)
- [License](#-license)

---

## ✨ Features

<div align="center">
  <img src="public/features.svg" alt="Features overview" width="800"/>
</div>

<br/>

### 35 Infrastructure Components

A complete toolbox for any architecture — **35 production-grade components** across five categories, each with verified throughput and latency specs, plus a custom block you can rename to anything.

| Category | Components |
|----------|-----------|
| **Networking** | DNS · CDN · Load Balancer · API Gateway · Rate Limiter · Reverse Proxy · Origin Shield |
| **Compute** | App Server · Auth Service · WebSocket Server · Task Scheduler · Stream Processor · Notification Service |
| **Storage** | SQL · NoSQL · Cache/Redis · Object Storage · Search/ES · Graph DB · Time-Series DB · Data Warehouse · File Store · Vector DB · Geospatial Index |
| **Messaging** | Message Queue · Pub/Sub |
| **Infrastructure** | Service Mesh · Monitoring · Service Discovery · Distributed Lock · Circuit Breaker · Coordination Service · ID Generator · Sharded Counter · Config Service |
| **Special** | Custom Component (double-click to rename) |

Every component ships with **benchmark-backed specs**, cross-checked against official docs:

| Component | Max QPS | Latency | | Component | Max QPS | Latency |
|---|---|---|---|---|---|---|
| Load Balancer | 1,000,000 | 1 ms | | Kafka | 100,000 | 5 ms |
| CDN | 500,000 | 15 ms | | Elasticsearch | 20,000 | 10 ms |
| Cache / Redis | 100,000 | 1 ms | | Object Storage (S3) | 25,000 | 75 ms |
| NoSQL (DynamoDB) | 50,000 | 3 ms | | SQL Database | 10,000 | 8 ms |

---

### Traffic Simulation

<div align="center">
  <img src="public/traffic-sim.svg" alt="Animated traffic simulation" width="800"/>
</div>

<br/>

Push 1K–500K requests/sec through your design and watch it behave like a real system:

- **Correct fan-in accumulation** via Kahn's topological sort — QPS adds up exactly where it should.
- **Smart traffic splitting** — load balancers split evenly; other components fan out 100% to each child.
- **Per-node metrics** — QPS, utilization %, latency, and status (healthy / warning / critical).
- **Honest throughput** — reported throughput is capped at offered load and collapses through saturated nodes. No phantom over-capacity numbers.
- **Disconnected-node aware** — a stray, unwired node never steals traffic from the real request path.
- **Async-edge aware** — connections marked async are excluded from user-facing latency.
- **Bottleneck & cascading-failure** visualization, plus cycle detection that separates true cycle members from nodes merely downstream of one.

---

### Connectivity-Aware Scoring

<div align="center">
  <img src="public/scoring.svg" alt="Animated scoring engine" width="800"/>
</div>

<br/>

SystemForge scores the **wired request path**, not a parts bin. Drop a cache on the canvas but never connect it, and you get no credit — with feedback telling you exactly why. A pile of disconnected components scores *"Needs Work,"* just like it would in a real interview.

Five categories, each capped at exactly **20 points**:

| Category | What it checks |
|----------|---------------|
| **Scalability** | Load balancing, horizontal scaling, caching, async processing |
| **Availability** | No SPOFs, replica redundancy, monitoring, overload protection |
| **Latency** | CDN usage, cache-before-DB patterns, minimal hop count |
| **Cost Efficiency** | Right-sized components, polyglot persistence, no waste |
| **Trade-offs** | Read/write separation, defense in depth, architecture breadth |

**Verdicts:** Needs Work `<31` · Decent `<51` · Good `<71` · Excellent `<86` · Architect Level `86+`

---

### Interview Practice Mode

<div align="center">
  <img src="public/interview-flow.svg" alt="6-phase interview flow" width="800"/>
</div>

<br/>

Run a full, timed 45-minute mock with a wall-clock-accurate timer (it keeps counting even if you switch tabs) and a phase-by-phase guide:

| # | Phase | Time | Focus |
|---|-------|------|-------|
| 1 | **Requirements** | 5 min | Clarify functional & non-functional requirements |
| 2 | **Estimation** | 5 min | Back-of-the-envelope capacity math |
| 3 | **API Design** | 5 min | Define core endpoints |
| 4 | **Data Model** | 5 min | Entities, relationships, access patterns |
| 5 | **High-Level Design** | 15 min | Build the architecture on the canvas |
| 6 | **Deep Dive** | 10 min | Trade-offs and failure modes |

A color-coded timer keeps you honest: green (on track) · yellow (over target) · red (significantly over).

---

### Concept Library & Trade-off Cards

**Concept Library** — select any component to get interview-ready notes: when to use it, when *not* to, key trade-offs, common patterns (cache-aside, write-through, …), what to say to impress an interviewer, and verified real-world examples from Netflix, Uber, Twitter, and more.

**Edge labels** — click any connection to set its protocol (HTTP · gRPC · WebSocket · pub/sub · TCP) and sync/async mode, rendered with distinct line styles and badges.

**21 Trade-off Cards** — side-by-side comparisons of the decisions interviewers love to probe, with a "when to choose which" for each:

> SQL vs NoSQL · Push vs Pull · Sync vs Async · Strong vs Eventual Consistency · Monolith vs Microservices · REST vs gRPC · Cache-aside vs Write-through · Vertical vs Horizontal Scaling · Polling vs WebSocket · Single vs Multi-leader · Hash vs Range Partitioning · CDN Push vs Pull · Token Bucket vs Sliding Window · At-least-once vs Exactly-once Processing · Optimistic vs Pessimistic Locking · Long-polling vs SSE vs WebSocket · Kafka vs RabbitMQ · JWT vs Session Tokens · Normalization vs Denormalization · Batch vs Stream Processing · Active-active vs Active-passive

You can also log your **own** trade-off decisions with rationale as you design.

---

### Learning Path

A structured progression from your first easy problem to architect-level systems, with concept prerequisites shown per problem and completion tracking.

| Tier | Sample Problems | Focus |
|------|----------------|-------|
| **Foundations** | URL Shortener, Rate Limiter, Parking Lot | Core building blocks |
| **Intermediate** | Notification System, Autocomplete, Instagram, Reddit, Tinder | Combining systems |
| **Advanced** | Twitter, Chat, Web Crawler, Dropbox, WhatsApp, Code Editor | Complex distributed systems |
| **Expert** | Uber, YouTube, Payments, Netflix, Zoom, Google Maps, Kafka, Digital Wallet | Multi-concern architectures |

---

### Mobile & Tablet

Genuinely usable on phones and tablets — not just a shrunk desktop:

- **Tap-to-add** components (HTML5 drag-and-drop doesn't work on touch — tap the row or the `+`).
- Left **library drawer** + right **bottom sheet**; the canvas stays full-bleed.
- Finger-friendly wiring (enlarged connection handles + generous hit areas) and a **Remove Connection** button so edges are deletable without a keyboard.
- Two-row interview bar with controls always on screen; tap-to-edit text notes.
- Safe-area insets respected; **no horizontal overflow at 375 / 768 / 1024px+**.

---

## 📋 35 Design Problems

Every problem includes scale requirements (QPS, storage, latency), constraints, progressive hints, tags, a reference architecture you can load onto the canvas, and a full interview guide (requirements checklist, estimation math, API design, and data model).

<details>
<summary><strong>Click to expand all 35 problems</strong></summary>

<br/>

| # | Problem | Difficulty | Key Concepts |
|---|---------|-----------|-------------|
| 1 | URL Shortener | Easy | Hashing, caching, 100:1 read/write |
| 2 | Rate Limiter | Easy | Token bucket, sliding window, Redis |
| 3 | Parking Lot | Easy | IoT events, availability tracking |
| 4 | Twitter / News Feed | Hard | Fan-out, timeline, hybrid approach |
| 5 | Chat System | Hard | WebSocket, presence, message ordering |
| 6 | Uber / Ride Sharing | Hard | Geohash, location streaming, matching |
| 7 | YouTube / Video Streaming | Hard | CDN, transcoding, tiered storage |
| 8 | Notification System | Medium | Priority queues, multi-channel delivery |
| 9 | Typeahead / Autocomplete | Medium | Trie, prefix search, offline aggregation |
| 10 | Web Crawler | Medium | URL frontier, politeness, dedup |
| 11 | Distributed Cache | Medium | Consistent hashing, eviction, hot keys |
| 12 | Payment System | Hard | Idempotency, saga pattern, double-entry ledger |
| 13 | Ticket Booking | Hard | Virtual queue, seat locking, flash sales |
| 14 | Google Docs | Hard | OT/CRDT, WebSocket, version history |
| 15 | Dropbox / File Storage | Hard | Block chunking, delta sync, dedup |
| 16 | Instagram | Medium | Media pipeline, feed gen, CDN strategy |
| 17 | Spotify | Medium | Adaptive bitrate, pre-fetch, collab filtering |
| 18 | Amazon / E-Commerce | Hard | Microservices, inventory, event sourcing |
| 19 | Slack / Team Messaging | Hard | Channel model, search, connection gateway |
| 20 | Metrics / Monitoring | Hard | Time-series ingestion, downsampling, alerting |
| 21 | Netflix | Hard | Recommendation engine, adaptive streaming, DRM |
| 22 | Tinder / Dating App | Medium | Geospatial matching, ELO scoring, Bloom filters |
| 23 | Google Maps | Hard | Map tiles, Dijkstra/A*, real-time traffic |
| 24 | Zoom | Hard | WebRTC/SFU, simulcast, screen sharing |
| 25 | DoorDash / Food Delivery | Hard | Driver dispatch, ETA prediction, order tracking |
| 26 | Reddit | Medium | Ranking algorithms, comment trees, moderation |
| 27 | Airbnb | Hard | Search + booking, pricing, bilateral reviews |
| 28 | WhatsApp | Hard | E2E encryption (Signal Protocol), offline delivery |
| 29 | Google Search | Hard | Inverted index, PageRank, query parsing |
| 30 | Yelp / Location Service | Medium | QuadTree/Geohash, proximity search, reviews |
| 31 | TikTok | Hard | Recommendation (two-tower), video transcoding |
| 32 | Distributed Message Queue | Hard | Partitioning, consumer groups, exactly-once |
| 33 | Digital Wallet / UPI | Hard | P2P transfers, idempotency, compliance |
| 34 | Online Code Editor | Medium | Sandboxed execution, LSP, real-time collab |
| 35 | CI/CD Pipeline | Medium | Build DAGs, artifact storage, canary deploys |

</details>

---

## 🚀 Quick Start

> **Prerequisites:** Node.js 18.18+ and npm.

```bash
git clone https://github.com/vijaygupta18/system-design-simulator.git
cd system-design-simulator
npm install
npm run dev
```

Open **http://localhost:3000** — that's it. Everything runs client-side; your designs are saved to `localStorage`.

### 🐳 Run with Docker

> **Prerequisites:** [Docker](https://docs.docker.com/get-docker/) installed and running.

```bash
# Build the image
docker build -t system-forge .

# Run the container
docker run -d -p 3000:3000 --name system-forge system-forge
```

Open **http://localhost:3000** — the same app, fully containerized. Stop with `docker stop system-forge` and start again with `docker start system-forge`.

**Why Docker?** No Node.js setup needed. No `npm install`. One command and you're running — ideal for quick previews, CI/CD pipelines, or deploying on a headless server.

### Keyboard Shortcuts

| Shortcut | Action | | Shortcut | Action |
|----------|--------|---|----------|--------|
| `Ctrl/⌘ + Enter` | Run simulation | | `Ctrl/⌘ + S` | Save design |
| `Ctrl/⌘ + Shift + S` | Score design | | `Ctrl/⌘ + O` | Load design |
| `Ctrl/⌘ + Z` | Undo | | `Ctrl/⌘ + E` | Export as PNG |
| `Ctrl/⌘ + Shift + Z` / `Ctrl + Y` | Redo | | `Delete` | Remove selected node/edge |
| `Escape` | Deselect | | | |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, fully static) |
| Language | React 19 + TypeScript |
| Canvas | [@xyflow/react](https://reactflow.dev) (ReactFlow v12) |
| State | Zustand v5, persisted to `localStorage` |
| Styling | Tailwind CSS v4 + shadcn-style components on Base UI |
| Animation | Framer Motion |
| Freehand pen | perfect-freehand |
| Icons | Lucide React |
| Export | html-to-image (PNG / SVG / JSON) |

No backend, no database, no telemetry — the entire app ships as a static bundle.

### Project Structure

```
src/
├── app/                  # Next.js App Router — layout, single route, globals.css
├── components/
│   ├── canvas/           # ReactFlow host, Component/Text nodes, edges, pen overlay
│   ├── dialogs/          # ModalShell + Save / Load / Confirm / Support / Create
│   ├── interview/        # Interview bar, phase guides, start dialog
│   ├── layout/           # AppShell, TopBar, SupportFAB
│   ├── panel/            # Right panel: Props · Simulate · Score · Capacity · Trade-offs
│   ├── sidebar/          # Component palette, problem selector, learning path
│   └── ui/               # Base UI primitives, Toast
├── data/
│   ├── components.ts     # 35 components (+ custom) with verified specs
│   ├── problems.ts       # 35 design problems with reference architectures
│   ├── conceptLibrary.ts # Educational content for every component
│   ├── interviewData.ts  # Requirements, APIs & data models for all 35 problems
│   ├── tradeoffCards.ts  # 21 trade-off comparisons
│   └── learningPath.ts   # 4-tier progression with prerequisites
├── engine/
│   └── simulator.ts      # Traffic simulation (Kahn's topological sort)
├── scoring/
│   ├── scorer.ts         # Orchestrator — builds the shared scoring graph
│   └── rules/            # 5 rule modules, 20 pts each
├── store/                # Zustand stores (canvas, app, interview, saved designs, …)
├── lib/                  # exportCanvas, loadReference, icons, utils
└── types/                # Shared TypeScript interfaces
```

---

## 🤝 Contributing

Contributions are welcome — new problems, components, trade-off cards, bug fixes, and UX polish all help. Please open an issue first to discuss larger changes.

```bash
npm ci            # Install exact locked dependencies
npm run dev       # Start the dev server
npm run lint      # Run ESLint
npm run build     # Production build (also type-checks)
```

CI runs `npm run lint` and `npm run build` on every push and pull request, so run both locally before opening a PR. Bug reports and feature requests have [issue templates](.github/ISSUE_TEMPLATE) — filling them in makes triage much faster.

**Good first contributions:** add a design problem to `src/data/problems.ts` (+ its `interviewData.ts` entry), author a trade-off card, or improve concept-library content. Every formula, figure, and real-world attribution should be technically correct — this content teaches people preparing for real interviews.

---

## ☕ Support

If SystemForge helped you prep for a system design interview, a chai goes a long way toward keeping it alive and open-source. No pressure — no ads, no paywalls, ever.

[![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-UPI-06B6D4?style=for-the-badge&logo=buymeacoffee&logoColor=white)](#-support)

<details>
<summary><b>Click to reveal the UPI QR</b></summary>

<br/>

<p align="center">
  <img src="public/support-upi-qr.jpg" alt="UPI QR code — vijaygupta1818@ptyes" width="280"/>
</p>

<p align="center">
  Scan with any UPI app — Paytm · PhonePe · GPay · BHIM<br/>
  UPI ID: <code>vijaygupta1818@ptyes</code>
</p>

</details>

> Prefer the in-app flow? Open the deployed site with <code>?support=1</code> and the support dialog opens automatically.

---

## 📄 License

[MIT](LICENSE) © [@vijaygupta18](https://github.com/vijaygupta18)

<div align="center">
<br/>

**If SystemForge helps your interview prep, consider giving it a ⭐ — it genuinely helps.**

<br/>

Built with care for everyone grinding system design interviews.

</div>
