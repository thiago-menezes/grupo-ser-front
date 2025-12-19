import { config as baseConfig } from '../eslint/base';

export default [
  ...baseConfig,
  {
    ignores: ['dist/**', '**/*.spec.ts', '**/*.test.ts'],
  },
];
