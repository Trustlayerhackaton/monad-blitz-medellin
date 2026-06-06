"use client";

import { Zap, CreditCard, Download, Settings, HelpCircle, Bell } from "lucide-react";

interface QuickActionsProps {
  isDemoMode?: boolean;
}

export function QuickActions({ isDemoMode = false }: QuickActionsProps) {
  const actions = [
    {
      icon: CreditCard,
      label: "Registrar Pago",
      gradient: "linear-gradient(135deg, #00FF87 0%, #00D9FF 100%)",
      onClick: () => {
        // Acción para registrar pago
        alert("Función de registrar pago próximamente");
      },
    },
    {
      icon: Download,
      label: "Exportar Reporte",
      gradient: "linear-gradient(135deg, #00D9FF 0%, #00FF87 100%)",
      onClick: () => {
        // Acción para exportar
        alert("Función de exportar reporte próximamente");
      },
    },
    {
      icon: Bell,
      label: "Configurar Alertas",
      gradient: "linear-gradient(135deg, #FFAA00 0%, #FF8800 100%)",
      onClick: () => {
        // Acción para configurar alertas
        alert("Función de configurar alertas próximamente");
      },
    },
    {
      icon: HelpCircle,
      label: "Centro de Ayuda",
      gradient: "linear-gradient(135deg, #00FF87 0%, #00D9FF 100%)",
      onClick: () => {
        // Acción para ayuda
        alert("Función de centro de ayuda próximamente");
      },
    },
  ];

  return (
    <div className="rounded-xl p-6 backdrop-blur-sm transition-all duration-300" style={{ backgroundColor: '#1A2332', border: '1px solid rgba(0, 255, 135, 0.1)', boxShadow: '0 0 20px rgba(0, 255, 135, 0.1)' }}>
      <div className="flex items-center space-x-2 mb-6">
        <Zap className="w-6 h-6" style={{ color: '#00FF87' }} />
        <h3 className="text-xl font-bold" style={{ color: '#00FF87', letterSpacing: '-0.02em' }}>Acciones Rápidas</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.onClick}
              className="p-4 rounded-lg transition-all duration-300 flex flex-col items-center space-y-2"
              style={{ 
                background: action.gradient,
                color: '#0A0F1E',
                boxShadow: '0 4px 15px rgba(0, 255, 135, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 6px 25px rgba(0, 255, 135, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 255, 135, 0.2)';
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
              }}
            >
              <Icon className="w-6 h-6" />
              <span className="text-sm font-semibold">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

