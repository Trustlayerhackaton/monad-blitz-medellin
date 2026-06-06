"use client";

import { Calculator, Gift, TrendingUp, Target } from "lucide-react";
import { useState } from "react";

interface RewardsCalculatorProps {
  level: string;
  currentConsecutivePayments: number;
  isDemoMode?: boolean;
}

export function RewardsCalculator({
  level,
  currentConsecutivePayments,
  isDemoMode = false,
}: RewardsCalculatorProps) {
  const [futurePayments, setFuturePayments] = useState(5);

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
        return 0.8;
    }
  };

  const getRachaBonus = (racha: number) => {
    if (racha >= 20) return 100;
    if (racha >= 15) return 75;
    if (racha >= 10) return 50;
    if (racha >= 5) return 25;
    return 0;
  };

  const baseReward = 50;
  const multiplier = getRewardMultiplier(level);

  const calculateFutureRewards = () => {
    const results = [];
    for (let i = 1; i <= futurePayments; i++) {
      const newRacha = currentConsecutivePayments + i;
      const bonus = getRachaBonus(newRacha);
      const reward = Math.round(baseReward * multiplier + bonus);
      results.push({
        payment: i,
        racha: newRacha,
        reward,
        bonus,
      });
    }
    return results;
  };

  const futureRewards = calculateFutureRewards();
  const totalRewards = futureRewards.reduce((sum, r) => sum + r.reward, 0);

  return (
    <div className="rounded-xl p-6 backdrop-blur-sm transition-all duration-300" style={{ backgroundColor: '#1A2332', border: '1px solid rgba(0, 255, 135, 0.1)', boxShadow: '0 0 20px rgba(0, 255, 135, 0.1)' }}>
      <div className="flex items-center space-x-2 mb-6">
        <Calculator className="w-6 h-6" style={{ color: '#00FF87' }} />
        <h3 className="text-xl font-bold" style={{ color: '#00FF87', letterSpacing: '-0.02em' }}>Calculadora de Recompensas</h3>
      </div>

      <div className="mb-6 p-4 rounded-lg backdrop-blur-sm" style={{ background: 'linear-gradient(135deg, rgba(0, 255, 135, 0.1) 0%, rgba(0, 217, 255, 0.1) 100%)', border: '1px solid rgba(0, 255, 135, 0.2)' }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm mb-1" style={{ color: '#8B92A7' }}>Racha Actual</p>
            <p className="text-2xl font-bold" style={{ color: '#00FF87' }}>{currentConsecutivePayments}</p>
          </div>
          <div>
            <p className="text-sm mb-1" style={{ color: '#8B92A7' }}>Nivel</p>
            <p className="text-2xl font-bold" style={{ color: '#00D9FF' }}>{level}</p>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-semibold mb-2" style={{ color: '#FFFFFF' }}>
            Pagos Futuros a Calcular
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={futurePayments}
            onChange={(e) => setFuturePayments(Number(e.target.value))}
            className="w-full px-4 py-2 rounded-lg transition-all duration-300"
            style={{
              backgroundColor: '#1A2332',
              border: '1px solid rgba(0, 255, 135, 0.2)',
              color: '#FFFFFF',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0, 255, 135, 0.5)';
              e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 255, 135, 0.2)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0, 255, 135, 0.2)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      {/* Tabla compacta con scroll */}
      <div className="mb-6 rounded-lg overflow-hidden" style={{ border: '1px solid rgba(0, 255, 135, 0.1)' }}>
        <div className="max-h-64 overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0" style={{ backgroundColor: '#131B2E' }}>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#FFFFFF' }}>
                  Pago
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#FFFFFF' }}>
                  Racha
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#FFFFFF' }}>
                  Bonus
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider" style={{ color: '#FFFFFF' }}>
                  Recompensa
                </th>
              </tr>
            </thead>
            <tbody style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
              {futureRewards.map((item) => (
                <tr
                  key={item.payment}
                  className="transition-all duration-300"
                  style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 255, 135, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4" style={{ color: '#00FF87' }} />
                      <span className="text-sm font-semibold" style={{ color: '#FFFFFF' }}>#{item.payment}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm" style={{ color: '#8B92A7' }}>{item.racha} pagos</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {item.bonus > 0 ? (
                      <span className="text-sm font-semibold" style={{ color: '#00FF87' }}>+{item.bonus}</span>
                    ) : (
                      <span className="text-sm" style={{ color: '#8B92A7', opacity: 0.5 }}>-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <span className="text-sm font-bold" style={{ color: '#00FF87' }}>{item.reward} mMonad</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-4 rounded-lg backdrop-blur-sm" style={{ background: 'linear-gradient(135deg, rgba(0, 255, 135, 0.15) 0%, rgba(0, 217, 255, 0.15) 100%)', border: '2px solid rgba(0, 255, 135, 0.3)' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Gift className="w-5 h-5" style={{ color: '#00FF87' }} />
            <span className="font-semibold" style={{ color: '#FFFFFF' }}>Total de Recompensas</span>
          </div>
          <TrendingUp className="w-5 h-5" style={{ color: '#00FF87' }} />
        </div>
        <p className="text-3xl font-bold" style={{ color: '#00FF87' }}>{totalRewards} mMonad</p>
        <p className="text-sm mt-1" style={{ color: '#8B92A7' }}>
          Recompensas estimadas por {futurePayments} pagos consecutivos
        </p>
      </div>
    </div>
  );
}

