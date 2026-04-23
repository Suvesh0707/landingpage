import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['*.ngrok-free.app', '*.ngrok-free.dev', '*.ngrok.io'],

  async redirects() {
    return [
      {
        source: '/landingpage',
        destination: 'https://mentorcha.us',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
