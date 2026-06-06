// Verificación e2e del módulo de riesgo: WalletRegistry + RiskScoreOracle + refreshScore.
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
const { ethers } = hre;

async function main() {
  const net = hre.network.name;
  const dep = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "deployments", `${net}.json`))
  );
  const c = dep.contracts;
  const [owner, walletB] = await ethers.getSigners(); // owner == oracleSigner (deployer)
  const chainId = (await ethers.provider.getNetwork()).chainId;

  const registry = await ethers.getContractAt("WalletRegistry", c.walletRegistry);
  const oracle = await ethers.getContractAt("RiskScoreOracle", c.riskOracle);
  const nft = await ethers.getContractAt("CreditNFT", c.creditNFT);

  // --- 1. WalletRegistry: walletB firma su consentimiento; owner la registra ---
  const rawConsent = ethers.solidityPackedKeccak256(
    ["string", "address", "address", "uint256", "address"],
    ["CrediPass:LinkWallet:", owner.address, walletB.address, chainId, c.walletRegistry]
  );
  const consentSig = await walletB.signMessage(ethers.getBytes(rawConsent));
  await (await registry.connect(owner).registerWallet(walletB.address, consentSig)).wait();
  const linked = await registry.getLinkedWallets(owner.address);
  console.log("WalletRegistry linked:", linked);

  // --- 2. RiskScoreOracle: el oráculo (owner) firma un score; owner lo publica pagando fee ---
  const subject = owner.address;
  const score = 720n;
  const dataHash = ethers.id("trustlayer-demo-payload-1");
  const rawScore = ethers.solidityPackedKeccak256(
    ["string", "address", "uint256", "bytes32", "uint256", "address"],
    ["TrustLayer:RiskScore:", subject, score, dataHash, chainId, c.riskOracle]
  );
  const scoreSig = await owner.signMessage(ethers.getBytes(rawScore));
  const fee = await oracle.scoreFee();
  await (
    await oracle.connect(owner).submitScore(subject, score, dataHash, scoreSig, { value: fee })
  ).wait();
  const stored = await oracle.getScore(subject);
  console.log("Oracle score:", stored.score.toString(), "| fee(wei):", fee.toString());

  // --- 3. CreditNFT.refreshScore lee el oráculo y deriva el nivel ---
  const tokenId = await nft.getActiveToken(owner.address);
  await (await nft.refreshScore(tokenId)).wait();
  const risk = await nft.getRiskInfo(tokenId);
  const levels = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
  console.log(
    `NFT #${tokenId} -> riskScore ${risk.riskScore}, level ${levels[Number(risk.level)]}`
  );

  // Aserciones
  const ok =
    linked.length === 1 &&
    linked[0] === walletB.address &&
    stored.score === 720n &&
    risk.riskScore === 720n &&
    Number(risk.level) === 1; // 720 -> MEDIUM
  console.log("\nRISK MODULE E2E:", ok ? "PASS ✅" : "FAIL ❌");
  process.exit(ok ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
