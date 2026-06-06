# Screen Specifications — Trustlayer

Detailed layout and content specs for every major screen in the product.

---

## 1. Landing Page

### 1.1 Hero Section
```
Layout: Full viewport height (100dvh)
Background: Deep black (#0A0A0F) + animated purple/amber orbs (see animations.md)
Content alignment: Center (text-center on mobile, can shift left on desktop)

Eyebrow tag: "Monad Blockchain · NFT · DeFi" — small badge with purple border
H1: "Tu Pasaporte Financiero Digital"
   Font: Space Grotesk, 900 weight, 72px desktop / 40px mobile
   Color: White (#F1F0FF)
   
Subheadline: "Convierte tus pagos puntuales en reputación on-chain. Gana recompensas, sube de nivel y accede a más crédito."
   Font: DM Sans, 400, 20px desktop / 16px mobile
   Color: #9CA3AF
   Max-width: 600px

CTA Row (gap: 16px):
   Primary: "Lanzar App" → /dashboard
   Ghost: "Ver en GitHub" → github link (external)

Trust signals row (below CTAs, mt-8):
   "Monad L1" · "Contratos Verificados" · "Open Source"
   Small text in gray with separator dots

Hero visual (right side on desktop / below on mobile):
   NFT Passport Card component (demo data: score=750, level=gold)
   Floating stat chips orbiting the card:
     "+45 puntos por pago" (emerald)
     "Nivel ORO alcanzado" (gold)
     "0.5 MON ganados" (purple)
```

### 1.2 Problem Section
```
Background: slightly lighter than hero (#0D0D16)
Section label: "EL PROBLEMA" in small caps, purple text
H2: "El historial crediticio está roto"
Subtext: One sentence explaining fragmentation

Grid: 2x2 on desktop, 1-col on mobile
Each card:
  Icon: Large emoji or Lucide icon in purple circle
  Title: Bold, white
  Body: 1-2 sentences, gray

Cards content:
  ❌ Fragmentación — "Tu historial está atrapado en silos de cada banco"
  ❌ Sin control — "No puedes ver ni corregir tu propia información crediticia"
  ❌ Barreras de acceso — "Sin historial tradicional = sin crédito. El catch-22 financiero."
  ❌ Sin incentivos — "¿Por qué pagar puntual si no hay recompensa?"
```

### 1.3 Solution / How It Works
```
Background: #0A0A0F
Section label: "LA SOLUCIÓN"
H2: "Un pasaporte financiero que te pertenece"

Layout: Horizontal stepper (scrollable on mobile)
5 steps with connecting line:

Step 1: "Conecta tu Wallet"
  Icon: 🔌
  Body: "MetaMask o cualquier wallet EVM. Sin KYC, sin burocracia."

Step 2: "Crea tu NFT Pasaporte"
  Icon: 🎫
  Body: "Mint tu identidad financiera digital. Vive en Monad, te pertenece a ti."

Step 3: "Registra tus Pagos"
  Icon: ✅
  Body: "Cada pago puntual queda grabado en blockchain, inmutable y verificable."

Step 4: "Sube tu Score"
  Icon: 📈
  Body: "Acumula puntos, construye racha, sube de Bronce a Diamante."

Step 5: "Gana Recompensas"
  Icon: 💎
  Body: "Tokens MON por cada pago. Más nivel = más recompensas."
```

### 1.4 Features Section
```
H2: "Todo lo que necesitas para tu reputación financiera"

Layout: Alternating row (feature left/right)

Feature 1 — Dashboard Completo (visual left, text right)
  Visual: Screenshot/mockup of dashboard stats
  Title: "Ve tu progreso en tiempo real"
  Bullets: Score actual · Predicción IA · Calculadora de recompensas · Historial de pagos

Feature 2 — Sistema de Niveles (text left, visual right)
  Visual: Level badges array (Bronze → Diamond) with glow effects
  Title: "5 niveles de reputación"
  Bullets: Bronce · Plata · Oro · Platino · Diamante · Más nivel = más beneficios

Feature 3 — Para Comercios (visual left, text right)
  Visual: Simple verification flow mockup
  Title: "Verificación instantánea"
  Bullets: Sin base de datos central · Datos on-chain verificables · Acceso sin permisos

Feature 4 — Asistente IA (text left, visual right)
  Visual: Chat bubble mockup
  Title: "Tu asesor financiero personal"
  Bullets: Responde sobre tu perfil · Sugiere cómo subir tu score · Disponible 24/7
```

### 1.5 Tech Stack Strip
```
Background: #111118
Text: "Construido sobre las mejores tecnologías Web3"
Logos row: Monad · Solidity · Next.js · OpenZeppelin · Wagmi
Style: Grayscale logos, 50% opacity, hover → full color + name tooltip
```

### 1.6 Roadmap
```
Layout: Horizontal timeline with dots
Phase 1 ✅: Smart contracts · Frontend · MetaMask · Gamificación
Phase 2 🔄: Deploy production · Tests · Eliminar demo data · Más wallets
Phase 3 🔜: App móvil · Más redes · API pública · DAO governance
```

