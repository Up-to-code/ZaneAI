import { httpRouter } from "convex/server";

import { authComponent } from "./auth/client";
import { createAuth } from "./auth/createAuth";

const http = httpRouter();

authComponent.registerRoutes(http, createAuth, { cors: true });

export default http;
