// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface ICreditNFT {
    function getReputation(uint256 tokenId) external view returns (uint256);
    function getCreditData(uint256 tokenId) external view returns (
        uint256 paymentScore,
        uint256 consecutivePayments,
        address linkedWallet,
        uint256 governancePower,
        uint256 stakingAmount,
        uint256 createdAt,
        bool isStaked
    );
    function ownerOf(uint256 tokenId) external view returns (address);
}

contract RewardSystem is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    address public creditNFTContract;
    IERC20 public Monad;
    uint256 public rewardRate;
    uint256 public baseReward;
    mapping(uint256 => uint256) public lastClaimed;
    mapping(uint256 => uint256) public totalRewards;
    mapping(address => uint256) public creditLimit;
    mapping(address => uint256) public activeLoans;
    uint256 public interestRate;
    mapping(address => bool) public authorizedRegistrars;

    event RewardClaimed(uint256 indexed tokenId, address indexed recipient, uint256 amount, uint256 reputation);
    event PaymentRecorded(uint256 indexed tokenId, address indexed user, uint256 rewardAmount);

    constructor(address initialOwner, address _Monad, address _creditNFTContract) Ownable(initialOwner) {
        Monad = IERC20(_Monad);
        creditNFTContract = _creditNFTContract;
        rewardRate = 1e15;
        baseReward = 5e17;
        interestRate = 500;
        authorizedRegistrars[msg.sender] = true;
    }

    function authorizeRegistrar(address registrar) external onlyOwner {
        authorizedRegistrars[registrar] = true;
    }

    function recordPayment(uint256 tokenId) external nonReentrant {
        require(authorizedRegistrars[msg.sender], "Not authorized");
        require(creditNFTContract != address(0), "CreditNFT contract not set");

        ICreditNFT creditNFT = ICreditNFT(creditNFTContract);
        address nftOwner = creditNFT.ownerOf(tokenId);
        require(nftOwner != address(0), "Invalid token");

        (uint256 paymentScore, uint256 consecutivePayments, address linkedWallet,,,,) = creditNFT.getCreditData(tokenId);
        address recipient = linkedWallet != address(0) ? linkedWallet : nftOwner;

        uint256 reputation = creditNFT.getReputation(tokenId);
        uint256 rewardAmount = calculateReward(reputation, paymentScore, consecutivePayments);

        require(Monad.balanceOf(address(this)) >= rewardAmount, "Insufficient contract balance");

        Monad.safeTransfer(recipient, rewardAmount);
        lastClaimed[tokenId] = block.timestamp;
        totalRewards[tokenId] += rewardAmount;

        updateCreditLimit(recipient, reputation);

        emit PaymentRecorded(tokenId, recipient, rewardAmount);
        emit RewardClaimed(tokenId, recipient, rewardAmount, reputation);
    }

    function calculateReward(uint256 reputation, uint256 paymentScore, uint256 consecutivePayments) internal view returns (uint256) {
        uint256 reward = baseReward;
        if (reputation > 0) {
            reward += (reputation * rewardRate);
        }
        if (consecutivePayments >= 6) {
            reward += (baseReward / 2);
        }
        if (consecutivePayments >= 12) {
            reward += baseReward;
        }
        return reward;
    }

    function updateCreditLimit(address user, uint256 reputation) internal {
        uint256 newLimit = 100e18 + (reputation / 100) * 10e18;
        if (newLimit > 1000e18) {
            newLimit = 1000e18;
        }
        creditLimit[user] = newLimit;
    }

    function getCreditInfo(address user) external view returns (uint256 limit, uint256 active, uint256 available) {
        limit = creditLimit[user];
        active = activeLoans[user];
        available = limit > active ? limit - active : 0;
    }

    function depositFunds(uint256 amount) external onlyOwner {
        Monad.safeTransferFrom(msg.sender, address(this), amount);
    }
}

