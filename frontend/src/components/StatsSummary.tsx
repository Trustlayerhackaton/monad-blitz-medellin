"use client";

import { BarChart3, PieChart, Activity } from "lucide-react";
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface StatsSummaryProps {
  score: number;
  consecutivePayments: number;
  rewards: number;
  isDemoMode?: boolean;
}

export function StatsSummary({
  score,
  consecutivePayments,
  rewards,
  isDemoMode = false,
}: StatsSummaryProps) {
  // Datos para gráfico de distribución
  const distributionData = [
    { name: "Score", value: score, color: "#00FF87" },
    { name: "Pagos", value: consecutivePayments * 10, color: "#00D9FF" },
    { name: "Recompensas", value: rewards / 10, color: "#FFAA00" },
  ];

  const totalPoints = score + consecutivePayments * 10 + rewards / 10;

  return (
    <div className="rounded-xl p-6 backdrop-blur-sm transition-all duration-300" style={{ backgroundColor: '#1A2332', border: '1px solid rgba(0, 255, 135, 0.1)', boxShadow: '0 0 20px rgba(0, 255, 135, 0.1)' }}>
      <div className="flex items-center space-x-2 mb-6">
        <Activity className="w-6 h-6" style={{ color: '#00FF87' }} />
        <h3 className="text-xl font-bold" style={{ color: '#00FF87', letterSpacing: '-0.02em' }}>Resumen Estadístico</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico de distribución */}
        <div>
          <h4 className="text-sm font-semibold mb-4" style={{ color: '#FFFFFF' }}>Distribución de Métricas</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A2332',
                    border: '1px solid rgba(0, 255, 135, 0.2)',
                    borderRadius: '8px',
                    color: '#FFFFFF'
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="space-y-4">
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#131B2E', border: '1px solid rgba(0, 255, 135, 0.2)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: '#8B92A7' }}>Puntos Totales</p>
                <p className="text-2xl font-bold" style={{ color: '#00FF87' }}>{Math.round(totalPoints)}</p>
              </div>
              <BarChart3 className="w-8 h-8" style={{ color: '#00FF87' }} />
            </div>
          </div>

          <div className="p-4 rounded-lg" style={{ backgroundColor: '#131B2E', border: '1px solid rgba(0, 217, 255, 0.2)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: '#8B92A7' }}>Eficiencia</p>
                <p className="text-2xl font-bold" style={{ color: '#00D9FF' }}>
                  {consecutivePayments > 0 ? Math.round((score / consecutivePayments)) : 0}
                </p>
                <p className="text-xs mt-1" style={{ color: '#8B92A7' }}>Puntos por pago</p>
              </div>
              <PieChart className="w-8 h-8" style={{ color: '#00D9FF' }} />
            </div>
          </div>

          <div className="p-4 rounded-lg" style={{ backgroundColor: '#131B2E', border: '1px solid rgba(255, 170, 0, 0.2)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: '#8B92A7' }}>Valor Acumulado</p>
                <p className="text-2xl font-bold" style={{ color: '#FFAA00' }}>
                  ${(rewards * 100).toLocaleString("es-CO")}
                </p>
                <p className="text-xs mt-1" style={{ color: '#8B92A7' }}>Equivalente en COP</p>
              </div>
              <Activity className="w-8 h-8" style={{ color: '#FFAA00' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

