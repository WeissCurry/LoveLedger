import { createPublicClient, createWalletClient, custom, http } from "viem";
import { sepolia } from "viem/chains";
import ABI from "../abi/LoveLedgerABI.json";
import { defineChain } from "viem/utils";

export const CONTRACT_ADDRESS = "0x3cc95BdCbefbe2b335Ad7D1679D8eCD69df93D18";


const liskSepolia = defineChain({
    id: 4202,
    name: "Lisk Sepolia",
    network: "lisk-sepolia",
    nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
    rpcUrls: {
        default: { http: ["https://rpc.sepolia-api.lisk.com"] },
    },
    blockExplorers: {
        default: { name: "Lisk Sepolia Explorer", url: "https://sepolia-blockscout.lisk.com" },
    },
});


export const publicClient = createPublicClient({
    chain: liskSepolia,
    transport: http(),
});

export const getWalletClient = async () => {
    if (!window.ethereum) throw new Error("No wallet found");
    return createWalletClient({
        chain: liskSepolia,
        transport: custom(window.ethereum),
    });
};

export const LOVE_LEDGER_ABI = ABI;
