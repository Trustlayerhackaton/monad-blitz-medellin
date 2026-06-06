"use client";

import { Gift, Trophy, TrendingUp, Award } from "lucide-react";

interface RewardsTableProps {
  level: string;
  consecutivePayments: number;
  isDemoMode?: boolean;
}

export function RewardsTable({ level, consecutivePayments, isDemoMode = false }: RewardsTableProps) {
  // Tabla de recompensas basada en nivel y racha
  const getRewardMultiplier = (level: string) => {
    switch (level.toLowerCase()) {
      case "diamante":
        return 2.0;
      case "platino":
        return 1.5;
      case "oro":
        return 1.2;
      case "plata":
        return 1.0;
      default:
        return 0.8; // Bronce
    }
  };

  const getRachaBonus = (racha: number) => {
    if (racha >= 20) return 100;
    if (racha >= 15) return 75;
    if (racha >= 10) return 50;
    if (racha >= 5) return 25;
    return 0;
  };

  const baseReward = 50; // mMonad base por pago
  const multiplier = getRewardMultiplier(level);
  const rachaBonus = getRachaBonus(consecutivePayments);
  const totalReward = Math.round(baseReward * multiplier + rachaBonus);

  const rewardsData = [
    { racha: 1, base: baseReward, multiplier: multiplier, bonus: 0, total: Math.round(baseReward * multiplier) },
    { racha: 5, base: baseReward, multiplier: multiplier, bonus: 25, total: Math.round(baseReward * multiplier + 25) },
    { racha: 10, base: baseReward, multiplier: multiplier, bonus: 50, total: Math.round(baseReward * multiplier + 50) },
    { racha: 15, base: baseReward, multiplier: multiplier, bonus: 75, total: Math.round(baseReward * multiplier + 75) },
    { racha: 20, base: baseReward, multiplier: multiplier, bonus: 100, total: Math.round(baseReward * multiplier + 100) },
  ];

  return (
    <div className="rounded-xl p-6 backdrop-blur-sm transition-all duration-300" style={{ backgroundColor: '#1A2332', border: '1px solid rgba(0, 255, 135, 0.1)', boxShadow: '0 0 20px rgba(0, 255, 135, 0.1)' }}>
      <div className="flex items-center space-x-2 mb-6">
        <Gift className="w-6 h-6" style={{ color: '#00FF87' }} />
        <h3 className="text-xl font-bold" style={{ color: '#00FF87', letterSpacing: '-0.02em' }}>Tabla de Recompensas Monad</h3>
      </div>

      <div className="mb-6 p-4 rounded-lg backdrop-blur-sm" style={{ background: 'linear-gradient(135deg, rgba(0, 255, 135, 0.1) 0%, rgba(0, 217, 255, 0.1) 100%)', border: '1px solid rgba(0, 255, 135, 0.2)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold" style={{ color: '#FFFFFF' }}>Recompensa Actual</span>
          <span className="text-2xl font-bold" style={{ color: '#00FF87' }}>{totalReward} mMonad</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs" style={{ color: '#8B92A7' }}>
          <div>Nivel: {level}</div>
          <div>Multiplicador: {multiplier}x</div>
          <div>Racha: {consecutivePayments}</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: '#FFFFFF' }}>Racha</th>
              <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: '#FFFFFF' }}>Base</th>
              <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: '#FFFFFF' }}>Multiplicador</th>
              <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: '#FFFFFF' }}>Bonus Racha</th>
              <th className="text-right py-3 px-4 text-sm font-semibold" style={{ color: '#FFFFFF' }}>Total mMonad</th>
            </tr>
          </thead>
          <tbody>
            {rewardsData.map((row, index) => (
              <tr
                key={index}
                className="transition-all duration-300"
                style={{ 
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  backgroundColor: row.racha === consecutivePayments ? 'rgba(0, 255, 135, 0.1)' : 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (row.racha !== consecutivePayments) {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 255, 135, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (row.racha !== consecutivePayments) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    {row.racha === consecutivePayments && (
                      <Trophy className="w-4 h-4" style={{ color: '#00FF87' }} />
                    )}
                    <span className="font-semibold" style={{ color: '#FFFFFF' }}>{row.racha}</span>
                  </div>
                </td>
                <td className="py-3 px-4" style={{ color: '#8B92A7' }}>{row.base} mMonad</td>
                <td className="py-3 px-4" style={{ color: '#8B92A7' }}>{row.multiplier.toFixed(1)}x</td>
                <td className="py-3 px-4" style={{ color: '#8B92A7' }}>+{row.bonus} mMonad</td>
                <td className="py-3 px-4 text-right font-bold" style={{ color: '#00FF87' }}>{row.total} mMonad</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-3 rounded-lg backdrop-blur-sm" style={{ backgroundColor: '#131B2E', border: '1px solid rgba(0, 217, 255, 0.2)', borderLeft: '4px solid #00D9FF' }}>
        <p className="text-xs" style={{ color: '#8B92A7' }}>
          <strong style={{ color: '#FFFFFF' }}>Nota:</strong> Las recompensas se calculan multiplicando la base por el multiplicador de nivel y sumando el bonus por racha.
        </p>
      </div>
    </div>
  );
}

