const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Desplegando contratos en MAINNET...\n");
  console.log("⚠️  ADVERTENCIA: Estás desplegando en MAINNET con tokens REALES\n");

  const network = hre.network.name;
  const chainId = (await hre.ethers.provider.getNetwork()).chainId;
  
  console.log(`Red: ${network}`);
  console.log(`Chain ID: ${chainId}\n`);

  // Validar que es mainnet
  const mainnetChainIds = {
    "monad": 143,
  };

  if (!mainnetChainIds[network] || mainnetChainIds[network] !== Number(chainId)) {
    console.error("❌ ERROR: Este script solo funciona para Mainnet!");
    console.error(`Red detectada: ${network}, Chain ID: ${chainId}`);
    console.error("Usa: --network monad");
    process.exit(1);
  }

  const [deployer] = await hre.ethers.getSigners();
  console.log("Desplegando con la cuenta:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  const balanceFormatted = hre.ethers.formatEther(balance);
  console.log("Balance:", balanceFormatted, "MON", "\n");

  // Validar balance mínimo
  const minBalance = hre.ethers.parseEther("0.1");
  if (balance < minBalance) {
    console.error("❌ ERROR: Balance insuficiente para desplegar en Mainnet!");
    console.error(`Balance actual: ${balanceFormatted}`);
    console.error("Balance mínimo recomendado: 0.1 MON");
    console.error("\n💡 Obtén MON en:");
    console.error("   - Exchange compatible con Monad (MON)");
    console.error("   - Transferir a tu wallet MetaMask");
    process.exit(1);
  }

  console.log("✅ Balance suficiente. Continuando con el despliegue...\n");

  // Confirmación final
  console.log("=".repeat(60));
  console.log("⚠️  ÚLTIMA CONFIRMACIÓN");
  console.log("=".repeat(60));
  console.log("Estás a punto de desplegar en MAINNET.");
  console.log("Esto costará tokens REALES y las transacciones son PERMANENTES.");
  console.log("Presiona Ctrl+C para cancelar o espera 5 segundos...\n");
  
  await new Promise(resolve => setTimeout(resolve, 5000));

  // 1. Desplegar MockMonad
  console.log("1️⃣ Desplegando MockMonad...");
  const MockMonad = await hre.ethers.getContractFactory("MockMonad");
  const mockMonad = await MockMonad.deploy(deployer.address);
  await mockMonad.waitForDeployment();
  const mockMonadAddress = await mockMonad.getAddress();
  console.log("✅ MockMonad desplegado en:", mockMonadAddress);

  // Mint tokens iniciales
  try {
    const mintTx = await mockMonad.mint(deployer.address, hre.ethers.parseEther("1000000"));
    await mintTx.wait();
    console.log("✅ Tokens minteados para deployer\n");
  } catch (error) {
    console.log("⚠️ Error al mintear tokens:", error.message, "\n");
  }

  // 2. Desplegar CreditNFT
  console.log("2️⃣ Desplegando CreditNFT...");
  const CreditNFT = await hre.ethers.getContractFactory("CreditNFT");
  const creditNFT = await CreditNFT.deploy(deployer.address);
  await creditNFT.waitForDeployment();
  const creditNFTAddress = await creditNFT.getAddress();
  console.log("✅ CreditNFT desplegado en:", creditNFTAddress);

  // Autorizar minter
  try {
    const authTx = await creditNFT.authorizeMinter(deployer.address);
    await authTx.wait();
    console.log("✅ Deployer autorizado como minter\n");
  } catch (error) {
    console.log("⚠️ Error al autorizar minter:", error.message, "\n");
  }

  // 3. Desplegar RewardSystem
  console.log("3️⃣ Desplegando RewardSystem...");
  const RewardSystem = await hre.ethers.getContractFactory("RewardSystem");
  const rewardSystem = await RewardSystem.deploy(deployer.address, mockMonadAddress, creditNFTAddress);
  await rewardSystem.waitForDeployment();
  const rewardSystemAddress = await rewardSystem.getAddress();
  console.log("✅ RewardSystem desplegado en:", rewardSystemAddress);

  // Autorizar registrador
  try {
    const regTx = await rewardSystem.authorizeRegistrar(deployer.address);
    await regTx.wait();
    console.log("✅ Deployer autorizado como registrador\n");
  } catch (error) {
    console.log("⚠️ Error al autorizar registrador:", error.message, "\n");
  }

  // 4. Depositar fondos en RewardSystem
  console.log("4️⃣ Depositando fondos en RewardSystem...");
  try {
    const depositAmount = hre.ethers.parseEther("100000");
    const approveTx = await mockMonad.approve(rewardSystemAddress, depositAmount);
    await approveTx.wait();
    const depositTx = await rewardSystem.depositFunds(depositAmount);
    await depositTx.wait();
    console.log("✅ Fondos depositados:", hre.ethers.formatEther(depositAmount), "mMonad\n");
  } catch (error) {
    console.log("⚠️ Error al depositar fondos:", error.message, "\n");
  }

  // Guardar información de despliegue
  const deploymentInfo = {
    network: network,
    chainId: chainId.toString(),
    deployer: deployer.address,
    contracts: {
      mockMonad: mockMonadAddress,
      creditNFT: creditNFTAddress,
      rewardSystem: rewardSystemAddress,
    },
    timestamp: new Date().toISOString(),
    explorer: getExplorerUrl(network, chainId),
  };

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentFile = path.join(deploymentsDir, `${network}-mainnet.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

  console.log("📄 Información de despliegue guardada en:", deploymentFile);
  console.log("\n" + "=".repeat(60));
  console.log("🎉 ¡Despliegue en MAINNET completado exitosamente!");
  console.log("=".repeat(60));
  console.log("\n📋 Direcciones de contratos:\n");
  console.log("MockMonad:", mockMonadAddress);
  console.log("CreditNFT:", creditNFTAddress);
  console.log("RewardSystem:", rewardSystemAddress);
  
  if (deploymentInfo.explorer) {
    console.log("\n🔍 Explorador de bloques:");
    console.log(`MockMonad: ${deploymentInfo.explorer}/address/${mockMonadAddress}`);
    console.log(`CreditNFT: ${deploymentInfo.explorer}/address/${creditNFTAddress}`);
    console.log(`RewardSystem: ${deploymentInfo.explorer}/address/${rewardSystemAddress}`);
  }

  console.log("\n💡 Configura estas direcciones en frontend/.env.production:");
  console.log(`NEXT_PUBLIC_MONAD_NFT_CONTRACT=${creditNFTAddress}`);
  console.log(`NEXT_PUBLIC_MONAD_REWARD_CONTRACT=${rewardSystemAddress}`);
  console.log(`NEXT_PUBLIC_MONAD_Monad_CONTRACT=${mockMonadAddress}`);
  console.log(`NEXT_PUBLIC_MONAD_CHAIN_ID=143`);
  console.log("\n");

  console.log("📝 Próximos pasos:");
  console.log("1. Verifica los contratos en el explorador de bloques");
  console.log("2. Actualiza las variables de entorno del frontend");
  console.log("3. Despliega el frontend en Vercel o similar");
  console.log("4. Prueba las funcionalidades en Mainnet");
  console.log("\n");

  return deploymentInfo;
}

function getExplorerUrl(network, chainId) {
  const explorers = {
    "monad": "https://monadscan.com",
  };

  if (explorers[network]) {
    return explorers[network];
  }

  // Por chainId
  const chainIdMap = {
    "143": "https://monadscan.com", // Monad Mainnet
  };

  return chainIdMap[chainId.toString()] || null;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ ERROR durante el despliegue:");
    console.error(error);
    process.exit(1);
  });

