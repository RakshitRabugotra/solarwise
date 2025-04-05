/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*", // Matches requests to /api/*
        destination: `${process.env.NODE_ENV === 'production' ? process.env.PROD_SERVER : "http://localhost:5000"}/api/:path*`, // Proxies requests to the production server
      },
    ]
  },
}

export default nextConfig
