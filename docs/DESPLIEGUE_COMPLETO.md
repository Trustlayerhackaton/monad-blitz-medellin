# 🚀 Despliegue Completo - Confianza Móvil

Guía para desplegar todo el proyecto: Hardhat Node, Backend (Node-RED), y Frontend.

---

## 📋 Requisitos Previos

1. **Node.js 18+** instalado
2. **npm** o **yarn** instalado
3. **MetaMask** instalado en el navegador (para conectar wallet)

---

## 🎯 Opción 1: Despliegue Automático (Recomendado)

### Windows (PowerShell)

```powershell
# Ejecutar script de inicio completo
.\scripts\start-all.ps1
```

### Linux/Mac (Bash)

```bash
# Dar permisos de ejecución
chmod +x scripts/start-all.sh

# Ejecutar script
./scripts/start-all.sh
```

Este script automáticamente:
1. ✅ Inicia Hardhat Node en puerto 8545
2. ✅ Despliega todos los contratos
3. ✅ Configura variables de entorno del frontend
4. ✅ Inicia Node-RED en puerto 1880
5. ✅ Inicia Frontend en puerto 3000

---

## 🔧 Opción 2: Despliegue Manual (Paso a Paso)

### Terminal 1: Hardhat Node

```bash
cd contracts
npm install  # Si no has instalado dependencias
npx hardhat node
```

Deja esta terminal abierta. Verás 20 cuentas con fondos.

### Terminal 2: Desplegar Contratos

```bash
cd contracts
npx hardhat run scripts/deploy-local.js --network localhost
```

**⚠️ IMPORTANTE**: Copia las direcciones de los contratos que aparecen:
- `CreditNFT: 0x...`
- `RewardSystem: 0x...`
- `MockMonad: 0x...`

### Terminal 3: Node-RED (Backend)

```bash
# Instalar Node-RED globalmente (si no lo tienes)
npm install -g node-red

# Iniciar Node-RED
node-red
```

Node-RED estará disponible en: http://localhost:1880

### Terminal 4: Frontend

```bash
cd frontend
npm install  # Si no has instalado dependencias

# Crear archivo .env.local con las direcciones de contratos
# (O el script automático lo hace por ti)
```

Crea `frontend/.env.local`:

```env
NEXT_PUBLIC_LOCAL_NFT_CONTRACT=0x... (dirección de CreditNFT)
NEXT_PUBLIC_LOCAL_REWARD_CONTRACT=0x... (dirección de RewardSystem)
NEXT_PUBLIC_LOCAL_Monad_CONTRACT=0x... (dirección de MockMonad)
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:1880
NODE_ENV=development
```

Luego inicia el frontend:

```bash
npm run dev
```

---

## ✅ Verificación

Después del despliegue, verifica que todo esté funcionando:

### 1. Hardhat Node
- ✅ Terminal muestra "Started HTTP and WebSocket JSON-RPC server"
- ✅ URL: http://localhost:8545

### 2. Contratos
- ✅ Archivo `contracts/deployments/localhost.json` existe
- ✅ Contiene direcciones de los 3 contratos

### 3. Node-RED
- ✅ Abre http://localhost:1880
- ✅ Deberías ver la interfaz de Node-RED

### 4. Frontend
- ✅ Abre http://localhost:3000
- ✅ Deberías ver el dashboard de Confianza Móvil
- ✅ Puedes conectar MetaMask

---

## 🔌 Configurar MetaMask

Para usar el frontend, necesitas configurar MetaMask:

### 1. Agregar Red Local

1. Abre MetaMask
2. Ve a Settings → Networks → Add Network
3. Agrega:
   - **Network Name**: `Hardhat Local`
   - **RPC URL**: `http://localhost:8545`
   - **Chain ID**: `31337`
   - **Currency Symbol**: `ETH`

### 2. Importar Cuenta de Prueba

1. En MetaMask, ve a Account → Import Account
2. Usa el mnemonic que aparece en la terminal de Hardhat:
   ```
   test test test test test test test test test test test junk
   ```
3. O importa una clave privada de las cuentas mostradas en Hardhat

---

## 🛑 Detener Servicios

### Windows (PowerShell)

```powershell
.\scripts\stop-all.ps1
```

### Linux/Mac

```bash
# Detener procesos manualmente
pkill -f "hardhat node"
pkill -f "node-red"
pkill -f "next dev"
```

O presiona `Ctrl+C` en cada terminal.

---

## 📊 Puertos Utilizados

| Servicio | Puerto | URL |
|----------|--------|-----|
| Hardhat Node | 8545 | http://localhost:8545 |
| Node-RED | 1880 | http://localhost:1880 |
| Frontend | 3000 | http://localhost:3000 |

---

## 🐛 Solución de Problemas

### Error: "Puerto ya en uso"

```bash
# Windows
netstat -ano | findstr :8545
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8545 | xargs kill -9
```

### Error: "Contratos no configurados"

- Verifica que `frontend/.env.local` exista
- Verifica que las direcciones sean correctas
- Verifica que Hardhat node esté ejecutándose

### Error: "MetaMask no detectado"

- Instala MetaMask
- Refresca la página
- Verifica que MetaMask esté desbloqueado

### Error: "Network mismatch"

- Cambia a red "Hardhat Local" en MetaMask
- Verifica Chain ID: 31337

### Node-RED no inicia

```bash
# Instalar Node-RED globalmente
npm install -g node-red

# Verificar instalación
node-red --version
```

---

## 📝 Notas Importantes

- ⚠️ **Los datos son locales**: Todo se pierde al reiniciar Hardhat node
- ⚠️ **Solo para desarrollo**: No uses en producción
- ✅ **Tokens de prueba**: Las cuentas de Hardhat tienen 10,000 ETH
- ✅ **NFTs de prueba**: El script de despliegue crea un NFT de prueba automáticamente

---

## 🎉 ¡Listo!

Ahora tienes todo funcionando:
- ✅ Hardhat Node ejecutándose
- ✅ Contratos desplegados
- ✅ Node-RED funcionando
- ✅ Frontend accesible

Puedes:
- Ver el dashboard en http://localhost:3000
- Conectar MetaMask
- Ver tus NFTs
- Probar las funcionalidades

---

**Última actualización**: Después de crear scripts de despliegue completo  
**Estado**: ✅ Listo para usar










