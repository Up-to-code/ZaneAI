export const DEV_SEED_NAMESPACE = "workspace-dev-seed";
export const DEV_SEED_ASSET_KEY_PREFIX = `${DEV_SEED_NAMESPACE}/asset/`;
export const DEV_SEED_THREAD_PREFIX = `${DEV_SEED_NAMESPACE}/thread/`;

export function isDevelopmentEnvironment(
  nodeEnv = process.env.NODE_ENV,
  devSeedEnabled = process.env.ZAYON_DEV_SEED_ENABLED,
) {
  return nodeEnv === "development" || devSeedEnabled === "1";
}

export function assertDevelopmentEnvironment(
  nodeEnv = process.env.NODE_ENV,
  devSeedEnabled = process.env.ZAYON_DEV_SEED_ENABLED,
) {
  if (!isDevelopmentEnvironment(nodeEnv, devSeedEnabled)) {
    throw new Error("Workspace dev seed is restricted to development deployments. Set ZAYON_DEV_SEED_ENABLED=1 only on dev deployments.");
  }
}
