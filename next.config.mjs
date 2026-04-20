import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    turbopack: {
      root: __dirname,
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'i.ibb.co',
        },
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
        },
      ],
      unoptimized: true,
    }
  };
  
  export default nextConfig;
