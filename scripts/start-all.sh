#!/bin/bash
# Script de inicio completo para Linux/Mac
# Inicia: Hardhat Node, Node-RED, y Frontend

echo "🚀 Iniciando Confianza Móvil - Despliegue Completo"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -d "contracts" ]; then
    echo "❌ Error: Ejecuta este script desde la raíz del proyecto"
    exit 1
fi

# Función para verificar puertos
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo "⚠️  Puerto $1 ya está en uso"
    fi
}

# Verificar puertos
echo "🔍 Verificando puertos..."
check_port 8545
check_port 1880
check_port 3000
echo ""

# 1. Iniciar Hardhat Node
echo "1️⃣ Iniciando Hardhat Node..."
cd contracts
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias de contratos..."
    npm install
fi
cd ..

# Iniciar Hardhat en background
gnome-terminal -- bash -c "cd contracts && echo '🔷 Hardhat Node iniciado en http://localhost:8545' && npx hardhat node; exec bash" 2>/dev/null || \
xterm -e "cd contracts && echo '🔷 Hardhat Node iniciado en http://localhost:8545' && npx hardhat node" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd \"'$(pwd)'/contracts\" && echo \"🔷 Hardhat Node iniciado en http://localhost:8545\" && npx hardhat node"' 2>/dev/null || \
echo "⚠️  Abre una nueva terminal y ejecuta: cd contracts && npx hardhat node"

sleep 5

# 2. Desplegar contratos
echo "2️⃣ Desplegando contratos..."
cd contracts
npx hardhat run scripts/deploy-local.js --network localhost
cd ..

# Leer direcciones de contratos
if [ -f "contracts/deployments/localhost.json" ]; then
    NFT_CONTRACT=$(cat contracts/deployments/localhost.json | grep -o '"creditNFT": "[^"]*"' | cut -d'"' -f4)
    REWARD_CONTRACT=$(cat contracts/deployments/localhost.json | grep -o '"rewardSystem": "[^"]*"' | cut -d'"' -f4)
    Monad_CONTRACT=$(cat contracts/deployments/localhost.json | grep -o '"mockMonad": "[^"]*"' | cut -d'"' -f4)
    
    echo ""
    echo "✅ Contratos desplegados:"
    echo "   CreditNFT: $NFT_CONTRACT"
    echo "   RewardSystem: $REWARD_CONTRACT"
    echo "   MockMonad: $Monad_CONTRACT"
    echo ""
    
    # Crear .env.local para frontend
    cat > frontend/.env.local << EOF
NEXT_PUBLIC_LOCAL_NFT_CONTRACT=$NFT_CONTRACT
NEXT_PUBLIC_LOCAL_REWARD_CONTRACT=$REWARD_CONTRACT
NEXT_PUBLIC_LOCAL_Monad_CONTRACT=$Monad_CONTRACT
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:1880
NODE_ENV=development
EOF
    
    echo "✅ Archivo frontend/.env.local creado"
else
    echo "⚠️  No se encontró archivo de despliegue"
fi

# 3. Iniciar Node-RED
echo "3️⃣ Iniciando Node-RED..."
if command -v node-red &> /dev/null; then
    gnome-terminal -- bash -c "echo '🔴 Node-RED iniciado en http://localhost:1880' && node-red; exec bash" 2>/dev/null || \
    xterm -e "echo '🔴 Node-RED iniciado en http://localhost:1880' && node-red" 2>/dev/null || \
    osascript -e 'tell app "Terminal" to do script "echo \"🔴 Node-RED iniciado en http://localhost:1880\" && node-red"' 2>/dev/null || \
    echo "⚠️  Abre una nueva terminal y ejecuta: node-red"
else
    echo "⚠️  Node-RED no está instalado. Instalando..."
    npm install -g node-red
    gnome-terminal -- bash -c "echo '🔴 Node-RED iniciado en http://localhost:1880' && node-red; exec bash" 2>/dev/null || \
    echo "⚠️  Abre una nueva terminal y ejecuta: node-red"
fi
sleep 3

# 4. Iniciar Frontend
echo "4️⃣ Iniciando Frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias del frontend..."
    npm install
fi
cd ..

gnome-terminal -- bash -c "cd frontend && echo '🌐 Frontend iniciado en http://localhost:3000' && npm run dev; exec bash" 2>/dev/null || \
xterm -e "cd frontend && echo '🌐 Frontend iniciado en http://localhost:3000' && npm run dev" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd \"'$(pwd)'/frontend\" && echo \"🌐 Frontend iniciado en http://localhost:3000\" && npm run dev"' 2>/dev/null || \
echo "⚠️  Abre una nueva terminal y ejecuta: cd frontend && npm run dev"

echo ""
echo "============================================================"
echo "✅ ¡Despliegue completo!"
echo "============================================================"
echo ""
echo "📍 Servicios disponibles:"
echo "   🔷 Hardhat Node: http://localhost:8545"
echo "   🔴 Node-RED: http://localhost:1880"
echo "   🌐 Frontend: http://localhost:3000"
echo ""
echo "💡 Abre http://localhost:3000 en tu navegador"
echo ""










