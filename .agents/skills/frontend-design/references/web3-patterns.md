# Web3 UX Patterns — Trustlayer

Patterns specific to blockchain interactions, wallet flows, and DeFi UX conventions.

---

## 1. Wallet Connection Flow

### Full State Machine
```
Not connected
  → User clicks "Conectar Wallet"
  → Modal opens: list of providers
  → User selects MetaMask
  → MetaMask popup appears (browser handles)
  → [pending] "Aprobando en MetaMask..."
  → [success] Pill changes to green + truncated address
  → [error]   Red inline error + "Intentar de nuevo" CTA

Connected
  → Wrong network (not Monad)
    → Yellow banner: "Cambia a Monad Testnet"
    → "Cambiar red" button → triggers addChain/switchChain
  → Right network
    → Normal dashboard state
```

### Network Config (Monad Testnet)
```ts
export const monadTestnet = {
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.monad.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: 'https://testnet.monadexplorer.com' },
  },
  testnet: true,
};
```

### Network Switcher Banner
Show this non-intrusively at top of dashboard if `chainId !== 10143`:
```
⚠️ Estás en la red incorrecta · [Cambiar a Monad Testnet]
```
Color: amber background `rgba(245,158,11,0.1)`, border `rgba(245,158,11,0.3)`

---

## 2. Transaction Lifecycle UX

### Four States to Handle for Every Transaction

| State | UX Treatment |
|-------|-------------|
| `idle` | Normal button state |
| `pending` (user signing) | Button loading + "Aprobando en MetaMask..." |
| `confirming` (on-chain) | TxStateIndicator component with step progress |
| `confirmed` | Success toast or modal (depends on importance) |
| `failed` | Error with reason + retry CTA |

### When to Use Toast vs Modal for Confirmation
- **Toast** (4s auto-dismiss): minor actions (profile update, settings change)
- **Modal celebration**: level-up, first NFT mint, milestone achievements
- **Inline state**: payments registered, reward claims

### Toast Design
```tsx
// Success toast
{
  background: 'rgba(16,185,129,0.1)',
  border: '1px solid rgba(16,185,129,0.3)',
  icon: '✅',
  text: 'Pago registrado exitosamente',
  subtext: 'Tu score ha aumentado +15 puntos',
}

// Error toast
{
  background: 'rgba(239,68,68,0.1)',
  border: '1px solid rgba(239,68,68,0.3)',
  icon: '❌',
  text: 'Transacción fallida',
  subtext: 'Insufficient funds for gas',
  action: { label: 'Reintentar', onClick: retry },
}
```

---

## 3. Gas & Error Handling

### Common Errors and Human-Readable Messages
```ts
const ERROR_MESSAGES: Record<string, string> = {
  'insufficient funds':     'No tienes suficiente MON para el gas. Obtén MON en el faucet.',
  'user rejected':          'Rechazaste la transacción en MetaMask.',
  'execution reverted':     'El contrato rechazó la transacción. Intenta de nuevo.',
  'network error':          'Error de red. Revisa tu conexión.',
  'nonce too low':          'Error de nonce. Recarga la página e intenta de nuevo.',
  'replacement underpriced':'Transacción duplicada. Espera a que la anterior confirme.',
};

function parseError(error: Error): string {
  for (const [key, message] of Object.entries(ERROR_MESSAGES)) {
    if (error.message.toLowerCase().includes(key)) return message;
  }
  return 'Error desconocido. Intenta de nuevo.';
}
```

### Faucet CTA
When user has insufficient MON balance, show:
```
💧 Necesitas MON para las transacciones
[Obtener MON en el faucet] → links to Alchemy/QuickNode faucet
```

---

## 4. NFT Minting Flow

```
Step 1: Check if user already has NFT
  → If yes: redirect to NFT tab
  → If no: show "Crear Pasaporte" CTA

Step 2: Pre-mint preview
  Show a preview of what their NFT will look like (score: 0, level: bronze)
  CTA: "Crear mi Pasaporte Financiero" (primary button)

Step 3: Mint transaction
  → Pending: animated NFT card with shimmer + "Creando tu pasaporte..."
  → Confirmed: celebration modal (see below)

Step 4: Celebration Modal
  - Full-screen overlay (backdrop-blur)
  - Confetti animation (use canvas-confetti)
  - Large NFT card reveal with entrance animation
  - Copy: "¡Tu pasaporte financiero ha sido creado! 🎉"
  - Sub-copy: "Comienza a registrar pagos para subir tu score"
  - CTA: "Ver mi Pasaporte" (closes modal, navigates to NFT tab)
```

