// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CreditNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;

    // Score base para los pasaportes auto-emitidos por el usuario (aún sin historial).
    uint256 public constant INITIAL_SELF_MINT_SCORE = 500;

    struct CreditData {
        uint256 paymentScore;
        uint256 consecutivePayments;
        address linkedWallet;
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
    event WalletLinked(uint256 indexed tokenId, address indexed linkedWallet);

    constructor(address initialOwner) ERC721("Credit Reputation NFT", "CREDIT") Ownable(initialOwner) {
        authorizedMinters[msg.sender] = true;
    }

    function authorizeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = true;
    }

    /// @notice Emisión por un emisor autorizado, que puede fijar score y racha iniciales.
    function mintCreditNFT(address to, uint256 paymentScore, uint256 consecutivePayments, string memory tokenURI) external returns (uint256) {
        require(authorizedMinters[msg.sender], "Not authorized to mint");
        require(paymentScore <= 1000, "Invalid payment score");
        require(to != address(0), "Invalid address");

        return _createCreditNFT(to, paymentScore, consecutivePayments, tokenURI);
    }

    /// @notice Auto-emisión: cualquier usuario crea su propio pasaporte con score base.
    /// @dev El score solo puede subir después mediante recordPayment (restringido a emisores autorizados).
    function mintMyPassport(string memory tokenURI) external returns (uint256) {
        require(activeToken[msg.sender] == 0, "Passport already exists");

        return _createCreditNFT(msg.sender, INITIAL_SELF_MINT_SCORE, 0, tokenURI);
    }

    function _createCreditNFT(address to, uint256 paymentScore, uint256 consecutivePayments, string memory tokenURI) internal returns (uint256) {
        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        _mint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        uint256 governancePower = calculateGovernancePower(paymentScore, consecutivePayments);

        creditData[newTokenId] = CreditData({
            paymentScore: paymentScore,
            consecutivePayments: consecutivePayments,
            linkedWallet: address(0),
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

    function linkWallet(uint256 tokenId, address linkedWallet) external {
        require(_ownerOf(tokenId) == msg.sender, "Not the owner");
        require(linkedWallet != address(0), "Invalid wallet address");
        creditData[tokenId].linkedWallet = linkedWallet;
        emit WalletLinked(tokenId, linkedWallet);
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
