// No Reanimated or worklets plugin is listed here on purpose: babel-preset-expo detects
// react-native-worklets and injects react-native-worklets/plugin itself. Adding it by hand
// registers the transform twice and breaks animations. If you hit a worklet error, the fix is
// somewhere else.
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
  };
};
