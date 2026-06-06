"use client";

import type { ScoreResult } from "@/hooks/useScoreRequest";

type Props = {
  creditScore: ScoreResult | null;
  trustScore: ScoreResult | null;
  loading?: boolean;
};

const LEVEL_COLOR: Record<string, string> = {
  LOW_RISK: "#00FF87",
  MEDIUM_RISK: "#FFD700",
  HIGH_RISK: "#FF8C00",
  CRITICAL_RISK: "#FF4444",
};

const LEVEL_LABEL: Record<string, string> = {
  LOW_RISK: "Low Risk",
  MEDIUM_RISK: "Medium Risk",
  HIGH_RISK: "High Risk",
  CRITICAL_RISK: "Critical",
};

function ScoreGauge({ score, label, level }: { score: number; label: string; level: string }) {
  const color = LEVEL_COLOR[level] ?? "#00D9FF";
  const pct = Math.round((score / 1000) * 100);
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.05)",
        borderRadius: 12,
        padding: "20px 24px",
        border: `1px solid ${color}33`,
        flex: 1,
        minWidth: 180,
      }}
    >
      <div style={{ fontSize: 12, color: "#8892A4", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
        {label}
      </div>
      <div style={{ fontSize: 48, fontWeight: 700, color, lineHeight: 1 }}>{score}</div>
      <div style={{ fontSize: 11, color, marginTop: 4 }}>{LEVEL_LABEL[level] ?? level}</div>
      <div style={{ marginTop: 12, background: "rgba(255,255,255,0.08)", borderRadius: 4, height: 6, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, background: color, height: "100%", borderRadius: 4, transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
}

export default function TrustScoreCard({ creditScore, trustScore, loading }: Props) {
  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: "center", color: "#8892A4", fontSize: 14 }}>
        Generating scores…
      </div>
    );
  }

  if (!creditScore && !trustScore) return null;

  return (
    <div
      style={{
        background: "rgba(0,217,255,0.04)",
        border: "1px solid rgba(0,217,255,0.15)",
        borderRadius: 16,
        padding: 24,
        marginTop: 16,
      }}
    >
      <div style={{ fontSize: 13, color: "#8892A4", marginBottom: 16, fontWeight: 600, letterSpacing: 0.5 }}>
        TRUSTLAYER SCORES
      </div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {creditScore && (
          <ScoreGauge score={creditScore.score} label="Credit Score" level={creditScore.level} />
        )}
        {trustScore && (
          <ScoreGauge score={trustScore.score} label="Trustworthy Score" level={trustScore.level} />
        )}
      </div>

      {(creditScore || trustScore) && (
        <details style={{ marginTop: 16 }}>
          <summary style={{ cursor: "pointer", fontSize: 12, color: "#8892A4" }}>
            Score breakdown
          </summary>
          <pre
            style={{
              marginTop: 8,
              fontSize: 11,
              color: "#8892A4",
              background: "rgba(0,0,0,0.3)",
              padding: 12,
              borderRadius: 8,
              overflow: "auto",
              maxHeight: 200,
            }}
          >
            {JSON.stringify({ credit: creditScore?.breakdown, trust: trustScore?.breakdown }, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
