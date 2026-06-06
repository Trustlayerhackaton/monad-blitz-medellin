Generate an action plan for the following implementation complete Demo based on the action plan attached file and in what's currently implemented in this repo, However this should only include the basic static HTML, CSS and JS, the functionality should have everything we already have implemented without any server side or login, we should mock all data everything, ensure the visual part of it has the same features we had before with the added ones.

# Implementation Gap Plan: Trustlayer — Missing Features vs System Design

## Context
Three system-design diagrams define the full Trustlayer product. Large portions are not yet implemented.
This plan identifies every gap, scopes each piece, and gives the exact files/steps to close them.

---

## Current State Summary

| Area | Built | Missing |
|------|-------|---------|
| Frontend – MetaMask login | ✅ | — |
| Frontend – Display payment score (on-chain) | ✅ | — |
| Frontend – Multi-wallet submission UI | ❌ | Full UI |
| Frontend – Optional ID / SSN input | ❌ | Full UI |
| Frontend – Pay MON flow | ❌ | Payment trigger |
| Frontend – Backend API calls | ❌ | All axios calls |
| Frontend – Trustworthy score display | ❌ | Separate score card |
| Backend – User CRUD | ✅ | — |
| Backend – Blockchain data fetching | ❌ | RPC calls |
| Backend – Credit score endpoint | ❌ | Full endpoint + ML |
| Backend – Trustworthy score endpoint | ❌ | Full endpoint + ML |
| Contracts – CreditNFT | ✅ | — |
| Contracts – RiskScoreOracle (scores on-chain) | ✅ | Not wired to frontend |
| Contracts – WalletRegistry (multi-wallet) | ✅ | Not wired to frontend |
| Contracts – ValidationRecord | ❌ | New contract needed |

---

## Gap 1 — Backend: Credit Score Endpoint

### What the diagram says
> User submits wallets (1–N) → backend reads on-chain history → ML (Neural Network + Random Forest) → Credit Score

### Files to create / modify

**`backend/pyproject.toml`** — add deps:
```toml
"scikit-learn>=1.4.0",
"pandas>=2.1.0",
"numpy>=1.26.0",
```
(`requests` already present for RPC calls; no web3 needed for basic JSON-RPC)

**`backend/models/credit_score.py`** — SQLAlchemy model:
- `id`, `user_id` (FK → users), `wallets` (JSON array), `score` (int 0-1000),
  `score_breakdown` (JSON), `created_at`

**`backend/schemas/score.py`** — Pydantic schemas:
- `CreditScoreRequest`: `wallets: list[str]`
- `TrustScoreRequest`: `national_id: str`, `country_code: str`
- `ScoreResponse`: `score: int`, `level: str`, `breakdown: dict`, `created_at`

**`backend/controller/blockchain_controller.py`** — fetches on-chain data:
```python
# Uses requests to call Monad JSON-RPC directly (already in deps)
# Endpoints to call per wallet:
#   eth_getTransactionCount   → tx volume
#   eth_getBalance            → current balance
#   eth_getLogs               → ERC-20 transfer events (transfer history)
# RPC URL from env: MONAD_RPC_URL (default https://testnet-rpc.monad.xyz)
```

**`backend/controller/score_controller.py`** — ML scoring logic:
```python
# Credit score:
#   Features per wallet: tx_count, avg_balance, unique_counterparties,
#                        days_active, large_tx_ratio, in/out ratio
#   Aggregate across all wallets (weighted sum)
#   Model: RandomForestRegressor from scikit-learn (trained on synthetic data at startup)
#   Output: 0–1000 score + per-feature contribution breakdown

# Trustworthy score:
#   Input: national_id, country_code
#   Step 1: call gov public APIs (Colombia: RUES, Procuraduria, Contraloria open endpoints)
#   Step 2: if APIs unavailable, use heuristic baseline = 600 with randomised noise
#   Model: same RandomForest pipeline
#   Output: 0–1000 score + breakdown
```

**`backend/routers/scores.py`** — new router:
- `POST /scores/credit` → `CreditScoreRequest` → returns `ScoreResponse`
- `POST /scores/trustworthy` → `TrustScoreRequest` → returns `ScoreResponse`

**`backend/main.py`** — add `scores_router` to `app.include_router(...)`

---

## Gap 2 — Frontend: Investigation Flow (Wallet List + ID + Pay MON)

### What the diagram says
> Investigation = YES → Add wallets + Optional ID → Pay x Monad → Generate scores → Smart contract validation

### Files to create / modify

**`frontend/src/hooks/useScoreRequest.ts`** — new hook:
- `useWalletRegistry()`: calls `WalletRegistry.addWallet()` to register extra wallets on-chain
- `useScoreGeneration()`: axios `POST /scores/credit` with wallet list, then `POST /scores/trustworthy` with ID
- `useScorePayment()`: wagmi `useWriteContract` → `RiskScoreOracle.submitScore()` with `value = scoreFee`

