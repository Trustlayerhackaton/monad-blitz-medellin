"use client";

import { Trophy, Award, Medal, Star, CheckCircle2, Lock } from "lucide-react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  requirement: number;
  icon: typeof Trophy;
  color: string;
}

interface AchievementsProps {
  consecutivePayments: number;
  isDemoMode?: boolean;
}

export function Achievements({ consecutivePayments, isDemoMode = false }: AchievementsProps) {
  const achievements: Achievement[] = [
    {
      id: "1",
      name: "Primer Paso",
      description: "Completa tu primer pago consecutivo",
      requirement: 1,
      icon: Trophy,
      color: "linear-gradient(135deg, #FFAA00 0%, #FF8800 100%)",
    },
    {
      id: "2",
      name: "Racha de 5",
      description: "Alcanza 5 pagos consecutivos",
      requirement: 5,
      icon: Medal,
      color: "linear-gradient(135deg, #8B92A7 0%, #6B7280 100%)",
    },
    {
      id: "3",
      name: "Decena Perfecta",
      description: "Alcanza 10 pagos consecutivos",
      requirement: 10,
      icon: Award,
      color: "linear-gradient(135deg, #00FF87 0%, #00D9FF 100%)",
    },
    {
      id: "4",
      name: "Quincena",
      description: "Alcanza 15 pagos consecutivos",
      requirement: 15,
      icon: Star,
      color: "linear-gradient(135deg, #00D9FF 0%, #00FF87 100%)",
    },
    {
      id: "5",
      name: "Veintena",
      description: "Alcanza 20 pagos consecutivos",
      requirement: 20,
      icon: Trophy,
      color: "linear-gradient(135deg, #00FF87 0%, #00D9FF 100%)",
    },
    {
      id: "6",
      name: "Maestro",
      description: "Alcanza 30 pagos consecutivos",
      requirement: 30,
      icon: Star,
      color: "linear-gradient(135deg, #00D9FF 0%, #00FF87 100%)",
    },
    {
      id: "7",
      name: "Leyenda",
      description: "Alcanza 50 pagos consecutivos",
      requirement: 50,
      icon: Trophy,
      color: "linear-gradient(135deg, #00FF87 0%, #00D9FF 100%)",
    },
  ];

  const getAchievementStatus = (requirement: number) => {
    if (consecutivePayments >= requirement) {
      return "unlocked";
    }
    if (consecutivePayments >= requirement - 2) {
      return "almost";
    }
    return "locked";
  };

  return (
    <div className="rounded-xl p-6 backdrop-blur-sm transition-all duration-300" style={{ backgroundColor: '#1A2332', border: '1px solid rgba(0, 255, 135, 0.1)', boxShadow: '0 0 20px rgba(0, 255, 135, 0.1)' }}>
      <div className="flex items-center space-x-2 mb-6">
        <Trophy className="w-6 h-6" style={{ color: '#00FF87' }} />
        <h3 className="text-xl font-bold" style={{ color: '#00FF87', letterSpacing: '-0.02em' }}>Logros y Conquistas</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement) => {
          const status = getAchievementStatus(achievement.requirement);
          const Icon = achievement.icon;
          const progress = Math.min((consecutivePayments / achievement.requirement) * 100, 100);

          return (
            <div
              key={achievement.id}
              className="p-4 rounded-lg border-2 transition-all duration-300"
              style={{
                background: status === "unlocked" ? achievement.color : status === "almost" ? 'rgba(255, 170, 0, 0.1)' : 'rgba(139, 146, 167, 0.05)',
                borderColor: status === "unlocked" ? 'transparent' : status === "almost" ? 'rgba(255, 170, 0, 0.3)' : 'rgba(139, 146, 167, 0.2)',
                color: status === "unlocked" ? '#0A0F1E' : '#FFFFFF',
                opacity: status === "locked" ? 0.6 : 1,
                boxShadow: status === "unlocked" ? '0 0 20px rgba(0, 255, 135, 0.2)' : 'none'
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: status === "unlocked" ? 'rgba(10, 15, 30, 0.2)' : status === "almost" ? 'rgba(255, 170, 0, 0.2)' : 'rgba(139, 146, 167, 0.1)' }}>
                  {status === "unlocked" ? (
                    <Icon className="w-6 h-6" style={{ color: '#0A0F1E' }} />
                  ) : status === "almost" ? (
                    <Icon className="w-6 h-6" style={{ color: '#FFAA00' }} />
                  ) : (
                    <Lock className="w-6 h-6" style={{ color: '#8B92A7' }} />
                  )}
                </div>
                {status === "unlocked" && (
                  <CheckCircle2 className="w-5 h-5" style={{ color: '#0A0F1E' }} />
                )}
              </div>

              <h4 className="font-bold mb-1" style={{ color: status === "unlocked" ? '#0A0F1E' : '#FFFFFF' }}>
                {achievement.name}
              </h4>
              <p className="text-sm mb-3" style={{ color: status === "unlocked" ? 'rgba(10, 15, 30, 0.8)' : '#8B92A7' }}>
                {achievement.description}
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: status === "unlocked" ? 'rgba(10, 15, 30, 0.7)' : '#8B92A7' }}>
                    Requisito: {achievement.requirement} pagos
                  </span>
                  <span className="font-semibold" style={{ color: status === "unlocked" ? '#0A0F1E' : '#FFFFFF' }}>
                    {consecutivePayments} / {achievement.requirement}
                  </span>
                </div>
                <div className="w-full rounded-full h-2" style={{ backgroundColor: status === "unlocked" ? 'rgba(10, 15, 30, 0.2)' : 'rgba(139, 146, 167, 0.1)' }}>
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${progress}%`,
                      backgroundColor: status === "unlocked" ? '#0A0F1E' : status === "almost" ? '#FFAA00' : '#8B92A7'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 rounded-lg backdrop-blur-sm" style={{ backgroundColor: '#131B2E', border: '1px solid rgba(0, 255, 135, 0.2)' }}>
        <p className="text-sm" style={{ color: '#8B92A7' }}>
          <strong style={{ color: '#FFFFFF' }}>Progreso Total:</strong> {consecutivePayments} pagos consecutivos completados
        </p>
      </div>
    </div>
  );
}

