/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
    FIRE_BASE_apiKey: process.env.FIRE_BASE_apiKey,
    FIRE_BASE_authDomain: process.env.FIRE_BASE_authDomain,
    FIRE_BASE_projectId: process.env.FIRE_BASE_projectId,
    FIRE_BASE_storageBucket: process.env.FIRE_BASE_storageBucket,
    FIRE_BASE_messagingSenderId: process.env.FIRE_BASE_messagingSenderId,
    FIRE_BASE_appId: process.env.FIRE_BASE_appId,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '7777',
        pathname: '/generations/*',
      },
    ],
  },
}

module.exports = nextConfig
