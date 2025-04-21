// backend/jest.config.js
export default {
    testEnvironment: 'node',
    transform: {
      '^.+\\.js$': 'babel-jest'
    },
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/$1'
    },
    testPathIgnorePatterns: [
      '/node_modules/',
      '/frontend/'
    ],
    modulePathIgnorePatterns: [
      '<rootDir>/frontend'
    ]
  };