// Despliega el módulo de riesgo de TrustLayer (WalletRegistry + RiskScoreOracle)
// y lo conecta con el CreditNFT ya desplegado.
//
// Requiere que CreditNFT/MockCCOP/RewardSystem ya estén desplegados (lee
// deployments/<network>.json). En local: corre antes `npm run deploy:local`.
//
// Variables de entorno opcionales:
//   SCORE_FEE_WEI    Tarifa por publicar score, en wei (default 0.01 MON)
//   ORACLE_SIGNER    Firmante autorizado del oráculo (default: deployer)
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const net = hre.network.name;
  console.log(`🚀 Desplegando módulo de riesgo TrustLayer en "${net}"...\n`);

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);

  // 1. Cargar despliegue previo (CreditNFT, etc.)
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  const deploymentFile = path.join(deploymentsDir, `${net}.json`);
  if (!fs.existsSync(deploymentFile)) {
    throw new Error(
      `No existe ${deploymentFile}. Despliega primero los contratos base ` +
        `(p. ej. "npm run deploy:local").`
    );
  }
  const deployment = JSON.parse(fs.readFileSync(deploymentFile));
  const creditNFTAddress = deployment.contracts.creditNFT;
  if (!creditNFTAddress) throw new Error("creditNFT no encontrado en el despliegue.");
  console.log("CreditNFT existente:", creditNFTAddress, "\n");

  // Parámetros configurables
  const scoreFee = process.env.SCORE_FEE_WEI
    ? BigInt(process.env.SCORE_FEE_WEI)
    : hre.ethers.parseEther("0.01");
  const oracleSigner = process.env.ORACLE_SIGNER || deployer.address;

  // 2. WalletRegistry
  console.log("1️⃣ Desplegando WalletRegistry...");
  const WalletRegistry = await hre.ethers.getContractFactory("WalletRegistry");
  const walletRegistry = await WalletRegistry.deploy();
  await walletRegistry.waitForDeployment();
  const walletRegistryAddress = await walletRegistry.getAddress();
  console.log("✅ WalletRegistry:", walletRegistryAddress, "\n");

  // 3. RiskScoreOracle
  console.log("2️⃣ Desplegando RiskScoreOracle...");
  console.log("   - admin/oracleSigner:", oracleSigner);
  console.log("   - scoreFee (wei):", scoreFee.toString());
  const RiskScoreOracle = await hre.ethers.getContractFactory("RiskScoreOracle");
  const riskOracle = await RiskScoreOracle.deploy(deployer.address, oracleSigner, scoreFee);
  await riskOracle.waitForDeployment();
  const riskOracleAddress = await riskOracle.getAddress();
  console.log("✅ RiskScoreOracle:", riskOracleAddress, "\n");

  // 4. Conectar el CreditNFT con el oráculo
  console.log("3️⃣ Conectando CreditNFT.setRiskOracle(...)...");
  const creditNFT = await hre.ethers.getContractAt("CreditNFT", creditNFTAddress);
  const tx = await creditNFT.setRiskOracle(riskOracleAddress);
  await tx.wait();
  console.log("✅ CreditNFT vinculado al RiskScoreOracle\n");

  // 5. Persistir direcciones
  deployment.contracts.walletRegistry = walletRegistryAddress;
  deployment.contracts.riskOracle = riskOracleAddress;
  deployment.riskModule = {
    scoreFeeWei: scoreFee.toString(),
    oracleSigner,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(deploymentFile, JSON.stringify(deployment, null, 2));
  console.log("📄 Despliegue actualizado en:", deploymentFile);

  console.log("\n" + "=".repeat(60));
  console.log("🎉 Módulo de riesgo desplegado");
  console.log("=".repeat(60));
  console.log("WalletRegistry:  ", walletRegistryAddress);
  console.log("RiskScoreOracle: ", riskOracleAddress);
  console.log("\n💡 Añade a frontend/.env.local:");
  console.log(`NEXT_PUBLIC_WALLET_REGISTRY_ADDRESS=${walletRegistryAddress}`);
  console.log(`NEXT_PUBLIC_RISK_ORACLE_ADDRESS=${riskOracleAddress}`);

  // En local, anexar al .env.local automáticamente (sin pisar lo existente).
  if (net === "localhost" || net === "hardhat") {
    const envPath = path.join(__dirname, "..", "..", "frontend", ".env.local");
    let env = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
    env = upsertEnv(env, "NEXT_PUBLIC_WALLET_REGISTRY_ADDRESS", walletRegistryAddress);
    env = upsertEnv(env, "NEXT_PUBLIC_RISK_ORACLE_ADDRESS", riskOracleAddress);
    fs.writeFileSync(envPath, env);
    console.log("\n✅ frontend/.env.local actualizado");
  }
  console.log("");
}

// Inserta o reemplaza una variable en el contenido de un .env.
function upsertEnv(content, key, value) {
  const line = `${key}=${value}`;
  const re = new RegExp(`^${key}=.*$`, "m");
  if (re.test(content)) return content.replace(re, line);
  return (content.endsWith("\n") || content === "" ? content : content + "\n") + line + "\n";
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
