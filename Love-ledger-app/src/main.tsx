import React from "react";
import { createRoot } from "react-dom/client";
import { WagmiProvider, createConfig, http } from "wagmi";
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { sepolia } from "viem/chains";
import { defineChain } from "viem/utils";
import "@rainbow-me/rainbowkit/styles.css";
import App from "./App";
import "./index.css";

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

const { wallets } = getDefaultWallets({
  appName: "Love Ledger App",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ?? "demo",
});

const connectors = connectorsForWallets(wallets, {
  appName: "Love Ledger App",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ?? "demo",
});


const config = createConfig({
  chains: [liskSepolia, sepolia],
  connectors,
  transports: {
    [liskSepolia.id]: http(),
    [sepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider >
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
