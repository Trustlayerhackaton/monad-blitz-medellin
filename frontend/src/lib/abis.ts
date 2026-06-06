// ABIs mínimos de los contratos de CrediPass desplegados en Monad.
// Solo se incluyen las funciones que usa el frontend.

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
          { name: "celoWallet", type: "address" },
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
    inputs: [{ name: "astarTokenId", type: "uint256" }],
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
