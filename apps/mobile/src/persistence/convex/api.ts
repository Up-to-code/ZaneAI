// Keep mobile-side Convex references untyped to avoid pulling the entire backend
// declaration graph into the React Native typecheck.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const generatedApi = require("../../../../convex/_generated/api.js");

export const api = generatedApi.api as any;
