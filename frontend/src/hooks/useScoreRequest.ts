"use client";

import axios from "axios";
import { useState } from "react";
import { useReadContract, useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { getContracts, riskScoreOracleAbi, walletRegistryAbi } from "@/lib/contracts";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8000";

export type ScoreResult = {
  id: string;
  score: number;
  level: string;
  breakdown: Record<string, unknown>;
  created_at: string;
};

// ── Score fee read ────────────────────────────────────────────────────────────
export function useScoreFee(chainId?: number) {
  const contracts = getContracts(chainId);
  return useReadContract({
    address: contracts.riskScoreOracle,
    abi: riskScoreOracleAbi,
    functionName: "scoreFee",
    query: { enabled: Boolean(contracts.riskScoreOracle) },
  });
}

// ── Linked wallets read ───────────────────────────────────────────────────────
export function useLinkedWallets(owner?: `0x${string}`, chainId?: number) {
  const contracts = getContracts(chainId);
  return useReadContract({
    address: contracts.walletRegistry,
    abi: walletRegistryAbi,
    functionName: "getLinkedWallets",
    args: owner ? [owner] : undefined,
    query: { enabled: Boolean(contracts.walletRegistry && owner) },
  });
}

// ── Register additional wallet ────────────────────────────────────────────────
export function useRegisterWallet() {
  const { writeContractAsync, isPending } = useWriteContract();
  return { writeContractAsync, isPending };
}

// ── Credit score generation (backend call + on-chain submit) ─────────────────
export function useCreditScoreRequest() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { writeContractAsync } = useWriteContract();

  async function requestCreditScore(
    wallets: string[],
    subject: `0x${string}`,
    chainId: number,
    scoreFee: bigint
  ) {
    setLoading(true);
    setError(null);
    try {
      // 1. Backend generates score + signed payload
      const { data } = await axios.post<ScoreResult & { dataHash?: string; signature?: string }>(
        `${BACKEND_URL}/scores/credit`,
        { wallets }
      );
      setResult(data);

      // 2. If oracle contract is wired, submit score on-chain
      const contracts = getContracts(chainId);
      if (contracts.riskScoreOracle && data.dataHash && data.signature) {
        await writeContractAsync({
          address: contracts.riskScoreOracle,
          abi: riskScoreOracleAbi,
          functionName: "submitScore",
          args: [
            subject,
            BigInt(data.score),
            data.dataHash as `0x${string}`,
            data.signature as `0x${string}`,
          ],
          value: scoreFee,
        });
      }

      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Score request failed";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { requestCreditScore, loading, result, error };
}

// ── Trustworthy score generation (backend call only) ─────────────────────────
export function useTrustScoreRequest() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function requestTrustScore(nationalId: string, countryCode = "CO") {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post<ScoreResult>(
        `${BACKEND_URL}/scores/trustworthy`,
        { national_id: nationalId, country_code: countryCode }
      );
      setResult(data);
      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Trust score request failed";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { requestTrustScore, loading, result, error };
}
