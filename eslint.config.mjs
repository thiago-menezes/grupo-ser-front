import { nextJsConfig } from './src/packages/eslint/next.js';

export default [
  ...nextJsConfig,
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'dist/**',
      '**/*.d.ts',
      'public/**',
      '.env*',
      'coverage/**',
    ],
  },
];
