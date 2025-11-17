// /** @type {import('next').NextConfig} */
// const dev = process.env.NODE_ENV !== "production";

// const nextConfig = {
// 	env: {
// 		server: dev ? process.env.API_BASE_URL : process.env.API_BASE_URL,
// 		amsPublickey: process.env.AMS_PUBLIC_KEY,
// 		// amsPrivateKey: process.env.AMS_PRIVATE_KEY,
// 		// serverBaseUrl: process.env.API_BASE_URL.split("/api")[0],
// 	},
// 	images: {
// 		unoptimized: true,
// 	},
// };

// const withNextIntl = require("next-intl/plugin")(
// 	// This is the default (also the `src` folder is supported out of the box)
// 	"./i18n.js"
// );

// module.exports = withNextIntl(nextConfig);

/** @type {import('next').NextConfig} */
const dev = process.env.NODE_ENV !== "production";

const nextConfig = {
  env: {
    server: dev ? process.env.API_BASE_URL : process.env.API_BASE_URL,
    amsPublickey: process.env.AMS_PUBLIC_KEY,
  },
  
  // ✅ ENABLE IMAGE OPTIMIZATION (CRITICAL FIX)
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    
    // If loading from external domains, add them:
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // ✅ ENABLE SWC MINIFICATION
  swcMinify: true,

  // ✅ REMOVE CONSOLE LOGS IN PRODUCTION
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // ✅ OPTIMIZE PRODUCTION BUILDS
  productionBrowserSourceMaps: false,
  reactStrictMode: true,

  // ✅ EXPERIMENTAL - WITHOUT PROBLEMATIC OPTIONS
  experimental: {
    optimizePackageImports: ['react-icons', 'swiper'],
  },

  // ✅ WEBPACK OPTIMIZATION
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
      };
    }
    return config;
  },

  // ✅ COMPRESSION
  compress: true,

  // ✅ CACHE HEADERS
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

const withNextIntl = require("next-intl/plugin")("./i18n.js");

module.exports = withNextIntl(nextConfig);