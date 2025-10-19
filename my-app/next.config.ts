/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ⚠️ Allows production builds to succeed even if there are TypeScript errors.
    ignoreBuildErrors: true,
  },
  // Optional: also ignore ESLint failures during build
  // eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;