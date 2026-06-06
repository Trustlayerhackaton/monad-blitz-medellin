import { creditNFTAbi, rewardSystemAbi, mockCCOPAbi } from "./abis";

export type ContractAddresses = {
  creditNFT?: `0x${string}`;
  rewardSystem?: `0x${string}`;
  mockCCOP?: `0x${string}`;
};

const env = (v?: string): `0x${string}` | undefined =>
  v && v.startsWith("0x") && v.length === 42 ? (v as `0x${string}`) : undefined;

// Direcciones de contratos en Monad (se rellenan tras desplegar, vía .env.local).
// Mainnet (143) y Testnet (10143) leen las mismas variables NEXT_PUBLIC_MONAD_*.
const monadAddresses: ContractAddresses = {
  creditNFT: env(process.env.NEXT_PUBLIC_MONAD_NFT_CONTRACT),
  rewardSystem: env(process.env.NEXT_PUBLIC_MONAD_REWARD_CONTRACT),
  mockCCOP: env(process.env.NEXT_PUBLIC_MONAD_CCOP_CONTRACT),
};

export const CONTRACTS: Record<number, ContractAddresses> = {
  // Hardhat local: direcciones deterministas del despliegue local
  31337: {
    creditNFT:
      env(process.env.NEXT_PUBLIC_LOCAL_NFT_CONTRACT) ??
      "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    rewardSystem:
      env(process.env.NEXT_PUBLIC_LOCAL_REWARD_CONTRACT) ??
      "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
    mockCCOP:
      env(process.env.NEXT_PUBLIC_LOCAL_CCOP_CONTRACT) ??
      "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  },
  10143: monadAddresses, // Monad Testnet
  143: monadAddresses, // Monad Mainnet
};

export function getContracts(chainId?: number): ContractAddresses {
  if (!chainId) return {};
  return CONTRACTS[chainId] ?? {};
}

export function isChainConfigured(chainId?: number): boolean {
  const c = getContracts(chainId);
  return Boolean(c.creditNFT && c.rewardSystem && c.mockCCOP);
}

export { creditNFTAbi, rewardSystemAbi, mockCCOPAbi };
