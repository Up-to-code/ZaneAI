import { defineApp } from "convex/server";
import agent from "@convex-dev/agent/convex.config.js";
import rag from "@convex-dev/rag/convex.config.js";
import rateLimiter from "@convex-dev/rate-limiter/convex.config.js";

import betterAuth from "./betterAuth/convex.config.js";

const app: ReturnType<typeof defineApp> = defineApp();

app.use(agent);
app.use(rag);
app.use(rateLimiter);
app.use(betterAuth);

export default app;
