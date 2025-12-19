import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function findMonorepoRoot(startDir) {
  let currentDir = startDir;
  while (currentDir !== path.dirname(currentDir)) {
    const nodeModulesPath = path.join(currentDir, 'node_modules', 'reshaped');
    if (existsSync(nodeModulesPath)) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }
  return startDir;
}

const monorepoRoot = findMonorepoRoot(__dirname);
const themeMediaCSSPath = path.resolve(
  monorepoRoot,
  'node_modules/reshaped/dist/themes/reshaped/media.css',
);

const postcssConfig = {
  plugins: {
    '@csstools/postcss-global-data': {
      files: [themeMediaCSSPath],
    },
    'postcss-custom-media': {},
    cssnano: { preset: ['default', { calc: false }] },
  },
};

export default postcssConfig;
