import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    css: true,
    root: './src',
    coverage: {
      reporter: ['text'],
      exclude: [
        'coverage/**',
        '**/node_modules/**',
        '**/[.]**',
        '**/__mocks__/**',
        '**/vitest.config.*',
        '**/*.d.ts',
        'app/**/error.*',
        'app/**/layout.*',
        'app/**/not-found.*',
        '**/assets/**/*',
        '**/providers/**/*',
        'lib/config.ts',
        'components/updater.tsx',
      ],
      reportsDirectory: '../coverage',
    },
  },
  cacheDir: '../node_modules/.vite/',
});
