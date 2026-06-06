"use client";

import { Brain, TrendingUp, Calendar, Target } from "lucide-react";

interface ScorePredictionProps {
  currentScore: number;
  consecutivePayments: number;
  isDemoMode?: boolean;
}

export function ScorePrediction({
  currentScore,
  consecutivePayments,
  isDemoMode = false,
}: ScorePredictionProps) {
  const calculatePrediction = (months: number) => {
    const baseIncrease = consecutivePayments > 10 ? 8 : 5;
    const paymentBonus = consecutivePayments * 0.5;
    const monthlyIncrease = baseIncrease + paymentBonus;
    const predictedScore = Math.min(
      currentScore + monthlyIncrease * months,
      1000
    );
    const scoreIncrease = predictedScore - currentScore;
    const confidence = currentScore > 800 ? 92 : currentScore > 600 ? 78 : 65;

    return {
      predictedScore: Math.round(predictedScore),
      scoreIncrease: Math.round(scoreIncrease),
      confidence,
    };
  };

  const predictions = {
    oneMonth: calculatePrediction(1),
    threeMonths: calculatePrediction(3),
    sixMonths: calculatePrediction(6),
  };

  return (
    <div className="rounded-xl p-6 backdrop-blur-sm transition-all duration-300" style={{ backgroundColor: '#1A2332', border: '1px solid rgba(0, 255, 135, 0.1)', borderLeft: '4px solid #00FF87', boxShadow: '0 0 20px rgba(0, 255, 135, 0.1)' }}>
      <div className="flex items-center space-x-2 mb-6">
        <Brain className="w-6 h-6" style={{ color: '#00FF87' }} />
        <h3 className="text-xl font-bold" style={{ color: '#00FF87', letterSpacing: '-0.02em' }}>Predicción de Score (IA)</h3>
        <span className="ml-auto text-xs px-2 py-1 rounded" style={{ backgroundColor: 'rgba(0, 255, 135, 0.1)', color: '#00FF87', border: '1px solid rgba(0, 255, 135, 0.2)' }}>
          {predictions.oneMonth.confidence}% confianza
        </span>
      </div>

      <div className="space-y-4">
        {/* Score Actual */}
        <div className="rounded-lg p-4" style={{ backgroundColor: '#131B2E', border: '1px solid rgba(0, 255, 135, 0.2)' }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5" style={{ color: '#00FF87' }} />
              <span className="text-sm font-semibold" style={{ color: '#FFFFFF' }}>Score Actual</span>
            </div>
            <span className="text-2xl font-bold" style={{ color: '#00FF87' }}>{currentScore}</span>
          </div>
        </div>

        {/* Predicciones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1 Mes */}
          <div className="rounded-lg p-4 transition-all duration-300" style={{ backgroundColor: '#131B2E', border: '1px solid rgba(0, 255, 135, 0.2)' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0, 255, 135, 0.4)'; e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 255, 135, 0.2)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0, 255, 135, 0.2)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <div className="flex items-center space-x-2 mb-3">
              <Calendar className="w-4 h-4" style={{ color: '#00FF87' }} />
              <span className="text-sm font-semibold" style={{ color: '#FFFFFF' }}>1 Mes</span>
            </div>
            <div className="text-3xl font-bold mb-1" style={{ color: '#00FF87' }}>
              {predictions.oneMonth.predictedScore}
            </div>
            <div className="flex items-center space-x-1 text-sm" style={{ color: '#00D9FF' }}>
              <TrendingUp className="w-4 h-4" />
              <span>+{predictions.oneMonth.scoreIncrease} puntos</span>
            </div>
          </div>

          {/* 3 Meses */}
          <div className="rounded-lg p-4 transition-all duration-300" style={{ backgroundColor: '#131B2E', border: '1px solid rgba(0, 217, 255, 0.2)' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.4)'; e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 217, 255, 0.2)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.2)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <div className="flex items-center space-x-2 mb-3">
              <Calendar className="w-4 h-4" style={{ color: '#00D9FF' }} />
              <span className="text-sm font-semibold" style={{ color: '#FFFFFF' }}>3 Meses</span>
            </div>
            <div className="text-3xl font-bold mb-1" style={{ color: '#00D9FF' }}>
              {predictions.threeMonths.predictedScore}
            </div>
            <div className="flex items-center space-x-1 text-sm" style={{ color: '#00FF87' }}>
              <TrendingUp className="w-4 h-4" />
              <span>+{predictions.threeMonths.scoreIncrease} puntos</span>
            </div>
          </div>

          {/* 6 Meses */}
          <div className="rounded-lg p-4 transition-all duration-300" style={{ backgroundColor: '#131B2E', border: '1px solid rgba(0, 255, 135, 0.2)' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0, 255, 135, 0.4)'; e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 255, 135, 0.2)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0, 255, 135, 0.2)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <div className="flex items-center space-x-2 mb-3">
              <Calendar className="w-4 h-4" style={{ color: '#00FF87' }} />
              <span className="text-sm font-semibold" style={{ color: '#FFFFFF' }}>6 Meses</span>
            </div>
            <div className="text-3xl font-bold mb-1" style={{ color: '#00FF87' }}>
              {predictions.sixMonths.predictedScore}
            </div>
            <div className="flex items-center space-x-1 text-sm" style={{ color: '#00D9FF' }}>
              <TrendingUp className="w-4 h-4" />
              <span>+{predictions.sixMonths.scoreIncrease} puntos</span>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-4 p-3 rounded-lg backdrop-blur-sm" style={{ backgroundColor: '#131B2E', border: '1px solid rgba(0, 255, 135, 0.2)' }}>
          <p className="text-xs" style={{ color: '#8B92A7' }}>
            <strong style={{ color: '#FFFFFF' }}>Nota:</strong> Las predicciones se basan en tu historial actual y patrones de pago.
            Mantén tu racha de pagos para alcanzar estos objetivos.
          </p>
        </div>
      </div>
    </div>
  );
}

