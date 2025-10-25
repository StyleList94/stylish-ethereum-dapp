import { defineConfig, globalIgnores } from 'eslint/config';
import stylish from 'eslint-config-stylish';
import stylishReact from 'eslint-config-stylish/react';
import stylishReactHooks from 'eslint-config-stylish/react-hooks';
import stylishTypeScript from 'eslint-config-stylish/typescript';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import vitest from '@vitest/eslint-plugin';
import testingLibrary from 'eslint-plugin-testing-library';
import nextPlugin from '@next/eslint-plugin-next';

export default defineConfig(
  nextPlugin.configs['core-web-vitals'],
  globalIgnores([
    'node_modules/**',
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'vitest.config.mts',
  ]),
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    extends: [stylish],
  },
  {
    files: ['**/*.{js,jsx,tsx}'],
    extends: [stylishReact, stylishReactHooks],
  },
  {
    files: ['**/use*.ts'],
    extends: [stylishReactHooks],
  },
  {
    files: ['**/*.{ts,mts,cts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
      },
    },
    extends: [stylishTypeScript],
  },
  {
    files: ['next.config.ts'],
    rules: {
      'no-param-reassign': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
    },
  },
  {
    files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
    ...testingLibrary.configs['flat/react'],
  },
  {
    files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
    ...vitest.configs.recommended,
  },
  eslintConfigPrettier,
);
