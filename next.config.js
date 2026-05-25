/** @type {import('next').NextConfig} */
const nextConfig = {
  // Abilita il rendering lato client per Three.js
  transpilePackages: ['three'],
  webpack: (config) => {
    // Necessario per @react-three/fiber e drei
    config.externals = [...config.externals, { canvas: 'canvas' }];
    return config;
  },
  // Immagini da Supabase Storage
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

module.exports = nextConfig;
