import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,

  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
    resolveAlias: {
      'pino-pretty': {},
      encoding: {},
      '@react-native-async-storage/async-storage': {},
    },
  },
};

export default nextConfig;
