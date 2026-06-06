# Trustlayer — Próximos pasos

Hoja de ruta de desarrollo activo, priorizada por impacto sobre el producto.

## 1. Desplegar contratos en Monad Testnet y conectar datos reales
> Desbloquea todo lo demás.
- `cd contracts && npm run deploy:monad-testnet` (requiere `PRIVATE_KEY` con MON de testnet en `contracts/.env`).
- Copiar direcciones desplegadas a `frontend/.env.local`:
  `NEXT_PUBLIC_MONAD_NFT_CONTRACT`, `NEXT_PUBLIC_MONAD_REWARD_CONTRACT`, `NEXT_PUBLIC_MONAD_CCOP_CONTRACT`.
- Autorizar la wallet de referencia `0x5fE2283e679eA9e374D22b65A06b86d7213020D9` como `authorizedMinter` en `CreditNFT`.
- Verificar contratos: `npm run verify:monad-testnet`.

## 2. Salir del modo demo
- Hoy varios componentes reciben `isDemoMode` y valores hardcodeados (`averageScore=820`,
  `targetScore=1000`, leaderboard ficticio). Cablear a lecturas reales de `useTrustLayer`
  o a un servicio de indexación.

## 3. Refactor de arquitectura del frontend
- `page.tsx` (~830 líneas) concentra config de wagmi + dashboard + las 6 tabs.
- Extraer la config de wagmi a `app/providers.tsx` (client component) montado en `layout.tsx`.
- Separar el dashboard por tabs en módulos independientes.

## 4. Conectores de wallet
- Hoy solo `metaMask()`. Evaluar `injected()` (Rabby, Coinbase…) o adoptar RainbowKit
  para selector multi-wallet (ordena además los warnings de `@metamask/sdk` / WalletConnect).
- Añadir un chip de red activa en el header (ya existe el helper `networkName`).

## 5. Calidad y CI
- GitHub Actions: `build` + `tsc --noEmit` + `next lint` en cada PR.
- Tests E2E (Playwright): conexión de wallet, switch de red, mint. Unit tests del hook
  `useTrustLayer`. Los contratos ya tienen `test/Trustlayer.test.js`.

## 6. Documentación
- ~40 `.md` en la raíz, varios duplicados (guías de despliegue casi idénticas).
  Consolidar en `docs/` + un README único.

## 7. Seguridad de dependencias (no urgente)
- Pasada controlada de `npm audit` en rama aparte; mantener wagmi/viem/next en versiones soportadas.
