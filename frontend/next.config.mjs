import path from 'path';
import { fileURLToPath } from 'url';

// Get __filename and __dirname in an ES Module environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Setting up an alias '~' to point to the 'src' directory
    config.resolve.alias['~'] = path.resolve(__dirname, 'src');
    
    return config;
  },
  env: {
    // Ensure your environment variables are available inside the Next.js app
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
};

export default nextConfig;
