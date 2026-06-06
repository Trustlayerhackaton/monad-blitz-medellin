// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @notice Vista mínima del RiskScoreOracle de TrustLayer que consume el NFT.
/// @dev La tupla (score, timestamp, dataHash) es ABI-compatible con el struct
///      RiskScore del oráculo (los tres miembros son estáticos de 32 bytes).
interface IRiskScoreOracle {
    function getScore(address subject)
        external
        view
        returns (uint256 score, uint256 timestamp, bytes32 dataHash);
}

contract CreditNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;

    // Score base para los pasaportes auto-emitidos por el usuario (aún sin historial).
    uint256 public constant INITIAL_SELF_MINT_SCORE = 500;

    struct CreditData {
        uint256 paymentScore;
        uint256 consecutivePayments;
        address monadWallet;
        uint256 governancePower;
        uint256 stakingAmount;
        uint256 createdAt;
        bool isStaked;
    }

    mapping(uint256 => CreditData) public creditData;
    mapping(address => uint256[]) public userTokens;
    mapping(address => uint256) public activeToken;
    mapping(address => bool) public authorizedMinters;

    // --- Integración de riesgo (TrustLayer) ---

    /// @notice Nivel de riesgo derivado del score (a mayor score, menor riesgo).
    enum RiskLevel { LOW, MEDIUM, HIGH, CRITICAL }

    /// @notice Riesgo sincronizado en el NFT desde el RiskScoreOracle.
    /// @param riskScore Último score (0-1000) leído del oráculo.
    /// @param level Nivel derivado de `riskScore`.
    /// @param updatedAt Marca de tiempo de la última sincronización.
    struct RiskInfo {
        uint256 riskScore;
        RiskLevel level;
        uint256 updatedAt;
    }

    /// @notice Oráculo de riesgo de TrustLayer del que se lee el score.
    IRiskScoreOracle public riskOracle;

    /// @notice Riesgo por tokenId (separado de CreditData para no romper su ABI).
    mapping(uint256 => RiskInfo) public tokenRisk;

    event CreditNFTMinted(uint256 indexed tokenId, address indexed owner, uint256 paymentScore, uint256 consecutivePayments);
    event PaymentRecorded(uint256 indexed tokenId, uint256 newScore, uint256 consecutivePayments);
    event MonadWalletLinked(uint256 indexed tokenId, address indexed monadWallet);
    event RiskOracleUpdated(address indexed oracle);
    event RiskScoreRefreshed(uint256 indexed tokenId, uint256 riskScore, RiskLevel level);

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
            monadWallet: address(0),
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

    function linkMonadWallet(uint256 tokenId, address monadWallet) external {
        require(_ownerOf(tokenId) == msg.sender, "Not the owner");
        require(monadWallet != address(0), "Invalid Monad wallet");
        creditData[tokenId].monadWallet = monadWallet;
        emit MonadWalletLinked(tokenId, monadWallet);
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

    // --- Integración de riesgo (TrustLayer) ---

    /// @notice Configura el RiskScoreOracle del que se sincroniza el riesgo. Solo owner.
    /// @param oracle Dirección del RiskScoreOracle desplegado.
    function setRiskOracle(address oracle) external onlyOwner {
        require(oracle != address(0), "Invalid oracle");
        riskOracle = IRiskScoreOracle(oracle);
        emit RiskOracleUpdated(oracle);
    }

    /// @notice Sincroniza en el NFT el último score publicado en el oráculo para
    ///         el dueño del token, y deriva su nivel de riesgo.
    /// @dev Solo copia datos públicos ya verificados on-chain en el oráculo, por
    ///      lo que cualquiera puede refrescar cualquier token (no hay riesgo de
    ///      manipulación; el dato proviene del oráculo firmado). Revierte si el
    ///      token no existe, el oráculo no está configurado o no hay score.
    /// @param tokenId Token a refrescar.
    /// @return level Nivel de riesgo resultante.
    function refreshScore(uint256 tokenId) external returns (RiskLevel level) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(address(riskOracle) != address(0), "Risk oracle not set");

        (uint256 score, uint256 ts, ) = riskOracle.getScore(ownerOf(tokenId));
        require(ts != 0, "No score available");

        level = _levelFromScore(score);
        tokenRisk[tokenId] = RiskInfo({ riskScore: score, level: level, updatedAt: block.timestamp });

        emit RiskScoreRefreshed(tokenId, score, level);
    }

    /// @notice Deriva el nivel de riesgo a partir del score (0-1000).
    /// @dev Umbrales: >=750 LOW, >=500 MEDIUM, >=250 HIGH, resto CRITICAL.
    function _levelFromScore(uint256 score) internal pure returns (RiskLevel) {
        if (score >= 750) return RiskLevel.LOW;
        if (score >= 500) return RiskLevel.MEDIUM;
        if (score >= 250) return RiskLevel.HIGH;
        return RiskLevel.CRITICAL;
    }

    /// @notice Nivel de riesgo actualmente sincronizado en un token.
    /// @param tokenId Token consultado.
    /// @return Nivel de riesgo (por defecto LOW si nunca se ha refrescado).
    function getRiskLevel(uint256 tokenId) external view returns (RiskLevel) {
        return tokenRisk[tokenId].level;
    }

    /// @notice Información de riesgo completa sincronizada en un token.
    /// @param tokenId Token consultado.
    /// @return El registro RiskInfo (riskScore/level/updatedAt).
    function getRiskInfo(uint256 tokenId) external view returns (RiskInfo memory) {
        return tokenRisk[tokenId];
    }
}
