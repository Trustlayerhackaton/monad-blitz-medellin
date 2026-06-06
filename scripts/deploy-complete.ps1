# Script de despliegue completo simplificado
# Este script debe ejecutarse paso a paso manualmente

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  DESPLIEGUE COMPLETO - CONFIANZA MOVIL" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Este script guiara el despliegue paso a paso." -ForegroundColor Yellow
Write-Host ""

# Paso 1: Verificar estructura
Write-Host "Paso 1: Verificando estructura del proyecto..." -ForegroundColor Green
if (-not (Test-Path "contracts")) {
    Write-Host "ERROR: Directorio contracts no encontrado" -ForegroundColor Red
    exit 1
}
if (-not (Test-Path "frontend")) {
    Write-Host "ERROR: Directorio frontend no encontrado" -ForegroundColor Red
    exit 1
}
Write-Host "OK: Estructura del proyecto correcta" -ForegroundColor Green
Write-Host ""

# Paso 2: Instalar dependencias
Write-Host "Paso 2: Instalando dependencias..." -ForegroundColor Green
Write-Host "  - Contratos..." -ForegroundColor Yellow
Set-Location contracts
if (-not (Test-Path "node_modules")) {
    npm install
} else {
    Write-Host "  OK: Dependencias de contratos ya instaladas" -ForegroundColor Green
}
Set-Location ..
Write-Host "  - Frontend..." -ForegroundColor Yellow
Set-Location frontend
if (-not (Test-Path "node_modules")) {
    npm install
} else {
    Write-Host "  OK: Dependencias de frontend ya instaladas" -ForegroundColor Green
}
Set-Location ..
Write-Host ""

# Paso 3: Compilar contratos
Write-Host "Paso 3: Compilando contratos..." -ForegroundColor Green
Set-Location contracts
npx hardhat compile
Set-Location ..
Write-Host ""

# Paso 4: Instrucciones
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  INSTRUCCIONES PARA COMPLETAR EL DESPLIEGUE" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. TERMINAL 1 - Iniciar Hardhat Node:" -ForegroundColor Yellow
Write-Host "   cd contracts" -ForegroundColor White
Write-Host "   npx hardhat node" -ForegroundColor White
Write-Host ""
Write-Host "2. TERMINAL 2 - Desplegar contratos:" -ForegroundColor Yellow
Write-Host "   cd contracts" -ForegroundColor White
Write-Host "   npx hardhat run scripts/deploy-local.js --network localhost" -ForegroundColor White
Write-Host "   (Copia las direcciones de los contratos)" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Configurar frontend/.env.local con las direcciones:" -ForegroundColor Yellow
Write-Host "   NEXT_PUBLIC_LOCAL_NFT_CONTRACT=0x..." -ForegroundColor White
Write-Host "   NEXT_PUBLIC_LOCAL_REWARD_CONTRACT=0x..." -ForegroundColor White
Write-Host "   NEXT_PUBLIC_LOCAL_Monad_CONTRACT=0x..." -ForegroundColor White
Write-Host "   NEXT_PUBLIC_BACKEND_API_URL=http://localhost:1880" -ForegroundColor White
Write-Host ""
Write-Host "4. TERMINAL 3 - Iniciar Node-RED:" -ForegroundColor Yellow
Write-Host "   node-red" -ForegroundColor White
Write-Host "   (O: npm install -g node-red si no esta instalado)" -ForegroundColor Gray
Write-Host ""
Write-Host "5. TERMINAL 4 - Iniciar Frontend:" -ForegroundColor Yellow
Write-Host "   cd frontend" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  SERVICIOS DISPONIBLES" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Hardhat Node: http://localhost:8545" -ForegroundColor Green
Write-Host "  Node-RED: http://localhost:1880" -ForegroundColor Green
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "Presiona cualquier tecla para continuar con el despliegue automatico..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Intentar despliegue automatico
Write-Host ""
Write-Host "Iniciando despliegue automatico..." -ForegroundColor Green

# Verificar si Hardhat node esta corriendo
Write-Host "Verificando Hardhat Node..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8545" -Method POST -Body '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' -ContentType "application/json" -TimeoutSec 2 -ErrorAction Stop
    Write-Host "OK: Hardhat Node esta corriendo" -ForegroundColor Green
    
    # Desplegar contratos
    Write-Host "Desplegando contratos..." -ForegroundColor Yellow
    Set-Location contracts
    npx hardhat run scripts/deploy-local.js --network localhost
    Set-Location ..
    
    # Leer direcciones
    $deploymentFile = "contracts\deployments\localhost.json"
    if (Test-Path $deploymentFile) {
        $deployment = Get-Content $deploymentFile | ConvertFrom-Json
        $nftContract = $deployment.contracts.creditNFT
        $rewardContract = $deployment.contracts.rewardSystem
        $MonadContract = $deployment.contracts.mockMonad
        
        Write-Host ""
        Write-Host "Contratos desplegados:" -ForegroundColor Green
        Write-Host "  CreditNFT: $nftContract"
        Write-Host "  RewardSystem: $rewardContract"
        Write-Host "  MockMonad: $MonadContract"
        
        # Crear .env.local
        $envContent = "NEXT_PUBLIC_LOCAL_NFT_CONTRACT=$nftContract`nNEXT_PUBLIC_LOCAL_REWARD_CONTRACT=$rewardContract`nNEXT_PUBLIC_LOCAL_Monad_CONTRACT=$MonadContract`nNEXT_PUBLIC_BACKEND_API_URL=http://localhost:1880`nNODE_ENV=development"
        $envFile = "frontend\.env.local"
        Set-Content -Path $envFile -Value $envContent
        Write-Host ""
        Write-Host "OK: Archivo frontend/.env.local creado" -ForegroundColor Green
    }
} catch {
    Write-Host "ERROR: Hardhat Node no esta corriendo" -ForegroundColor Red
    Write-Host "Por favor, inicia Hardhat Node manualmente en una terminal separada:" -ForegroundColor Yellow
    Write-Host "  cd contracts && npx hardhat node" -ForegroundColor White
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  DESPLIEGUE COMPLETADO" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ahora puedes:" -ForegroundColor Yellow
Write-Host "  1. Iniciar Node-RED: node-red" -ForegroundColor White
Write-Host "  2. Iniciar Frontend: cd frontend && npm run dev" -ForegroundColor White
Write-Host "  3. Abrir http://localhost:3000 en tu navegador" -ForegroundColor White
Write-Host ""








