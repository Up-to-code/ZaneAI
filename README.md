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
| `npm run portal:build` | Build the Portal Next.js app. |
| `npm run web:build` | Build the Web Next.js app. |
| `npm run agent:smoke` | Run AI agent smoke tests. |

---

## Vercel Deployment

Deploy `apps/portal` and `apps/web` as two separate Vercel projects from the same repository. Keep Vercel's "Include source files outside of the Root Directory in the Build Step" setting enabled so each app can import shared workspace packages from `packages/`.

### Portal Project

| Setting | Value |
| :--- | :--- |
| Framework Preset | `Next.js` |
| Root Directory | `apps/portal` |
| Install Command | `cd ../.. && npm install --legacy-peer-deps` |
| Build Command | `cd ../.. && npm --workspace @anan/portal run build` |
| Output Directory | `.next` |

Required Vercel environment variable:

- `NEXT_PUBLIC_CONVEX_URL=https://<deployment>.convex.cloud`

### Web Project

| Setting | Value |
| :--- | :--- |
| Framework Preset | `Next.js` |
| Root Directory | `apps/web` |
| Install Command | `cd ../.. && npm install --legacy-peer-deps` |
| Build Command | `cd ../.. && npm --workspace web run build` |
| Output Directory | `.next` |

Required Vercel environment variables:

- `NEXT_PUBLIC_CONVEX_URL=https://<deployment>.convex.cloud`
- `NEXT_PUBLIC_AUTH_URL=https://<deployment>.convex.site` or `NEXT_PUBLIC_CONVEX_SITE_URL=https://<deployment>.convex.site`
- `UPLOADTHING_TOKEN=<your-uploadthing-token>`

Optional Vercel environment variables:

- `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=<your-posthog-project-token>`
- `NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com`
- `NEXT_PUBLIC_MOCK_DATA_ENABLED=false`

### Convex Deployment Environment

Convex deploys separately from Vercel, so set backend runtime values in the Convex deployment environment rather than in Vercel.

- Set `SITE_URL`, `ANAN_WEB_URL`, or `WEB_URL` to the production web origin so Better Auth trusts the deployed web app.
- Set `BETTER_AUTH_URL` or `CONVEX_SITE_URL` to the Convex site auth base URL.
- Set backend-only UploadThing and PostHog values, such as `UPLOADTHING_API_KEY`, `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, and `NEXT_PUBLIC_POSTHOG_HOST`, in Convex when backend functions need them.

---

&copy; 2026 Zane AI. All rights reserved.
