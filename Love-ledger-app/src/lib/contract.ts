import { createPublicClient, createWalletClient, custom, http } from "viem";
import { sepolia } from "viem/chains";
import ABI from "../abi/LoveLedgerABI.json";

export const CONTRACT_ADDRESS = "0x3cc95BdCbefbe2b335Ad7D1679D8eCD69df93D18";

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

export const getWalletClient = async () => {
  if (!window.ethereum) throw new Error("No wallet found");
  return createWalletClient({
    chain: sepolia,
    transport: custom(window.ethereum),
  });
};

export const LOVE_LEDGER_ABI = ABI;
