# 🚀 Configuración CrediPass en Monad Testnet

## ✅ Estado: CONTRATOS DESPLEGADOS EN MONAD TESTNET (Chain ID 10143)

### 📋 Direcciones de Contratos

| Contrato | Dirección |
|----------|-----------|
| **MockMonad** | `0xB0207dD36D1441592aF6EC59dfC390B1f974615f` |
| **CreditNFT** | `0x67841E9cCa5bfd49A9102245277d6EdD5bCE8453` |
| **RewardSystem** | `0xB59F9C7cdC9eF972c20ed9024cEEBe11820909FC` |

**Red**: Monad Testnet  
**Chain ID**: 10143  
**RPC**: https://testnet-rpc.monad.xyz  
**Explorador**: https://testnet.monadscan.com  

### 🔍 Explorador de Contratos

- MockMonad: https://testnet.monadscan.com/address/0xB0207dD36D1441592aF6EC59dfC390B1f974615f
- CreditNFT: https://testnet.monadscan.com/address/0x67841E9cCa5bfd49A9102245277d6EdD5bCE8453
- RewardSystem: https://testnet.monadscan.com/address/0xB59F9C7cdC9eF972c20ed9024cEEBe11820909FC

---

## 🎯 Iniciar la Aplicación

### 1. Instalar Dependencias

```bash
# Frontend
cd frontend
npm install
```

### 2. Configurar MetaMask

1. Abre MetaMask
2. Haz clic en la red actual en la parte superior
3. Selecciona "Agregar red personalizada"
4. Completa con:
   - **Nombre**: Monad Testnet
   - **RPC**: `https://testnet-rpc.monad.xyz`
   - **Chain ID**: `10143`
   - **Símbolo**: `MON`
   - **Explorador**: `https://testnet.monadscan.com`

5. Guarda la red
6. Cambia a "Monad Testnet" en MetaMask

### 3. Obtener Tokens de Prueba (Faucet)

1. Ve a: https://faucet.monad.xyz (o el faucet oficial)
2. Pega tu dirección de wallet
3. Solicita tokens (recibirás ~1 MON para gas)

### 4. Iniciar Frontend

```bash
npm run dev
```

El frontend estará disponible en: http://localhost:3000

---

## 🎮 Modo Demo

La aplicación incluye dos modos automáticos:

### Modo Demo (Sin NFT)
- Se activa automáticamente si no has minteado un NFT
- Muestra datos de ejemplo:
  - Score: 850 (Platino)
  - Pagos consecutivos: 5
  - Recompensas: 1,250 MON
  - Historial de actividades simuladas
  - Predicciones IA
  - Tabla de recompensas

### Modo Real (Con NFT)
- Se activa cuando connectas MetaMask y tienes un NFT creado
- Muestra datos reales desde los contratos:
  - Tu score actual
  - Tus pagos registrados
  - Tus recompensas disponibles
  - NFT asociado

---

## 🔐 Funcionalidades Blockchain

### Crear tu Pasaporte (NFT)

1. Conecta tu wallet en MetaMask
2. Haz clic en **"Crear Pasaporte"** (si no tienes uno)
3. Confirma la transacción en MetaMask
4. Recibirás un NFT "Credit Reputation NFT"

### Registrar Pago

1. Haz clic en **"Registrar Pago"**
2. Confirma en MetaMask
3. Tu score aumentará automáticamente
4. Recibe recompensas en tokens MON

### Ver NFT

1. Tu NFT aparecerá en la sección "Reputación Digital"
2. Puedes verlo en OpenSea o el explorador si lo deseas
3. Datos del NFT incluyen:
   - Score de pago
   - Pagos consecutivos
   - Poder de gobernanza
   - Monto en staking

---

## 📊 Variables de Entorno (frontend/.env.local)

```env
# Monad Testnet
NEXT_PUBLIC_MONAD_NFT_CONTRACT=0x67841E9cCa5bfd49A9102245277d6EdD5bCE8453
NEXT_PUBLIC_MONAD_REWARD_CONTRACT=0xB59F9C7cdC9eF972c20ed9024cEEBe11820909FC
NEXT_PUBLIC_MONAD_Monad_CONTRACT=0xB0207dD36D1441592aF6EC59dfC390B1f974615f
NEXT_PUBLIC_MONAD_CHAIN_ID=10143

# Desarrollo Local (Hardhat)
NEXT_PUBLIC_LOCAL_NFT_CONTRACT=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
NEXT_PUBLIC_LOCAL_REWARD_CONTRACT=0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
NEXT_PUBLIC_LOCAL_Monad_CONTRACT=0x5FbDB2315678afecb367f032d93F642f64180aa3

NODE_ENV=development
```

---

## ⚠️ Problemas Comunes

### "No se detecta MetaMask"
- ✅ Instala la extensión MetaMask
- ✅ Recarga la página
- ✅ Verifica que estés en Monad Testnet

### "Error de Chain ID"
- ✅ Asegúrate de estar en Monad Testnet (Chain ID: 10143)
- ✅ Cambia de red en MetaMask si es necesario

### "Saldo insuficiente para gas"
- ✅ Ve al faucet de Monad
- ✅ Solicita más tokens MON

### "Transacción rechazada"
- ✅ Verifica que tienes suficiente gas
- ✅ Intenta nuevamente
- ✅ Comprueba la consola del navegador

### "Modo demo aunque tengo wallet"
- ✅ Primero crea tu pasaporte (NFT)
- ✅ Confirmará automáticamente después

---

## 🧪 Verificación de Contratos

### Verificar MockMonad
```bash
curl https://testnet.monadscan.com/api\?module\=account\&action\=balance\&address\=0xB0207dD36D1441592aF6EC59dfC390B1f974615f
```

### Verificar CreditNFT
```bash
# Ver el supply de NFTs
curl https://testnet-rpc.monad.xyz \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_call","params":[{"to":"0x67841E9cCa5bfd49A9102245277d6EdD5bCE8453"}],"id":1}'
```

---

## 📱 Dashboard Features

### Tarjetas Principales
- **Mi Puntuación**: Score crediticio actual
- **Mis Recompensas**: Tokens disponibles para reclamar
- **Línea de Crédito**: Límite disponible
- **NFT de Reputación**: Tu pasaporte digital

### Análisis
- **Predicción IA**: Score predicho basado en historial
- **Tendencias**: Gráfico de evolución de score
- **Tabla de Recompensas**: Historial de recompensas
- **Ranking**: Comparativa con otros usuarios

### Acciones Rápidas
- Crear Pasaporte
- Registrar Pago
- Reclamar Recompensas
- Establecer Metas

---

## 🚀 Siguientes Pasos

1. **Despliegue en Mainnet** (cuando esté listo)
   - Cambiar RPC a `https://rpc.monad.xyz`
   - Chain ID: `143`
   
2. **Integrar Backend**
   - API para análisis de pagos
   - Webhooks para eventos blockchain
   
3. **Expandir a otras redes**
   - Otras redes EVM compatibles

---

## 📞 Soporte

Para problemas:
1. Revisa los logs en DevTools (F12)
2. Verifica el explorador de bloques
3. Consulta el archivo de despliegue: `contracts/deployments/monad-testnet.json`

**Última actualización**: 2026-06-06  
**Estado**: ✅ Activo y Funcional
