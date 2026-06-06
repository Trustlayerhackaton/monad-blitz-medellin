// Verificación e2e: lee exactamente lo mismo que el frontend (useCreditPassport)
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const dep = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "deployments", "localhost.json"))
  );
  const [deployer] = await hre.ethers.getSigners();
  const c = dep.contracts;

  const nft = await hre.ethers.getContractAt("CreditNFT", c.creditNFT);
  const reward = await hre.ethers.getContractAt("RewardSystem", c.rewardSystem);
  const ccop = await hre.ethers.getContractAt("MockCCOP", c.mockCCOP);

  const active = await nft.getActiveToken(deployer.address);
  const data = await nft.getCreditData(active);
  const info = await reward.getCreditInfo(deployer.address);
  const bal = await ccop.balanceOf(deployer.address);
  const isMinter = await nft.authorizedMinters(deployer.address);

  console.log("Wallet:            ", deployer.address);
  console.log("Active tokenId:    ", active.toString());
  console.log("paymentScore:      ", data.paymentScore.toString());
  console.log("consecutivePayments:", data.consecutivePayments.toString());
  console.log("reputation:        ", (await nft.getReputation(active)).toString());
  console.log("isAuthorizedMinter:", isMinter);
  console.log("credit limit:      ", hre.ethers.formatEther(info[0]), "mcCOP");
  console.log("credit available:  ", hre.ethers.formatEther(info[2]), "mcCOP");
  console.log("mcCOP balance:     ", hre.ethers.formatEther(bal));

  const ok =
    active > 0n &&
    data.paymentScore === 850n &&
    data.consecutivePayments === 5n &&
    isMinter === true &&
    bal > 0n;
  console.log("\nE2E READ RESULT:   ", ok ? "PASS ✅" : "FAIL ❌");
  process.exit(ok ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
