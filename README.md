# Zane AI

### Intelligent Infrastructure for Real Estate

**Zane AI** is the unified ecosystem connecting people, properties, and data. We are moving beyond the era of fragmented tools to build the **intelligent layer** that powers the future of real estate operations.

> [!IMPORTANT]
> **Connect. Automate. Scale.**
> We replace fractured canvases with a unified infrastructure where intent, operations, and intelligence act as one.

---

## 🏗️ Repository Architecture

This is a high-performance monorepo managed with **npm workspaces**, designed for speed, modularity, and cross-platform consistency.

### Applications (`apps/`)

| Path | Project | Description | Tech Stack |
| :--- | :--- | :--- | :--- |
| [`/apps/mobile`](/apps/mobile) | **Zane Mobile** | The companion app for modern agents. | Expo, React Native |
| [`/apps/portal`](/apps/portal) | **Zane Portal** | High-fidelity institutional interface. | Next.js, Framer Motion |
| [`/apps/web`](/apps/web) | **Zane Web** | Client-facing interactive experience. | Next.js, Tailwind CSS |

### Infrastructure & Shared Core (`packages/`)

- **[`/convex`](/convex)**: The AI-native backend. Real-time subscriptions, serverless functions, and vector search.
- **[`/packages/ag-ui`](/packages/ag-ui)**: The "Pure Canvas" design system. High-precision primitives for web and mobile.
- **[`/packages/zayon-assistant-protocol`](/packages/zayon-assistant-protocol)**: Unified communication layer for AI interactions.

---

## ⚡ Tech Stack

Zane AI is built on a modern, reactive stack optimized for developer velocity and institutional-grade performance.

- **Backend**: [Convex](https://convex.dev) (Real-time DB, Auth, Cron, Vector Search)
- **Frontend**: Next.js 15+ (Web/Portal), Expo 54 (iOS/Android)
- **Styling**: Tailwind CSS / Vanilla CSS (Modern CSS 4 features)
- **Auth**: [Better Auth](https://better-auth.com) / Clerk
- **AI**: OpenAI, AI SDK, Convex Agent/RAG components
- **State**: React Server Components & Convex real-time subscriptions

---

## 🎨 Design Philosophy: "Pure Canvas"

We believe that professional tools should fade into the background. The **Pure Canvas** aesthetic is a minimalist, high-fidelity design language focused on:

- **Zero Friction**: No unnecessary shadows, borders, or backdrop noise.
- **Precision Floating**: Interactive elements feel light, yet grounded.
- **Motion as Logic**: Smooth transitions that provide spatial awareness, not just decoration.

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+)
- [npm](https://www.npmjs.com/)
- [Bun](https://bun.sh/) (Optional, for scripts)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/zane-ai.git
   cd zane-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env.local` and add your Convex/Auth credentials.

4. Start development server:
   ```bash
   npm run convex      # Starts Convex backend
   npm run start       # Starts Mobile / Web workspaces
   ```

---

## 📜 Development Commands

| Command | Action |
| :--- | :--- |
| `npm run start` | Start the mobile application. |
| `npm run convex` | Run the Convex dev server and codegen. |
| `npm run typecheck` | Run TypeScript validation across the monorepo. |
| `npm run lint` | Execute ESLint checks. |
| `npm run agent:smoke` | Run AI agent smoke tests. |

---

&copy; 2026 Zane AI. All rights reserved.
