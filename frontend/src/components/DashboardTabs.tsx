"use client";

import { 
  LayoutDashboard, 
  Gift, 
  CreditCard, 
  Trophy, 
  BarChart3, 
  Activity,
  Home
} from "lucide-react";

interface DashboardTabsProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  badges?: {
    rewards?: number;
    achievements?: number;
    activity?: number;
  };
}

export function DashboardTabs({ children, activeTab, onTabChange, badges = {} }: DashboardTabsProps) {
  const tabs = [
    { id: "overview", label: "Resumen", icon: Home, badge: null },
    { id: "rewards", label: "Recompensas", icon: Gift, badge: badges.rewards },
    { id: "credits", label: "Créditos", icon: CreditCard, badge: null },
    { id: "achievements", label: "Logros", icon: Trophy, badge: badges.achievements },
    { id: "analytics", label: "Estadísticas", icon: BarChart3, badge: null },
    { id: "activity", label: "Actividad", icon: Activity, badge: badges.activity },
  ];

  return (
    <div className="w-full">
      {/* Tabs Navigation Mejorada */}
      <div className="mb-6 rounded-t-lg" style={{ backgroundColor: '#131B2E', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <nav className="flex space-x-1 overflow-x-auto px-2" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="relative flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-all duration-300"
                style={{
                  backgroundColor: isActive ? '#1A2332' : 'transparent',
                  color: isActive ? '#00FF87' : '#8B92A7',
                  borderBottom: isActive ? '2px solid #00FF87' : '2px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#00FF87';
                    e.currentTarget.style.backgroundColor = 'rgba(0, 255, 135, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#8B92A7';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Icon className="w-4 h-4" />
                <span className="whitespace-nowrap">{tab.label}</span>
                {tab.badge !== null && tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full"
                    style={{
                      backgroundColor: isActive ? '#00FF87' : '#ff4444',
                      color: isActive ? '#0A0F1E' : '#FFFFFF',
                    }}
                  >
                    {tab.badge > 9 ? "9+" : tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {children}
      </div>
    </div>
  );
}

