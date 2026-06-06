"use client";

import { Shield, Award, TrendingUp, Star, Sparkles } from "lucide-react";

interface ReputationNFTProps {
  score: number;
  level: string;
  consecutivePayments: number;
  tokenId?: string;
  isDemoMode?: boolean;
}

export function ReputationNFT({
  score,
  level,
  consecutivePayments,
  tokenId,
  isDemoMode = false,
}: ReputationNFTProps) {
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

  const getLevelIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case "diamante":
        return <Sparkles className="w-12 h-12" />;
      case "platino":
        return <Star className="w-12 h-12" />;
      case "oro":
        return <Award className="w-12 h-12" />;
      default:
        return <Shield className="w-12 h-12" />;
    }
  };

  const levelColors = getLevelColor(level);

  return (
    <div className="rounded-xl p-6 backdrop-blur-sm transition-all duration-300 overflow-hidden relative" style={{ backgroundColor: '#1A2332', border: '1px solid rgba(0, 255, 135, 0.1)', boxShadow: '0 0 20px rgba(0, 255, 135, 0.1)' }}>
      {/* Efectos de fondo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl" style={{ background: 'linear-gradient(135deg, #00FF87 0%, #00D9FF 100%)' }}></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl" style={{ background: 'linear-gradient(135deg, #00D9FF 0%, #00FF87 100%)' }}></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6" style={{ color: '#00FF87' }} />
            <h3 className="text-xl font-bold" style={{ color: '#00FF87', letterSpacing: '-0.02em' }}>NFT de Reputación</h3>
          </div>
          {tokenId && (
            <div className="px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(0, 255, 135, 0.1)', border: '1px solid rgba(0, 255, 135, 0.2)' }}>
              <span className="text-xs font-semibold" style={{ color: '#00FF87' }}>#{tokenId}</span>
            </div>
          )}
        </div>

        {/* NFT Card Principal */}
        <div 
          className="rounded-xl p-8 mb-4 transform transition-all duration-300"
          style={{ 
            background: levelColors.gradient,
            boxShadow: `0 0 30px ${levelColors.glow}`,
            color: '#0A0F1E'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = `0 0 40px ${levelColors.glow}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = `0 0 30px ${levelColors.glow}`;
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm opacity-90 mb-1">Nivel de Reputación</p>
              <p className="text-3xl font-bold">{level}</p>
            </div>
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full">
              {getLevelIcon(level)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <p className="text-xs opacity-80 mb-1">Payment Score</p>
              <p className="text-2xl font-bold">{score}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <p className="text-xs opacity-80 mb-1">Racha de Pagos</p>
              <p className="text-2xl font-bold">{consecutivePayments}</p>
            </div>
          </div>

          <div className="pt-4" style={{ borderTop: '1px solid rgba(10, 15, 30, 0.2)' }}>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" style={{ opacity: 0.8, color: '#0A0F1E' }} />
              <p className="text-sm" style={{ opacity: 0.9, color: '#0A0F1E' }}>Pasaporte Financiero Verificado</p>
            </div>
          </div>
        </div>

        {/* Información Adicional */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg p-3 backdrop-blur-sm" style={{ backgroundColor: '#131B2E', border: '1px solid rgba(0, 255, 135, 0.1)' }}>
            <div className="flex items-center space-x-2 mb-1">
              <Shield className="w-4 h-4" style={{ color: '#00FF87' }} />
              <span className="text-xs font-semibold" style={{ color: '#FFFFFF' }}>Verificado</span>
            </div>
            <p className="text-xs" style={{ color: '#8B92A7' }}>En Blockchain</p>
          </div>
          <div className="rounded-lg p-3 backdrop-blur-sm" style={{ backgroundColor: '#131B2E', border: '1px solid rgba(0, 217, 255, 0.1)' }}>
            <div className="flex items-center space-x-2 mb-1">
              <Award className="w-4 h-4" style={{ color: '#00D9FF' }} />
              <span className="text-xs font-semibold" style={{ color: '#FFFFFF' }}>Portátil</span>
            </div>
            <p className="text-xs" style={{ color: '#8B92A7' }}>Multi-plataforma</p>
          </div>
        </div>

        {isDemoMode && (
          <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: '#131B2E', border: '1px solid rgba(255, 170, 0, 0.2)', borderLeft: '4px solid #FFAA00' }}>
            <p className="text-xs" style={{ color: '#8B92A7' }}>
              <strong style={{ color: '#FFFFFF' }}>Modo Demo:</strong> Conecta tu wallet para ver tu NFT real
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

