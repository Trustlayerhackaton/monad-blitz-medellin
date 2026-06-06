"use client";

import { Lightbulb, ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";

interface RecommendedActionsProps {
  score: number;
  level: string;
  consecutivePayments: number;
  isDemoMode?: boolean;
}

export function RecommendedActions({
  score,
  level,
  consecutivePayments,
  isDemoMode = false,
}: RecommendedActionsProps) {
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());

  const getRecommendedActions = () => {
    const actions = [];

    // Acción basada en pagos consecutivos
    if (consecutivePayments < 5) {
      actions.push({
        id: "complete-5-payments",
        title: "Completa 5 pagos consecutivos",
        description: `Tienes ${consecutivePayments} pagos. Completa ${5 - consecutivePayments} más para obtener tu primer bonus de racha.`,
        priority: "high",
        reward: "+50 mMonad",
        icon: "🎯",
      });
    } else if (consecutivePayments < 10) {
      actions.push({
        id: "reach-10-payments",
        title: "Alcanza 10 pagos consecutivos",
        description: `Estás a ${10 - consecutivePayments} pagos de alcanzar el hito de 10 pagos consecutivos.`,
        priority: "high",
        reward: "+100 mMonad",
        icon: "🔥",
      });
    }

    // Acción basada en score
    if (score < 600) {
      actions.push({
        id: "reach-silver",
        title: "Alcanza Nivel Plata",
        description: `Tu score es ${score}. Necesitas ${600 - score} puntos más para alcanzar el nivel Plata.`,
        priority: "medium",
        reward: "Desbloquea nuevas recompensas",
        icon: "⭐",
      });
    } else if (score < 750) {
      actions.push({
        id: "reach-gold",
        title: "Alcanza Nivel Oro",
        description: `Tu score es ${score}. Necesitas ${750 - score} puntos más para alcanzar el nivel Oro.`,
        priority: "medium",
        reward: "Mejores tasas de crédito",
        icon: "🏆",
      });
    }

    // Acción basada en recompensas
    actions.push({
      id: "claim-rewards",
      title: "Revisa tus recompensas disponibles",
      description: "Tienes recompensas acumuladas que puedes reclamar.",
      priority: "low",
      reward: "Ver detalles",
      icon: "💰",
    });

    return actions;
  };

  const actions = getRecommendedActions();

  const toggleAction = (actionId: string) => {
    const newCompleted = new Set(completedActions);
    if (newCompleted.has(actionId)) {
      newCompleted.delete(actionId);
    } else {
      newCompleted.add(actionId);
    }
    setCompletedActions(newCompleted);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return {
          border: "rgba(255, 68, 68, 0.3)",
          background: "rgba(255, 68, 68, 0.05)",
        };
      case "medium":
        return {
          border: "rgba(255, 170, 0, 0.3)",
          background: "rgba(255, 170, 0, 0.05)",
        };
      default:
        return {
          border: "rgba(0, 255, 135, 0.2)",
          background: "rgba(0, 255, 135, 0.05)",
        };
    }
  };

  return (
    <div className="rounded-xl p-6 backdrop-blur-sm transition-all duration-300" style={{ backgroundColor: '#1A2332', border: '1px solid rgba(0, 255, 135, 0.1)', boxShadow: '0 0 20px rgba(0, 255, 135, 0.1)' }}>
      <div className="flex items-center space-x-2 mb-6">
        <Lightbulb className="w-6 h-6" style={{ color: '#00FF87' }} />
        <h3 className="text-xl font-bold" style={{ color: '#00FF87', letterSpacing: '-0.02em' }}>Acciones Recomendadas</h3>
      </div>

      {actions.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-3" style={{ color: '#00FF87' }} />
          <p className="font-medium" style={{ color: '#FFFFFF' }}>¡Excelente trabajo!</p>
          <p className="text-sm mt-1" style={{ color: '#8B92A7' }}>
            Has completado todas las acciones recomendadas.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {actions.map((action) => {
            const isCompleted = completedActions.has(action.id);
            const priorityColors = getPriorityColor(action.priority);
            return (
              <div
                key={action.id}
                className="rounded-lg p-4 transition-all duration-300"
                style={{
                  border: `1px solid ${isCompleted ? 'rgba(0, 255, 135, 0.3)' : priorityColors.border}`,
                  backgroundColor: isCompleted ? 'rgba(0, 255, 135, 0.05)' : priorityColors.background,
                  opacity: isCompleted ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isCompleted) {
                    e.currentTarget.style.borderColor = priorityColors.border.replace('0.3', '0.5');
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 255, 135, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCompleted) {
                    e.currentTarget.style.borderColor = priorityColors.border;
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-2xl">{action.icon}</span>
                      <h4
                        className="font-semibold"
                        style={{
                          textDecoration: isCompleted ? 'line-through' : 'none',
                          color: isCompleted ? '#8B92A7' : '#FFFFFF'
                        }}
                      >
                        {action.title}
                      </h4>
                    </div>
                    <p
                      className="text-sm mb-2"
                      style={{ color: isCompleted ? '#8B92A7' : '#8B92A7' }}
                    >
                      {action.description}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold px-2 py-1 rounded" style={{ color: '#00FF87', backgroundColor: 'rgba(0, 255, 135, 0.1)' }}>
                        {action.reward}
                      </span>
                      {action.priority === "high" && (
                        <span className="text-xs font-semibold px-2 py-1 rounded" style={{ color: '#ff4444', backgroundColor: 'rgba(255, 68, 68, 0.1)' }}>
                          Alta Prioridad
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleAction(action.id)}
                    className="ml-4 p-2 rounded-lg transition-all duration-300"
                    style={{
                      backgroundColor: isCompleted ? 'rgba(0, 255, 135, 0.1)' : 'rgba(139, 146, 167, 0.1)',
                      color: isCompleted ? '#00FF87' : '#8B92A7',
                      border: `1px solid ${isCompleted ? 'rgba(0, 255, 135, 0.2)' : 'rgba(139, 146, 167, 0.1)'}`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isCompleted ? 'rgba(0, 255, 135, 0.2)' : 'rgba(0, 255, 135, 0.1)';
                      e.currentTarget.style.borderColor = 'rgba(0, 255, 135, 0.3)';
                      e.currentTarget.style.color = '#00FF87';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isCompleted ? 'rgba(0, 255, 135, 0.1)' : 'rgba(139, 146, 167, 0.1)';
                      e.currentTarget.style.borderColor = isCompleted ? 'rgba(0, 255, 135, 0.2)' : 'rgba(139, 146, 167, 0.1)';
                      e.currentTarget.style.color = isCompleted ? '#00FF87' : '#8B92A7';
                    }}
                    title={isCompleted ? "Marcar como pendiente" : "Marcar como completada"}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-6 pt-4" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <button 
          className="w-full flex items-center justify-center space-x-2 font-medium transition-all duration-300"
          style={{ color: '#00FF87' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#00D9FF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#00FF87';
          }}
        >
          <span>Ver todas las acciones</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

