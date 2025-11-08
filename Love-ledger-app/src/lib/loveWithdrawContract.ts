export const LOVE_FUND_VAULT_ADDRESS = "0x3cc95BdCbefbe2b335Ad7D1679D8eCD69df93D18";
export const LOVE_FUND_VAULT_ABI = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "internalType": "address", "name": "to", "type": "address" }
    ],
    "name": "withdrawDeposit",
    "outputs": [],
    "stateMutability": "nonReentrant",
    "type": "function"
  }
];