import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';

// Extract recommended rule sets from plugins (classic configs)
const reactHooksRecommended = reactHooks.configs.recommended || {};
const reactRefreshRecommended = reactRefresh.configs.recommended || {};

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // Base JS recommendations
      ...js.configs.recommended.rules,
      // Plugin recommendations
      ...(reactHooksRecommended.rules || {}),
      ...(reactRefreshRecommended.rules || {}),
      // Project-specific tweaks
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
]);
