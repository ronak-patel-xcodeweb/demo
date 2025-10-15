/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed experimental.appDir - it's stable in Next.js 15
  eslint: {
    ignoreDuringBuilds: true,
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: true,
      },
    ];
  },
}

export default nextConfig