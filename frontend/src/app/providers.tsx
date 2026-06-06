"use client";

import { createConfig, WagmiProvider, http } from "wagmi";
import { metaMask } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const monadMainnet = {
  id: 143,
  name: "Monad",
  nativeCurrency: { name: "Monad", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.monad.xyz"] },
  },
  blockExplorers: {
    default: { name: "Monadscan", url: "https://monadscan.com" },
  },
} as const;

const monadTestnet = {
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: { name: "Monad", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testnet-rpc.monad.xyz"] },
  },
  blockExplorers: {
    default: { name: "Monad Testnet Explorer", url: "https://testnet.monadexplorer.com" },
  },
  testnet: true,
} as const;

const localhostChain = {
  id: 31337,
  name: "Hardhat Local",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["http://localhost:8545"] },
  },
  blockExplorers: {
    default: { name: "Local", url: "http://localhost:8545" },
  },
} as const;

export const wagmiConfig = createConfig({
  chains: [monadTestnet, monadMainnet, localhostChain],
  connectors: [metaMask()],
  transports: {
    [monadTestnet.id]: http("https://testnet-rpc.monad.xyz"),
    [monadMainnet.id]: http("https://rpc.monad.xyz"),
    [localhostChain.id]: http("http://localhost:8545"),
  },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
