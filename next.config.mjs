/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverActions: true,
    },
    reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: ('i.ibb.co','res.cloudinary.com'),
        }
      ],
      unoptimized: true,
    }
  };
  
  export default nextConfig;