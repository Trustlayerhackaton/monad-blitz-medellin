"use client";

import { Clock, CheckCircle2, Gift, Trophy, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Activity {
  id: string;
  type: "payment" | "reward" | "achievement" | "score";
  title: string;
  description: string;
  timestamp: Date;
  amount?: number;
}

interface ActivityFeedProps {
  isDemoMode?: boolean;
}

export function ActivityFeed({ isDemoMode = false }: ActivityFeedProps) {
  // Datos mock para demo
  const demoActivities: Activity[] = [
    {
      id: "1",
      type: "payment",
      title: "Pago Registrado",
      description: "Pago de $150,000 COP registrado exitosamente",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      amount: 150000,
    },
    {
      id: "2",
      type: "reward",
      title: "Recompensa Recibida",
      description: "Has ganado 50 mMonad por pago puntual",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      amount: 50,
    },
    {
      id: "3",
      type: "achievement",
      title: "Logro Desbloqueado",
      description: "Badge de Oro alcanzado",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: "4",
      type: "score",
      title: "Score Actualizado",
      description: "Tu score aumentó a 850 puntos",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: "5",
      type: "payment",
      title: "Pago Registrado",
      description: "Pago de $200,000 COP registrado exitosamente",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      amount: 200000,
    },
  ];

  const activities = isDemoMode ? demoActivities : [];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "payment":
        return <CheckCircle2 className="w-5 h-5" style={{ color: '#00FF87' }} />;
      case "reward":
        return <Gift className="w-5 h-5" style={{ color: '#00D9FF' }} />;
      case "achievement":
        return <Trophy className="w-5 h-5" style={{ color: '#FFAA00' }} />;
      case "score":
        return <ArrowRight className="w-5 h-5" style={{ color: '#00FF87' }} />;
      default:
        return <Clock className="w-5 h-5" style={{ color: '#8B92A7' }} />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "payment":
        return { bg: "rgba(0, 255, 135, 0.1)", border: "rgba(0, 255, 135, 0.2)" };
      case "reward":
        return { bg: "rgba(0, 217, 255, 0.1)", border: "rgba(0, 217, 255, 0.2)" };
      case "achievement":
        return { bg: "rgba(255, 170, 0, 0.1)", border: "rgba(255, 170, 0, 0.2)" };
      case "score":
        return { bg: "rgba(0, 255, 135, 0.1)", border: "rgba(0, 255, 135, 0.2)" };
      default:
        return { bg: "rgba(139, 146, 167, 0.05)", border: "rgba(139, 146, 167, 0.1)" };
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `Hace ${days} día${days > 1 ? "s" : ""}`;
    if (hours > 0) return `Hace ${hours} hora${hours > 1 ? "s" : ""}`;
    return "Hace unos minutos";
  };

  return (
    <div className="rounded-xl p-6 backdrop-blur-sm transition-all duration-300" style={{ backgroundColor: '#1A2332', border: '1px solid rgba(0, 255, 135, 0.1)', boxShadow: '0 0 20px rgba(0, 255, 135, 0.1)' }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold" style={{ color: '#00FF87', letterSpacing: '-0.02em' }}>Actividad Reciente</h3>
        <Clock className="w-5 h-5" style={{ color: '#8B92A7' }} />
      </div>

      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity, index) => {
            const colors = getActivityColor(activity.type);
            return (
              <div
                key={activity.id}
                className="flex items-start space-x-4 p-4 rounded-lg border transition-all duration-300"
                style={{
                  backgroundColor: colors.bg,
                  borderColor: colors.border
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 255, 135, 0.2)';
                  e.currentTarget.style.borderColor = colors.border.replace('0.2', '0.4');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = colors.border;
                }}
              >
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-semibold" style={{ color: '#FFFFFF' }}>{activity.title}</h4>
                    {activity.amount && (
                      <span className="text-sm font-bold ml-2 whitespace-nowrap" style={{ color: activity.type === "payment" ? '#00FF87' : '#00D9FF' }}>
                        {activity.type === "payment"
                          ? `$${activity.amount.toLocaleString("es-CO")}`
                          : `${activity.amount} mMonad`}
                      </span>
                    )}
                  </div>
                  <p className="text-sm mb-2" style={{ color: '#8B92A7' }}>{activity.description}</p>
                  <p className="text-xs" style={{ color: '#8B92A7', opacity: 0.7 }}>{formatTime(activity.timestamp)}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8" style={{ color: '#8B92A7' }}>
            <Clock className="w-12 h-12 mx-auto mb-2" style={{ color: '#8B92A7', opacity: 0.5 }} />
            <p>No hay actividad reciente</p>
          </div>
        )}
      </div>
    </div>
  );
}

