"use client";

import { useMemo } from "react";
import {
  useAccount,
  useChainId,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { formatEther } from "viem";
import {
  getContracts,
  isChainConfigured,
  creditNFTAbi,
  rewardSystemAbi,
  mockMonadAbi,
} from "@/lib/contracts";

type CreditDataTuple = {
  paymentScore: bigint;
  consecutivePayments: bigint;
  linkedWallet: `0x${string}`;
  governancePower: bigint;
  stakingAmount: bigint;
  createdAt: bigint;
  isStaked: boolean;
};

/**
 * Lee el pasaporte crediticio del usuario directamente desde los contratos
 * desplegados en Monad (o en la red activa que esté configurada) y expone
 * las acciones de escritura (mint, registrar pago, faucet).
 */
export function useCreditPassport() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const contracts = getContracts(chainId);
  const configured = isChainConfigured(chainId);

  const baseEnabled = Boolean(isConnected && address && configured);

  // 1. Token activo del usuario
  const { data: activeTokenRaw, refetch: refetchToken } = useReadContract({
    address: contracts.creditNFT,
    abi: creditNFTAbi,
    functionName: "getActiveToken",
    args: address ? [address] : undefined,
    query: { enabled: baseEnabled && Boolean(contracts.creditNFT) },
  });

  const activeToken = (activeTokenRaw as bigint | undefined) ?? 0n;
  const hasNFT = activeToken > 0n;

  // 2. Datos crediticios del token activo
  const { data: creditDataRaw, refetch: refetchCredit } = useReadContract({
    address: contracts.creditNFT,
    abi: creditNFTAbi,
    functionName: "getCreditData",
    args: [activeToken],
    query: { enabled: baseEnabled && hasNFT },
  });
  const creditData = creditDataRaw as CreditDataTuple | undefined;

  // 3. Recompensas acumuladas (mMonad en wallet) y línea de crédito
  const { data: MonadBalanceRaw, refetch: refetchBalance } = useReadContract({
    address: contracts.mockMonad,
    abi: mockMonadAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: baseEnabled && Boolean(contracts.mockMonad) },
  });

  const { data: creditInfoRaw, refetch: refetchCreditInfo } = useReadContract({
    address: contracts.rewardSystem,
    abi: rewardSystemAbi,
    functionName: "getCreditInfo",
    args: address ? [address] : undefined,
    query: { enabled: baseEnabled && Boolean(contracts.rewardSystem) },
  });

  // ¿La wallet conectada está autorizada para mintear/registrar pagos?
  const { data: isMinterRaw } = useReadContract({
    address: contracts.creditNFT,
    abi: creditNFTAbi,
    functionName: "authorizedMinters",
    args: address ? [address] : undefined,
    query: { enabled: baseEnabled && Boolean(contracts.creditNFT) },
  });

  const score = creditData ? Number(creditData.paymentScore) : 0;
  const consecutivePayments = creditData
    ? Number(creditData.consecutivePayments)
    : 0;

  const MonadBalance = (MonadBalanceRaw as bigint | undefined) ?? 0n;
  const rewards = Math.round(Number(formatEther(MonadBalance)));

  const creditInfo = creditInfoRaw as
    | readonly [bigint, bigint, bigint]
    | undefined;
  const creditLimit = creditInfo ? Number(formatEther(creditInfo[0])) : 0;
  const creditAvailable = creditInfo ? Number(formatEther(creditInfo[2])) : 0;

  const isAuthorizedMinter = Boolean(isMinterRaw);

  const { writeContractAsync, isPending } = useWriteContract();

  const refetchAll = () => {
    refetchToken();
    refetchCredit();
    refetchBalance();
    refetchCreditInfo();
  };

  // Auto-emisión: cualquier usuario crea su propio pasaporte con score base.
  const mintMyPassport = async () => {
    if (!contracts.creditNFT || !address) return;
    const hash = await writeContractAsync({
      address: contracts.creditNFT,
      abi: creditNFTAbi,
      functionName: "mintMyPassport",
      args: [""],
    });
    return hash;
  };

  // Emisión por un emisor autorizado (puede fijar score/racha iniciales).
  const mintPassport = async (
    initialScore = 750,
    initialConsecutive = 1
  ) => {
    if (!contracts.creditNFT || !address) return;
    const hash = await writeContractAsync({
      address: contracts.creditNFT,
      abi: creditNFTAbi,
      functionName: "mintCreditNFT",
      args: [address, BigInt(initialScore), BigInt(initialConsecutive), ""],
    });
    return hash;
  };

  // Registra un pago actualizando score y racha en el NFT.
  const recordPayment = async (newScore: number, newConsecutive: number) => {
    if (!contracts.creditNFT || !hasNFT) return;
    const hash = await writeContractAsync({
      address: contracts.creditNFT,
      abi: creditNFTAbi,
      functionName: "recordPayment",
      args: [activeToken, BigInt(newScore), BigInt(newConsecutive)],
    });
    return hash;
  };

  // Reclama mMonad de prueba desde el faucet del token.
  const claimFaucet = async () => {
    if (!contracts.mockMonad) return;
    const hash = await writeContractAsync({
      address: contracts.mockMonad,
      abi: mockMonadAbi,
      functionName: "faucet",
    });
    return hash;
  };

  return useMemo(
    () => ({
      isConnected,
      chainId,
      configured,
      hasNFT,
      tokenId: hasNFT ? activeToken.toString() : undefined,
      score,
      consecutivePayments,
      rewards,
      creditLimit,
      creditAvailable,
      isAuthorizedMinter,
      isPending,
      mintMyPassport,
      mintPassport,
      recordPayment,
      claimFaucet,
      refetchAll,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      isConnected,
      chainId,
      configured,
      hasNFT,
      activeToken,
      score,
      consecutivePayments,
      rewards,
      creditLimit,
      creditAvailable,
      isAuthorizedMinter,
      isPending,
    ]
  );
}
