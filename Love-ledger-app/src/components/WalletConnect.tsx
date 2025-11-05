import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function WalletConnect() {
  return (
    <div className="flex flex-col items-center gap-6">
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          mounted,
        }) => {
          const ready = mounted;
          const connected = ready && account && chain;

          return (
            <div
              {...(!ready && {
                "aria-hidden": true,
                style: {
                  opacity: 0,
                  pointerEvents: "none",
                  userSelect: "none",
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <button
                      onClick={openConnectModal}
                      className="bg-[#FF3EA5] hover:bg-[#FF3EA5]/90 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                      type="button"
                    >
                      Connect Wallet
                    </button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <button
                      onClick={openChainModal}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                      type="button"
                    >
                      Wrong network
                    </button>
                  );
                }

                return (
                  <div className="flex items-center gap-4">
                    {/* Chain Info */}
                    <button
                      onClick={openChainModal}
                      className="flex items-center bg-[#2A1E5C] px-4 py-2 rounded-lg border border-[#FF3EA5]/30 hover:border-[#FF3EA5] transition-all duration-200"
                      type="button"
                    >
                      {chain.hasIcon && chain.iconUrl && (
                        <img
                          alt={chain.name ?? "Chain icon"}
                          src={chain.iconUrl}
                          className="w-5 h-5 mr-2 rounded-full"
                        />
                      )}
                      <span className="text-sm font-medium text-white">{chain.name}</span>
                    </button>

                    {/* Account Info */}
                    <button
                      onClick={openAccountModal}
                      type="button"
                      className="border border-[#FF3EA5]/30 hover:bg-[#FF3EA5]/10 text-white text-sm px-4 py-2 rounded-lg transition-all duration-200"
                    >
                      {account.displayName}
                      {account.displayBalance ? ` (${account.displayBalance})` : ""}
                    </button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
}
