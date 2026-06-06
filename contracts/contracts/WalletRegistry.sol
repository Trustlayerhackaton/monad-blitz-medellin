// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/// @title WalletRegistry
/// @author CrediPass
/// @notice Permite a una identidad (`identityOwner`) vincular múltiples wallets
///         a su perfil CrediPass. Cada wallet adicional debe firmar un mensaje
///         de consentimiento, de forma que únicamente el dueño real de esa
///         wallet puede autorizar la vinculación.
/// @dev El conjunto de wallets vinculadas lo consume después el motor de scoring
///      off-chain para calcular el riesgo crediticio agregado multi-wallet.
///      Solo usa utilidades de OpenZeppelin (ECDSA / MessageHashUtils); no
///      requiere librerías externas adicionales.
contract WalletRegistry {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    /// @notice Wallets adicionales vinculadas por cada identidad (owner).
    /// @dev No incluye al propio `owner`; el owner es implícito en su identidad.
    mapping(address => address[]) private _linkedWallets;

    /// @notice Indica si `wallet` ya está vinculada a `owner` (anti-duplicado).
    /// @dev Acceso: isLinked[owner][wallet].
    mapping(address => mapping(address => bool)) public isLinked;

    /// @notice Identidad (owner) a la que pertenece una wallet vinculada.
    /// @dev Una wallet solo puede pertenecer a un único owner para evitar que el
    ///      mismo historial cuente en dos identidades distintas.
    mapping(address => address) public walletOwner;

    /// @notice Se emite cuando una wallet se vincula correctamente a una identidad.
    /// @param owner Identidad (dueño) que registra la wallet.
    /// @param wallet Wallet adicional que quedó vinculada.
    event WalletLinked(address indexed owner, address indexed wallet);

    /// @notice Construye el hash determinista del mensaje de consentimiento que
    ///         debe firmar la wallet que se desea vincular.
    /// @dev Liga `owner`, `wallet`, `block.chainid` y `address(this)` para evitar
    ///      replays entre cuentas, cadenas o despliegues distintos. Se devuelve ya
    ///      envuelto en el prefijo EIP-191 (`personal_sign`), de modo que el
    ///      frontend puede firmar con `viem.signMessage` el mismo payload crudo.
    /// @param owner Identidad a la que se vinculará la wallet.
    /// @param wallet Wallet que otorga su consentimiento.
    /// @return Hash EIP-191 listo para recuperar al firmante.
    function consentHash(address owner, address wallet) public view returns (bytes32) {
        bytes32 raw = keccak256(
            abi.encodePacked(
                "CrediPass:LinkWallet:",
                owner,
                wallet,
                block.chainid,
                address(this)
            )
        );
        return raw.toEthSignedMessageHash();
    }

    /// @notice Vincula `wallet` a la identidad de quien llama (`msg.sender`).
    /// @dev `wallet` debe haber firmado previamente `consentHash(msg.sender, wallet)`.
    ///      Revierte si la wallet es cero, es el propio caller, ya está vinculada
    ///      a este owner, ya pertenece a otro owner, o la firma no corresponde.
    /// @param wallet Wallet adicional a vincular.
    /// @param signature Firma EIP-191 (65 bytes) producida por `wallet`.
    function registerWallet(address wallet, bytes calldata signature) external {
        require(wallet != address(0), "WalletRegistry: zero wallet");
        require(wallet != msg.sender, "WalletRegistry: cannot link self");
        require(!isLinked[msg.sender][wallet], "WalletRegistry: already linked");
        require(walletOwner[wallet] == address(0), "WalletRegistry: wallet taken");

        address recovered = consentHash(msg.sender, wallet).recover(signature);
        require(recovered == wallet, "WalletRegistry: invalid signature");

        _linkedWallets[msg.sender].push(wallet);
        isLinked[msg.sender][wallet] = true;
        walletOwner[wallet] = msg.sender;

        emit WalletLinked(msg.sender, wallet);
    }

    /// @notice Devuelve las wallets adicionales vinculadas a `owner`.
    /// @param owner Identidad consultada.
    /// @return Array de wallets vinculadas (no incluye al propio `owner`).
    function getLinkedWallets(address owner) external view returns (address[] memory) {
        return _linkedWallets[owner];
    }

    /// @notice Número de wallets adicionales vinculadas a `owner`.
    /// @param owner Identidad consultada.
    /// @return Cantidad de wallets vinculadas.
    function getLinkedWalletCount(address owner) external view returns (uint256) {
        return _linkedWallets[owner].length;
    }
}
