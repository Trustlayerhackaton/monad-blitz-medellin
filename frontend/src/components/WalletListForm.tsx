"use client";

import { useState } from "react";
import { useAccount } from "wagmi";

type Props = {
  onSubmit: (wallets: string[], nationalId: string, countryCode: string) => void;
  onCancel: () => void;
  loading?: boolean;
};

export default function WalletListForm({ onSubmit, onCancel, loading }: Props) {
  const { address } = useAccount();
  const [wallets, setWallets] = useState<string[]>(address ? [address] : [""]);
  const [nationalId, setNationalId] = useState("");
  const [countryCode, setCountryCode] = useState("CO");
  const [inputErr, setInputErr] = useState("");

  function addWallet() {
    setWallets((prev) => [...prev, ""]);
  }

  function updateWallet(idx: number, val: string) {
    setWallets((prev) => prev.map((w, i) => (i === idx ? val : w)));
  }

  function removeWallet(idx: number) {
    if (wallets.length <= 1) return;
    setWallets((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleSubmit() {
    const valid = wallets.filter((w) => w.trim().startsWith("0x") && w.trim().length === 42);
    if (valid.length === 0) {
      setInputErr("Enter at least one valid wallet address (0x…)");
      return;
    }
    setInputErr("");
    onSubmit(valid, nationalId.trim(), countryCode);
  }

  return (
    <div
      style={{
        background: "#0D1421",
        border: "1px solid rgba(0,217,255,0.2)",
        borderRadius: 16,
        padding: 28,
        maxWidth: 520,
        width: "100%",
      }}
    >
      <h3 style={{ color: "#fff", margin: "0 0 4px", fontSize: 18, fontWeight: 700 }}>
        Financial Analysis
      </h3>
      <p style={{ color: "#8892A4", fontSize: 13, margin: "0 0 24px" }}>
        Add the wallets you want included in your credit score calculation.
      </p>

      {/* Wallet list */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ color: "#8892A4", fontSize: 12, fontWeight: 600, letterSpacing: 0.5 }}>
          WALLETS
        </label>
        {wallets.map((w, idx) => (
          <div key={idx} style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
            <input
              value={w}
              onChange={(e) => updateWallet(idx, e.target.value)}
              placeholder="0x…"
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8,
                padding: "10px 14px",
                color: "#fff",
                fontSize: 13,
                fontFamily: "monospace",
                outline: "none",
              }}
            />
            {wallets.length > 1 && (
              <button
                onClick={() => removeWallet(idx)}
                style={{
                  background: "rgba(255,68,68,0.15)",
                  border: "1px solid rgba(255,68,68,0.3)",
                  borderRadius: 8,
                  color: "#FF4444",
                  padding: "8px 12px",
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addWallet}
          style={{
            marginTop: 10,
            background: "transparent",
            border: "1px dashed rgba(0,217,255,0.4)",
            borderRadius: 8,
            color: "#00D9FF",
            padding: "8px 16px",
            cursor: "pointer",
            fontSize: 13,
            width: "100%",
          }}
        >
          + Add wallet
        </button>
      </div>

      {/* Optional ID */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ color: "#8892A4", fontSize: 12, fontWeight: 600, letterSpacing: 0.5 }}>
          NATIONAL ID (OPTIONAL)
        </label>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 8,
              padding: "10px 8px",
              color: "#fff",
              fontSize: 13,
              outline: "none",
              width: 72,
            }}
          >
            <option value="CO">🇨🇴 CO</option>
            <option value="MX">🇲🇽 MX</option>
            <option value="US">🇺🇸 US</option>
            <option value="BR">🇧🇷 BR</option>
          </select>
          <input
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
            placeholder="Enter ID number for Trustworthy Score"
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 8,
              padding: "10px 14px",
              color: "#fff",
              fontSize: 13,
              outline: "none",
            }}
          />
        </div>
        <p style={{ color: "#8892A4", fontSize: 11, margin: "6px 0 0" }}>
          Enables the Trustworthy Score via public government records.
        </p>
      </div>

      {inputErr && (
        <p style={{ color: "#FF4444", fontSize: 12, marginBottom: 12 }}>{inputErr}</p>
      )}

      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={onCancel}
          style={{
            flex: 1,
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 10,
            color: "#8892A4",
            padding: "12px",
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            flex: 2,
            background: loading ? "rgba(0,255,135,0.2)" : "linear-gradient(135deg,#00FF87,#00D9FF)",
            border: "none",
            borderRadius: 10,
            color: loading ? "#8892A4" : "#0A0F1E",
            padding: "12px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          {loading ? "Processing…" : "Continue →"}
        </button>
      </div>
    </div>
  );
}
