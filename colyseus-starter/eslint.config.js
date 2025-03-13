export default {
  languageOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    globals: {
      // Node.js globals
      process: 'readonly',
      __dirname: 'readonly',
      __filename: 'readonly',
      // ES2021 globals
      console: 'readonly',
      Promise: 'readonly'
    }
  },
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    'no-debugger': 'error',
    'no-duplicate-imports': 'error',
    'prefer-const': 'error',
    'quotes': ['error', 'single'],
    'semi': ['error', 'always']
  }
};