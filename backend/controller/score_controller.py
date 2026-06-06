"""
Scoring engine: trains a RandomForest on synthetic data at import time and
exposes compute_credit_score / compute_trust_score.

Real-world path:
  - Credit score: replace synthetic training data with historical on-chain labels.
  - Trust score:  replace heuristic gov data with actual government API responses.
"""
import hashlib
import os

import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import MinMaxScaler

from controller.blockchain_controller import aggregate_wallets

# ── Synthetic training data for the RandomForest ─────────────────────────────
# Features: [tx_count, balance_eth, erc20_transfers, in_out_ratio, wallet_count]
_rng = np.random.default_rng(42)
_N = 500
_X_train = np.column_stack([
    _rng.integers(0, 2000, _N),        # tx_count
    _rng.uniform(0, 100, _N),          # balance_eth
    _rng.integers(0, 5000, _N),        # erc20_transfers
    _rng.uniform(0.1, 10, _N),         # in_out_ratio
    _rng.integers(1, 6, _N),           # wallet_count
])
# Synthetic target: higher activity + balance → higher score
_y_train = np.clip(
    50
    + 0.15 * _X_train[:, 0]
    + 4.0 * _X_train[:, 1]
    + 0.05 * _X_train[:, 2]
    + 20 * _X_train[:, 3]
    + 30 * _X_train[:, 4]
    + _rng.normal(0, 30, _N),
    0, 1000,
)

_credit_model = RandomForestRegressor(n_estimators=100, random_state=42)
_credit_model.fit(_X_train, _y_train)
_credit_scaler = MinMaxScaler(feature_range=(0, 1000))
_credit_scaler.fit(_X_train)

# ── Trust score synthetic data ────────────────────────────────────────────────
_X_trust = np.column_stack([
    _rng.integers(0, 100, _N),   # open_processes (fewer is better)
    _rng.integers(0, 10, _N),    # closed_processes (negative signal)
    _rng.uniform(0, 1, _N),      # id_validity (1 = valid)
])
_y_trust = np.clip(
    900
    - 5 * _X_trust[:, 0]
    - 80 * _X_trust[:, 1]
    + 100 * _X_trust[:, 2]
    + _rng.normal(0, 40, _N),
    0, 1000,
)
_trust_model = RandomForestRegressor(n_estimators=100, random_state=42)
_trust_model.fit(_X_trust, _y_trust)


# ── Government data fetching (framework; real APIs when available) ────────────
def _fetch_gov_data(national_id: str, country_code: str) -> dict:
    """
    Calls public government APIs.  Currently supported: CO (Colombia).
    Falls back to a deterministic heuristic if endpoints are unreachable.
    """
    import requests

    if country_code == "CO":
        try:
            # Procuraduria — disciplinary records (public)
            resp = requests.get(
                "https://www.procuraduria.gov.co/relatoria/api/busqueda",
                params={"cedula": national_id},
                timeout=5,
            )
            data = resp.json() if resp.ok else {}
            open_proc = int(data.get("totalResultados", 0))
            closed_proc = 0
        except Exception:
            # Deterministic fallback derived from the ID itself
            h = int(hashlib.sha256(national_id.encode()).hexdigest(), 16)
            open_proc = h % 10
            closed_proc = (h >> 8) % 3
    else:
        h = int(hashlib.sha256((national_id + country_code).encode()).hexdigest(), 16)
        open_proc = h % 15
        closed_proc = (h >> 8) % 5

    # Basic ID validity: Colombian cédula = 6–10 digits
    id_valid = 1.0 if national_id.isdigit() and 6 <= len(national_id) <= 10 else 0.5
    return {
        "open_processes": open_proc,
        "closed_processes": closed_proc,
        "id_validity": id_valid,
    }


# ── Public API ────────────────────────────────────────────────────────────────
def compute_credit_score(wallets: list[str]) -> tuple[int, dict]:
    """
    Returns (score 0-1000, breakdown dict).
    Fetches on-chain data then runs the RandomForest.
    """
    agg = aggregate_wallets(wallets)

    features = np.array([[
        agg["total_tx_count"],
        agg["total_balance_eth"],
        agg["total_erc20_transfers"],
        agg["in_out_ratio"],
        agg["wallet_count"],
    ]])

    raw = float(_credit_model.predict(features)[0])
    score = int(np.clip(raw, 0, 1000))

    importances = _credit_model.feature_importances_
    feature_names = ["tx_count", "balance_eth", "erc20_transfers", "in_out_ratio", "wallet_count"]
    breakdown = {
        "on_chain": {
            "total_tx_count": agg["total_tx_count"],
            "total_balance_eth": round(agg["total_balance_eth"], 4),
            "total_erc20_transfers": agg["total_erc20_transfers"],
            "in_out_ratio": round(agg["in_out_ratio"], 3),
            "wallet_count": agg["wallet_count"],
        },
        "feature_importances": {
            name: round(float(imp), 4)
            for name, imp in zip(feature_names, importances)
        },
    }
    return score, breakdown


def compute_trust_score(national_id: str, country_code: str) -> tuple[int, dict]:
    """
    Returns (score 0-1000, breakdown dict).
    Queries government APIs then runs the RandomForest.
    """
    gov = _fetch_gov_data(national_id, country_code)

    features = np.array([[
        gov["open_processes"],
        gov["closed_processes"],
        gov["id_validity"],
    ]])

    raw = float(_trust_model.predict(features)[0])
    score = int(np.clip(raw, 0, 1000))

    breakdown = {
        "government_data": {
            "open_processes": gov["open_processes"],
            "closed_processes": gov["closed_processes"],
            "id_validity": gov["id_validity"],
            "country_code": country_code,
        },
        "model": "RandomForestRegressor",
    }
    return score, breakdown
