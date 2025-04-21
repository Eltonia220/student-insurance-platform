// backend/babel.config.js
module.exports = {
    presets: [
      ['@babel/preset-env', { targets: { node: 'current' } }]
    ],
    // Explicitly disable react-refresh for backend tests
    plugins: [
      ['react-refresh', { skipEnvCheck: true }]
    ],
    ignore: [
      'node_modules',
      'frontend'
    ]
  };