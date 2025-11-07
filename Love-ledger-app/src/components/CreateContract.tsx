// src/components/CreateContract.tsx
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Lock, AlertCircle, Copy } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { isAddress, parseEther } from "viem";
import { LOVE_LEDGER_ABI, CONTRACT_ADDRESS } from "../lib/contract";

interface CreateContractProps {
  wallet: string;
  onBack: () => void;
  onSubmit: (formData: {
    partnerWallet: string;
    amount: string;
    duration: string;
    refundOption: "refund" | "burn";
  }) => void;
}

export function CreateContract({ wallet, onBack, onSubmit }: CreateContractProps) {
  const { isConnected } = useAccount();
  const [formData, setFormData] = useState({
    partnerWallet: "",
    amount: "",
    duration: "",
    refundOption: "refund" as "refund" | "burn",
  });
  const [copied, setCopied] = useState(false);

  const {
    writeContract,
    data: txHash,
    isPending,
    error,
  } = useWriteContract();

  const { isSuccess, isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const shortWallet = wallet
    ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}`
    : "Not Connected";

  const handleCopy = async () => {
    if (!wallet) return;
    await navigator.clipboard.writeText(wallet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) return alert("Please connect your wallet first!");
    if (!isAddress(formData.partnerWallet)) {
      alert("Invalid partner wallet address!");
      return;
    }

    try {
      console.log("🧩 DEBUG SUBMIT:", {
        contractAddress: CONTRACT_ADDRESS,
        partnerWallet: formData.partnerWallet,
        amount: formData.amount,
        parsedAmount: parseEther(formData.amount || "0").toString(),
      });

      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: LOVE_LEDGER_ABI,
        functionName: "startRelationship",
        args: [
          formData.partnerWallet as `0x${string}`,
          "0x0000000000000000000000000000000000000000",
          BigInt(parseEther(formData.amount || "0")),
        ],
        value: parseEther(formData.amount || "0"),
      });

      console.log("✅ Transaction submitted successfully!");

      // ✅ Setelah sukses kirim data ke parent
      onSubmit(formData);
    } catch (err) {
      console.error("❌ Error creating contract:", err);
    }
  };

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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl mb-3 text-[#FF3EA5] font-bold">
              Create Love Contract 💞
            </h1>
            <p className="text-gray-400">
              Lock your commitment on-chain. Prove your future together.
            </p>
          </div>

          <Card className="bg-[#2A1E5C]/50 border-[#FF3EA5]/20 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Wallet Display */}
              <div>
                <Label>Your Wallet</Label>
                <div className="mt-2 flex items-center justify-between px-4 py-3 bg-[#1A1332] rounded-lg border border-[#FF3EA5]/20">
                  <span className="text-sm text-gray-400">{shortWallet}</span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="text-xs flex items-center gap-1 text-[#FF3EA5] hover:text-[#FFD465] transition"
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Partner Wallet */}
              <div>
                <Label htmlFor="partnerWallet">Partner's Wallet Address</Label>
                <Input
                  id="partnerWallet"
                  placeholder="0x..."
                  value={formData.partnerWallet}
                  onChange={(e) =>
                    setFormData({ ...formData, partnerWallet: e.target.value })
                  }
                  className="mt-2 bg-[#1A1332] border-[#FF3EA5]/20"
                  required
                />
              </div>

              {/* Amount */}
              <div>
                <Label htmlFor="amount">Love Fund Amount (ETH)</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF3EA5]" />
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.05"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    className="pl-10 bg-[#1A1332] border-[#FF3EA5]/20"
                    required
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <Label htmlFor="duration">Duration (Days)</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="365"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  className="mt-2 bg-[#1A1332] border-[#FF3EA5]/20"
                />
              </div>

              {/* Refund Option */}
              <div>
                <Label>If One Partner Unpairs</Label>
                <RadioGroup
                  value={formData.refundOption}
                  onValueChange={(value: "burn" | "refund") =>
                    setFormData({ ...formData, refundOption: value })
                  }
                  className="mt-3 space-y-3"
                >
                  <div className="flex items-start space-x-3 p-4 bg-[#1A1332] rounded-lg border border-[#FF3EA5]/20">
                    <RadioGroupItem value="refund" id="refund" />
                    <div>
                      <Label htmlFor="refund">Refund Remaining Partner</Label>
                      <p className="text-xs text-gray-500">
                        Remaining partner receives all funds.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 bg-[#1A1332] rounded-lg border border-[#FF3EA5]/20">
                    <RadioGroupItem value="burn" id="burn" />
                    <div>
                      <Label htmlFor="burn">Burn Funds</Label>
                      <p className="text-xs text-gray-500">
                        Funds go to null address if one unpairs.
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Warning */}
              <Alert className="bg-[#FF3EA5]/10 border-[#FF3EA5]/30">
                <AlertCircle className="h-4 w-4 text-[#FF3EA5]" />
                <AlertDescription className="text-sm text-gray-300">
                  <strong>Important:</strong> Once created, funds are locked
                  until both partners verify marriage.
                </AlertDescription>
              </Alert>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-[#FF3EA5] hover:bg-[#FF3EA5]/90"
                disabled={isPending || isConfirming}
              >
                {isPending
                  ? "Waiting for Wallet..."
                  : isConfirming
                  ? "Confirming on Chain..."
                  : "Lock Love Fund & Create Contract"}
              </Button>

              {isSuccess && (
                <p className="text-green-400 text-center mt-4">
                  ✅ Contract Created Successfully!
                </p>
              )}
              {error && (
                <p className="text-red-400 text-center mt-4">
                  ❌ {(error as any)?.shortMessage || error.message}
                </p>
              )}
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
