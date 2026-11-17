/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  // Browser-test logs/screenshots written inside the project would otherwise retrigger Fast Refresh in a loop.
  webpack: (config, { dev }) => {
    if (dev) config.watchOptions = { ...config.watchOptions, ignored: ["**/node_modules/**", "**/.git/**", "**/.playwright-mcp/**", "**/dev.log", "**/*.png"] };
    return config;
  },
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
