# 🚀 Guía de Despliegue - Confianza Móvil

Esta guía te ayudará a desplegar tanto el backend (contratos inteligentes) como el frontend de Confianza Móvil.

---

## 📋 Índice

1. [Despliegue del Backend (Contratos)](#despliegue-del-backend)
2. [Despliegue del Frontend](#despliegue-del-frontend)
3. [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
4. [Verificación de Contratos](#verificación-de-contratos)

---

## 🔧 Despliegue del Backend (Contratos)

### Prerrequisitos

1. **Node.js y npm** instalados
2. **Wallet con fondos** para gas (si despliegas en Testnet/Mainnet)
3. **Clave privada** de la wallet (para firmar transacciones)

### Opción 1: Despliegue en Localhost (Desarrollo)

```bash
# 1. Navegar a la carpeta de contratos
cd contracts

# 2. Instalar dependencias (si no lo has hecho)
npm install

# 3. Iniciar nodo local de Hardhat (en otra terminal)
npx hardhat node

# 4. En otra terminal, desplegar contratos
npx hardhat run scripts/deploy-local.js --network localhost
```

### Opción 2: Despliegue en Testnet (Recomendado)

#### Para Astar Testnet:

```bash
# 1. Configurar variables de entorno
cd contracts
cp .env.example .env

# 2. Editar .env y agregar tu PRIVATE_KEY
# PRIVATE_KEY=tu_clave_privada_aqui

# 3. Obtener tokens de prueba (faucet)
# Visita: https://faucet.astar.network/

# 4. Desplegar en Astar Testnet
npx hardhat run scripts/deploy-testnet.js --network astar-testnet
```

#### Para Celo Alfajores (Testnet):

```bash
# 1. Configurar variables de entorno (mismo .env)
# PRIVATE_KEY=tu_clave_privada_aqui

# 2. Obtener tokens de prueba (faucet)
# Visita: https://faucet.celo.org/alfajores

# 3. Desplegar en Celo Alfajores
npx hardhat run scripts/deploy-testnet.js --network celo-alfajores
```

### Opción 3: Despliegue en Mainnet (Producción)

⚠️ **ADVERTENCIA**: Mainnet usa tokens reales. Asegúrate de tener suficiente balance para gas.

#### Para Astar Mainnet:

```bash
# 1. Configurar .env con tu PRIVATE_KEY
# 2. Asegúrate de tener suficiente ASTR para gas

# 3. Desplegar
npx hardhat run scripts/deploy-testnet.js --network astar
```

#### Para Celo Mainnet:

```bash
# 1. Configurar .env con tu PRIVATE_KEY
# 2. Asegúrate de tener suficiente CELO para gas

# 3. Desplegar
npx hardhat run scripts/deploy-testnet.js --network celo
```

### Resultado del Despliegue

Después del despliegue, encontrarás un archivo JSON en `contracts/deployments/[network].json` con:

- Direcciones de todos los contratos
- Información de la red
- Timestamp del despliegue
- URLs del explorador de bloques

**Ejemplo:**
```json
{
  "network": "astar-testnet",
  "chainId": "4369",
  "deployer": "0x...",
  "contracts": {
    "mockMonad": "0x...",
    "creditNFT": "0x...",
    "rewardSystem": "0x..."
  }
}
```

---

## 🌐 Despliegue del Frontend

### Opción 1: Despliegue en Vercel (Recomendado - Gratis)

#### Paso 1: Preparar el Proyecto

```bash
# 1. Navegar a la carpeta frontend
cd frontend

# 2. Instalar dependencias
npm install

# 3. Crear archivo .env.production con las direcciones de contratos
cp .env.example .env.production

# 4. Editar .env.production con las direcciones reales de tus contratos
```

#### Paso 2: Desplegar en Vercel

**Opción A: Desde la CLI de Vercel**

```bash
# 1. Instalar Vercel CLI (si no lo tienes)
npm i -g vercel

# 2. Iniciar sesión
vercel login

# 3. Desplegar
cd frontend
vercel

# 4. Para producción
vercel --prod
```

**Opción B: Desde el Dashboard de Vercel**

1. Ve a [vercel.com](https://vercel.com)
2. Conecta tu repositorio de GitHub
3. Configura el proyecto:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
4. Agrega las variables de entorno en Settings → Environment Variables
5. Haz clic en "Deploy"

#### Variables de Entorno en Vercel

Agrega estas variables en Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_ASTAR_NFT_CONTRACT=0x...
NEXT_PUBLIC_CELO_REWARD_CONTRACT=0x...
NEXT_PUBLIC_LOCAL_Monad_CONTRACT=0x...
NEXT_PUBLIC_ASTAR_CHAIN_ID=592
NEXT_PUBLIC_CELO_CHAIN_ID=42220
NEXT_PUBLIC_BACKEND_API_URL=https://tu-backend.com
```

### Opción 2: Despliegue en Netlify

```bash
# 1. Instalar Netlify CLI
npm i -g netlify-cli

# 2. Iniciar sesión
netlify login

# 3. Desplegar
cd frontend
netlify deploy --prod
```

### Opción 3: Despliegue en Railway

1. Ve a [railway.app](https://railway.app)
2. Conecta tu repositorio
3. Crea un nuevo proyecto desde GitHub
4. Configura:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
5. Agrega variables de entorno en Variables

### Opción 4: Despliegue en Render

1. Ve a [render.com](https://render.com)
2. Crea un nuevo "Web Service"
3. Conecta tu repositorio
4. Configura:
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Start Command**: `cd frontend && npm start`
5. Agrega variables de entorno

---

## 🔐 Configuración de Variables de Entorno

### Backend (.env en contracts/)

```env
PRIVATE_KEY=tu_clave_privada_aqui
ASTAR_TESTNET_RPC=https://rpc.astar.network:8545
CELO_ALFAJORES_RPC=https://alfajores-forno.celo-testnet.org
```

### Frontend (.env.production en frontend/)

```env
NEXT_PUBLIC_ASTAR_NFT_CONTRACT=0x...
NEXT_PUBLIC_CELO_REWARD_CONTRACT=0x...
NEXT_PUBLIC_LOCAL_Monad_CONTRACT=0x...
NEXT_PUBLIC_ASTAR_CHAIN_ID=592
NEXT_PUBLIC_CELO_CHAIN_ID=42220
NEXT_PUBLIC_BACKEND_API_URL=https://tu-backend.com
```

⚠️ **IMPORTANTE**: 
- Las variables que empiezan con `NEXT_PUBLIC_` son públicas y accesibles en el navegador
- Nunca compartas tu `PRIVATE_KEY`
- Usa diferentes wallets para desarrollo y producción

---

## ✅ Verificación de Contratos

### Verificar en Explorador de Bloques

Después del despliegue, puedes verificar tus contratos en:

- **Astar Testnet**: https://blockscout.com/astar-testnet
- **Astar Mainnet**: https://astar.subscan.io
- **Celo Alfajores**: https://alfajores.celoscan.io
- **Celo Mainnet**: https://celoscan.io

### Verificación Automática (Opcional)

```bash
# Verificar en Astar
npx hardhat verify --network astar-testnet <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>

# Verificar en Celo
npx hardhat verify --network celo-alfajores <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

---

## 📊 Checklist de Despliegue

### Backend
- [ ] Contratos compilados sin errores
- [ ] Wallet configurada con fondos suficientes
- [ ] Variables de entorno configuradas (.env)
- [ ] Contratos desplegados en Testnet/Mainnet
- [ ] Direcciones de contratos guardadas
- [ ] Contratos verificados en explorador (opcional)

### Frontend
- [ ] Dependencias instaladas
- [ ] Variables de entorno configuradas
- [ ] Build exitoso (`npm run build`)
- [ ] Desplegado en plataforma (Vercel/Netlify/etc.)
- [ ] Variables de entorno configuradas en plataforma
- [ ] Frontend accesible y funcional

---

## 🆘 Solución de Problemas

### Error: "Insufficient funds"
- **Solución**: Asegúrate de tener suficiente balance para gas en tu wallet

### Error: "Nonce too high"
- **Solución**: Espera unos segundos o reinicia el nodo local

### Error: "Contract verification failed"
- **Solución**: Verifica que los argumentos del constructor sean correctos

### Frontend no se conecta a contratos
- **Solución**: Verifica que las direcciones en `.env.production` sean correctas

---

## 📚 Recursos Adicionales

- [Documentación de Hardhat](https://hardhat.org/docs)
- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Astar](https://docs.astar.network)
- [Documentación de Celo](https://docs.celo.org)

---

**Última actualización**: Después de crear scripts de despliegue  
**Estado**: ✅ Listo para desplegar


