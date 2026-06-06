import {
  creditNFTAbi,
  mockCCOPAbi,
  rewardSystemAbi,
  riskScoreOracleAbi,
  validationRecordAbi,
  walletRegistryAbi,
} from "./abis";

export type ContractAddresses = {
  creditNFT?: `0x${string}`;
  rewardSystem?: `0x${string}`;
  mockCCOP?: `0x${string}`;
  walletRegistry?: `0x${string}`;
  riskScoreOracle?: `0x${string}`;
  validationRecord?: `0x${string}`;
};

const env = (v?: string): `0x${string}` | undefined =>
  v && v.startsWith("0x") && v.length === 42 ? (v as `0x${string}`) : undefined;

// Direcciones de contratos en Monad (se rellenan tras desplegar, vía .env.local).
// Mainnet (143) y Testnet (10143) leen las mismas variables NEXT_PUBLIC_MONAD_*.
const monadAddresses: ContractAddresses = {
  creditNFT: env(process.env.NEXT_PUBLIC_MONAD_NFT_CONTRACT),
  rewardSystem: env(process.env.NEXT_PUBLIC_MONAD_REWARD_CONTRACT),
  mockCCOP: env(process.env.NEXT_PUBLIC_MONAD_CCOP_CONTRACT),
  walletRegistry: env(process.env.NEXT_PUBLIC_WALLET_REGISTRY_ADDRESS),
  riskScoreOracle: env(process.env.NEXT_PUBLIC_RISK_ORACLE_ADDRESS),
  validationRecord: env(process.env.NEXT_PUBLIC_VALIDATION_RECORD_ADDRESS),
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
    walletRegistry: env(process.env.NEXT_PUBLIC_WALLET_REGISTRY_ADDRESS),
    riskScoreOracle: env(process.env.NEXT_PUBLIC_RISK_ORACLE_ADDRESS),
    validationRecord: env(process.env.NEXT_PUBLIC_VALIDATION_RECORD_ADDRESS),
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

export {
  creditNFTAbi,
  mockCCOPAbi,
  rewardSystemAbi,
  riskScoreOracleAbi,
  validationRecordAbi,
  walletRegistryAbi,
};
