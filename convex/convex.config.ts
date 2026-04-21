import { defineApp } from "convex/server";
import convexOrchestrator from "@akshatgiri/convex-orchestrator/convex.config.js";
import actionCache from "@convex-dev/action-cache/convex.config.js";
import agent from "@convex-dev/agent/convex.config";
import migrations from "@convex-dev/migrations/convex.config.js";
import rag from "@convex-dev/rag/convex.config";
import rateLimiter from "@convex-dev/rate-limiter/convex.config";

import betterAuth from "./betterAuth/convex.config.js";

const app: ReturnType<typeof defineApp> = defineApp();

app.use(agent);
app.use(actionCache);
app.use(convexOrchestrator);
app.use(migrations);
app.use(rag);
app.use(rateLimiter);
app.use(betterAuth);

export default app;
