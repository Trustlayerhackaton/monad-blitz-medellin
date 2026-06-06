# Component Library Reference — Trustlayer UI

## Table of Contents
1. [NFT Passport Card](#1-nft-passport-card)
2. [Payment Score Ring](#2-payment-score-ring)
3. [CTA Buttons](#3-cta-buttons)
4. [Level Badge](#4-level-badge)
5. [Stat Card](#5-stat-card)
6. [Dashboard Tab Nav](#6-dashboard-tab-nav)
7. [AI Chat Bubble](#7-ai-chat-bubble)
8. [Wallet Connect Button](#8-wallet-connect-button)
9. [Transaction State Indicator](#9-transaction-state-indicator)
10. [Empty State](#10-empty-state)
11. [Skeleton Loaders](#11-skeleton-loaders)

---

## 1. NFT Passport Card

```tsx
// NFTPassportCard.tsx
interface NFTPassportCardProps {
  address: string;
  score: number;
  level: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  consecutivePayments: number;
  tokenId?: string;
  loading?: boolean;
}

const LEVEL_COLORS = {
  bronze:   '#CD7F32',
  silver:   '#C0C0C0',
  gold:     '#FFD700',
  platinum: '#E5E4E2',
  diamond:  '#B9F2FF',
};

export function NFTPassportCard({ address, score, level, consecutivePayments, tokenId, loading }: NFTPassportCardProps) {
  const levelColor = LEVEL_COLORS[level];
  
  if (loading) return <NFTPassportCardSkeleton />;

  return (
    <div className="relative group">
      {/* Animated glow border */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(135deg, ${levelColor}33, #7C3AED33)`, filter: 'blur(1px)' }}
      />
      
      <div
        className="relative rounded-2xl p-6 backdrop-blur-xl transition-transform duration-300 group-hover:-translate-y-1"
        style={{
          background: 'rgba(17,17,24,0.9)',
          border: `1px solid ${levelColor}40`,
          boxShadow: `0 4px 24px rgba(0,0,0,0.4), 0 0 40px ${levelColor}20`,
        }}
      >
        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-400">TRUSTLAYER</span>
            {tokenId && (
              <span className="text-xs font-mono text-gray-600">#{tokenId}</span>
            )}
          </div>
          <LevelBadge level={level} />
        </div>

        {/* Score display */}
        <div className="text-center my-6">
          <p className="text-gray-400 text-sm mb-1">Payment Score</p>
          <p
            className="font-mono font-black text-6xl tracking-tight"
            style={{ color: levelColor, textShadow: `0 0 30px ${levelColor}60` }}
          >
            {score}
          </p>
          <p className="text-gray-500 text-xs mt-1">/ 1000</p>
        </div>

        {/* Streak */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-amber-400 text-sm">🔥</span>
          <span className="text-gray-300 text-sm font-medium">
            {consecutivePayments} pagos consecutivos
          </span>
        </div>

        {/* Wallet address */}
        <div
          className="rounded-lg px-3 py-2 text-center"
          style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)' }}
        >
          <p className="font-mono text-xs text-gray-400">
            {address.slice(0, 6)}...{address.slice(-4)}
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

## 2. Payment Score Ring

```tsx
// ScoreRing.tsx
interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  animate?: boolean;
}

function getScoreColor(score: number): string {
  if (score >= 750) return '#FFD700';
  if (score >= 600) return '#A855F7';
  if (score >= 400) return '#F59E0B';
  return '#EF4444';
}

export function ScoreRing({ score, size = 200, strokeWidth = 12, animate = true }: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 1000) * circumference;
  const color = getScoreColor(score);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke="rgba(124,58,237,0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          style={{
            transition: animate ? 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
            filter: `drop-shadow(0 0 8px ${color}80)`,
          }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-mono font-black text-4xl"
          style={{ color, textShadow: `0 0 20px ${color}60` }}
        >
          {score}
        </span>
        <span className="text-gray-500 text-xs">score</span>
      </div>
    </div>
  );
}
```

---

## 3. CTA Buttons

```tsx
// Button.tsx
type ButtonVariant = 'primary' | 'gold' | 'ghost' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-violet-600 to-purple-500 text-white hover:brightness-110',
  gold:    'bg-gradient-to-r from-amber-500 to-yellow-400 text-gray-900 hover:brightness-110',
  ghost:   'bg-transparent border border-violet-500/50 text-violet-400 hover:border-violet-400 hover:text-violet-300',
  danger:  'bg-transparent border border-red-500/50 text-red-400 hover:bg-red-500/10',
};

export function Button({ variant = 'primary', loading, icon, fullWidth, children, disabled, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        px-6 py-3 rounded-full font-semibold text-sm
        transition-all duration-200
        hover:scale-[1.02] active:scale-[0.98]
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
        ${fullWidth ? 'w-full' : ''}
        ${VARIANT_STYLES[variant]}
        ${props.className ?? ''}
      `}
      style={{ boxShadow: !disabled && variant === 'primary' ? '0 0 20px rgba(124,58,237,0.3)' : undefined }}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      ) : icon}
      {children}
    </button>
  );
}
```

---

## 4. Level Badge

```tsx
// LevelBadge.tsx
type Level = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

const LEVEL_CONFIG: Record<Level, { color: string; label: string; emoji: string }> = {
  bronze:   { color: '#CD7F32', label: 'BRONCE',   emoji: '🥉' },
  silver:   { color: '#C0C0C0', label: 'PLATA',    emoji: '🥈' },
  gold:     { color: '#FFD700', label: 'ORO',      emoji: '🥇' },
  platinum: { color: '#E5E4E2', label: 'PLATINO',  emoji: '💎' },
  diamond:  { color: '#B9F2FF', label: 'DIAMANTE', emoji: '💠' },
};

export function LevelBadge({ level }: { level: Level }) {
  const { color, label, emoji } = LEVEL_CONFIG[level];
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold tracking-wider uppercase"
      style={{
        color,
        background: `${color}18`,
        border: `1px solid ${color}50`,
        textShadow: `0 0 10px ${color}60`,
      }}
    >
      {emoji} {label}
    </span>
  );
}
```

---

## 5. Stat Card

```tsx
// StatCard.tsx
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  delta?: { value: string; positive: boolean };
  loading?: boolean;
}

export function StatCard({ label, value, icon, delta, loading }: StatCardProps) {
  if (loading) return <div className="rounded-2xl bg-[#111118] border border-purple-900/20 p-6 h-28 animate-pulse" />;
  
  return (
    <div
      className="rounded-2xl p-6 transition-colors duration-200 hover:bg-[#1A1A24]"
      style={{
        background: '#111118',
        border: '1px solid rgba(124,58,237,0.15)',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-lg" style={{ background: 'rgba(124,58,237,0.1)' }}>
          <span className="text-violet-400">{icon}</span>
        </div>
        {delta && (
          <span className={`text-xs font-medium ${delta.positive ? 'text-emerald-400' : 'text-red-400'}`}>
            {delta.positive ? '▲' : '▼'} {delta.value}
          </span>
        )}
      </div>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}
```

---

## 6. Dashboard Tab Nav

```tsx
// DashboardTabs.tsx
const TABS = [
  { id: 'overview',    label: 'Resumen',    icon: '📊' },
  { id: 'nft',         label: 'NFT',        icon: '🎫' },
  { id: 'rewards',     label: 'Recompensas',icon: '🏆' },
  { id: 'ai',          label: 'Asistente',  icon: '🤖' },
  { id: 'leaderboard', label: 'Ranking',    icon: '🥇' },
  { id: 'analytics',   label: 'Análisis',   icon: '📈' },
  { id: 'credit',      label: 'Crédito',    icon: '💳' },
];

export function DashboardTabs({ active, onChange }: { active: string; onChange: (id: string) => void }) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide border-b border-purple-900/20">
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`
            flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap
            transition-all duration-200 border-b-2 -mb-px
            ${active === tab.id
              ? 'border-violet-500 text-white'
              : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-violet-800'
            }
          `}
        >
          <span>{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
```

---

## 7. AI Chat Bubble

```tsx
// ChatBubble.tsx
interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export function ChatBubble({ role, content, timestamp }: ChatBubbleProps) {
  const isUser = role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`
          max-w-[75%] px-4 py-3 text-sm leading-relaxed
          ${isUser
            ? 'bg-gradient-to-br from-violet-600 to-purple-600 text-white rounded-2xl rounded-br-sm'
            : 'text-gray-200 rounded-2xl rounded-bl-sm'
          }
        `}
        style={!isUser ? { background: '#1A1A24', border: '1px solid rgba(124,58,237,0.2)' } : undefined}
      >
        {content}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex justify-start mb-3">
      <div className="px-4 py-3 rounded-2xl rounded-bl-sm" style={{ background: '#1A1A24', border: '1px solid rgba(124,58,237,0.2)' }}>
        <div className="flex gap-1.5 items-center h-4">
          {[0,1,2].map(i => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## 8. Wallet Connect Button

```tsx
// WalletConnectButton.tsx
// Uses wagmi v2: import { useAccount, useConnect, useDisconnect } from 'wagmi'

export function WalletConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <button
        onClick={() => disconnect()}
        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors duration-200"
        style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981' }}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        {address.slice(0,6)}...{address.slice(-4)}
      </button>
    );
  }

  return (
    <Button variant="primary" onClick={() => connect({ connector: connectors[0] })}>
      Conectar Wallet
    </Button>
  );
}
```

---

## 9. Transaction State Indicator

```tsx
// TxState.tsx — for blockchain confirmation feedback
type TxStatus = 'idle' | 'pending' | 'confirming' | 'confirmed' | 'failed';

const TX_STEPS = ['Enviado', 'Pendiente', 'Confirmado'];

export function TxStateIndicator({ status, txHash }: { status: TxStatus; txHash?: string }) {
  const stepIndex = { idle: -1, pending: 0, confirming: 1, confirmed: 2, failed: -1 }[status];
  
  if (status === 'idle') return null;
  
  return (
    <div className="rounded-xl p-4" style={{ background: '#111118', border: '1px solid rgba(124,58,237,0.2)' }}>
      <div className="flex items-center gap-3 mb-3">
        {status === 'failed' ? (
          <span className="text-red-400 text-sm font-medium">❌ Transacción fallida</span>
        ) : status === 'confirmed' ? (
          <span className="text-emerald-400 text-sm font-medium">✅ Confirmado en Monad</span>
        ) : (
          <span className="text-violet-300 text-sm font-medium animate-pulse">⏳ Confirmando en Monad...</span>
        )}
      </div>
      
      {status !== 'failed' && (
        <div className="flex items-center gap-2">
          {TX_STEPS.map((step, i) => (
            <React.Fragment key={step}>
              <div className={`flex items-center gap-1.5 ${i <= stepIndex ? 'text-violet-400' : 'text-gray-600'}`}>
                <span className={`w-2 h-2 rounded-full ${i < stepIndex ? 'bg-emerald-400' : i === stepIndex ? 'bg-violet-400 animate-pulse' : 'bg-gray-700'}`} />
                <span className="text-xs">{step}</span>
              </div>
              {i < TX_STEPS.length - 1 && (
                <div className={`flex-1 h-px ${i < stepIndex ? 'bg-violet-600' : 'bg-gray-700'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
      
      {txHash && (
        <a
          href={`https://testnet.monadexplorer.com/tx/${txHash}`}
          target="_blank" rel="noopener noreferrer"
          className="mt-2 inline-block text-xs text-violet-400 hover:text-violet-300 underline underline-offset-2"
        >
          Ver en Monad Explorer →
        </a>
      )}
    </div>
  );
}
```

---

## 10. Empty State

```tsx
// EmptyState.tsx
interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void; variant?: ButtonVariant };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4"
        style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}
      >
        {icon}
      </div>
      <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-400 text-sm max-w-xs mb-6">{description}</p>
      {action && (
        <Button variant={action.variant ?? 'primary'} onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Usage examples:
// No wallet: <EmptyState icon="🔌" title="Wallet no conectada" description="Conecta tu wallet para ver tu pasaporte financiero" action={{ label: 'Conectar Wallet', onClick: openWalletModal }} />
// No NFT:    <EmptyState icon="🎫" title="Sin NFT aún" description="Crea tu pasaporte financiero digital para comenzar" action={{ label: 'Crear Pasaporte', onClick: mintNFT }} />
```

---

## 11. Skeleton Loaders

```tsx
// Skeleton.tsx
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg ${className}`}
      style={{ background: 'rgba(124,58,237,0.08)' }}
    />
  );
}

export function NFTPassportCardSkeleton() {
  return (
    <div className="rounded-2xl p-6" style={{ background: '#111118', border: '1px solid rgba(124,58,237,0.1)' }}>
      <div className="flex justify-between mb-6">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="flex justify-center my-6">
        <Skeleton className="h-16 w-32 rounded-lg" />
      </div>
      <Skeleton className="h-4 w-40 mx-auto mb-4" />
      <Skeleton className="h-9 w-full rounded-lg" />
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl p-6" style={{ background: '#111118' }}>
      <Skeleton className="h-8 w-8 rounded-lg mb-3" />
      <Skeleton className="h-3 w-24 mb-2" />
      <Skeleton className="h-7 w-20" />
    </div>
  );
}
```
