/** @type {import('next').NextConfig} */
// const nextConfig = {}

// module.exports = nextConfig

module.exports = {
  eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
    experimental: {
      missingSuspenseWithCSRBailout: false,
    }
  }

// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// module.exports = {
//     eslint: {
//       // Warning: This allows production builds to successfully complete even if
//       // your project has ESLint errors.
//       ignoreDuringBuilds: true,
//     },
//   }
