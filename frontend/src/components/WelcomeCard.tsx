"use client";

import { Sparkles, TrendingUp, Target, ArrowRight } from "lucide-react";

interface WelcomeCardProps {
  score: number;
  level: string;
  consecutivePayments: number;
  isDemoMode?: boolean;
}

export function WelcomeCard({
  score,
  level,
  consecutivePayments,
  isDemoMode = false,
}: WelcomeCardProps) {
  const getNextMilestone = () => {
    if (score < 600) return { target: 600, label: "Nivel Plata", progress: (score / 600) * 100 };
    if (score < 750) return { target: 750, label: "Nivel Oro", progress: (score / 750) * 100 };
    if (score < 850) return { target: 850, label: "Nivel Platino", progress: (score / 850) * 100 };
    if (score < 950) return { target: 950, label: "Nivel Diamante", progress: (score / 950) * 100 };
    return { target: 1000, label: "Score Máximo", progress: (score / 1000) * 100 };
  };

  const milestone = getNextMilestone();
  const nextPaymentMilestone = consecutivePayments < 5 ? 5 : consecutivePayments < 10 ? 10 : consecutivePayments < 20 ? 20 : 30;

  return (
    <div 
      className="rounded-xl p-6 relative overflow-hidden backdrop-blur-sm transition-all duration-300"
      style={{ 
        backgroundColor: '#1A2332',
        border: '1px solid rgba(0, 255, 135, 0.1)',
        boxShadow: '0 0 20px rgba(0, 255, 135, 0.1)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0, 255, 135, 0.3)';
        e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 255, 135, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0, 255, 135, 0.1)';
        e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 135, 0.1)';
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32" style={{ backgroundColor: '#00FF87' }}></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full -ml-24 -mb-24" style={{ backgroundColor: '#00D9FF' }}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1" style={{ color: '#00FF87', letterSpacing: '-0.02em' }}>
              ¡Bienvenido de vuelta! 👋
            </h2>
            <p className="text-sm" style={{ color: '#8B92A7' }}>
              Tu pasaporte financiero está en nivel <span className="font-semibold" style={{ color: '#FFFFFF' }}>{level}</span>
            </p>
          </div>
          <div className="p-3 rounded-lg backdrop-blur-sm" style={{ backgroundColor: 'rgba(0, 255, 135, 0.1)', border: '1px solid rgba(0, 255, 135, 0.2)' }}>
            <Sparkles className="w-6 h-6" style={{ color: '#00FF87' }} />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="rounded-lg p-4 backdrop-blur-sm" style={{ backgroundColor: '#131B2E', border: '1px solid rgba(139, 146, 167, 0.1)' }}>
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4" style={{ color: '#00FF87' }} />
              <span className="text-xs" style={{ color: '#8B92A7' }}>Payment Score</span>
            </div>
            <p className="text-3xl font-bold" style={{ color: '#00FF87' }}>{score}</p>
            <div className="mt-2 w-full rounded-full h-2" style={{ backgroundColor: 'rgba(139, 146, 167, 0.1)' }}>
              <div
                className="rounded-full h-2 transition-all duration-500"
                style={{ width: `${milestone.progress}%`, backgroundColor: '#00FF87' }}
              ></div>
            </div>
            <p className="text-xs mt-1" style={{ color: '#8B92A7' }}>
              {milestone.progress.toFixed(0)}% hacia {milestone.label}
            </p>
          </div>

          <div className="rounded-lg p-4 backdrop-blur-sm" style={{ backgroundColor: '#131B2E', border: '1px solid rgba(139, 146, 167, 0.1)' }}>
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-4 h-4" style={{ color: '#00FF87' }} />
              <span className="text-xs" style={{ color: '#8B92A7' }}>Pagos Consecutivos</span>
            </div>
            <p className="text-3xl font-bold" style={{ color: '#00FF87' }}>{consecutivePayments}</p>
            <p className="text-xs mt-1" style={{ color: '#8B92A7' }}>
              {nextPaymentMilestone - consecutivePayments} pagos para el siguiente hito
            </p>
          </div>
        </div>

        {/* Recommended Action */}
        <div className="rounded-lg p-4 backdrop-blur-sm" style={{ backgroundColor: '#131B2E', border: '1px solid rgba(0, 255, 135, 0.2)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: '#FFFFFF' }}>Próximo paso recomendado</p>
              <p className="text-xs" style={{ color: '#8B92A7' }}>
                {consecutivePayments < 5
                  ? "Completa 5 pagos consecutivos para obtener tu primer bonus"
                  : score < 750
                  ? "Mejora tu score para alcanzar el siguiente nivel"
                  : "Mantén tu racha activa para maximizar tus recompensas"}
              </p>
            </div>
            <ArrowRight className="w-5 h-5" style={{ color: '#00FF87' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

