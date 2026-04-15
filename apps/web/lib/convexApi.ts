// Keep the web app decoupled from unrelated root-backend type failures by
// loading the generated Convex API at runtime only.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const generatedApiModule = require("../../../convex/_generated/api.js") as {
  api: any;
  internal: any;
};

export const api: any = generatedApiModule.api;
export const internal: any = generatedApiModule.internal;
export const apiUnsafe: any = generatedApiModule.api;
export const internalUnsafe: any = generatedApiModule.internal;
