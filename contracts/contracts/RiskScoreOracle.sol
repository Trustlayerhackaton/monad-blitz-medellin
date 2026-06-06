// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/// @title RiskScoreOracle
/// @author TrustLayer
/// @notice Almacena on-chain el score de riesgo crediticio calculado off-chain
///         por el motor de scoring de TrustLayer. Cada score debe venir firmado
///         por un backend autorizado (`ORACLE_ROLE`) y su publicación se cobra
///         por uso en MON nativo (modelo pay-per-use).
/// @dev Arquitectura híbrida: el cálculo pesado ocurre off-chain (riskEngine.js)
///      y aquí solo se persiste el resultado firmado, garantizando transparencia
///      y verificabilidad. La firma desacopla quién paga/relaya (cualquiera) de
///      quién autoriza el dato (el oráculo). Anti-replay mediante `dataHash`.
contract RiskScoreOracle is AccessControl, ReentrancyGuard {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    /// @notice Rol que pueden firmar scores válidos (backend de TrustLayer).
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");

    /// @notice Score máximo admitido (escala 0-1000).
    uint256 public constant MAX_SCORE = 1000;

    /// @notice Score de riesgo persistido para una wallet/identidad.
    /// @param score Puntaje 0-1000 calculado off-chain.
    /// @param timestamp Marca de tiempo (block.timestamp) de la publicación.
    /// @param dataHash Hash del payload completo del cálculo (auditable off-chain).
    struct RiskScore {
        uint256 score;
        uint256 timestamp;
        bytes32 dataHash;
    }

    /// @notice Score actual por sujeto (subject => RiskScore).
    mapping(address => RiskScore) private _scores;

    /// @notice Evita reutilizar un mismo cálculo (dataHash) más de una vez.
    mapping(bytes32 => bool) public consumedDataHash;

    /// @notice Tarifa en MON (wei) que paga el usuario por publicar un score.
    uint256 public scoreFee;

    /// @notice Se emite al publicar un score válido.
    /// @param subject Identidad/wallet a la que pertenece el score.
    /// @param score Puntaje publicado.
    /// @param dataHash Hash del payload del cálculo.
    /// @param payer Quien pagó/relayó la transacción.
    /// @param feePaid MON pagado.
    event ScoreSubmitted(
        address indexed subject,
        uint256 score,
        bytes32 indexed dataHash,
        address indexed payer,
        uint256 feePaid
    );

    /// @notice Se emite al actualizar la tarifa.
    event ScoreFeeUpdated(uint256 oldFee, uint256 newFee);

    /// @notice Se emite al retirar las tarifas acumuladas.
    event FeesWithdrawn(address indexed to, uint256 amount);

    /// @param admin Cuenta con DEFAULT_ADMIN_ROLE (gestiona roles, tarifa, retiros).
    /// @param oracleSigner Firmante autorizado inicial (backend de scoring).
    /// @param initialFee Tarifa inicial en MON (wei) por publicar un score.
    constructor(address admin, address oracleSigner, uint256 initialFee) {
        require(admin != address(0), "RiskScoreOracle: zero admin");
        require(oracleSigner != address(0), "RiskScoreOracle: zero signer");
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ORACLE_ROLE, oracleSigner);
        scoreFee = initialFee;
    }

    /// @notice Construye el digest EIP-191 que el backend debe firmar para un score.
    /// @dev Liga subject + score + dataHash + chainid + address(this) para evitar
    ///      replays entre cadenas/despliegues. El frontend reconstruye el mismo
    ///      payload crudo y verifica antes de pagar.
    /// @param subject Identidad/wallet del score.
    /// @param score Puntaje 0-1000.
    /// @param dataHash Hash del payload del cálculo off-chain.
    /// @return Digest listo para `recover`.
    function scoreDigest(
        address subject,
        uint256 score,
        bytes32 dataHash
    ) public view returns (bytes32) {
        bytes32 raw = keccak256(
            abi.encodePacked(
                "TrustLayer:RiskScore:",
                subject,
                score,
                dataHash,
                block.chainid,
                address(this)
            )
        );
        return raw.toEthSignedMessageHash();
    }

    /// @notice Publica on-chain un score firmado por el oráculo, pagando la tarifa.
    /// @dev `msg.sender` (el usuario) paga `scoreFee` en MON. La firma debe
    ///      recuperar a una cuenta con `ORACLE_ROLE`. Revierte por pago
    ///      insuficiente, score inválido, dataHash ya usado o firma no autorizada.
    ///      Cualquier excedente sobre la tarifa se devuelve al pagador.
    /// @param subject Identidad/wallet a la que pertenece el score.
    /// @param score Puntaje 0-1000 calculado off-chain.
    /// @param dataHash Hash del payload completo del cálculo.
    /// @param signature Firma EIP-191 del oráculo sobre `scoreDigest(...)`.
    function submitScore(
        address subject,
        uint256 score,
        bytes32 dataHash,
        bytes calldata signature
    ) external payable nonReentrant {
        require(msg.value >= scoreFee, "RiskScoreOracle: insufficient fee");
        require(subject != address(0), "RiskScoreOracle: zero subject");
        require(score <= MAX_SCORE, "RiskScoreOracle: score too high");
        require(!consumedDataHash[dataHash], "RiskScoreOracle: dataHash used");

        address signer = scoreDigest(subject, score, dataHash).recover(signature);
        require(hasRole(ORACLE_ROLE, signer), "RiskScoreOracle: unauthorized signer");

        consumedDataHash[dataHash] = true;
        _scores[subject] = RiskScore({
            score: score,
            timestamp: block.timestamp,
            dataHash: dataHash
        });

        emit ScoreSubmitted(subject, score, dataHash, msg.sender, scoreFee);

        // Devuelve cualquier excedente por encima de la tarifa.
        uint256 refund = msg.value - scoreFee;
        if (refund > 0) {
            (bool ok, ) = payable(msg.sender).call{value: refund}("");
            require(ok, "RiskScoreOracle: refund failed");
        }
    }

    /// @notice Devuelve el score de riesgo de `subject`.
    /// @param subject Identidad/wallet consultada.
    /// @return El registro RiskScore (score/timestamp/dataHash); ceros si no existe.
    function getScore(address subject) external view returns (RiskScore memory) {
        return _scores[subject];
    }

    /// @notice Indica si `subject` ya tiene un score publicado.
    function hasScore(address subject) external view returns (bool) {
        return _scores[subject].timestamp != 0;
    }

    /// @notice Actualiza la tarifa por publicación de score. Solo admin.
    /// @param newFee Nueva tarifa en MON (wei).
    function setScoreFee(uint256 newFee) external onlyRole(DEFAULT_ADMIN_ROLE) {
        emit ScoreFeeUpdated(scoreFee, newFee);
        scoreFee = newFee;
    }

    /// @notice Retira las tarifas en MON acumuladas en el contrato. Solo admin.
    /// @param to Destinatario de los fondos.
    function withdrawFees(address payable to) external onlyRole(DEFAULT_ADMIN_ROLE) nonReentrant {
        require(to != address(0), "RiskScoreOracle: zero recipient");
        uint256 balance = address(this).balance;
        require(balance > 0, "RiskScoreOracle: nothing to withdraw");
        (bool ok, ) = to.call{value: balance}("");
        require(ok, "RiskScoreOracle: withdraw failed");
        emit FeesWithdrawn(to, balance);
    }
}
