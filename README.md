# 🎫 Trustlayerc - Tu Pasaporte Financiero Digital

> **Portátil y verificable en cualquier comercio**

Trustlayer es una plataforma descentralizada basada en blockchain que permite a los usuarios crear y gestionar un pasaporte financiero digital portátil. El sistema gamifica el comportamiento de pago puntual, recompensando a los usuarios con tokens Monad y NFTs que representan su historial crediticio.

![Trustlayerc](https://img.shields.io/badge/Trustlayerc-Blockchain-blue)
![Solidity](https://img.shields.io/badge/Solidity-0.8.20-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📋 Tabla de Contenidos

- [Problema que Resuelve](#-problema-que-resuelve)
- [Solución](#-solución)
- [Características Principales](#-características-principales)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Arquitectura](#-arquitectura)
- [Instalación](#-instalación)
- [Uso Rápido](#-uso-rápido)
- [Despliegue](#-despliegue)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Contratos Inteligentes](#-contratos-inteligentes)
- [Contribución al Ecosistema Blockchain](#-contribución-al-ecosistema-blockchain)
- [Roadmap](#-roadmap)
- [Licencia](#-licencia)

---

## 🎯 Problema que Resuelve

### El Problema de la Acreditación de Pago Puntual

En el sistema financiero tradicional, los usuarios enfrentan varios desafíos:

- ❌ **Falta de portabilidad**: El historial crediticio está fragmentado entre diferentes instituciones
- ❌ **Falta de transparencia**: Los usuarios no tienen control sobre sus datos crediticios
- ❌ **Barreras de acceso**: Personas sin historial crediticio tradicional tienen dificultades para acceder a servicios financieros
- ❌ **Falta de incentivos**: No hay recompensas por mantener un buen comportamiento de pago

### Impacto Social

Este problema afecta especialmente a:
- Personas sin historial crediticio tradicional
- Usuarios de servicios financieros informales
- Comunidades con acceso limitado a servicios bancarios tradicionales
- Emprendedores que necesitan demostrar su solvencia

---

## ✨ Solución

Trustlayerc utiliza **blockchain y NFTs** para crear un sistema de reputación crediticia:

1. **NFTs como Pasaportes Financieros**: Cada usuario recibe un NFT que contiene su historial de pagos, score y logros
2. **Gamificación**: Sistema de recompensas con tokens Monad por pagos puntuales
3. **Portabilidad**: Los NFTs son transferibles y verificables en cualquier comercio
4. **Transparencia**: Todo está registrado en blockchain de forma inmutable
5. **Inclusión Financiera**: Permite a usuarios sin historial tradicional construir su reputación

---

## 🚀 Características Principales

### Para Usuarios

- 🎫 **Pasaporte Financiero NFT**: NFT único que representa tu historial crediticio
- 🎮 **Sistema de Gamificación**: 
  - Niveles (Bronce, Plata, Oro, Platino, Diamante)
  - Recompensas en Monad por pagos consecutivos
  - Logros y badges por hitos alcanzados
- 📊 **Dashboard Completo**:
  - Visualización de score y progreso
  - Predicciones de score con IA
  - Calculadora de recompensas
  - Tabla de recompensas por nivel
- 💳 **Línea de Crédito Pre-aprobada**: Basada en tu Payment Score
- 📈 **Estadísticas y Análisis**: Gráficos de evolución, comparaciones, metas
- 🏆 **Leaderboard**: Ranking global de usuarios
- 🤖 **Asistente IA**: Chat para responder dudas sobre tu perfil
- 📱 **Compartir Logros**: Compartir en redes sociales (Facebook, X, Instagram)

### Para Comercios

- ✅ **Verificación Instantánea**: Verificar el historial crediticio de un usuario
- 🔒 **Datos Inmutables**: Información confiable en blockchain
- 📋 **Acceso Descentralizado**: Sin necesidad de bases de datos centralizadas

---

## 🛠 Tecnologías Utilizadas

### Frontend
- **Next.js 14** - Framework React con App Router
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **Wagmi v2** - Hooks para Ethereum
- **Viem** - Cliente de blockchain
- **Recharts** - Gráficos y visualizaciones
- **Lucide React** - Iconos

### Smart Contracts
- **Solidity 0.8.20** - Lenguaje de contratos
- **Hardhat** - Entorno de desarrollo
- **OpenZeppelin** - Contratos seguros y estándar
- **ERC-721** - Estándar NFT
- **ERC-20** - Estándar de tokens (Monad)

### Blockchain Networks
- **Monad** - Red principal L1 EVM-compatible (Mainnet Chain ID 143 y Testnet Chain ID 10143)
- **Hardhat Local** - Desarrollo local (Chain ID 31337)

### Backend (Opcional)
- **Node-RED** - Flujo de datos y APIs

---

## 🏗 Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Dashboard  │  │  Components  │  │   Wagmi/Viem │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────┘
                          │
                          │ Web3
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  Blockchain (Monad L1)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  CreditNFT   │  │ RewardSystem │  │  MockMonad    │   │
│  │   (ERC-721)  │  │              │  │   (ERC-20)   │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Flujo de Datos

1. Usuario conecta su wallet (MetaMask)
2. Frontend lee datos del NFT desde blockchain
3. Sistema calcula score y recompensas
4. Usuario realiza pagos → Se actualiza el NFT
5. Usuario recibe recompensas en Monad

---

## 📦 Instalación

### Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Git
- MetaMask (extensión del navegador)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/USERNAME/Trustlayerc.git
   cd Trustlayerc
   ```

2. **Instalar dependencias de contratos**
   ```bash
   cd contracts
   npm install
   ```

3. **Instalar dependencias del frontend**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configurar variables de entorno**
   ```bash
   # Copiar plantilla
   cp env.example.txt .env.local
   
   # Editar .env.local con tus direcciones de contratos
   ```

---

## 🚀 Uso Rápido

### Desarrollo Local

1. **Iniciar Hardhat Node** (Terminal 1)
   ```bash
   cd contracts
   npx hardhat node
   ```

2. **Desplegar contratos** (Terminal 2)
   ```bash
   cd contracts
   npm run deploy:local
   ```

3. **Iniciar frontend** (Terminal 3)
   ```bash
   cd frontend
   npm run dev
   ```

4. **Abrir en el navegador**
   - Ve a `http://localhost:3000`
   - Conecta MetaMask
   - Configura la red "Hardhat Local" (Chain ID: 31337)

### Scripts Automatizados

**Windows:**
```powershell
.\scripts\start-all.ps1
```

**Linux/Mac:**
```bash
chmod +x scripts/start-all.sh
./scripts/start-all.sh
```

---

## 🌐 Despliegue

### Frontend (Vercel/Netlify)

1. **Vercel** (Recomendado)
   ```bash
   npm install -g vercel
   cd frontend
   vercel
   ```

2. **Netlify**
   - Conectar repositorio en Netlify
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/.next`

### Contratos (Monad)

1. **Configurar variables de entorno**
   ```bash
   # En contracts/.env
   PRIVATE_KEY=tu_clave_privada
   MONAD_MAINNET_RPC=https://rpc.monad.xyz
   MONAD_TESTNET_RPC=https://testnet-rpc.monad.xyz
   ```

2. **Desplegar en Monad Testnet** (Chain ID 10143)
   ```bash
   cd contracts
   npm run deploy:monad-testnet
   ```

3. **Desplegar en Monad Mainnet** (Chain ID 143)
   ```bash
   npm run deploy:monad
   ```

4. **Verificar contratos**
   ```bash
   npm run verify:monad -- CONTRACT_ADDRESS [args_del_constructor]
   ```

📖 **Guías detalladas:**
- [Despliegue Completo](./DESPLIEGUE_COMPLETO.md)
- [Guía de Despliegue](./GUIA_DESPLIEGUE.md)
- [Guía Mainnet](./GUIA_MAINNET.md)

---

## 📁 Estructura del Proyecto

```
Trustlayerc/
├── contracts/              # Smart Contracts
│   ├── contracts/          # Código Solidity
│   │   ├── CreditNFT.sol   # NFT de reputación crediticia
│   │   ├── RewardSystem.sol # Sistema de recompensas
│   │   └── MockMonad.sol    # Token Monad (ERC-20)
│   ├── scripts/            # Scripts de despliegue
│   ├── test/               # Tests de contratos
│   └── hardhat.config.js   # Configuración Hardhat
│
├── frontend/               # Aplicación Next.js
│   ├── src/
│   │   ├── app/            # Páginas (App Router)
│   │   ├── components/     # Componentes React
│   │   │   ├── DashboardTabs.tsx
│   │   │   ├── NFTCard.tsx
│   │   │   ├── RewardsTable.tsx
│   │   │   ├── AIChat.tsx
│   │   │   └── ... (21 componentes)
│   │   ├── hooks/          # Custom hooks
│   │   └── contexts/       # React contexts
│   ├── public/             # Archivos estáticos
│   └── package.json
│
├── scripts/                # Scripts de automatización
│   ├── start-all.ps1       # Windows
│   ├── start-all.sh        # Linux/Mac
│   └── deploy-complete.ps1
│
└── docs/                    # Documentación
    ├── DESPLIEGUE_COMPLETO.md
    ├── GUIA_DESPLIEGUE.md
    └── ...
```

---

## 🔐 Contratos Inteligentes

### CreditNFT (ERC-721)

**Funcionalidad:**
- Representa el pasaporte financiero del usuario
- Almacena: Payment Score, Pagos Consecutivos, Celo Wallet
- Transferible entre wallets
- Metadata URI para visualización

**Funciones principales:**
- `mintCreditNFT()` - Crear nuevo NFT
- `recordPayment()` - Registrar pago y actualizar score
- `linkCeloWallet()` - Vincular wallet de Celo
- `getCreditData()` - Obtener datos del NFT

### RewardSystem

**Funcionalidad:**
- Distribuye recompensas en Monad
- Calcula recompensas basadas en nivel y racha
- Gestiona bonos por hitos alcanzados

**Funciones principales:**
- `calculateReward()` - Calcular recompensa
- `distributeReward()` - Distribuir Monad
- `getUserRewards()` - Obtener historial de recompensas

### MockMonad (ERC-20)

**Funcionalidad:**
- Token de recompensa Monad
- Transferible y compatible con wallets estándar
- Usado para recompensar pagos puntuales

---

## 🌍 Contribución al Ecosistema Blockchain

### Para Monad

- ✅ **Alto rendimiento**: Aprovecha la ejecución paralela y finalidad rápida de Monad (L1 EVM-compatible)
- ✅ **Token de recompensa Monad**: Token ERC-20 (mMonad) desplegado en Monad para gamificar pagos puntuales
- ✅ **Inclusión Financiera**: Solución para usuarios no bancarizados
- ✅ **Casos de Uso Reales**: Solución práctica para un problema real, con costos de gas bajos

### Para el Ecosistema General

- 🔒 **Privacidad**: Usuario controla sus datos
- 🌐 **Descentralización**: Sin dependencia de entidades centralizadas
- 🔄 **Interoperabilidad**: NFTs estándar (ERC-721) compatibles con cualquier wallet
- 📊 **Transparencia**: Todo registrado en blockchain de forma inmutable

---

## 🎯 Roadmap

### Fase 1: Fundación ✅
- [x] Contratos inteligentes
- [x] Frontend básico
- [x] Integración con MetaMask
- [x] Sistema de gamificación

### Fase 2: Mejoras (En Progreso)
- [ ] Integración real con contratos (eliminar modo demo)
- [ ] Despliegue en producción
- [ ] Tests automatizados
- [ ] Optimización de rendimiento

### Fase 3: Expansión (Futuro)
- [ ] App móvil (React Native)
- [ ] Integración con más redes
- [ ] API pública para comercios
- [ ] Programa de referidos
- [ ] DAO para gobernanza

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👥 Equipo

Desarrollado para el Hackathon de Blockchain - 2025

---

## 📞 Contacto y Soporte

- **Issues**: [GitHub Issues](https://github.com/USERNAME/Trustlayerc/issues)
- **Documentación**: Ver carpeta `docs/`
- **Guía Rápida**: [INICIO_RAPIDO.md](./INICIO_RAPIDO.md)

---

## 🙏 Agradecimientos

- **OpenZeppelin** - Contratos seguros
- **Celo** - Red blockchain
- **Next.js** - Framework React
- **Wagmi** - Hooks para Ethereum

---

<div align="center">

**Hecho con ❤️ para la inclusión financiera**

⭐ Si te gusta este proyecto, ¡dale una estrella!

</div>

