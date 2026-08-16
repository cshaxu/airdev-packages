/* "@airdev/next": "managed" */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  oxc: false,
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
    tsconfigRaw: { compilerOptions: { jsx: 'react-jsx' } },
  },
  resolve: { alias: { '@': path.resolve(rootDir, 'src') } },
  test: {
    environment: 'node',
    globals: true,
    include: ['test/**/*.test.ts', 'test/**/*.test.tsx'],
    pool: 'threads',
  },
});
