# Script para iniciar todos los servicios en terminales separadas
# Ejecutar desde la raíz del proyecto

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  INICIANDO SERVICIOS - CONFIANZA MOVIL" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = $PWD.Path
Write-Host "Directorio del proyecto: $projectRoot" -ForegroundColor Gray
Write-Host ""

# Verificar estructura
if (-not (Test-Path "contracts")) {
    Write-Host "ERROR: Directorio contracts no encontrado" -ForegroundColor Red
    exit 1
}
if (-not (Test-Path "frontend")) {
    Write-Host "ERROR: Directorio frontend no encontrado" -ForegroundColor Red
    exit 1
}

# 1. Iniciar Hardhat Node en terminal nueva
Write-Host "1. Abriendo terminal para Hardhat Node..." -ForegroundColor Yellow
$hardhatPath = Join-Path $projectRoot "contracts"
$hardhatCommand = "cd '$hardhatPath'; Write-Host '===============================================' -ForegroundColor Green; Write-Host '  HARDHAT NODE' -ForegroundColor Green; Write-Host '===============================================' -ForegroundColor Green; Write-Host ''; Write-Host 'Iniciando Hardhat Node en http://localhost:8545...' -ForegroundColor Cyan; Write-Host ''; npx hardhat node"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $hardhatCommand
Write-Host "   Terminal de Hardhat Node abierta" -ForegroundColor Green
Write-Host "   Esperando 10 segundos para que el nodo inicie..." -ForegroundColor Gray
Start-Sleep -Seconds 10

# 2. Desplegar contratos
Write-Host ""
Write-Host "2. Desplegando contratos..." -ForegroundColor Yellow
Set-Location contracts

# Esperar a que el nodo esté listo
$maxAttempts = 15
$attempt = 0
$nodeReady = $false
while (-not $nodeReady -and $attempt -lt $maxAttempts) {
    try {
        $body = '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
        $response = Invoke-WebRequest -Uri "http://localhost:8545" -Method POST -Body $body -ContentType "application/json" -TimeoutSec 2 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            $nodeReady = $true
            Write-Host "   Hardhat Node está listo!" -ForegroundColor Green
        }
    } catch {
        $attempt++
        Start-Sleep -Seconds 2
        Write-Host "   Esperando nodo... ($attempt/$maxAttempts)" -ForegroundColor Gray
    }
}

if (-not $nodeReady) {
    Write-Host "   ADVERTENCIA: Hardhat Node puede no estar listo aún" -ForegroundColor Yellow
    Write-Host "   Esperando 5 segundos adicionales..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
}

# Compilar si es necesario
Write-Host "   Compilando contratos..." -ForegroundColor Gray
npx hardhat compile 2>&1 | Out-Null

# Desplegar contratos
Write-Host "   Desplegando contratos en localhost..." -ForegroundColor Gray
npx hardhat run scripts/deploy-local.js --network localhost

Set-Location ..

# Leer direcciones de contratos
Write-Host ""
Write-Host "3. Configurando frontend..." -ForegroundColor Yellow
$deploymentFile = Join-Path "contracts" "deployments\localhost.json"
if (Test-Path $deploymentFile) {
    $deployment = Get-Content $deploymentFile -Raw | ConvertFrom-Json
    $nftContract = $deployment.contracts.creditNFT
    $rewardContract = $deployment.contracts.rewardSystem
    $MonadContract = $deployment.contracts.mockMonad
    
    Write-Host "   Contratos desplegados:" -ForegroundColor Green
    Write-Host "     CreditNFT: $nftContract" -ForegroundColor White
    Write-Host "     RewardSystem: $rewardContract" -ForegroundColor White
    Write-Host "     MockMonad: $MonadContract" -ForegroundColor White
    
    # Crear .env.local
    $envFile = Join-Path "frontend" ".env.local"
    $envContent = @"
NEXT_PUBLIC_LOCAL_NFT_CONTRACT=$nftContract
NEXT_PUBLIC_LOCAL_REWARD_CONTRACT=$rewardContract
NEXT_PUBLIC_LOCAL_Monad_CONTRACT=$MonadContract
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:1880
NODE_ENV=development
"@
    Set-Content -Path $envFile -Value $envContent -Encoding UTF8
    Write-Host "   Archivo frontend/.env.local creado" -ForegroundColor Green
} else {
    Write-Host "   ADVERTENCIA: No se encontró archivo de despliegue" -ForegroundColor Yellow
    Write-Host "   Las direcciones deberán configurarse manualmente" -ForegroundColor Yellow
}

# 4. Iniciar Node-RED en terminal nueva
Write-Host ""
Write-Host "4. Abriendo terminal para Node-RED..." -ForegroundColor Yellow
$nodeRedCommand = "Write-Host '===============================================' -ForegroundColor Red; Write-Host '  NODE-RED' -ForegroundColor Red; Write-Host '===============================================' -ForegroundColor Red; Write-Host ''; Write-Host 'Iniciando Node-RED en http://localhost:1880...' -ForegroundColor Cyan; Write-Host ''; if (Get-Command node-red -ErrorAction SilentlyContinue) { node-red } else { Write-Host 'ERROR: Node-RED no esta instalado.' -ForegroundColor Red; Write-Host 'Instala con: npm install -g node-red' -ForegroundColor Yellow; Write-Host ''; Write-Host 'Presiona cualquier tecla para cerrar...' -ForegroundColor Gray; $null = `$Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown') }"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $nodeRedCommand
Write-Host "   Terminal de Node-RED abierta" -ForegroundColor Green
Start-Sleep -Seconds 2

# 5. Iniciar Frontend en terminal nueva
Write-Host ""
Write-Host "5. Abriendo terminal para Frontend..." -ForegroundColor Yellow
$frontendPath = Join-Path $projectRoot "frontend"
$frontendCommand = "cd '$frontendPath'; Write-Host '===============================================' -ForegroundColor Blue; Write-Host '  FRONTEND - NEXT.JS' -ForegroundColor Blue; Write-Host '===============================================' -ForegroundColor Blue; Write-Host ''; Write-Host 'Iniciando Frontend en http://localhost:3000...' -ForegroundColor Cyan; Write-Host ''; if (-not (Test-Path 'node_modules')) { Write-Host 'Instalando dependencias...' -ForegroundColor Yellow; npm install }; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCommand
Write-Host "   Terminal de Frontend abierta" -ForegroundColor Green

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  SERVICIOS INICIADOS" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Servicios disponibles en:" -ForegroundColor Green
Write-Host "  Hardhat Node: http://localhost:8545" -ForegroundColor White
Write-Host "  Node-RED:     http://localhost:1880" -ForegroundColor White
Write-Host "  Frontend:     http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "NOTAS:" -ForegroundColor Yellow
Write-Host "  - Hardhat Node debe estar completamente iniciado antes de usar el frontend" -ForegroundColor Gray
Write-Host "  - Si Node-RED no esta instalado, ejecuta: npm install -g node-red" -ForegroundColor Gray
Write-Host "  - Espera a que el frontend compile completamente antes de abrirlo en el navegador" -ForegroundColor Gray
Write-Host ""
Write-Host "Presiona cualquier tecla para cerrar esta ventana..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")








