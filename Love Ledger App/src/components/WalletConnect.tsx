import { Wallet } from "lucide-react";
import { Button } from "./ui/button";

interface WalletConnectProps {
  wallet: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function WalletConnect({ wallet, onConnect, onDisconnect }: WalletConnectProps) {
  return (
    <div className="flex items-center gap-4">
      {wallet ? (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-4 py-2 bg-[#2A1E5C] rounded-lg border border-[#FF3EA5]/30">
            <Wallet className="w-4 h-4 text-[#FF3EA5]" />
            <span className="text-sm">
              {wallet.slice(0, 6)}...{wallet.slice(-4)}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onDisconnect}
            className="border-[#FF3EA5]/30 hover:bg-[#FF3EA5]/10"
          >
            Disconnect
          </Button>
        </div>
      ) : (
        <Button
          onClick={onConnect}
          className="bg-[#FF3EA5] hover:bg-[#FF3EA5]/90"
        >
          <Wallet className="w-4 h-4 mr-2" />
          Connect Wallet
        </Button>
      )}
    </div>
  );
}
