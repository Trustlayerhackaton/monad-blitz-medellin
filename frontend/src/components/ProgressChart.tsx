"use client";

import { TrendingUp, Target, BarChart3 } from "lucide-react";

interface ProgressChartProps {
  currentScore: number;
  targetScore: number;
  consecutivePayments: number;
  isDemoMode?: boolean;
}

export function ProgressChart({
  currentScore,
  targetScore,
  consecutivePayments,
  isDemoMode = false,
}: ProgressChartProps) {
  const progress = Math.min((currentScore / targetScore) * 100, 100);
  const paymentsProgress = Math.min((consecutivePayments / 12) * 100, 100);

  return (
    <div className="rounded-xl p-6 backdrop-blur-sm transition-all duration-300" style={{ backgroundColor: '#1A2332', border: '1px solid rgba(0, 255, 135, 0.1)', boxShadow: '0 0 20px rgba(0, 255, 135, 0.1)' }}>
      <div className="flex items-center space-x-2 mb-6">
        <BarChart3 className="w-6 h-6" style={{ color: '#00FF87' }} />
        <h3 className="text-xl font-bold" style={{ color: '#00FF87', letterSpacing: '-0.02em' }}>Progreso y Metas</h3>
      </div>

      <div className="space-y-6">
        {/* Progreso del Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" style={{ color: '#00FF87' }} />
              <span className="text-sm font-semibold" style={{ color: '#FFFFFF' }}>Payment Score</span>
            </div>
            <span className="text-sm font-bold" style={{ color: '#00FF87' }}>
              {currentScore} / {targetScore}
            </span>
          </div>
          <div className="w-full rounded-full h-4 overflow-hidden" style={{ backgroundColor: 'rgba(139, 146, 167, 0.1)' }}>
            <div
              className="h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
              style={{ 
                width: `${progress}%`,
                background: 'linear-gradient(135deg, #00FF87 0%, #00D9FF 100%)',
                boxShadow: '0 0 10px rgba(0, 255, 135, 0.3)'
              }}
            >
              {progress > 15 && (
                <span className="text-xs font-bold" style={{ color: '#0A0F1E' }}>{Math.round(progress)}%</span>
              )}
            </div>
          </div>
          {progress < 100 && (
            <p className="text-xs mt-1" style={{ color: '#8B92A7' }}>
              Faltan {targetScore - currentScore} puntos para alcanzar tu meta
            </p>
          )}
        </div>

        {/* Progreso de Pagos Consecutivos */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4" style={{ color: '#00D9FF' }} />
              <span className="text-sm font-semibold" style={{ color: '#FFFFFF' }}>Pagos Consecutivos</span>
            </div>
            <span className="text-sm font-bold" style={{ color: '#00D9FF' }}>
              {consecutivePayments} / 12
            </span>
          </div>
          <div className="w-full rounded-full h-4 overflow-hidden" style={{ backgroundColor: 'rgba(139, 146, 167, 0.1)' }}>
            <div
              className="h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
              style={{ 
                width: `${paymentsProgress}%`,
                background: 'linear-gradient(135deg, #00D9FF 0%, #00FF87 100%)',
                boxShadow: '0 0 10px rgba(0, 217, 255, 0.3)'
              }}
            >
              {paymentsProgress > 15 && (
                <span className="text-xs font-bold" style={{ color: '#0A0F1E' }}>
                  {Math.round(paymentsProgress)}%
                </span>
              )}
            </div>
          </div>
          {paymentsProgress < 100 && (
            <p className="text-xs mt-1" style={{ color: '#8B92A7' }}>
              Faltan {12 - consecutivePayments} pagos para completar el objetivo mensual
            </p>
          )}
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-2 gap-4 pt-4" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div className="text-center p-3 rounded-lg" style={{ backgroundColor: '#131B2E', border: '1px solid rgba(0, 255, 135, 0.1)' }}>
            <div className="text-2xl font-bold" style={{ color: '#00FF87' }}>{currentScore}</div>
            <div className="text-xs mt-1" style={{ color: '#8B92A7' }}>Score Actual</div>
          </div>
          <div className="text-center p-3 rounded-lg" style={{ backgroundColor: '#131B2E', border: '1px solid rgba(0, 217, 255, 0.1)' }}>
            <div className="text-2xl font-bold" style={{ color: '#00D9FF' }}>{consecutivePayments}</div>
            <div className="text-xs mt-1" style={{ color: '#8B92A7' }}>Racha Actual</div>
          </div>
        </div>
      </div>
    </div>
  );
}

