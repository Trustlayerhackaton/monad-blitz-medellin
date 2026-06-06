const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Desplegando contratos en red local...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Desplegando con la cuenta:", deployer.address);
  console.log("Balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString(), "\n");

  // 1. Desplegar MockCCOP
  console.log("1️⃣ Desplegando MockCCOP...");
  const MockCCOP = await hre.ethers.getContractFactory("MockCCOP");
  const mockCCOP = await MockCCOP.deploy(deployer.address);
  await mockCCOP.waitForDeployment();
  const mockCCOPAddress = await mockCCOP.getAddress();
  console.log("✅ MockCCOP desplegado en:", mockCCOPAddress);

  await mockCCOP.mint(deployer.address, hre.ethers.parseEther("1000000"));
  console.log("✅ Tokens minteados para deployer\n");

  // 2. Desplegar CreditNFT
  console.log("2️⃣ Desplegando CreditNFT...");
  const CreditNFT = await hre.ethers.getContractFactory("CreditNFT");
  const creditNFT = await CreditNFT.deploy(deployer.address);
  await creditNFT.waitForDeployment();
  const creditNFTAddress = await creditNFT.getAddress();
  console.log("✅ CreditNFT desplegado en:", creditNFTAddress);

  await creditNFT.authorizeMinter(deployer.address);
  console.log("✅ Deployer autorizado como minter\n");

  // 3. Desplegar RewardSystem
  console.log("3️⃣ Desplegando RewardSystem...");
  const RewardSystem = await hre.ethers.getContractFactory("RewardSystem");
  const rewardSystem = await RewardSystem.deploy(deployer.address, mockCCOPAddress, creditNFTAddress);
  await rewardSystem.waitForDeployment();
  const rewardSystemAddress = await rewardSystem.getAddress();
  console.log("✅ RewardSystem desplegado en:", rewardSystemAddress);

  await rewardSystem.authorizeRegistrar(deployer.address);
  console.log("✅ Deployer autorizado como registrador\n");

  // 4. Depositar fondos en RewardSystem
  console.log("4️⃣ Depositando fondos en RewardSystem...");
  const depositAmount = hre.ethers.parseEther("100000");
  await mockCCOP.approve(rewardSystemAddress, depositAmount);
  await rewardSystem.depositFunds(depositAmount);
  console.log("✅ Fondos depositados:", hre.ethers.formatEther(depositAmount), "mcCOP\n");

  // Guardar información de despliegue
  const deploymentInfo = {
    network: "localhost",
    chainId: 31337,
    deployer: deployer.address,
    contracts: {
      mockCCOP: mockCCOPAddress,
      creditNFT: creditNFTAddress,
      rewardSystem: rewardSystemAddress,
    },
    timestamp: new Date().toISOString(),
  };

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentFile = path.join(deploymentsDir, "localhost.json");
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

  console.log("📄 Información de despliegue guardada en:", deploymentFile);
  console.log("\n" + "=".repeat(60));
  console.log("🎉 ¡Despliegue completado exitosamente!");
  console.log("=".repeat(60));
  console.log("\n📋 Direcciones de contratos:\n");
  console.log("MockCCOP:", mockCCOPAddress);
  console.log("CreditNFT:", creditNFTAddress);
  console.log("RewardSystem:", rewardSystemAddress);
  console.log("\n💡 Configura estas direcciones en frontend/.env.local:");
  console.log(`NEXT_PUBLIC_LOCAL_NFT_CONTRACT=${creditNFTAddress}`);
  console.log(`NEXT_PUBLIC_LOCAL_REWARD_CONTRACT=${rewardSystemAddress}`);
  console.log(`NEXT_PUBLIC_LOCAL_CCOP_CONTRACT=${mockCCOPAddress}`);
  console.log("\n");

  // Crear un NFT de prueba para el deployer
  console.log("5️⃣ Creando NFT de prueba para el deployer...");
  try {
    const tokenURI = "https://api.confianzamovil.com/nft/1";
    const tx = await creditNFT.mintCreditNFT(deployer.address, 850, 5, tokenURI);
    await tx.wait();
    const tokenId = await creditNFT.getActiveToken(deployer.address);
    console.log("✅ NFT de prueba creado - Token ID:", tokenId.toString());

    console.log("\n6️⃣ Registrando pago de prueba...");
    const rewardTx = await rewardSystem.recordPayment(tokenId);
    await rewardTx.wait();
    console.log("✅ Pago registrado y recompensa otorgada\n");
  } catch (error) {
    console.log("⚠️ Error al crear NFT de prueba:", error.message);
  }

  // Crear archivo .env.local automáticamente
  const frontendEnvPath = path.join(__dirname, "..", "..", "frontend", ".env.local");
  const envContent = `NEXT_PUBLIC_LOCAL_NFT_CONTRACT=${creditNFTAddress}
NEXT_PUBLIC_LOCAL_REWARD_CONTRACT=${rewardSystemAddress}
NEXT_PUBLIC_LOCAL_CCOP_CONTRACT=${mockCCOPAddress}
NODE_ENV=development
`;
  
  try {
    fs.writeFileSync(frontendEnvPath, envContent);
    console.log("✅ Archivo frontend/.env.local creado automáticamente");
  } catch (error) {
    console.log("⚠️ No se pudo crear .env.local automáticamente:", error.message);
  }
  console.log("\n");

  return deploymentInfo;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

