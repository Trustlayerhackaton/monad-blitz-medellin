"use client";

import { Target, CheckCircle2, Clock, TrendingUp } from "lucide-react";

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  deadline: Date;
  type: "score" | "payments" | "rewards";
}

interface GoalsTrackerProps {
  currentScore: number;
  consecutivePayments: number;
  rewards: number;
  isDemoMode?: boolean;
}

export function GoalsTracker({
  currentScore,
  consecutivePayments,
  rewards,
  isDemoMode = false,
}: GoalsTrackerProps) {
  // Metas demo
  const demoGoals: Goal[] = [
    {
      id: "1",
      title: "Alcanzar Score 900",
      target: 900,
      current: currentScore,
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      type: "score",
    },
    {
      id: "2",
      title: "Completar 10 Pagos Consecutivos",
      target: 10,
      current: consecutivePayments,
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      type: "payments",
    },
    {
      id: "3",
      title: "Acumular 2000 mMonad",
      target: 2000,
      current: rewards,
      deadline: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
      type: "rewards",
    },
  ];

  const goals = isDemoMode ? demoGoals : [];

  const getProgress = (goal: Goal) => {
    return Math.min((goal.current / goal.target) * 100, 100);
  };

  const getDaysRemaining = (deadline: Date) => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="rounded-xl p-6 backdrop-blur-sm transition-all duration-300" style={{ backgroundColor: '#1A2332', border: '1px solid rgba(0, 255, 135, 0.1)', boxShadow: '0 0 20px rgba(0, 255, 135, 0.1)' }}>
      <div className="flex items-center space-x-2 mb-6">
        <Target className="w-6 h-6" style={{ color: '#00FF87' }} />
        <h3 className="text-xl font-bold" style={{ color: '#00FF87', letterSpacing: '-0.02em' }}>Metas y Objetivos</h3>
      </div>

      <div className="space-y-4">
        {goals.map((goal) => {
          const progress = getProgress(goal);
          const daysRemaining = getDaysRemaining(goal.deadline);
          const isCompleted = goal.current >= goal.target;

          return (
            <div
              key={goal.id}
              className="p-4 rounded-lg border-2 transition-all duration-300"
              style={{
                backgroundColor: isCompleted ? 'rgba(0, 255, 135, 0.1)' : '#131B2E',
                borderColor: isCompleted ? 'rgba(0, 255, 135, 0.3)' : 'rgba(139, 146, 167, 0.2)'
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" style={{ color: '#00FF87' }} />
                    ) : (
                      <Clock className="w-5 h-5" style={{ color: '#8B92A7' }} />
                    )}
                    <h4 className="font-semibold" style={{ color: isCompleted ? '#00FF87' : '#FFFFFF' }}>
                      {goal.title}
                    </h4>
                  </div>
                  <div className="flex items-center space-x-4 text-sm ml-7" style={{ color: '#8B92A7' }}>
                    <span>
                      {goal.current} / {goal.target}
                    </span>
                    <span>{daysRemaining} días restantes</span>
                  </div>
                </div>
                {isCompleted && (
                  <span className="px-2 py-1 text-xs font-semibold rounded" style={{ backgroundColor: 'rgba(0, 255, 135, 0.2)', color: '#00FF87', border: '1px solid rgba(0, 255, 135, 0.3)' }}>
                    Completado
                  </span>
                )}
              </div>

              <div className="ml-7">
                <div className="w-full rounded-full h-2 mb-2" style={{ backgroundColor: 'rgba(139, 146, 167, 0.1)' }}>
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${progress}%`,
                      backgroundColor: isCompleted ? '#00FF87' : progress > 75 ? '#00D9FF' : progress > 50 ? '#FFAA00' : '#ff4444',
                      boxShadow: isCompleted ? '0 0 10px rgba(0, 255, 135, 0.3)' : 'none'
                    }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: '#8B92A7' }}>{Math.round(progress)}% completado</span>
                  {!isCompleted && (
                    <span style={{ color: '#8B92A7' }}>
                      Faltan {goal.target - goal.current} para completar
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button 
        className="w-full mt-4 px-4 py-2 rounded-lg transition-all duration-300 font-semibold text-sm"
        style={{
          backgroundColor: 'transparent',
          border: '1px solid #00FF87',
          color: '#00FF87'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0, 255, 135, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        + Crear Nueva Meta
      </button>
    </div>
  );
}

