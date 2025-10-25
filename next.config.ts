import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config, context) => {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    config.plugins.push(
      new context.webpack.IgnorePlugin({
        resourceRegExp: /^(pino-pretty|encoding)$/,
      }),
    );

    config.externals.push('@react-native-async-storage/async-storage');

    return config;
  },
};

export default nextConfig;
