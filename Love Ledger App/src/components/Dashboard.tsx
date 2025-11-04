import { motion } from "motion/react";
import { ArrowLeft, Heart, AlertTriangle, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";

interface Contract {
  id: string;
  creatorWallet: string;
  partnerWallet: string;
  amount: string;
  duration: string;
  refundOption: string;
  status: "pending" | "active" | "verified" | "terminated";
  verifiedCreator: boolean;
  verifiedPartner: boolean;
  createdAt: string;
  lastActivity: string;
  paired: boolean;
  verifiedAt?: string;
  terminatedBy?: string;
  terminatedAt?: string;
}

interface DashboardProps {
  wallet: string;
  contract: Contract | null;
  onBack: () => void;
  onPair: () => void;
  onVerify: () => void;
  onUnpair: () => void;
}

export function Dashboard({ wallet, contract, onBack, onPair, onVerify, onUnpair }: DashboardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-gray-500";
      case "active":
        return "bg-[#FF3EA5]";
      case "verified":
        return "bg-[#FFD465]";
      case "terminated":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "active":
        return <Heart className="w-4 h-4" />;
      case "verified":
        return <CheckCircle2 className="w-4 h-4" />;
      case "terminated":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getDaysRemaining = () => {
    if (!contract || !contract.duration) return null;
    const created = new Date(contract.createdAt);
    const duration = parseInt(contract.duration);
    const expiryDate = new Date(created.getTime() + duration * 24 * 60 * 60 * 1000);
    const now = new Date();
    const daysLeft = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, daysLeft);
  };

  const getProgressPercentage = () => {
    if (!contract || !contract.duration) return 0;
    const created = new Date(contract.createdAt);
    const duration = parseInt(contract.duration);
    const now = new Date();
    const elapsed = now.getTime() - created.getTime();
    const total = duration * 24 * 60 * 60 * 1000;
    return Math.min(100, (elapsed / total) * 100);
  };

  const getDaysSinceCreated = () => {
    if (!contract) return 0;
    const created = new Date(contract.createdAt);
    const now = new Date();
    const days = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const isCreator = contract?.creatorWallet === wallet;
  const isPartner = contract?.partnerWallet === wallet;
  const userVerified = isCreator ? contract?.verifiedCreator : contract?.verifiedPartner;
  const partnerVerified = isCreator ? contract?.verifiedPartner : contract?.verifiedCreator;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0A1E] via-[#1A1332] to-[#0F0A1E] py-12">
      <div className="container mx-auto px-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-8 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl mb-3 text-[#FF3EA5]">Love Contract Dashboard</h1>
            <p className="text-gray-400">Monitor your commitment status</p>
          </motion.div>

          {!contract ? (
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
              {/* Status Card */}
              <Card className="bg-[#2A1E5C]/50 border-[#FF3EA5]/20 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-full ${getStatusColor(contract.status)}/20`}>
                      {getStatusIcon(contract.status)}
                    </div>
                    <div>
                      <h2 className="text-2xl">Contract Status</h2>
                      <Badge className={`${getStatusColor(contract.status)} mt-1`}>
                        {contract.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl text-[#FFD465]">{contract.amount} MATIC</div>
                    <div className="text-sm text-gray-400">Locked Fund</div>
                  </div>
                </div>

                {/* Contract Details */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-[#1A1332] rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">Contract Creator</div>
                    <div className="text-sm">
                      {contract.creatorWallet.slice(0, 10)}...{contract.creatorWallet.slice(-8)}
                      {isCreator && <span className="text-[#FF3EA5] ml-2">(You)</span>}
                    </div>
                  </div>
                  <div className="p-4 bg-[#1A1332] rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">Partner Wallet</div>
                    <div className="text-sm">
                      {contract.partnerWallet.slice(0, 10)}...{contract.partnerWallet.slice(-8)}
                      {isPartner && <span className="text-[#FF3EA5] ml-2">(You)</span>}
                    </div>
                  </div>
                </div>

                {/* Time Progress */}
                {contract.status === "active" && (
                  <div className="mb-6">
                    {contract.duration ? (
                      <>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Contract Duration</span>
                          <span className="text-[#FFD465]">{getDaysRemaining()} days remaining</span>
                        </div>
                        <Progress value={getProgressPercentage()} className="h-2" />
                      </>
                    ) : (
                      <div className="p-4 bg-[#1A1332] rounded-lg border border-[#FF3EA5]/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-gray-400 mb-1">Contract Duration</div>
                            <div className="text-lg text-[#FFD465]">No Expiry Date</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-400">Active for</div>
                            <div className="text-lg text-[#FF3EA5]">{getDaysSinceCreated()} days</div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Kontrak ini tidak memiliki batas waktu dan akan tetap aktif hingga diverifikasi atau di-unpair.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Created Date */}
                <div className="text-xs text-gray-500">
                  Created: {new Date(contract.createdAt).toLocaleDateString()}
                </div>
              </Card>

              {/* Pending Pairing */}
              {contract.status === "pending" && !contract.paired && isPartner && (
                <Alert className="bg-[#FF3EA5]/10 border-[#FF3EA5]/30">
                  <Heart className="h-4 w-4 text-[#FF3EA5]" />
                  <AlertDescription className="text-sm">
                    <strong>Pairing Request:</strong> You've been invited to join this love contract. Accept to activate the commitment.
                  </AlertDescription>
                </Alert>
              )}

              {/* Verification Status */}
              {contract.status === "active" && (
                <Card className="bg-[#2A1E5C]/50 border-[#FF3EA5]/20 p-8">
                  <h3 className="text-xl mb-6 text-[#FFD465]">Marriage Verification Status</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className={`p-6 rounded-lg border-2 ${userVerified ? 'bg-[#FFD465]/10 border-[#FFD465]' : 'bg-[#1A1332] border-[#FF3EA5]/20'}`}>
                      <div className="flex items-center gap-3 mb-2">
                        {userVerified ? (
                          <CheckCircle2 className="w-6 h-6 text-[#FFD465]" />
                        ) : (
                          <Clock className="w-6 h-6 text-gray-500" />
                        )}
                        <div className="text-lg">Your Verification</div>
                      </div>
                      <div className="text-sm text-gray-400">
                        {userVerified ? "Verified ✓" : "Pending..."}
                      </div>
                    </div>

                    <div className={`p-6 rounded-lg border-2 ${partnerVerified ? 'bg-[#FFD465]/10 border-[#FFD465]' : 'bg-[#1A1332] border-[#FF3EA5]/20'}`}>
                      <div className="flex items-center gap-3 mb-2">
                        {partnerVerified ? (
                          <CheckCircle2 className="w-6 h-6 text-[#FFD465]" />
                        ) : (
                          <Clock className="w-6 h-6 text-gray-500" />
                        )}
                        <div className="text-lg">Partner's Verification</div>
                      </div>
                      <div className="text-sm text-gray-400">
                        {partnerVerified ? "Verified ✓" : "Pending..."}
                      </div>
                    </div>
                  </div>

                  {!userVerified && !partnerVerified && (
                    <Alert className="bg-blue-500/10 border-blue-500/30 mb-4">
                      <AlertCircle className="h-4 w-4 text-blue-400" />
                      <AlertDescription className="text-sm text-gray-300">
                        Both partners must verify marriage independently. Once both verify, the Love Fund will be released and NFTs will be minted.
                      </AlertDescription>
                    </Alert>
                  )}

                  {userVerified && !partnerVerified && (
                    <Alert className="bg-[#FFD465]/10 border-[#FFD465]/30 mb-4">
                      <Clock className="h-4 w-4 text-[#FFD465]" />
                      <AlertDescription className="text-sm text-gray-300">
                        You've verified! Waiting for your partner to verify marriage...
                      </AlertDescription>
                    </Alert>
                  )}

                  {!userVerified && partnerVerified && (
                    <Alert className="bg-[#FF3EA5]/10 border-[#FF3EA5]/30 mb-4">
                      <AlertTriangle className="h-4 w-4 text-[#FF3EA5]" />
                      <AlertDescription className="text-sm text-gray-300">
                        Your partner has verified! Complete your verification to unlock the Love Fund.
                      </AlertDescription>
                    </Alert>
                  )}
                </Card>
              )}

              {/* Verified Success */}
              {contract.status === "verified" && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <Card className="bg-gradient-to-br from-[#FFD465]/20 to-[#FF3EA5]/20 border-[#FFD465] p-8 text-center">
                    <div className="mb-4 text-6xl">💍</div>
                    <h2 className="text-3xl mb-3 text-[#FFD465]">Congratulations!</h2>
                    <p className="text-lg mb-4">You are now verified on-chain!</p>
                    <p className="text-gray-400 mb-6">
                      Love Fund has been released ({parseFloat(contract.amount) / 2} MATIC each) and Love Proof NFTs have been minted to both wallets.
                    </p>
                    <Badge className="bg-[#FFD465] text-[#0F0A1E]">
                      Verified on {new Date(contract.verifiedAt!).toLocaleDateString()}
                    </Badge>
                  </Card>
                </motion.div>
              )}

              {/* Terminated */}
              {contract.status === "terminated" && (
                <Card className="bg-red-500/10 border-red-500/30 p-8 text-center">
                  <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h2 className="text-2xl mb-3 text-red-400">Contract Terminated</h2>
                  <p className="text-gray-400 mb-4">
                    This contract was terminated on {new Date(contract.terminatedAt!).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Terminated by: {contract.terminatedBy?.slice(0, 10)}...{contract.terminatedBy?.slice(-8)}
                  </p>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                {contract.status === "pending" && !contract.paired && isPartner && (
                  <Button
                    onClick={onPair}
                    className="flex-1 bg-[#FF3EA5] hover:bg-[#FF3EA5]/90"
                    size="lg"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Accept & Pair Wallet
                  </Button>
                )}

                {contract.status === "active" && !userVerified && (
                  <Button
                    onClick={onVerify}
                    className="flex-1 bg-[#FFD465] hover:bg-[#FFD465]/90 text-[#0F0A1E]"
                    size="lg"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Verify Married
                  </Button>
                )}

                {contract.status === "active" && (
                  <Button
                    onClick={onUnpair}
                    variant="destructive"
                    className="flex-1"
                    size="lg"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Unpair Contract
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
