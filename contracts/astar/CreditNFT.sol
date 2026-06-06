// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CreditNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct CreditData {
        uint256 paymentScore;
        uint256 consecutivePayments;
        address celoWallet;
        uint256 governancePower;
        uint256 stakingAmount;
        uint256 createdAt;
        bool isStaked;
    }

    mapping(uint256 => CreditData) public creditData;
    mapping(address => uint256[]) public userTokens;
    mapping(address => uint256) public activeToken;
    mapping(address => bool) public authorizedMinters;

    event CreditNFTMinted(uint256 indexed tokenId, address indexed owner, uint256 paymentScore, uint256 consecutivePayments);
    event PaymentRecorded(uint256 indexed tokenId, uint256 newScore, uint256 consecutivePayments);
    event CeloWalletLinked(uint256 indexed tokenId, address indexed celoWallet);

    constructor(address initialOwner) ERC721("Credit Reputation NFT", "CREDIT") Ownable(initialOwner) {
        authorizedMinters[msg.sender] = true;
    }

    function authorizeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = true;
    }

    function mintCreditNFT(address to, uint256 paymentScore, uint256 consecutivePayments, string memory tokenURI) external returns (uint256) {
        require(authorizedMinters[msg.sender], "Not authorized to mint");
        require(paymentScore <= 1000, "Invalid payment score");
        require(to != address(0), "Invalid address");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        uint256 governancePower = calculateGovernancePower(paymentScore, consecutivePayments);

        creditData[newTokenId] = CreditData({
            paymentScore: paymentScore,
            consecutivePayments: consecutivePayments,
            celoWallet: address(0),
            governancePower: governancePower,
            stakingAmount: 0,
            createdAt: block.timestamp,
            isStaked: false
        });

        userTokens[to].push(newTokenId);
        if (activeToken[to] == 0 || creditData[newTokenId].paymentScore > creditData[activeToken[to]].paymentScore) {
            activeToken[to] = newTokenId;
        }

        emit CreditNFTMinted(newTokenId, to, paymentScore, consecutivePayments);
        return newTokenId;
    }

    function recordPayment(uint256 tokenId, uint256 newScore, uint256 consecutivePayments) external {
        require(authorizedMinters[msg.sender], "Not authorized");
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(newScore <= 1000, "Invalid payment score");

        CreditData storage data = creditData[tokenId];
        data.paymentScore = newScore;
        data.consecutivePayments = consecutivePayments;
        data.governancePower = calculateGovernancePower(newScore, consecutivePayments);

        emit PaymentRecorded(tokenId, newScore, consecutivePayments);
    }

    function linkCeloWallet(uint256 tokenId, address celoWallet) external {
        require(_ownerOf(tokenId) == msg.sender, "Not the owner");
        require(celoWallet != address(0), "Invalid Celo wallet");
        creditData[tokenId].celoWallet = celoWallet;
        emit CeloWalletLinked(tokenId, celoWallet);
    }

    function getReputation(uint256 tokenId) external view returns (uint256) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        CreditData memory data = creditData[tokenId];
        return (data.paymentScore * data.consecutivePayments) / 10;
    }

    function getCreditData(uint256 tokenId) external view returns (CreditData memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return creditData[tokenId];
    }

    function getActiveToken(address user) external view returns (uint256) {
        return activeToken[user];
    }

    function calculateGovernancePower(uint256 paymentScore, uint256 consecutivePayments) internal pure returns (uint256) {
        return (paymentScore / 10) + (consecutivePayments * 2);
    }
}

