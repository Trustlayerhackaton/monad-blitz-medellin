const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("Trustlayerc", function () {
  // Despliega MockMonad + CreditNFT + RewardSystem y devuelve los signers.
  async function deployFixture() {
    const [owner, user, registrar, other] = await ethers.getSigners();

    const MockMonad = await ethers.getContractFactory("MockMonad");
    const Monad = await MockMonad.deploy(owner.address);

    const CreditNFT = await ethers.getContractFactory("CreditNFT");
    const creditNFT = await CreditNFT.deploy(owner.address);

    const RewardSystem = await ethers.getContractFactory("RewardSystem");
    const rewardSystem = await RewardSystem.deploy(
      owner.address,
      await Monad.getAddress(),
      await creditNFT.getAddress()
    );

    return { owner, user, registrar, other, Monad, creditNFT, rewardSystem };
  }

  describe("CreditNFT - auto-emisión (mintMyPassport)", function () {
    it("cualquier usuario puede crear su propio pasaporte con score base 500", async function () {
      const { creditNFT, user } = await loadFixture(deployFixture);

      await expect(creditNFT.connect(user).mintMyPassport(""))
        .to.emit(creditNFT, "CreditNFTMinted")
        .withArgs(1n, user.address, 500n, 0n);

      expect(await creditNFT.ownerOf(1)).to.equal(user.address);
      expect(await creditNFT.balanceOf(user.address)).to.equal(1n);
      expect(await creditNFT.getActiveToken(user.address)).to.equal(1n);

      const data = await creditNFT.getCreditData(1);
      expect(data.paymentScore).to.equal(500n);
      expect(data.consecutivePayments).to.equal(0n);
      expect(data.celoWallet).to.equal(ethers.ZeroAddress);
    });

    it("revierte si la wallet ya tiene un pasaporte (anti-spam)", async function () {
      const { creditNFT, user } = await loadFixture(deployFixture);

      await creditNFT.connect(user).mintMyPassport("");
      await expect(
        creditNFT.connect(user).mintMyPassport("")
      ).to.be.revertedWith("Passport already exists");
    });

    it("usuarios distintos obtienen tokenIds distintos", async function () {
      const { creditNFT, user, other } = await loadFixture(deployFixture);

      await creditNFT.connect(user).mintMyPassport("");
      await creditNFT.connect(other).mintMyPassport("");

      expect(await creditNFT.getActiveToken(user.address)).to.equal(1n);
      expect(await creditNFT.getActiveToken(other.address)).to.equal(2n);
    });
  });

  describe("CreditNFT - registrar pagos (recordPayment)", function () {
    it("un emisor autorizado (owner) puede subir el score", async function () {
      const { creditNFT, owner, user } = await loadFixture(deployFixture);
      await creditNFT.connect(user).mintMyPassport("");

      await expect(creditNFT.connect(owner).recordPayment(1, 700, 6))
        .to.emit(creditNFT, "PaymentRecorded")
        .withArgs(1n, 700n, 6n);

      const data = await creditNFT.getCreditData(1);
      expect(data.paymentScore).to.equal(700n);
      expect(data.consecutivePayments).to.equal(6n);
    });

    it("revierte si lo llama una wallet NO autorizada (el propio usuario)", async function () {
      const { creditNFT, user } = await loadFixture(deployFixture);
      await creditNFT.connect(user).mintMyPassport("");

      await expect(
        creditNFT.connect(user).recordPayment(1, 1000, 99)
      ).to.be.revertedWith("Not authorized");
    });

    it("una wallet recién autorizada con authorizeMinter sí puede registrar pagos", async function () {
      const { creditNFT, owner, user, registrar } = await loadFixture(deployFixture);
      await creditNFT.connect(user).mintMyPassport("");

      await creditNFT.connect(owner).authorizeMinter(registrar.address);
      await creditNFT.connect(registrar).recordPayment(1, 650, 4);

      const data = await creditNFT.getCreditData(1);
      expect(data.paymentScore).to.equal(650n);
    });

    it("revierte con un score inválido (> 1000)", async function () {
      const { creditNFT, owner, user } = await loadFixture(deployFixture);
      await creditNFT.connect(user).mintMyPassport("");

      await expect(
        creditNFT.connect(owner).recordPayment(1, 1001, 1)
      ).to.be.revertedWith("Invalid payment score");
    });
  });

  describe("CreditNFT - emisión autorizada (mintCreditNFT)", function () {
    it("una wallet no autorizada no puede emitir a terceros", async function () {
      const { creditNFT, user, other } = await loadFixture(deployFixture);

      await expect(
        creditNFT.connect(user).mintCreditNFT(other.address, 800, 3, "")
      ).to.be.revertedWith("Not authorized to mint");
    });

    it("el owner puede emitir un pasaporte con score inicial a un tercero", async function () {
      const { creditNFT, owner, other } = await loadFixture(deployFixture);

      await creditNFT.connect(owner).mintCreditNFT(other.address, 800, 3, "");
      const data = await creditNFT.getCreditData(1);
      expect(data.paymentScore).to.equal(800n);
      expect(data.consecutivePayments).to.equal(3n);
      expect(await creditNFT.ownerOf(1)).to.equal(other.address);
    });
  });

  describe("CreditNFT - reputación", function () {
    it("calcula la reputación como score * racha / 10", async function () {
      const { creditNFT, owner, user } = await loadFixture(deployFixture);
      await creditNFT.connect(user).mintMyPassport("");
      await creditNFT.connect(owner).recordPayment(1, 700, 6);

      // 700 * 6 / 10 = 420
      expect(await creditNFT.getReputation(1)).to.equal(420n);
    });
  });

  describe("MockMonad - faucet", function () {
    it("cualquier usuario puede reclamar 1000 mMonad del faucet", async function () {
      const { Monad, user } = await loadFixture(deployFixture);

      await Monad.connect(user).faucet();
      expect(await Monad.balanceOf(user.address)).to.equal(ethers.parseEther("1000"));
    });
  });

  describe("RewardSystem - integración completa", function () {
    async function fundedFixture() {
      const ctx = await loadFixture(deployFixture);
      const { Monad, rewardSystem, owner } = ctx;

      // El owner deposita fondos para que el RewardSystem pueda pagar recompensas.
      const deposit = ethers.parseEther("100000");
      await Monad.connect(owner).approve(await rewardSystem.getAddress(), deposit);
      await rewardSystem.connect(owner).depositFunds(deposit);

      return ctx;
    }

    it("distribuye recompensas en mMonad y actualiza la línea de crédito", async function () {
      const { Monad, creditNFT, rewardSystem, owner, user } = await loadFixture(fundedFixture);

      // El usuario crea su pasaporte y el emisor registra su historial.
      await creditNFT.connect(user).mintMyPassport("");
      await creditNFT.connect(owner).recordPayment(1, 600, 6);

      // reputación = 600 * 6 / 10 = 360
      // reward = base(0.5) + 360*0.001 (0.36) + base/2 por racha>=6 (0.25) = 1.11 mMonad
      await rewardSystem.connect(owner).recordPayment(1);

      expect(await Monad.balanceOf(user.address)).to.equal(ethers.parseEther("1.11"));
      expect(await rewardSystem.totalRewards(1)).to.equal(ethers.parseEther("1.11"));

      // límite = 100 + (360/100)*10 = 130 mMonad
      const info = await rewardSystem.getCreditInfo(user.address);
      expect(info.limit).to.equal(ethers.parseEther("130"));
      expect(info.available).to.equal(ethers.parseEther("130"));
    });

    it("revierte si un no-registrador intenta registrar el pago", async function () {
      const { creditNFT, rewardSystem, owner, user } = await loadFixture(fundedFixture);
      await creditNFT.connect(user).mintMyPassport("");
      await creditNFT.connect(owner).recordPayment(1, 600, 6);

      await expect(
        rewardSystem.connect(user).recordPayment(1)
      ).to.be.revertedWith("Not authorized");
    });
  });
});