**`frontend/src/components/WalletListForm.tsx`** — new component:
- Input to add wallet addresses (1 to N)
- "Add Wallet" button — calls WalletRegistry contract
- Optional: ID number text field + country selector
- "Continue" → moves to payment step

**`frontend/src/components/ScorePaymentModal.tsx`** — new component:
- Shows estimated fee (read from `RiskScoreOracle.scoreFee()`)
- "Pay & Generate Score" button → triggers payment + backend call
- Progress stepper: Submit wallets → Pay MON → Generate → Record on-chain

**`frontend/src/components/TrustScoreCard.tsx`** — new component:
- Shows Trustworthy Score (0–1000) alongside Credit Score
- Breakdown of factors (from `ScoreResponse.breakdown`)

**`frontend/src/app/page.tsx`** — wire up:
- Add "Solicitar Análisis" button that opens `WalletListForm`
- Add new dashboard tab or modal that shows both scores
- Add `TrustScoreCard` to Overview tab
- Add axios import + call backend after payment confirmation

**`frontend/src/lib/contracts.ts`** — add:
- `riskScoreOracleAbi` and `walletRegistryAbi`
- Contract addresses for both (from env vars)

---

## Gap 3 — Smart Contract: ValidationRecord

### What the diagram says
> Generate smart contract with validation of which wallet verified the score of which wallets

### File to create

**`contracts/contracts/ValidationRecord.sol`**:
```solidity
// Records immutable on-chain: who (backend oracle) validated which subject's score
// struct Record { address subject; uint256 score; uint256 timestamp; bytes32 dataHash; }
// mapping(address => Record[]) public records;
// function record(address subject, uint256 score, bytes32 dataHash) external onlyOracle
// event ScoreValidated(address indexed subject, uint256 score, address indexed oracle, uint256 timestamp)
```
Wire into `RiskScoreOracle.submitScore()`: after storing score, call `ValidationRecord.record()`.

**`contracts/scripts/deploy-risk.js`** — update to also deploy `ValidationRecord` and link to `RiskScoreOracle`.

**`frontend/src/lib/abis.ts`** — add `validationRecordAbi`.

---

## Gap 4 — env.example / docker-compose wiring for new vars

**`env.example`** (root) — add:
```
MONAD_RPC_URL=https://testnet-rpc.monad.xyz
ORACLE_PRIVATE_KEY=          # backend signs scores for RiskScoreOracle
RISK_ORACLE_ADDRESS=         # deployed RiskScoreOracle address
WALLET_REGISTRY_ADDRESS=     # deployed WalletRegistry address
VALIDATION_RECORD_ADDRESS=   # deployed ValidationRecord address
```

**`docker-compose.yaml`** — add these to the `backend` environment section.

---

## Implementation Order

```
1. backend/pyproject.toml          — add scikit-learn, pandas, numpy
2. backend/models/credit_score.py  — DB model
3. backend/schemas/score.py        — request/response schemas
4. backend/controller/blockchain_controller.py  — RPC data fetching
5. backend/controller/score_controller.py       — ML scoring
6. backend/routers/scores.py       — HTTP endpoints
7. backend/main.py                 — register scores router

8. contracts/contracts/ValidationRecord.sol     — new contract
9. contracts/scripts/deploy-risk.js             — update deploy script
10. frontend/src/lib/abis.ts        — add new ABIs
11. frontend/src/lib/contracts.ts   — add new addresses
12. frontend/src/hooks/useScoreRequest.ts       — new hook
13. frontend/src/components/WalletListForm.tsx  — wallet + ID input
14. frontend/src/components/ScorePaymentModal.tsx — pay + generate flow
15. frontend/src/components/TrustScoreCard.tsx  — display scores
16. frontend/src/app/page.tsx       — wire new components into dashboard

17. env.example + docker-compose.yaml — add new env vars
```

---

## Verification

1. **Backend scoring**: `curl -X POST http://localhost:8000/scores/credit -d '{"wallets":["0xabc"]}'` → returns `{score, level, breakdown}`
2. **Backend trustworthy**: `curl -X POST http://localhost:8000/scores/trustworthy -d '{"national_id":"12345","country_code":"CO"}'` → returns score
3. **Contract deploy**: `npx hardhat run scripts/deploy-risk.js --network localhost` → all three contracts deployed
4. **Frontend flow**: Connect MetaMask → click Solicitar Análisis → add wallet → pay MON → see both score cards update
5. **On-chain record**: `cast call <VALIDATION_RECORD_ADDR> "records(address)(uint256)" <user_addr>` returns score
