/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_ASTAR_NFT_CONTRACT: process.env.NEXT_PUBLIC_ASTAR_NFT_CONTRACT,
    NEXT_PUBLIC_CELO_REWARD_CONTRACT: process.env.NEXT_PUBLIC_CELO_REWARD_CONTRACT,
    NEXT_PUBLIC_LOCAL_NFT_CONTRACT: process.env.NEXT_PUBLIC_LOCAL_NFT_CONTRACT,
    NEXT_PUBLIC_LOCAL_REWARD_CONTRACT: process.env.NEXT_PUBLIC_LOCAL_REWARD_CONTRACT,
    NEXT_PUBLIC_LOCAL_Monad_CONTRACT: process.env.NEXT_PUBLIC_LOCAL_Monad_CONTRACT,
    NEXT_PUBLIC_ASTAR_CHAIN_ID: process.env.NEXT_PUBLIC_ASTAR_CHAIN_ID || "592",
    NEXT_PUBLIC_CELO_CHAIN_ID: process.env.NEXT_PUBLIC_CELO_CHAIN_ID || "42220",
    NEXT_PUBLIC_BACKEND_API_URL: process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:1880",
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

module.exports = nextConfig;

