/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/dscape-archive',
  assetPrefix: '/dscape-archive/',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
