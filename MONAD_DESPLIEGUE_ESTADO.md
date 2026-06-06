# 🟣 Estado del despliegue en Monad

Migración de Trustlayerc a **Monad L1** (EVM-compatible). Todo el código está
hecho y verificado. **Lo único que falta es fondear una wallet de testnet y
lanzar el despliegue.**

## ✅ Hecho y verificado

- **Migración de red a Monad** (Astar/Celo eliminados):
  - `contracts/hardhat.config.js`: redes `monad` (Chain ID 143) y `monad-testnet` (Chain ID 10143) + verificación en Monadscan.
  - Scripts `deploy-mainnet.js`, `deploy-testnet.js`, `check-balance.js` adaptados (MON, faucet, explorer).
  - `package.json`: `deploy:monad`, `deploy:monad-testnet`, `verify:monad*`.
- **Frontend conectado a los contratos** (ya no es solo demo):
  - `frontend/src/lib/abis.ts` — ABIs de CreditNFT, RewardSystem, MockMonad.
  - `frontend/src/lib/contracts.ts` — direcciones por red (lee `NEXT_PUBLIC_MONAD_*`).
  - `frontend/src/hooks/useCreditPassport.ts` — lecturas on-chain + acciones (mint, registrar pago, faucet).
  - `frontend/src/app/page.tsx` — wagmi configurado para Monad; datos reales cuando hay NFT.
- **Auto-emisión**: `CreditNFT.mintMyPassport()` permite a cualquier usuario crear su pasaporte (score base 500); subir el score sigue restringido a emisores autorizados.
- **Tests de Hardhat**: `contracts/test/Trustlayerc.test.js` — 13/13 pasando.
- **Pipeline de despliegue probado** en nodo local (3 contratos + NFT + pago OK).
- **Deployer efímero de testnet** generado en `contracts/.env` (gitignored).
  Dirección: `0x5fE2283e679eA9e374D22b65A06b86d7213020D9`

## ⏳ Lo único que falta (conectar/fondear la wallet)

1. **Fondear el deployer** con ~0.5 MON de testnet (faucet o transferencia a
   `0x5fE2283e679eA9e374D22b65A06b86d7213020D9`).
   - Alternativa: usar tu propia clave de testnet en `contracts/.env`.
   - Verifica saldo: `cd contracts && npm run check-balance -- --network monad-testnet`

2. **Desplegar:**
   ```bash
   cd contracts
   npm run deploy:monad-testnet
   ```
   Esto guarda las direcciones en `contracts/deployments/monad-testnet.json`.

3. **Conectar el frontend:** copia las 3 direcciones a `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_MONAD_NFT_CONTRACT=0x...
   NEXT_PUBLIC_MONAD_REWARD_CONTRACT=0x...
   NEXT_PUBLIC_MONAD_Monad_CONTRACT=0x...
   NEXT_PUBLIC_MONAD_CHAIN_ID=10143
   ```
   ```bash
   cd frontend && npm run dev
   ```
   Conecta MetaMask en **Monad Testnet (Chain ID 10143)** y listo.