---

## 5. Level-Up Celebration

Triggered when `newLevel !== oldLevel` after a payment:

```tsx
// LevelUpModal.tsx
// Entrance: scale from 0.8 to 1 + fade in (300ms spring easing)
// Background: full-screen blur overlay
// Content:
//   - Old level badge (grayed) → arrow → New level badge (glowing)
//   - "¡Subiste de nivel!" heading
//   - New level name in giant text with level color
//   - Rewards earned in this level-up
//   - Share button (Facebook, X/Twitter, Instagram story)
//   - CTA: "Continuar"

// confetti config:
confetti({
  particleCount: 150,
  spread: 90,
  colors: [levelColor, '#7C3AED', '#F59E0B'],
  origin: { y: 0.4 },
});
```

---

## 6. Payment Registration Flow

```
User navigates to "Registrar Pago" (from dashboard CTA or nav)
  ↓
Form: amount + date + concept (pre-filled with today)
  ↓
Preview: "Este pago sumará +X puntos a tu score"
(calculate estimated delta before submitting)
  ↓
Confirm CTA → MetaMask → TxStateIndicator
  ↓
Success:
  - Score ring animates to new value
  - Streak counter increments
  - "🔥 Racha: X días consecutivos" toast
  - If new level: LevelUpModal
```

---

## 7. Address & Hash Display Conventions

```tsx
// Always truncate wallet addresses
function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Always truncate tx hashes
function truncateTxHash(hash: string): string {
  return `${hash.slice(0, 10)}...${hash.slice(-6)}`;
}

// Always link to explorer
function explorerLink(type: 'tx' | 'address', value: string): string {
  const base = 'https://testnet.monadexplorer.com';
  return type === 'tx' ? `${base}/tx/${value}` : `${base}/address/${value}`;
}
```

Never display raw full addresses or hashes in primary UI. Always offer a "copy" icon button next to truncated values.

---

## 8. Leaderboard UX

```
Layout: Full-width table or card list
Columns: Rank · User (avatar + truncated address) · Score · Level · Streak
Highlight: Current user's row with purple left border accent
Top 3: Gold/Silver/Bronze trophy icons in rank column
Pagination: "Ver más" lazy load (not paginated buttons)
Empty: "Sé el primero en el ranking. ¡Crea tu pasaporte!"
```

---

## 9. Social Sharing

```tsx
const SHARE_MESSAGES = {
  levelUp: (level: string) => 
    `¡Acabo de subir al nivel ${level} en @Trustlayer! Mi historial crediticio está en blockchain 🚀 #Monad #DeFi #InclusionFinanciera`,
  
  score: (score: number) =>
    `Mi score en @Trustlayer es ${score}/1000. Construyendo mi reputación financiera en blockchain ⛓️ #Monad`,
    
  streak: (days: number) =>
    `${days} pagos consecutivos en @Trustlayer 🔥 Ganando recompensas en Monad cada vez que pago a tiempo 💎`,
};

// Share targets: X (Twitter), Facebook, WhatsApp (especially for LATAM), copy link
// Always include a screenshot-friendly card (og:image generation recommended)
```

---

## 10. Mobile-Specific Patterns

### Bottom Navigation (mobile only)
```
[🏠 Inicio] [🎫 NFT] [💰 Recompensas] [🤖 AI] [👤 Perfil]
Background: rgba(10,10,15,0.95) + blur
Border-top: 1px solid rgba(124,58,237,0.15)
Active: purple dot indicator above icon
```

### Swipe Gestures
- Dashboard tabs: horizontal swipe to navigate (touch-action: pan-x)
- NFT card: swipe up reveals transaction history
- Leaderboard: pull-to-refresh pattern

### Haptics (if available via mobile browser)
```ts
// On level-up or payment confirmed:
if ('vibrate' in navigator) {
  navigator.vibrate([100, 50, 100]); // gentle celebration pattern
}
```
