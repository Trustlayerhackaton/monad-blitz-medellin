"use client";

import { Bell, CheckCircle2, Gift, Trophy, AlertCircle, X } from "lucide-react";
import { useState, useEffect } from "react";

interface Notification {
  id: string;
  type: "achievement" | "reward" | "payment" | "warning";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationsPanelProps {
  isDemoMode?: boolean;
}

export function NotificationsPanel({ isDemoMode = false }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isDemoMode) {
      // Notificaciones mock para demo
      const demoNotifications: Notification[] = [
        {
          id: "1",
          type: "achievement",
          title: "¡Logro Desbloqueado!",
          message: "Has alcanzado el Badge de Oro con un score de 950",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: false,
        },
        {
          id: "2",
          type: "reward",
          title: "Recompensa Recibida",
          message: "Has ganado 50 mMonad por tu pago puntual",
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          read: false,
        },
        {
          id: "3",
          type: "payment",
          title: "Pago Registrado",
          message: "Tu pago de $150,000 COP ha sido registrado exitosamente",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          read: true,
        },
        {
          id: "4",
          type: "achievement",
          title: "Nueva Racha",
          message: "¡Felicidades! Has completado 15 pagos consecutivos",
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          read: true,
        },
      ];
      setNotifications(demoNotifications);
    }
  }, [isDemoMode]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "achievement":
        return <Trophy className="w-5 h-5" style={{ color: '#00FF87' }} />;
      case "reward":
        return <Gift className="w-5 h-5" style={{ color: '#00FF87' }} />;
      case "payment":
        return <CheckCircle2 className="w-5 h-5" style={{ color: '#00D9FF' }} />;
      case "warning":
        return <AlertCircle className="w-5 h-5" style={{ color: '#ffaa00' }} />;
      default:
        return <Bell className="w-5 h-5" style={{ color: '#8B92A7' }} />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
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
    <>
      {/* Botón de notificaciones compacto para header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg transition-all duration-300"
        style={{ color: '#8B92A7' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#00FF87';
          e.currentTarget.style.backgroundColor = 'rgba(0, 255, 135, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#8B92A7';
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
        title="Notificaciones"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center" style={{ backgroundColor: '#ff4444', color: '#FFFFFF' }}>
            {unreadCount}
          </span>
        )}
      </button>

      {/* Panel de notificaciones */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 rounded-xl z-50 max-h-96 overflow-hidden backdrop-blur-sm" style={{ backgroundColor: '#1A2332', border: '1px solid rgba(0, 255, 135, 0.2)', boxShadow: '0 0 30px rgba(0, 255, 135, 0.2)' }}>
          <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <h3 className="text-lg font-bold" style={{ color: '#00FF87', letterSpacing: '-0.02em' }}>Notificaciones</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="transition-all duration-300"
              style={{ color: '#8B92A7' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#00FF87';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#8B92A7';
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="overflow-y-auto max-h-80">
            {notifications.length > 0 ? (
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 transition-all duration-300 cursor-pointer"
                    style={{ 
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      backgroundColor: !notification.read ? 'rgba(0, 255, 135, 0.05)' : 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 255, 135, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = !notification.read ? 'rgba(0, 255, 135, 0.05)' : 'transparent';
                    }}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p
                              className="text-sm font-semibold"
                              style={{ color: !notification.read ? '#FFFFFF' : '#8B92A7' }}
                            >
                              {notification.title}
                            </p>
                            <p className="text-sm mt-1" style={{ color: '#8B92A7' }}>
                              {notification.message}
                            </p>
                            <p className="text-xs mt-2" style={{ color: '#8B92A7' }}>
                              {formatTime(notification.timestamp)}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full flex-shrink-0 ml-2" style={{ backgroundColor: '#00FF87' }}></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center" style={{ color: '#8B92A7' }}>
                <Bell className="w-12 h-12 mx-auto mb-2" style={{ color: '#8B92A7', opacity: 0.5 }} />
                <p>No hay notificaciones</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

