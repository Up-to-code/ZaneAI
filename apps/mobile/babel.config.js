module.exports = function (api) {
  const isTest = api.env("test");
  api.cache(() => isTest);
  return {
    presets: [require.resolve("babel-preset-expo")],
    plugins: [
      !isTest && require.resolve("react-native-reanimated/plugin"),
    ].filter(Boolean),
  };
};
