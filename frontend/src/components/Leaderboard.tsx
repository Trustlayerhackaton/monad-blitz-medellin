"use client";

import { Trophy, Medal, Award, TrendingUp, Users } from "lucide-react";

interface LeaderboardUser {
  rank: number;
  address: string;
  score: number;
  consecutivePayments: number;
  rewards: number;
  isCurrentUser?: boolean;
}

interface LeaderboardProps {
  currentUserScore: number;
  currentUserAddress: string;
  isDemoMode?: boolean;
}

export function Leaderboard({
  currentUserScore,
  currentUserAddress,
  isDemoMode = false,
}: LeaderboardProps) {
  // Datos mock para demo
  const demoUsers: LeaderboardUser[] = [
    {
      rank: 1,
      address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      score: 950,
      consecutivePayments: 15,
      rewards: 1250,
      isCurrentUser: true,
    },
    {
      rank: 2,
      address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      score: 920,
      consecutivePayments: 12,
      rewards: 980,
    },
    {
      rank: 3,
      address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
      score: 890,
      consecutivePayments: 10,
      rewards: 850,
    },
    {
      rank: 4,
      address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
      score: 870,
      consecutivePayments: 9,
      rewards: 720,
    },
    {
      rank: 5,
      address: "0x9965507D1a55bcC2695C58ba16FB37d819F0E4DF",
      score: 850,
      consecutivePayments: 8,
      rewards: 650,
    },
  ];

  const users = isDemoMode ? demoUsers : [];
  const averageScore =
    users.length > 0
      ? Math.round(users.reduce((sum, u) => sum + u.score, 0) / users.length)
      : 0;
  const currentUserRank = users.find((u) => u.isCurrentUser)?.rank || 0;
  const percentile = currentUserRank
    ? Math.round(((users.length - currentUserRank + 1) / users.length) * 100)
    : 0;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6" style={{ color: '#00FF87' }} />;
      case 2:
        return <Medal className="w-6 h-6" style={{ color: '#00D9FF' }} />;
      case 3:
        return <Award className="w-6 h-6" style={{ color: '#FFAA00' }} />;
      default:
        return <span className="text-lg font-bold" style={{ color: '#8B92A7' }}>#{rank}</span>;
    }
  };

  return (
    <div className="rounded-xl p-6 backdrop-blur-sm transition-all duration-300" style={{ backgroundColor: '#1A2332', border: '1px solid rgba(0, 255, 135, 0.1)', boxShadow: '0 0 20px rgba(0, 255, 135, 0.1)' }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Users className="w-6 h-6" style={{ color: '#00FF87' }} />
          <h3 className="text-xl font-bold" style={{ color: '#00FF87', letterSpacing: '-0.02em' }}>Ranking Global</h3>
        </div>
        <div className="text-right p-3 rounded-lg" style={{ backgroundColor: '#131B2E', border: '1px solid rgba(0, 255, 135, 0.2)' }}>
          <div className="text-sm mb-1" style={{ color: '#8B92A7' }}>Tu posición</div>
          <div className="text-2xl font-bold" style={{ color: '#00FF87' }}>
            #{currentUserRank || "N/A"}
          </div>
        </div>
      </div>

      {/* Comparativa con promedio */}
      <div className="mb-6 p-4 rounded-lg backdrop-blur-sm" style={{ background: 'linear-gradient(135deg, rgba(0, 255, 135, 0.1) 0%, rgba(0, 217, 255, 0.1) 100%)', border: '1px solid rgba(0, 255, 135, 0.2)' }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm mb-1" style={{ color: '#8B92A7' }}>Tu Score</div>
            <div className="text-2xl font-bold" style={{ color: '#00FF87' }}>
              {currentUserScore}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm mb-1" style={{ color: '#8B92A7' }}>Promedio</div>
            <div className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>{averageScore}</div>
          </div>
          <div className="text-right">
            <div className="text-sm mb-1" style={{ color: '#8B92A7' }}>Percentil</div>
            <div className="text-2xl font-bold" style={{ color: '#00D9FF' }}>
              {percentile}%
              <TrendingUp className="w-4 h-4 inline-block ml-1" />
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div className="flex items-center space-x-2 text-sm">
            {currentUserScore > averageScore ? (
              <>
                <span className="font-semibold" style={{ color: '#00FF87' }}>
                  +{currentUserScore - averageScore} puntos sobre el promedio
                </span>
                <TrendingUp className="w-4 h-4" style={{ color: '#00FF87' }} />
              </>
            ) : (
              <>
                <span className="font-semibold" style={{ color: '#FFAA00' }}>
                  {currentUserScore - averageScore} puntos del promedio
                </span>
                <TrendingUp className="w-4 h-4" style={{ color: '#FFAA00' }} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Lista de ranking */}
      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.rank}
            className="flex items-center justify-between p-4 rounded-lg transition-all duration-300"
            style={{
              background: user.isCurrentUser 
                ? 'linear-gradient(135deg, rgba(0, 255, 135, 0.15) 0%, rgba(0, 217, 255, 0.15) 100%)'
                : '#131B2E',
              border: user.isCurrentUser 
                ? '2px solid rgba(0, 255, 135, 0.4)'
                : '1px solid rgba(139, 146, 167, 0.1)',
              boxShadow: user.isCurrentUser ? '0 0 20px rgba(0, 255, 135, 0.2)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (!user.isCurrentUser) {
                e.currentTarget.style.backgroundColor = 'rgba(0, 255, 135, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(0, 255, 135, 0.2)';
              }
            }}
            onMouseLeave={(e) => {
              if (!user.isCurrentUser) {
                e.currentTarget.style.backgroundColor = '#131B2E';
                e.currentTarget.style.borderColor = 'rgba(139, 146, 167, 0.1)';
              }
            }}
          >
            <div className="flex items-center space-x-4 flex-1">
              <div className="flex-shrink-0">
                {getRankIcon(user.rank)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate flex items-center space-x-2" style={{ color: user.isCurrentUser ? '#00FF87' : '#FFFFFF' }}>
                  <span>
                    {user.isCurrentUser
                      ? "Tú"
                      : `${user.address.slice(0, 6)}...${user.address.slice(-4)}`}
                  </span>
                  {user.isCurrentUser && (
                    <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(0, 255, 135, 0.2)', color: '#00FF87', border: '1px solid rgba(0, 255, 135, 0.3)' }}>
                      Tú
                    </span>
                  )}
                </div>
                <div className="text-sm mt-1" style={{ color: '#8B92A7' }}>
                  {user.consecutivePayments} pagos consecutivos
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold" style={{ color: user.isCurrentUser ? '#00FF87' : '#FFFFFF' }}>
                {user.score}
              </div>
              <div className="text-xs mt-1" style={{ color: '#8B92A7' }}>
                {user.rewards} mMonad
              </div>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-8" style={{ color: '#8B92A7' }}>
          <p>No hay datos de ranking disponibles</p>
        </div>
      )}
    </div>
  );
}

