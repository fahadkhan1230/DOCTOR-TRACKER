
/** @type {import('next').NextConfig} */
const backendUrl =
  process.env.BACKEND_URL ||
  'https://doctor-tracker-lmk0.onrender.com';

export default {
  reactStrictMode: true,
  poweredByHeader: false,

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};
