// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title ValidationRecord
/// @author TrustLayer
/// @notice Registra de forma inmutable qué oráculo validó el score de crédito
///         de cada subject (wallet). Actúa como libro contable de auditoría:
///         cualquiera puede consultar quién firmó qué score y cuándo.
/// @dev Pensado para ser llamado desde RiskScoreOracle.submitScore() justo después
///      de persistir el score. El contrato que llame a `record()` debe tener
///      RECORDER_ROLE (normalmente el propio RiskScoreOracle).
contract ValidationRecord is AccessControl {
    /// @notice Rol que puede escribir registros (concedido a RiskScoreOracle).
    bytes32 public constant RECORDER_ROLE = keccak256("RECORDER_ROLE");

    /// @notice Un único evento de validación.
    struct Record {
        address oracle;     // Contrato/cuenta que registró el score
        uint256 score;      // Score publicado (0-1000)
        bytes32 dataHash;   // Hash del payload off-chain para auditoría
        uint256 timestamp;  // block.timestamp de la publicación
    }

    /// @notice Historial de validaciones por subject (más reciente al final).
    mapping(address => Record[]) private _records;

    /// @notice Se emite cada vez que se registra una validación.
    event ScoreValidated(
        address indexed subject,
        uint256 score,
        bytes32 indexed dataHash,
        address indexed oracle,
        uint256 timestamp
    );

    /// @param admin Cuenta con DEFAULT_ADMIN_ROLE (gestiona roles).
    constructor(address admin) {
        require(admin != address(0), "ValidationRecord: zero admin");
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    /// @notice Registra la validación de un score. Solo RECORDER_ROLE.
    /// @param subject  Wallet/identidad cuyo score fue validado.
    /// @param score    Puntaje publicado (0-1000).
    /// @param dataHash Hash del payload del cálculo off-chain.
    function record(
        address subject,
        uint256 score,
        bytes32 dataHash
    ) external onlyRole(RECORDER_ROLE) {
        require(subject != address(0), "ValidationRecord: zero subject");
        _records[subject].push(
            Record({
                oracle: msg.sender,
                score: score,
                dataHash: dataHash,
                timestamp: block.timestamp
            })
        );
        emit ScoreValidated(subject, score, dataHash, msg.sender, block.timestamp);
    }

    /// @notice Devuelve todo el historial de validaciones de `subject`.
    function getRecords(address subject) external view returns (Record[] memory) {
        return _records[subject];
    }

    /// @notice Número de validaciones registradas para `subject`.
    function recordCount(address subject) external view returns (uint256) {
        return _records[subject].length;
    }

    /// @notice Última validación registrada para `subject` (revierte si no hay ninguna).
    function latestRecord(address subject) external view returns (Record memory) {
        uint256 len = _records[subject].length;
        require(len > 0, "ValidationRecord: no records");
        return _records[subject][len - 1];
    }
}
