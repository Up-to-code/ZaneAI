const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [...new Set([...(config.watchFolders ?? []), workspaceRoot])];
config.resolver.alias = {
  ...(config.resolver.alias ?? {}),
  "@": path.resolve(projectRoot, "src"),
  "@convex": path.resolve(workspaceRoot, "convex"),
};

module.exports = withNativeWind(config, {
  input: "./global.css",
});
