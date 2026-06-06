"use client";

import { TrendingUp, Calendar, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ScoreTrendChartProps {
  currentScore: number;
  isDemoMode?: boolean;
}

export function ScoreTrendChart({ currentScore, isDemoMode = false }: ScoreTrendChartProps) {
  // Datos mock para demo - evolución del score en los últimos 6 meses
  const demoData = [
    { month: "Jul", score: 720 },
    { month: "Ago", score: 750 },
    { month: "Sep", score: 780 },
    { month: "Oct", score: 810 },
    { month: "Nov", score: 830 },
    { month: "Dic", score: currentScore },
  ];

  const data = isDemoMode ? demoData : [];

  return (
    <div className="rounded-xl p-6 backdrop-blur-sm transition-all duration-300" style={{ backgroundColor: '#1A2332', border: '1px solid rgba(0, 255, 135, 0.1)', boxShadow: '0 0 20px rgba(0, 255, 135, 0.1)' }}>
      <div className="flex items-center space-x-2 mb-6">
        <BarChart3 className="w-6 h-6" style={{ color: '#00FF87' }} />
        <h3 className="text-xl font-bold" style={{ color: '#00FF87', letterSpacing: '-0.02em' }}>Evolución del Score</h3>
      </div>

      {data.length > 0 ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 146, 167, 0.2)" />
              <XAxis 
                dataKey="month" 
                stroke="#8B92A7"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#8B92A7"
                domain={[600, 1000]}
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A2332',
                  border: '1px solid rgba(0, 255, 135, 0.2)',
                  borderRadius: '8px',
                  color: '#FFFFFF'
                }}
                formatter={(value: number) => [`${value} puntos`, "Score"]}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#00FF87"
                strokeWidth={3}
                dot={{ fill: "#00FF87", r: 5 }}
                activeDot={{ r: 8, fill: "#00D9FF" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center" style={{ color: '#8B92A7' }}>
          <p>No hay datos disponibles</p>
        </div>
      )}

      <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-lg" style={{ backgroundColor: '#131B2E', border: '1px solid rgba(139, 146, 167, 0.1)' }}>
            <div className="text-sm mb-1" style={{ color: '#8B92A7' }}>Inicio</div>
            <div className="text-lg font-bold" style={{ color: '#FFFFFF' }}>{data[0]?.score || 0}</div>
          </div>
          <div className="p-3 rounded-lg" style={{ backgroundColor: '#131B2E', border: '1px solid rgba(0, 255, 135, 0.2)' }}>
            <div className="text-sm mb-1" style={{ color: '#8B92A7' }}>Actual</div>
            <div className="text-lg font-bold" style={{ color: '#00FF87' }}>{currentScore}</div>
          </div>
          <div className="p-3 rounded-lg" style={{ backgroundColor: '#131B2E', border: '1px solid rgba(0, 217, 255, 0.2)' }}>
            <div className="text-sm mb-1" style={{ color: '#8B92A7' }}>Mejora</div>
            <div className="text-lg font-bold" style={{ color: '#00D9FF' }}>
              +{data.length > 0 ? currentScore - (data[0]?.score || 0) : 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

