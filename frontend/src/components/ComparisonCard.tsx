"use client";

import { TrendingUp, TrendingDown, Minus, Users } from "lucide-react";

interface ComparisonCardProps {
  currentScore: number;
  averageScore: number;
  isDemoMode?: boolean;
}

export function ComparisonCard({
  currentScore,
  averageScore,
  isDemoMode = false,
}: ComparisonCardProps) {
  const difference = currentScore - averageScore;
  const percentage = averageScore > 0 ? ((difference / averageScore) * 100).toFixed(1) : "0";

  const getComparisonStatus = () => {
    if (difference > 50) return { icon: TrendingUp, color: "#00FF87", bg: "rgba(0, 255, 135, 0.1)", border: "rgba(0, 255, 135, 0.3)", text: "Muy por encima" };
    if (difference > 0) return { icon: TrendingUp, color: "#00FF87", bg: "rgba(0, 255, 135, 0.1)", border: "rgba(0, 255, 135, 0.2)", text: "Por encima" };
    if (difference === 0) return { icon: Minus, color: "#8B92A7", bg: "rgba(139, 146, 167, 0.1)", border: "rgba(139, 146, 167, 0.2)", text: "Promedio" };
    if (difference > -50) return { icon: TrendingDown, color: "#FFAA00", bg: "rgba(255, 170, 0, 0.1)", border: "rgba(255, 170, 0, 0.2)", text: "Por debajo" };
    return { icon: TrendingDown, color: "#ff4444", bg: "rgba(255, 68, 68, 0.1)", border: "rgba(255, 68, 68, 0.3)", text: "Muy por debajo" };
  };

  const status = getComparisonStatus();
  const StatusIcon = status.icon;

  return (
    <div className="rounded-xl p-6 backdrop-blur-sm transition-all duration-300" style={{ backgroundColor: '#1A2332', border: '1px solid rgba(0, 255, 135, 0.1)', boxShadow: '0 0 20px rgba(0, 255, 135, 0.1)' }}>
      <div className="flex items-center space-x-2 mb-6">
        <Users className="w-6 h-6" style={{ color: '#00FF87' }} />
        <h3 className="text-xl font-bold" style={{ color: '#00FF87', letterSpacing: '-0.02em' }}>Comparación con Promedio</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-lg p-4" style={{ backgroundColor: '#131B2E', border: '1px solid rgba(0, 255, 135, 0.2)' }}>
          <div className="text-sm mb-1" style={{ color: '#8B92A7' }}>Tu Score</div>
          <div className="text-3xl font-bold" style={{ color: '#00FF87' }}>{currentScore}</div>
        </div>
        <div className="rounded-lg p-4" style={{ backgroundColor: '#131B2E', border: '1px solid rgba(139, 146, 167, 0.1)' }}>
          <div className="text-sm mb-1" style={{ color: '#8B92A7' }}>Promedio</div>
          <div className="text-3xl font-bold" style={{ color: '#FFFFFF' }}>{averageScore}</div>
        </div>
      </div>

      <div 
        className="p-4 rounded-lg"
        style={{ 
          backgroundColor: status.bg,
          border: `1px solid ${status.border}`
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <StatusIcon className="w-5 h-5" style={{ color: status.color }} />
            <span className="font-semibold" style={{ color: status.color }}>{status.text}</span>
          </div>
          <div className="text-right" style={{ color: status.color }}>
            <div className="text-2xl font-bold">
              {difference > 0 ? "+" : ""}{difference}
            </div>
            <div className="text-sm">
              {difference > 0 ? "+" : ""}{percentage}%
            </div>
          </div>
        </div>
      </div>

      {difference < 0 && (
        <div 
          className="mt-4 p-3 rounded-lg"
          style={{ 
            backgroundColor: 'rgba(0, 217, 255, 0.1)',
            border: '1px solid rgba(0, 217, 255, 0.2)',
            borderLeft: '4px solid #00D9FF'
          }}
        >
          <p className="text-sm" style={{ color: '#8B92A7' }}>
            <strong style={{ color: '#FFFFFF' }}>💡 Consejo:</strong> Mantén tus pagos puntuales para mejorar tu score y alcanzar el promedio.
          </p>
        </div>
      )}
    </div>
  );
}

