//@ts-check

const { composePlugins, withNx } = require('@nx/next');
const withNextIntl = require('next-intl/plugin')();
const { execSync } = require('child_process');

let version = new Date().toISOString().split('T')[0].replace(/-/g, '.');
try {
  version = execSync('git log -1 --format=%cd --date=format:%Y.%m.%d').toString().trim();
} catch (_e) {
  // Fallback to current date if git fails
}

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
  },
  // Use this to set Nx-specific options
  // See: https://nx.dev/recipes/next/next-config-setup
  nx: {},
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    optimizePackageImports: ['@heroicons/react'],
    viewTransition: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'platform-lookaside.fbsbx.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  transpilePackages: [
    '@job-tracker/ui-components',
    '@job-tracker/hooks',
    '@job-tracker/data-access',
    '@job-tracker/validation',
    '@job-tracker/domain',
    '@job-tracker/app-logic',
  ],
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
    ];
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
  withNextIntl,
];

module.exports = composePlugins(...plugins)(nextConfig);
