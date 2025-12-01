// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... other configurations ...

  async rewrites() {
    return [
      {
        source: '/api/indexer/:path*',
        destination: 'https://meme-indexer-production.up.railway.app/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
