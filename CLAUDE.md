# CLAUDE.md

Contexto del proyecto para Claude Code. Trustlayer es un producto en desarrollo activo.

## Qué es
dApp de identidad financiera descentralizada: los usuarios generan y verifican
identidad crediticia on-chain (NFT de reputación + token de recompensa mcCOP),
portátil y verificable en cualquier comercio.

## Stack
- **Frontend:** Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS
- **Web3:** wagmi v2 + viem (conector actual: `metaMask()`)
- **Contratos:** Solidity 0.8.20 · Hardhat · OpenZeppelin 5 (ERC-721 + ERC-20)
- **Red principal:** Monad — Testnet (chainId `10143`) → Mainnet (chainId `143`).
  Hardhat local (`31337`) para desarrollo.

## Estructura
- `frontend/` — app Next.js. La lógica del dashboard vive en `src/app/page.tsx`
  (config de wagmi inline + 6 tabs). Hook on-chain en `src/hooks/useCreditPassport.ts`.
  Direcciones por chainId en `src/lib/contracts.ts` (leídas de `NEXT_PUBLIC_*`).
- `contracts/` — proyecto Hardhat. Fuentes activas en `contracts/contracts/`
  (`CreditNFT.sol`, `RewardSystem.sol`, `MockCCOP.sol`). Scripts de deploy en `scripts/`.
- `scripts/` — automatización (`start-all.ps1` levanta nodo + deploy + frontend).

## Arrancar
- Local completo (Windows): `.\scripts\start-all.ps1`
- Frontend: `cd frontend && npm install && npm run dev` → http://localhost:3000
- La app entra en **modo demo** hasta que haya contratos desplegados y direcciones en
  `frontend/.env.local`.

## Tests
- E2E con Playwright en `frontend/e2e/`. Config en `frontend/playwright.config.ts`
  (levanta el dev server solo; corre en serie con 1 worker para no saturar la
  compilación on-demand de Next). Ejecutar: `cd frontend && npm run test:e2e`.
- `demo-mode.spec.ts` cubre el modo demo (carga, banner, métricas, navegación de tabs).
  Usar `.first()` / scope por rol: muchos textos se repiten en varias tarjetas.
- Contratos: `contracts/test/Trustlayer.test.js` (`npm test` en `contracts/`).

## Conexión a Monad
- La UI ofrece botones de cambio/alta de red (Monad Testnet/Mainnet) vía `useSwitchChain`.
- Si MetaMask no tiene la red, la añade automáticamente con la config de chains de `page.tsx`.

## Reglas de trabajo
- Tratar como producto en desarrollo activo (no mencionar eventos/plazos).
- Antes de cada cambio mayor, crear rama `feature/` o `fix/`.
- Mantener el código sin referencias a cadenas legacy (Astar, Celo, etc.).
- Prioridad: el build debe compilar sin errores de TypeScript.

## Estado / pendientes
Ver `NEXT_STEPS.md` para la hoja de ruta priorizada.
