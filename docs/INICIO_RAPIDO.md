# 🚀 Inicio Rápido - CrediPass

## ⚡ Opción Rápida: Monad Testnet (Recomendado)

Los contratos ya están desplegados en **Monad Testnet (Chain ID 10143)**.  
Direcciones de contratos: Ver `MONAD_CONFIG.md`

### 1️⃣ Instalar Dependencias

```bash
cd frontend
npm install
```

### 2️⃣ Configurar MetaMask

1. Abre MetaMask
2. Agregá red personalizada:
   - **Nombre**: Monad Testnet
   - **RPC**: https://testnet-rpc.monad.xyz
   - **Chain ID**: 10143
   - **Símbolo**: MON
   - **Explorador**: https://testnet.monadscan.com
3. Selectá Monad Testnet en MetaMask

### 3️⃣ Obtener Tokens MON (Faucet)

- Ve a: https://faucet.monad.xyz
- Pega tu dirección de wallet
- Solicita tokens (~1 MON para gas)

### 4️⃣ Iniciar Frontend

```bash
npm run dev
```

Abre: http://localhost:3000

### 5️⃣ Usar la App

1. Haz clic en "Conectar MetaMask"
2. Verás el modo demo (datos de ejemplo)
3. Crea un pasaporte (NFT) para activar modo real
4. Registra pagos y obtén recompensas

---

## 🖥️ Opción Local: Hardhat Localhost

Para desarrollo local sin dependencia de testnet.

### Pasos Rápidos para Ver el Proyecto Funcionando

### 1️⃣ Instalar Dependencias

```bash
# Contratos
cd contracts
npm install

# Frontend  
cd ../frontend
npm install
```

### 2️⃣ Iniciar Hardhat Node (Terminal 1)

```bash
cd contracts
npm run node
```

Deja esta terminal abierta. Verás 20 cuentas con fondos.

### 3️⃣ Desplegar Contratos (Terminal 2)

```bash
cd contracts
npm run deploy:local
```

**⚠️ IMPORTANTE**: Copia las direcciones de los contratos que aparecen al final:
- `CreditNFT: 0x...`
- `RewardSystem: 0x...`
- `MockMonad: 0x...`

### 4️⃣ Configurar Frontend

Crea `frontend/.env.local` con las direcciones:

```env
NEXT_PUBLIC_LOCAL_NFT_CONTRACT=0x... (pega la dirección de CreditNFT)
NEXT_PUBLIC_LOCAL_REWARD_CONTRACT=0x... (pega la dirección de RewardSystem)
NEXT_PUBLIC_LOCAL_Monad_CONTRACT=0x... (pega la dirección de MockMonad)
NODE_ENV=development
```

### 5️⃣ Configurar MetaMask

1. Abre MetaMask
2. Agrega red:
   - Nombre: `Hardhat Local`
   - RPC: `http://localhost:8545`
   - Chain ID: `31337`
   - Símbolo: `ETH`
3. Importa cuenta usando el mnemonic que aparece en la terminal de Hardhat:

### 6️⃣ Iniciar Frontend (Terminal 3)

```bash
cd frontend
npm run dev
```

### 7️⃣ Abrir en Navegador

1. Abre `http://localhost:3000`
2. Haz clic en "Conectar con MetaMask"
3. Acepta en MetaMask
4. ¡Listo! Verás el dashboard

## ✅ Verificación

Si todo está bien, deberías ver:
- ✅ Dashboard cargando
- ✅ Tu dirección de wallet en el header
- ✅ Tarjetas de reputación, recompensas, crédito
- ✅ NFT de prueba (si se creó durante el despliegue)

## 🐛 Problemas Comunes

### "Contratos no configurados"
- Verifica que `.env.local` tenga las direcciones correctas
- Verifica que Hardhat node esté ejecutándose

### "MetaMask no detectado"
- Instala MetaMask
- Refresca la página

### "Network mismatch"
- Cambia a red "Hardhat Local" en MetaMask
- Verifica Chain ID: 31337

## 📝 Notas

- Los contratos se despliegan automáticamente con un NFT de prueba
- Puedes obtener tokens Monad llamando al método `faucet()` del contrato MockMonad
- Todos los datos son locales y se pierden al reiniciar Hardhat node

## 🎉 ¡Listo!

Ahora puedes:
- Ver tu reputación
- Ver tus recompensas
- Ver tu crédito disponible
- Ver tus NFTs

