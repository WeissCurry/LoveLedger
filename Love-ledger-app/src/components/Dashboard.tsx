import { motion } from "motion/react";
import {
  ArrowLeft,
  Heart,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { Contract } from "../types/Contract";
import { useContractStatus } from "../hooks/useContractStatus";
import { useWriteContract } from "wagmi";
import { LOVE_NFT_ADDRESS, LOVE_NFT_ABI } from "../lib/loveNftContract";

interface DashboardProps {
  wallet: `0x${string}`;
  contract: Contract | null;
  onBack: () => void;
  onPair: () => Promise<void>;
  onVerify: () => Promise<void>;
  onUnpair: () => Promise<void>;
}

export function Dashboard({ contract, onBack, onPair, onVerify, onUnpair }: DashboardProps) {
  const { address, isConnected } = useAccount();

  const { writeContract, isPending: isMinting } = useWriteContract();

  const handleMintNFT = async () => {
    try {
      await writeContract({
        address: LOVE_NFT_ADDRESS,
        abi: LOVE_NFT_ABI,
        functionName: "mint",
        args: [address],
      });
      alert("You are about to mint nft!");
    } catch (err) {
      alert("Mint failed!");
    }
  };

  
  // Get status from blockchain
  const { 
    onChainStatus, 
    hasRelationship, 
    tokenId, 
    relationshipData,
    refetchStatus,
    isLoading: statusLoading 
  } = useContractStatus(contract?.partnerWallet);

  // Use on-chain status if available, fallback to contract status
  const displayStatus = onChainStatus || contract?.status || "Dating";

  // 🩷 --- STATUS STYLE MAPPING SESUAI SC ---
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Dating":
        return "bg-pink-500";
      case "Married":
        return "bg-yellow-400";
      case "BrokeUp":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Dating":
        return <Heart className="w-4 h-4" />;
      case "Married":
        return <CheckCircle2 className="w-4 h-4" />;
      case "BrokeUp":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getDaysSinceCreated = () => {
    if (!contract) return 0;
    const created = new Date(contract.createdAt);
    const now = new Date();
    return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  };

  const isCreator = contract?.creatorWallet === address;
  const isPartner = contract?.partnerWallet === address;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0A1E] via-[#1A1332] to-[#0F0A1E] py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between mb-8">
          <Button variant="ghost" onClick={onBack} className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl mb-3 text-[#FF3EA5]">Love Contract Dashboard</h1>
            <p className="text-gray-400">Monitor your commitment status on-chain</p>
          </motion.div>

          {!isConnected ? (
            <Card className="bg-[#2A1E5C]/50 border-[#FF3EA5]/20 p-12 text-center">
              <Heart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h2 className="text-xl mb-2 text-gray-400">No Wallet Connected</h2>
              <p className="text-gray-500 mb-6">
                Connect your wallet to view your contracts.
              </p>
              <ConnectButton />
            </Card>
          ) : !contract ? (
            <Card className="bg-[#2A1E5C]/50 border-[#FF3EA5]/20 p-12 text-center">
              <Heart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h2 className="text-xl mb-2 text-gray-400">No Active Contract</h2>
              <p className="text-gray-500 mb-6">
                You don't have any love contracts yet. Create one to get started.
              </p>
              <Button onClick={onBack} className="bg-[#FF3EA5] hover:bg-[#FF3EA5]/90">
                Create Love Contract
              </Button>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* STATUS CARD */}
              <Card className="bg-[#2A1E5C]/50 border-[#FF3EA5]/20 p-8">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-full ${getStatusColor(displayStatus)}/20`}>
                      {getStatusIcon(displayStatus)}
                    </div>
                    <div>
                      <h2 className="text-2xl">Contract Status</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`${getStatusColor(displayStatus)}`}>
                          {displayStatus.toUpperCase()}
                        </Badge>
                        {statusLoading && (
                          <span className="text-xs text-gray-500">Loading on-chain data...</span>
                        )}
                        {onChainStatus && (
                          <span className="text-xs text-green-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            On-Chain
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl text-[#FFD465]">{contract.amount} ETH</div>
                    <div className="text-sm text-gray-400">Locked Fund</div>
                    {tokenId && (
                      <div className="text-xs text-gray-500 mt-1">Token ID: {tokenId.toString()}</div>
                    )}
                  </div>
                </div>

                {/* Refresh Button */}
                <div className="flex justify-end mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetchStatus()}
                    className="text-xs"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Refresh Status
                  </Button>
                </div>

                {/* INFO DASAR */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-[#1A1332] rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">Partner A (Creator)</div>
                    <div className="text-sm">
                      {contract.creatorWallet.slice(0, 10)}...{contract.creatorWallet.slice(-8)}
                      {isCreator && <span className="text-[#FF3EA5] ml-2">(You)</span>}
                    </div>
                  </div>
                  <div className="p-4 bg-[#1A1332] rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">Partner B</div>
                    <div className="text-sm">
                      {contract.partnerWallet.slice(0, 10)}...{contract.partnerWallet.slice(-8)}
                      {isPartner && <span className="text-[#FF3EA5] ml-2">(You)</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    Created: {new Date(contract.createdAt).toLocaleDateString()}
                  </span>
                  <Button
                    size="sm"
                    className="bg-[#FF3EA5] hover:bg-[#FF3EA5]/90"
                    onClick={handleMintNFT}
                    disabled={isMinting}
                  >
                    Mint NFT
                  </Button>
                </div>
              </Card>

              {/* STATUS DETAIL */}
              {displayStatus === "Dating" && (
                <Alert className="bg-pink-500/10 border-pink-500/30">
                  <Heart className="h-4 w-4 text-pink-400" />
                  <AlertDescription className="text-sm text-gray-300">
                    💞 You're currently dating! Ready to take it to the next level?
                  </AlertDescription>
                </Alert>
              )}

              {displayStatus === "Married" && (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <Card className="bg-gradient-to-br from-yellow-400/20 to-pink-500/20 border-yellow-400 p-8 text-center">
                    <div className="mb-4 text-6xl">💍</div>
                    <h2 className="text-3xl mb-3 text-yellow-400">Congratulations!</h2>
                    <p className="text-lg mb-4">You're officially married on-chain!</p>
                    <p className="text-gray-400 mb-6">
                      Love Fund is now eligible for withdrawal by the depositor.
                    </p>
                  </Card>
                </motion.div>
              )}

              {displayStatus === "BrokeUp" && (
                <Card className="bg-red-500/10 border-red-500/30 p-8 text-center">
                  <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h2 className="text-2xl mb-3 text-red-400">Relationship Ended 💔</h2>
                  <p className="text-gray-400">
                    The contract has been marked as BrokeUp. Deposit is now locked and both partners are single again.
                  </p>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

<div className="hidden">
  bg-pink-500 bg-yellow-400 bg-red-500 bg-gray-500
  bg-pink-500/10 bg-pink-500/30 bg-yellow-400/20 bg-red-500/10 bg-red-500/30
</div>