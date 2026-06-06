# Script de inicio completo para Windows PowerShell
# Inicia: Hardhat Node, Node-RED, y Frontend

Write-Host "Iniciando Confianza Movil - Despliegue Completo" -ForegroundColor Green
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "contracts")) {
    Write-Host "Error: Ejecuta este script desde la raiz del proyecto" -ForegroundColor Red
    exit 1
}

# 1. Iniciar Hardhat Node
Write-Host "1. Iniciando Hardhat Node..." -ForegroundColor Cyan
$hardhatPath = Join-Path $PWD "contracts"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$hardhatPath'; Write-Host 'Hardhat Node iniciado en http://localhost:8545' -ForegroundColor Green; npx hardhat node" -WindowStyle Normal
Write-Host "   Esperando a que Hardhat Node este listo..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Verificar que el nodo esté listo
$maxAttempts = 10
$attempt = 0
$nodeReady = $false
while (-not $nodeReady -and $attempt -lt $maxAttempts) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8545" -Method POST -Body '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' -ContentType "application/json" -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $nodeReady = $true
            Write-Host "   Hardhat Node esta listo!" -ForegroundColor Green
        }
    } catch {
        $attempt++
        Start-Sleep -Seconds 2
    }
}

if (-not $nodeReady) {
    Write-Host "   Advertencia: Hardhat Node puede no estar listo. Continuando..." -ForegroundColor Yellow
}

# 2. Compilar y desplegar contratos
Write-Host "2. Compilando contratos..." -ForegroundColor Cyan
Set-Location contracts
if (-not (Test-Path "node_modules")) {
    Write-Host "Instalando dependencias de contratos..." -ForegroundColor Yellow
    npm install
}
npx hardhat compile
Write-Host "3. Desplegando contratos..." -ForegroundColor Cyan
Start-Sleep -Seconds 2
npx hardhat run scripts/deploy-local.js --network localhost
Set-Location ..

# Leer direcciones de contratos del archivo de despliegue
$deploymentFile = Join-Path "contracts" "deployments\localhost.json"
if (Test-Path $deploymentFile) {
    $deployment = Get-Content $deploymentFile | ConvertFrom-Json
    $nftContract = $deployment.contracts.creditNFT
    $rewardContract = $deployment.contracts.rewardSystem
    $MonadContract = $deployment.contracts.mockMonad
    
    Write-Host ""
    Write-Host "Contratos desplegados:" -ForegroundColor Green
    Write-Host "   CreditNFT: $nftContract"
    Write-Host "   RewardSystem: $rewardContract"
    Write-Host "   MockMonad: $MonadContract"
    Write-Host ""
    
    # Crear .env.local para frontend
    $envContent = "NEXT_PUBLIC_LOCAL_NFT_CONTRACT=$nftContract`nNEXT_PUBLIC_LOCAL_REWARD_CONTRACT=$rewardContract`nNEXT_PUBLIC_LOCAL_Monad_CONTRACT=$MonadContract`nNEXT_PUBLIC_BACKEND_API_URL=http://localhost:1880`nNODE_ENV=development"
    
    $envFile = Join-Path "frontend" ".env.local"
    Set-Content -Path $envFile -Value $envContent
    Write-Host "Archivo frontend/.env.local creado" -ForegroundColor Green
} else {
    Write-Host "No se encontro archivo de despliegue" -ForegroundColor Yellow
}

# 3. Iniciar Node-RED
Write-Host "3. Iniciando Node-RED..." -ForegroundColor Cyan
if (Get-Command node-red -ErrorAction SilentlyContinue) {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Node-RED iniciado en http://localhost:1880' -ForegroundColor Green; node-red" -WindowStyle Normal
} else {
    Write-Host "Node-RED no esta instalado. Instalando..." -ForegroundColor Yellow
    npm install -g node-red
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Node-RED iniciado en http://localhost:1880' -ForegroundColor Green; node-red" -WindowStyle Normal
}
Start-Sleep -Seconds 3

# 4. Iniciar Frontend
Write-Host "4. Iniciando Frontend..." -ForegroundColor Cyan
$frontendPath = Join-Path $PWD "frontend"
Set-Location frontend
if (-not (Test-Path "node_modules")) {
    Write-Host "Instalando dependencias del frontend..." -ForegroundColor Yellow
    npm install
}
Set-Location ..
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host 'Frontend iniciado en http://localhost:3000' -ForegroundColor Green; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "Despliegue completo!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Servicios disponibles:" -ForegroundColor Cyan
Write-Host "   Hardhat Node: http://localhost:8545"
Write-Host "   Node-RED: http://localhost:1880"
Write-Host "   Frontend: http://localhost:3000"
Write-Host ""
Write-Host "Abre http://localhost:3000 en tu navegador" -ForegroundColor Yellow
Write-Host ""
