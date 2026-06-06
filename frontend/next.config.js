/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_MONAD_NFT_CONTRACT: process.env.NEXT_PUBLIC_MONAD_NFT_CONTRACT,
    NEXT_PUBLIC_MONAD_REWARD_CONTRACT: process.env.NEXT_PUBLIC_MONAD_REWARD_CONTRACT,
    NEXT_PUBLIC_MONAD_CCOP_CONTRACT: process.env.NEXT_PUBLIC_MONAD_CCOP_CONTRACT,
    NEXT_PUBLIC_LOCAL_NFT_CONTRACT: process.env.NEXT_PUBLIC_LOCAL_NFT_CONTRACT,
    NEXT_PUBLIC_LOCAL_REWARD_CONTRACT: process.env.NEXT_PUBLIC_LOCAL_REWARD_CONTRACT,
    NEXT_PUBLIC_LOCAL_CCOP_CONTRACT: process.env.NEXT_PUBLIC_LOCAL_CCOP_CONTRACT,
    NEXT_PUBLIC_MONAD_MAINNET_CHAIN_ID: process.env.NEXT_PUBLIC_MONAD_MAINNET_CHAIN_ID || "143",
    NEXT_PUBLIC_MONAD_TESTNET_CHAIN_ID: process.env.NEXT_PUBLIC_MONAD_TESTNET_CHAIN_ID || "10143",
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

