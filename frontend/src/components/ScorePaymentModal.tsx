"use client";

import { formatEther } from "viem";
import type { ScoreResult } from "@/hooks/useScoreRequest";

type Step = "idle" | "paying" | "scoring" | "done" | "error";

type Props = {
  scoreFee: bigint;
  wallets: string[];
  hasNationalId: boolean;
  onConfirm: () => Promise<void>;
  onClose: () => void;
  step: Step;
  creditScore: ScoreResult | null;
  trustScore: ScoreResult | null;
  errorMsg: string | null;
};

const STEPS = [
  { key: "paying", label: "Pay MON fee" },
  { key: "scoring", label: "Generate scores" },
  { key: "done", label: "Record on-chain" },
] as const;

function StepRow({ label, active, done }: { label: string; active: boolean; done: boolean }) {
  const icon = done ? "✓" : active ? "⟳" : "○";
  const color = done ? "#00FF87" : active ? "#00D9FF" : "#8892A4";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
      <span style={{ color, fontWeight: 700, width: 20, textAlign: "center" }}>{icon}</span>
      <span style={{ color: done || active ? "#fff" : "#8892A4", fontSize: 14 }}>{label}</span>
    </div>
  );
}

export default function ScorePaymentModal({
  scoreFee,
  wallets,
  hasNationalId,
  onConfirm,
  onClose,
  step,
  creditScore,
  trustScore,
  errorMsg,
}: Props) {
  const feeEth = formatEther(scoreFee);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 16,
      }}
    >
      <div
        style={{
          background: "#0D1421",
          border: "1px solid rgba(0,217,255,0.2)",
          borderRadius: 20,
          padding: 32,
          maxWidth: 440,
          width: "100%",
        }}
      >
        <h3 style={{ color: "#fff", margin: "0 0 8px", fontSize: 20, fontWeight: 700 }}>
          Generate Trustlayer Score
        </h3>
        <p style={{ color: "#8892A4", fontSize: 13, margin: "0 0 24px" }}>
          Analyzing {wallets.length} wallet{wallets.length !== 1 ? "s" : ""}
          {hasNationalId ? " + national ID" : ""}.
        </p>

        {/* Fee info */}
        <div
          style={{
            background: "rgba(0,255,135,0.06)",
            border: "1px solid rgba(0,255,135,0.15)",
            borderRadius: 10,
            padding: "14px 18px",
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ color: "#8892A4", fontSize: 13 }}>Network fee</span>
          <span style={{ color: "#00FF87", fontWeight: 700, fontSize: 16 }}>{feeEth} MON</span>
        </div>

        {/* Progress steps */}
        <div style={{ marginBottom: 24 }}>
          {STEPS.map((s) => (
            <StepRow
              key={s.key}
              label={s.label}
              active={step === s.key}
              done={
                (s.key === "paying" && (step === "scoring" || step === "done")) ||
                (s.key === "scoring" && step === "done") ||
                (s.key === "done" && step === "done")
              }
            />
          ))}
        </div>

        {/* Error */}
        {step === "error" && errorMsg && (
          <div
            style={{
              background: "rgba(255,68,68,0.1)",
              border: "1px solid rgba(255,68,68,0.3)",
              borderRadius: 8,
              padding: "10px 14px",
              color: "#FF4444",
              fontSize: 12,
              marginBottom: 20,
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Done summary */}
        {step === "done" && (creditScore || trustScore) && (
          <div
            style={{
              background: "rgba(0,255,135,0.06)",
              border: "1px solid rgba(0,255,135,0.15)",
              borderRadius: 10,
              padding: "14px 18px",
              marginBottom: 20,
            }}
          >
            {creditScore && (
              <div style={{ color: "#fff", fontSize: 14, marginBottom: 4 }}>
                Credit Score: <strong style={{ color: "#00FF87" }}>{creditScore.score}</strong>{" "}
                <span style={{ color: "#8892A4", fontSize: 12 }}>({creditScore.level})</span>
              </div>
            )}
            {trustScore && (
              <div style={{ color: "#fff", fontSize: 14 }}>
                Trustworthy Score:{" "}
                <strong style={{ color: "#00D9FF" }}>{trustScore.score}</strong>{" "}
                <span style={{ color: "#8892A4", fontSize: 12 }}>({trustScore.level})</span>
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={onClose}
            disabled={step === "paying" || step === "scoring"}
            style={{
              flex: 1,
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 10,
              color: "#8892A4",
              padding: "12px",
              cursor: step === "paying" || step === "scoring" ? "not-allowed" : "pointer",
              fontSize: 14,
            }}
          >
            {step === "done" ? "Close" : "Cancel"}
          </button>
          {step === "idle" && (
            <button
              onClick={onConfirm}
              style={{
                flex: 2,
                background: "linear-gradient(135deg,#00FF87,#00D9FF)",
                border: "none",
                borderRadius: 10,
                color: "#0A0F1E",
                padding: "12px",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              Pay & Generate Score
            </button>
          )}
          {step === "error" && (
            <button
              onClick={onConfirm}
              style={{
                flex: 2,
                background: "rgba(255,68,68,0.2)",
                border: "1px solid rgba(255,68,68,0.4)",
                borderRadius: 10,
                color: "#FF4444",
                padding: "12px",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
