# Animation & Motion Reference — Trustlayer

Motion design philosophy: **purposeful, not decorative**. Animations should communicate state changes, guide attention, and celebrate achievements. Every animation must serve a function.

---

## 1. Entrance Animations (Page/Component Load)

### Dashboard Load Sequence
Staggered reveals create a sense of the page "coming alive":

```css
/* Base classes for staggered entrance */
.animate-fade-up {
  opacity: 0;
  transform: translateY(16px);
  animation: fadeUp var(--duration-slow) var(--ease-out-expo) forwards;
}

@keyframes fadeUp {
  to { opacity: 1; transform: translateY(0); }
}

/* Stagger delays */
.delay-0   { animation-delay: 0ms; }
.delay-100 { animation-delay: 100ms; }
.delay-200 { animation-delay: 200ms; }
.delay-300 { animation-delay: 300ms; }
.delay-400 { animation-delay: 400ms; }
.delay-500 { animation-delay: 500ms; }
```

**Dashboard stagger order:**
1. `delay-0` — Stat cards row
2. `delay-100` — NFT passport card
3. `delay-200` — Score ring
4. `delay-300` — Chart/analytics section
5. `delay-400` — Recent activity feed

### Landing Page Hero
```css
.hero-headline {
  animation: heroIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.hero-subheadline {
  animation: heroIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
}

.hero-ctas {
  animation: heroIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
}

@keyframes heroIn {
  from { opacity: 0; transform: translateY(24px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
```

---

## 2. Score Ring Animation

```tsx
// Animate score counting up on first render
import { useEffect, useState } from 'react';

function useCountUp(target: number, duration = 1200): number {
  const [current, setCurrent] = useState(0);
  
  useEffect(() => {
    const start = performance.now();
    
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const eased = 1 - Math.pow(2, -10 * progress);
      setCurrent(Math.round(eased * target));
      
      if (progress < 1) requestAnimationFrame(tick);
    };
    
    requestAnimationFrame(tick);
  }, [target, duration]);
  
  return current;
}
```

**Score delta animation:** When score changes after payment:
```tsx
// Flash the score ring briefly with a green pulse
<circle className="animate-ping-once" style={{ stroke: '#10B981', opacity: 0.3 }} />
```

```css
@keyframes pingOnce {
  0%   { transform: scale(1);   opacity: 0.3; }
  50%  { transform: scale(1.05); opacity: 0; }
  100% { transform: scale(1);   opacity: 0; }
}
.animate-ping-once {
  animation: pingOnce 0.6s ease-out forwards;
}
```

---

## 3. NFT Card Hover Effects

```css
.nft-card {
  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 300ms ease;
}

.nft-card:hover {
  transform: translateY(-4px) scale(1.01);
}

/* Level badge shimmer on hover */
.level-badge-shimmer::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 40%,
    rgba(255,255,255,0.25) 50%,
    transparent 60%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: inherit;
}

@keyframes shimmer {
  from { background-position: 200% center; }
  to   { background-position: -200% center; }
}
```

---

## 4. Level-Up Celebration

### Sequence (total ~2s)
```
0ms    — Modal overlay fades in (200ms)
200ms  — Card scales in from 0.85 (300ms spring)
300ms  — Confetti burst fires
500ms  — Old level fades out, arrow appears
700ms  — New level badge reveals with glow pulse
1000ms — Reward amount counts up
1200ms — CTA button fades in
```

### Glow Pulse for New Level Badge
```css
@keyframes levelGlow {
  0%, 100% { box-shadow: 0 0 20px var(--level-color-30); }
  50%       { box-shadow: 0 0 40px var(--level-color-60), 0 0 80px var(--level-color-20); }
}

.level-badge-new {
  animation: levelGlow 1.5s ease-in-out 0.7s 3;
}
```

### Confetti Config
```ts
import confetti from 'canvas-confetti';

export function fireLevelUpConfetti(levelColor: string) {
  // First burst — center
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { x: 0.5, y: 0.5 },
    colors: [levelColor, '#7C3AED', '#F59E0B', '#FFFFFF'],
    startVelocity: 35,
    gravity: 0.9,
    scalar: 1.2,
    ticks: 200,
  });
  
  // Side bursts — 200ms later
  setTimeout(() => {
    confetti({ particleCount: 60, angle: 60,  spread: 55, origin: { x: 0, y: 0.6 }, colors: [levelColor, '#7C3AED'] });
    confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1, y: 0.6 }, colors: [levelColor, '#F59E0B'] });
  }, 200);
}
```

