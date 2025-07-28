import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   images: {
    domains: ['res.cloudinary.com'],
    // Or use the newer remotePatterns (recommended for Next.js 13+)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
