"use client";

import { CreditCard, Shield, TrendingUp, Award } from "lucide-react";

interface NFTCardProps {
  tokenId?: string;
  score: number;
  level: string;
  isDemoMode?: boolean;
}

export function NFTCard({ tokenId, score, level, isDemoMode = false }: NFTCardProps) {
  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "diamante":
        return { gradient: "linear-gradient(135deg, #00FF87 0%, #00D9FF 100%)", glow: "rgba(0, 255, 135, 0.3)" };
      case "platino":
        return { gradient: "linear-gradient(135deg, #00D9FF 0%, #00FF87 100%)", glow: "rgba(0, 217, 255, 0.3)" };
      case "oro":
        return { gradient: "linear-gradient(135deg, #FFAA00 0%, #FF8800 100%)", glow: "rgba(255, 170, 0, 0.3)" };
      case "plata":
        return { gradient: "linear-gradient(135deg, #8B92A7 0%, #6B7280 100%)", glow: "rgba(139, 146, 167, 0.3)" };
      default:
        return { gradient: "linear-gradient(135deg, #FF8800 0%, #FF6600 100%)", glow: "rgba(255, 136, 0, 0.3)" };
    }
  };

  const levelColors = getLevelColor(level);

  return (
    <div 
      className="rounded-xl p-6 backdrop-blur-sm transition-all duration-300"
      style={{ 
        backgroundColor: '#1A2332',
        border: '1px solid rgba(0, 255, 135, 0.1)',
        boxShadow: '0 0 20px rgba(0, 255, 135, 0.1)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0, 255, 135, 0.3)';
        e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 255, 135, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0, 255, 135, 0.1)';
        e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 135, 0.1)';
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <CreditCard className="w-6 h-6" style={{ color: '#00FF87' }} />
          <h3 className="text-lg font-bold" style={{ color: '#FFFFFF', letterSpacing: '-0.02em' }}>Pasaporte Financiero NFT</h3>
        </div>
        <div className="px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(0, 255, 135, 0.1)', border: '1px solid rgba(0, 255, 135, 0.2)' }}>
          <span className="text-xs font-semibold" style={{ color: '#00FF87' }}>#{tokenId || "DEMO"}</span>
        </div>
      </div>

      <div 
        className="rounded-lg p-6 mb-4"
        style={{ 
          background: levelColors.gradient,
          boxShadow: `0 0 20px ${levelColors.glow}`,
          color: '#0A0F1E'
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm mb-1" style={{ opacity: 0.9, color: '#0A0F1E' }}>Nivel Actual</p>
            <p className="text-2xl font-bold" style={{ color: '#0A0F1E' }}>{level}</p>
          </div>
          <Award className="w-10 h-10" style={{ opacity: 0.8, color: '#0A0F1E' }} />
        </div>
        <div className="pt-4" style={{ borderTop: '1px solid rgba(10, 15, 30, 0.2)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs mb-1" style={{ opacity: 0.8, color: '#0A0F1E' }}>Payment Score</p>
              <p className="text-3xl font-bold" style={{ color: '#0A0F1E' }}>{score}</p>
            </div>
            <TrendingUp className="w-8 h-8" style={{ opacity: 0.8, color: '#0A0F1E' }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div 
          className="rounded-lg p-3 backdrop-blur-sm transition-all duration-300"
          style={{ 
            backgroundColor: '#131B2E',
            border: '1px solid rgba(0, 255, 135, 0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0, 255, 135, 0.3)';
            e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 255, 135, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0, 255, 135, 0.1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div className="flex items-center space-x-2 mb-1">
            <Shield className="w-4 h-4" style={{ color: '#00FF87' }} />
            <span className="text-xs font-semibold" style={{ color: '#FFFFFF' }}>Verificado</span>
          </div>
          <p className="text-xs" style={{ color: '#8B92A7' }}>En Blockchain</p>
        </div>
        <div 
          className="rounded-lg p-3 backdrop-blur-sm transition-all duration-300"
          style={{ 
            backgroundColor: '#131B2E',
            border: '1px solid rgba(0, 255, 135, 0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0, 255, 135, 0.3)';
            e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 255, 135, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0, 255, 135, 0.1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div className="flex items-center space-x-2 mb-1">
            <CreditCard className="w-4 h-4" style={{ color: '#00D9FF' }} />
            <span className="text-xs font-semibold" style={{ color: '#FFFFFF' }}>Portátil</span>
          </div>
          <p className="text-xs" style={{ color: '#8B92A7' }}>Multi-plataforma</p>
        </div>
      </div>

      {isDemoMode && (
        <div 
          className="mt-4 p-3 rounded-lg"
          style={{ 
            backgroundColor: '#131B2E',
            border: '1px solid rgba(0, 255, 135, 0.2)',
            borderLeft: '4px solid #00FF87'
          }}
        >
          <p className="text-xs" style={{ color: '#8B92A7' }}>
            <strong style={{ color: '#FFFFFF' }}>Modo Demo:</strong> Conecta tu wallet para ver tu NFT real
          </p>
        </div>
      )}
    </div>
  );
}