---

## 5. Skeleton Loading Pulse

```css
@keyframes skeletonPulse {
  0%, 100% { opacity: 0.5; }
  50%       { opacity: 1; }
}

.skeleton {
  background: rgba(124, 58, 237, 0.08);
  animation: skeletonPulse 1.5s ease-in-out infinite;
}

/* Gradient version for larger skeletons */
.skeleton-gradient {
  background: linear-gradient(
    90deg,
    rgba(124, 58, 237, 0.05) 0%,
    rgba(124, 58, 237, 0.12) 50%,
    rgba(124, 58, 237, 0.05) 100%
  );
  background-size: 200% 100%;
  animation: skeletonSlide 1.5s ease-in-out infinite;
}

@keyframes skeletonSlide {
  from { background-position: 200% center; }
  to   { background-position: -200% center; }
}
```

---

## 6. Button Micro-interactions

```css
.btn {
  transition:
    transform var(--duration-fast) var(--ease-spring),
    box-shadow var(--duration-normal) ease,
    filter var(--duration-fast) ease;
}

.btn:hover:not(:disabled) {
  transform: scale(1.02) translateY(-1px);
}

.btn:active:not(:disabled) {
  transform: scale(0.98) translateY(0);
  transition-duration: 80ms;
}

/* Gold button reward glow pulse (for claim actions) */
.btn-gold {
  animation: goldPulse 3s ease-in-out infinite;
}

@keyframes goldPulse {
  0%, 100% { box-shadow: 0 0 15px rgba(245,158,11,0.3); }
  50%       { box-shadow: 0 0 30px rgba(245,158,11,0.6); }
}
```

---

## 7. Background Mesh Animation (Landing Hero)

```css
.hero-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

/* Animated gradient orbs */
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
  animation: orbFloat 8s ease-in-out infinite;
}

.orb-1 {
  width: 600px; height: 600px;
  background: #7C3AED;
  top: -200px; left: -100px;
  animation-delay: 0s;
}

.orb-2 {
  width: 400px; height: 400px;
  background: #A855F7;
  top: 20%; right: -100px;
  animation-delay: -3s;
}

.orb-3 {
  width: 500px; height: 500px;
  background: #F59E0B;
  bottom: -100px; left: 40%;
  opacity: 0.08;
  animation-delay: -5s;
}

@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%       { transform: translate(30px, -20px) scale(1.05); }
  66%       { transform: translate(-20px, 30px) scale(0.95); }
}
```

---

## 8. Chart/Recharts Animation Config

```tsx
// Standard animation props for Recharts components
const chartAnimationProps = {
  isAnimationActive: true,
  animationBegin: 200,
  animationDuration: 800,
  animationEasing: 'ease-out',
};

// Line chart stroke: brand purple gradient
const chartColors = {
  primary:  '#7C3AED',
  secondary:'#A855F7',
  success:  '#10B981',
  warning:  '#F59E0B',
  gridLine: 'rgba(124,58,237,0.08)',
  axisText: '#6B7280',
};
```

---

## 9. Transition Timing Reference

| Interaction | Duration | Easing | Notes |
|---|---|---|---|
| Button hover | 150ms | ease | Fast feedback |
| Card hover | 250ms | ease-out-expo | Smooth lift |
| Modal open | 300ms | spring | Bouncy entrance |
| Modal close | 200ms | ease-in | Quick dismiss |
| Page nav | 400ms | ease-out-expo | Feels intentional |
| Score count-up | 1200ms | ease-out-expo | Dramatic reveal |
| Level-up modal | 300ms | spring | Celebratory |
| Toast slide-in | 250ms | ease-out-expo | Noticeable not jarring |
| Skeleton pulse | 1500ms | ease-in-out infinite | Subtle |
| Orb float | 8000ms | ease-in-out infinite | Barely noticeable |
