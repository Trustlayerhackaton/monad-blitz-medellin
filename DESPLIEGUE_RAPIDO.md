# ⚡ Despliegue Rápido - Confianza Móvil

Guía rápida para desplegar backend y frontend.

---

## 🚀 Despliegue Backend (Testnet)

### 1. Configurar Variables de Entorno

```bash
cd contracts
# Crear archivo .env
echo "PRIVATE_KEY=tu_clave_privada_aqui" > .env
```

### 2. Obtener Tokens de Prueba

- **Astar Testnet**: https://faucet.astar.network/
- **Celo Alfajores**: https://faucet.celo.org/alfajores

### 3. Desplegar

```bash
# Astar Testnet
npx hardhat run scripts/deploy-testnet.js --network astar-testnet

# Celo Alfajores
npx hardhat run scripts/deploy-testnet.js --network celo-alfajores
```

### 4. Guardar Direcciones

Después del despliegue, copia las direcciones de los contratos del archivo:
`contracts/deployments/[network].json`

---

## 🌐 Despliegue Frontend (Vercel)

### Opción 1: CLI de Vercel

```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

### Opción 2: Dashboard de Vercel

1. Ve a https://vercel.com
2. Conecta tu repositorio de GitHub
3. Configura:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
4. Agrega variables de entorno (Settings → Environment Variables)
5. Deploy

### Variables de Entorno Necesarias

```
NEXT_PUBLIC_ASTAR_NFT_CONTRACT=0x...
NEXT_PUBLIC_CELO_REWARD_CONTRACT=0x...
NEXT_PUBLIC_LOCAL_Monad_CONTRACT=0x...
NEXT_PUBLIC_ASTAR_CHAIN_ID=592
NEXT_PUBLIC_CELO_CHAIN_ID=42220
```

---

## ✅ Verificación

1. **Backend**: Verifica contratos en explorador de bloques
2. **Frontend**: Accede a la URL de Vercel y prueba la conexión

---

**¿Problemas?** Consulta `GUIA_DESPLIEGUE.md` para más detalles.


