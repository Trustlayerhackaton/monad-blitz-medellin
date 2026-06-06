import os
from typing import Any

import requests

MONAD_RPC = os.getenv("MONAD_RPC_URL", "https://testnet-rpc.monad.xyz")
_SESSION = requests.Session()
_SESSION.headers.update({"Content-Type": "application/json"})


def _rpc(method: str, params: list) -> Any:
    payload = {"jsonrpc": "2.0", "id": 1, "method": method, "params": params}
    try:
        r = _SESSION.post(MONAD_RPC, json=payload, timeout=8)
        r.raise_for_status()
        data = r.json()
        return data.get("result")
    except Exception:
        return None


def fetch_wallet_data(address: str) -> dict:
    """Fetch on-chain stats for a single wallet via JSON-RPC."""
    tx_count_hex = _rpc("eth_getTransactionCount", [address, "latest"])
    balance_hex = _rpc("eth_getBalance", [address, "latest"])

    tx_count = int(tx_count_hex, 16) if tx_count_hex else 0
    balance_wei = int(balance_hex, 16) if balance_hex else 0
    balance_eth = balance_wei / 1e18

    # Approximate on-chain activity via log count using a wide block range.
    # We check Transfer events (topic0 = keccak256("Transfer(address,address,uint256)"))
    # where the wallet appears as sender or receiver.
    TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
    logs_in = _rpc(
        "eth_getLogs",
        [
            {
                "fromBlock": "0x1",
                "toBlock": "latest",
                "topics": [
                    TRANSFER_TOPIC,
                    None,
                    "0x" + address[2:].zfill(64),
                ],
            }
        ],
    )
    logs_out = _rpc(
        "eth_getLogs",
        [
            {
                "fromBlock": "0x1",
                "toBlock": "latest",
                "topics": [
                    TRANSFER_TOPIC,
                    "0x" + address[2:].zfill(64),
                    None,
                ],
            }
        ],
    )

    erc20_in = len(logs_in) if isinstance(logs_in, list) else 0
    erc20_out = len(logs_out) if isinstance(logs_out, list) else 0

    return {
        "address": address,
        "tx_count": tx_count,
        "balance_eth": balance_eth,
        "erc20_in": erc20_in,
        "erc20_out": erc20_out,
        "erc20_total": erc20_in + erc20_out,
    }


def aggregate_wallets(wallets: list[str]) -> dict:
    """Fetch and aggregate on-chain data for multiple wallets."""
    results = [fetch_wallet_data(w) for w in wallets]
    total_tx = sum(r["tx_count"] for r in results)
    total_balance = sum(r["balance_eth"] for r in results)
    total_erc20 = sum(r["erc20_total"] for r in results)
    in_out_ratio = (
        sum(r["erc20_in"] for r in results) / max(sum(r["erc20_out"] for r in results), 1)
    )
    return {
        "wallet_count": len(wallets),
        "total_tx_count": total_tx,
        "total_balance_eth": total_balance,
        "total_erc20_transfers": total_erc20,
        "in_out_ratio": in_out_ratio,
        "per_wallet": results,
    }
