module.exports = function (api) {
  api.cache(true);
  return {
    presets: [[
      'babel-preset-expo',
      { jsxImportSource: 'nativewind' }
    ],
      'nativewind/babel'],
    plugins: [
      ['module:react-native-dotenv', {
        moduleName: '@env',  // You can import from '@env'
        path: '.env',         // Path to your .env file
        safe: false,          // Set to true if you want to enforce variable checks
        allowUndefined: true // Allow undefined environment variables
      }]
    ]
  };
};
