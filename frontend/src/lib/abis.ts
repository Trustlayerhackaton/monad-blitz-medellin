// ABIs mínimos de los contratos de Trustlayer desplegados en Monad.
// Solo se incluyen las funciones que usa el frontend.

export const walletRegistryAbi = [
  {
    type: "function",
    name: "consentHash",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "wallet", type: "address" },
    ],
    outputs: [{ name: "", type: "bytes32" }],
  },
  {
    type: "function",
    name: "registerWallet",
    stateMutability: "nonpayable",
    inputs: [
      { name: "wallet", type: "address" },
      { name: "signature", type: "bytes" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "getLinkedWallets",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "address[]" }],
  },
  {
    type: "function",
    name: "isLinked",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "wallet", type: "address" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "event",
    name: "WalletLinked",
    inputs: [
      { name: "owner", type: "address", indexed: true },
      { name: "wallet", type: "address", indexed: true },
    ],
  },
] as const;

export const riskScoreOracleAbi = [
  {
    type: "function",
    name: "scoreFee",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "submitScore",
    stateMutability: "payable",
    inputs: [
      { name: "subject", type: "address" },
      { name: "score", type: "uint256" },
      { name: "dataHash", type: "bytes32" },
      { name: "signature", type: "bytes" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "getScore",
    stateMutability: "view",
    inputs: [{ name: "subject", type: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "score", type: "uint256" },
          { name: "timestamp", type: "uint256" },
          { name: "dataHash", type: "bytes32" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "hasScore",
    stateMutability: "view",
    inputs: [{ name: "subject", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "scoreDigest",
    stateMutability: "view",
    inputs: [
      { name: "subject", type: "address" },
      { name: "score", type: "uint256" },
      { name: "dataHash", type: "bytes32" },
    ],
    outputs: [{ name: "", type: "bytes32" }],
  },
  {
    type: "event",
    name: "ScoreSubmitted",
    inputs: [
      { name: "subject", type: "address", indexed: true },
      { name: "score", type: "uint256", indexed: false },
      { name: "dataHash", type: "bytes32", indexed: true },
      { name: "payer", type: "address", indexed: true },
      { name: "feePaid", type: "uint256", indexed: false },
    ],
  },
] as const;

export const validationRecordAbi = [
  {
    type: "function",
    name: "getRecords",
    stateMutability: "view",
    inputs: [{ name: "subject", type: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        components: [
          { name: "oracle", type: "address" },
          { name: "score", type: "uint256" },
          { name: "dataHash", type: "bytes32" },
          { name: "timestamp", type: "uint256" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "recordCount",
    stateMutability: "view",
    inputs: [{ name: "subject", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "latestRecord",
    stateMutability: "view",
    inputs: [{ name: "subject", type: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "oracle", type: "address" },
          { name: "score", type: "uint256" },
          { name: "dataHash", type: "bytes32" },
          { name: "timestamp", type: "uint256" },
        ],
      },
    ],
  },
  {
    type: "event",
    name: "ScoreValidated",
    inputs: [
      { name: "subject", type: "address", indexed: true },
      { name: "score", type: "uint256", indexed: false },
      { name: "dataHash", type: "bytes32", indexed: true },
      { name: "oracle", type: "address", indexed: true },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
] as const;

export const creditNFTAbi = [
  {
    type: "function",
    name: "getActiveToken",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "getReputation",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "getCreditData",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "paymentScore", type: "uint256" },
          { name: "consecutivePayments", type: "uint256" },
          { name: "monadWallet", type: "address" },
          { name: "governancePower", type: "uint256" },
          { name: "stakingAmount", type: "uint256" },
          { name: "createdAt", type: "uint256" },
          { name: "isStaked", type: "bool" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "ownerOf",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "authorizedMinters",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "mintCreditNFT",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "paymentScore", type: "uint256" },
      { name: "consecutivePayments", type: "uint256" },
      { name: "tokenURI", type: "string" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "mintMyPassport",
    stateMutability: "nonpayable",
    inputs: [{ name: "tokenURI", type: "string" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "recordPayment",
    stateMutability: "nonpayable",
    inputs: [
      { name: "tokenId", type: "uint256" },
      { name: "newScore", type: "uint256" },
      { name: "consecutivePayments", type: "uint256" },
    ],
    outputs: [],
  },
] as const;

export const rewardSystemAbi = [
  {
    type: "function",
    name: "getCreditInfo",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [
      { name: "limit", type: "uint256" },
      { name: "active", type: "uint256" },
      { name: "available", type: "uint256" },
    ],
  },
  {
    type: "function",
    name: "totalRewards",
    stateMutability: "view",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "recordPayment",
    stateMutability: "nonpayable",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [],
  },
] as const;

export const mockCCOPAbi = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
  {
    type: "function",
    name: "symbol",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
  {
    type: "function",
    name: "faucet",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
] as const;