### 1.7 Final CTA Section
```
Background: Dark with centered purple glow
H2: "Comienza a construir tu reputación financiera"
Subtext: "Gratuito, open source, en Monad."
CTA: "Crear mi Pasaporte" (large primary button)
Small text below: "Sin registro. Sin KYC. Solo tu wallet."
```

---

## 2. Dashboard

### 2.1 Sidebar (Desktop)
```
Width: 240px
Background: #0D0D16

Top: Logo + "Trustlayer" wordmark
Below: Wallet connect pill (green if connected)

Nav items (icon + label):
  📊 Dashboard (active)
  🎫 Mi NFT
  💰 Recompensas
  🏆 Leaderboard
  🤖 Asistente IA
  📈 Análisis
  💳 Línea de Crédito
  ⚙️ Configuración

Bottom: 
  Network indicator (Monad Testnet green dot)
  Version tag
```

### 2.2 Overview Tab
```
Top row (4 stat cards, responsive grid):
  Card 1: Payment Score (large number, colored by level)
  Card 2: Pagos Consecutivos (streak 🔥)
  Card 3: MON Ganados total
  Card 4: Línea de Crédito Pre-aprobada

Second row:
  Left (60%): Score evolution chart (Recharts LineChart, last 30 days)
  Right (40%): NFT Passport Card

Third row:
  Left (50%): Reward table (next level benefits)
  Right (50%): Recent activity feed (last 5 payments)
```

### 2.3 NFT Tab
```
Hero: NFT Passport Card (large, centered)
Below: NFT metadata details (tokenId, contract address, mint date)
Actions: "Ver en Explorer" · "Compartir"
History: All recorded payments table
  Columns: Fecha · Monto · Concepto · +Puntos · Estado
```

### 2.4 Rewards Tab
```
Header: Total MON earned + Total MON pending
Chart: Monthly rewards bar chart (Recharts)
Level table: All 5 levels with rewards per payment
Claim section: Pending rewards + "Reclamar" CTA
```

### 2.5 AI Chat Tab
```
Full-height chat interface
Messages area: scrollable
Input: fixed bottom, full-width
Suggested prompts (shown when empty):
  "¿Cómo subo mi score más rápido?"
  "¿Cuánto ganaré si pago 3 veces más?"
  "¿Qué significa mi nivel actual?"
```

### 2.6 Leaderboard Tab
```
Filter bar: Todos · Esta semana · Este mes
Table/Cards:
  Rank # | Avatar | Dirección | Score | Nivel | Racha
  Top 3: trophy icons (🥇🥈🥉)
  Current user: highlighted row with purple accent
```

### 2.7 Analytics Tab
```
3 charts:
  1. Score evolution (LineChart) — last 90 days
  2. Payments per month (BarChart)
  3. Rewards earned over time (AreaChart)

AI Prediction section:
  "Con tu racha actual, alcanzarás nivel Oro en ~X días"
  Projected score chart (dashed line for future)
```

### 2.8 Credit Line Tab
```
Large number: Pre-approved credit amount
Based on: Current score + level explanation
How to increase: 3-step improvement guide
Application: Placeholder "Próximamente" state (Phase 3)
```

---

## 3. About Page

### Layout
```
Max-width: 900px, centered
Background: Same dark theme as main app

Section 1 — Mission
  H1: "Construyendo la inclusión financiera en blockchain"
  Body: 2-3 paragraphs about the problem in LATAM, why blockchain, why Monad

Section 2 — The Hackathon
  Context card: "Construido en 48 horas · Monad Blitz Medellín 2025"
  Badge: Hackathon logo + date

Section 3 — Team
  Grid of team cards (2-3 col)
  Each: Avatar/initials · Name · Role · GitHub link

Section 4 — Why Monad?
  3 reasons with icons:
    ⚡ Alta velocidad — L1 con ejecución paralela
    💰 Gas bajo — Accesible para LATAM
    🔒 EVM compatible — Herramientas conocidas

Section 5 — Tech Stack
  Visual grid of technologies used

Section 6 — Links
  GitHub repo · Live demo · Contract on Explorer
```

---

## 4. Error / 404 / Loading States

### 404 Page
```
Large "404" in --font-mono, --color-brand-primary, very faint
Title: "Página no encontrada"
Body: "Esta ruta no existe en nuestro blockchain... ni en el tuyo."
CTA: "Volver al Dashboard"
Background: Standard dark with subtle orb
```

### Global Loading State
```
Full-screen overlay (on first load, wallet detection)
Centered: Logo + animated pulse ring
Text: "Conectando con Monad..."
Max duration: 3s → then show "connect wallet" CTA
```

### Maintenance/Coming Soon
```
Only for features marked "Próximamente"
In-component (not full page):
  Blurred overlay on the component
  "🔜 Próximamente" badge centered
  Expected: "Fase 3 · Q3 2025"
```
