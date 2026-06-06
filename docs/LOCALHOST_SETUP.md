# Configuración para Localhost - Confianza Móvil

## 🚀 Inicio Rápido en Localhost

Esta guía te ayudará a configurar y ejecutar el proyecto en tu máquina local usando MetaMask y Hardhat.

## Prerrequisitos

1. **Node.js 18+** instalado
2. **MetaMask** instalado en tu navegador
3. **Git** (opcional)

## Paso 1: Instalar Dependencias

```bash
# Instalar dependencias de contratos
cd contracts
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install
```

## Paso 2: Iniciar Hardhat Node

En una terminal, ejecuta:

```bash
cd contracts
npm run node
```

Esto iniciará un nodo Hardhat local en `http://localhost:8545` con 20 cuentas de prueba prefinanciadas.

## Paso 3: Desplegar Contratos

En otra terminal, ejecuta:

```bash
cd contracts
npm run deploy:local
```

Esto desplegará todos los contratos necesarios:
- MockMonad (token mock de Monad)
- CreditNFT
- RewardSystem
- SiteVerification
- PaymentReceipt

El script mostrará las direcciones de los contratos desplegados.

## Paso 4: Configurar MetaMask

### Agregar Red Local

1. Abre MetaMask
2. Ve a Settings > Networks > Add Network
3. Agrega la siguiente configuración:
   - **Network Name**: Hardhat Local
   - **RPC URL**: http://localhost:8545
   - **Chain ID**: 31337
   - **Currency Symbol**: ETH

### Importar Cuenta de Prueba

1. En MetaMask, ve a Account > Import Account
2. Usa una de las claves privadas del Hardhat node (se muestran en la consola)
3. O usa el mnemonic: `test test test test test test test test test test test junk`
4. Selecciona la primera cuenta (tiene 10,000 ETH)

## Paso 5: Configurar Frontend

Crea el archivo `frontend/.env.local` con las direcciones de los contratos:

```env
NEXT_PUBLIC_LOCAL_NFT_CONTRACT=0x... (dirección de CreditNFT)
NEXT_PUBLIC_LOCAL_REWARD_CONTRACT=0x... (dirección de RewardSystem)
NEXT_PUBLIC_LOCAL_Monad_CONTRACT=0x... (dirección de MockMonad)
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:1880
NODE_ENV=development
```

Las direcciones se muestran después de ejecutar `npm run deploy:local`.

## Paso 6: Iniciar Frontend

```bash
cd frontend
npm run dev
```

El frontend estará disponible en `http://localhost:3000`.

## Paso 7: Usar la Aplicación

1. Abre `http://localhost:3000` en tu navegador
2. Conecta MetaMask (asegúrate de estar en la red Hardhat Local)
3. Acepta la conexión en MetaMask
4. ¡Listo! Puedes ver el dashboard y tus NFTs

## Script de Inicio Automático

Para simplificar el proceso, puedes usar el script automático:

```bash
./scripts/start-local.sh
```

Este script:
1. Instala dependencias si es necesario
2. Compila contratos
3. Inicia Hardhat node
4. Despliega contratos
5. Configura el frontend
6. Inicia el frontend

## Testing

### Crear un NFT de Prueba

Puedes crear un NFT de prueba usando el script de despliegue, o manualmente:

```bash
cd contracts
npx hardhat console --network localhost
```

Luego en la consola:

```javascript
const CreditNFT = await ethers.getContractFactory("CreditNFT");
const nft = await CreditNFT.attach("DIRECCION_DEL_CONTRATO");
const [deployer] = await ethers.getSigners();

await nft.mintCreditNFT(
  deployer.address,
  850, // paymentScore
  5,   // consecutivePayments
  "https://api.example.com/nft/1"
);
```

### Obtener Tokens Monad

Para obtener tokens mock de Monad:

```javascript
const MockMonad = await ethers.getContractFactory("MockMonad");
const Monad = await MockMonad.attach("DIRECCION_DEL_CONTRATO");

// Llamar al faucet
await Monad.faucet();
```

## Solución de Problemas

### Error: "MetaMask no detectado"

- Asegúrate de que MetaMask esté instalado
- Refresca la página
- Verifica que MetaMask esté desbloqueado

### Error: "Contratos no configurados"

- Verifica que los contratos estén desplegados
- Verifica que las direcciones en `.env.local` sean correctas
- Asegúrate de que Hardhat node esté ejecutándose

### Error: "Network mismatch"

- Verifica que MetaMask esté en la red Hardhat Local (Chain ID: 31337)
- Verifica que el RPC URL sea `http://localhost:8545`

### Error: "Insufficient funds"

- Usa una cuenta con fondos (las cuentas de Hardhat tienen 10,000 ETH)
- Verifica que estés usando la cuenta correcta

## Próximos Pasos

1. Explora el dashboard
2. Crea NFTs de prueba
3. Prueba las funcionalidades
4. Revisa los contratos desplegados en Hardhat

## Comandos Útiles

```bash
# Compilar contratos
cd contracts && npm run compile

# Ejecutar tests
cd contracts && npm test

# Ver logs de Hardhat
tail -f hardhat-node.log

# Ver logs del frontend
tail -f frontend.log
```

## Notas

- Los contratos se despliegan en la red local, no en mainnet
- Los tokens y NFTs son solo para testing
- Los datos se pierden cuando reinicias Hardhat node
- Para producción, usa Monad Mainnet

