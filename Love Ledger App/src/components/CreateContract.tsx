import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Lock, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Alert, AlertDescription } from "./ui/alert";

interface CreateContractProps {
  wallet: string;
  onBack: () => void;
  onSubmit: (data: ContractData) => void;
}

export interface ContractData {
  partnerWallet: string;
  amount: string;
  duration: string;
  refundOption: "burn" | "refund";
}

export function CreateContract({ wallet, onBack, onSubmit }: CreateContractProps) {
  const [formData, setFormData] = useState<ContractData>({
    partnerWallet: "",
    amount: "",
    duration: "",
    refundOption: "refund",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
            <h1 className="text-4xl mb-3 text-[#FF3EA5]">Create Love Contract</h1>
            <p className="text-gray-400">
              Lock your commitment on-chain. Prove your future together.
            </p>
          </div>

          <Card className="bg-[#2A1E5C]/50 border-[#FF3EA5]/20 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Your Wallet */}
              <div>
                <Label>Your Wallet (Contract Creator)</Label>
                <div className="mt-2 px-4 py-3 bg-[#1A1332] rounded-lg border border-[#FF3EA5]/20">
                  <span className="text-sm text-gray-400">{wallet}</span>
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

              {/* Love Fund Amount */}
              <div>
                <Label htmlFor="amount">Love Fund Amount (MATIC)</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF3EA5]" />
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="200"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    className="pl-10 bg-[#1A1332] border-[#FF3EA5]/20"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  This amount will be locked in escrow until marriage verification
                </p>
              </div>

              {/* Contract Duration */}
              <div>
                <Label htmlFor="duration">
                  Contract Duration (Days) 
                  <span className="text-[#FFD465] ml-2">- Optional</span>
                </Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="Contoh: 365 (atau kosongkan untuk tanpa batas)"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  className="mt-2 bg-[#1A1332] border-[#FF3EA5]/20"
                />
                <div className="mt-2 p-3 bg-[#FFD465]/10 border border-[#FFD465]/30 rounded-lg">
                  <p className="text-xs text-gray-300">
                    💡 <strong>Opsional:</strong> Tidak semua pasangan bisa memastikan waktu pernikahan. Biarkan kosong jika Anda ingin kontrak tetap aktif tanpa batas waktu hingga diverifikasi atau di-unpair.
                  </p>
                </div>
              </div>

              {/* Failure Consequence */}
              <div>
                <Label>If One Partner Unpairs Before Verification</Label>
                <RadioGroup
                  value={formData.refundOption}
                  onValueChange={(value) =>
                    setFormData({ ...formData, refundOption: value as "burn" | "refund" })
                  }
                  className="mt-3 space-y-3"
                >
                  <div className="flex items-start space-x-3 p-4 bg-[#1A1332] rounded-lg border border-[#FF3EA5]/20">
                    <RadioGroupItem value="refund" id="refund" className="mt-0.5" />
                    <div className="flex-1">
                      <Label htmlFor="refund" className="cursor-pointer">
                        Refund to Remaining Partner
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">
                        If one unpairs, all funds go to the partner who stayed committed
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 bg-[#1A1332] rounded-lg border border-[#FF3EA5]/20">
                    <RadioGroupItem value="burn" id="burn" className="mt-0.5" />
                    <div className="flex-1">
                      <Label htmlFor="burn" className="cursor-pointer">
                        Burn Funds
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">
                        If one unpairs, all funds are permanently burned (sent to null address)
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Warning Alert */}
              <Alert className="bg-[#FF3EA5]/10 border-[#FF3EA5]/30">
                <AlertCircle className="h-4 w-4 text-[#FF3EA5]" />
                <AlertDescription className="text-sm text-gray-300">
                  <strong>Important:</strong> Once created, this contract is immutable. Funds will be locked until both partners verify marriage or the contract is terminated. Make sure both parties understand the commitment.
                </AlertDescription>
              </Alert>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-[#FF3EA5] hover:bg-[#FF3EA5]/90"
                size="lg"
              >
                Lock Love Fund & Create Contract
              </Button>
            </form>
          </Card>

          {/* Info Box */}
          <div className="mt-6 p-6 bg-[#2A1E5C]/30 border border-[#FF3EA5]/20 rounded-lg">
            <h3 className="mb-3 text-[#FFD465]">What Happens Next?</h3>
            <ol className="space-y-2 text-sm text-gray-400">
              <li>1. Your Love Fund will be locked in the smart contract escrow vault</li>
              <li>2. Your partner will receive a pairing request to their wallet</li>
              <li>3. Once paired, contract status changes to "Active Relationship"</li>
              <li>4. Contract tetap aktif tanpa batas waktu (kecuali durasi ditentukan)</li>
              <li>5. When ready to marry, both wallets must verify independently</li>
              <li>6. After mutual verification, Love NFT mints and funds release 50/50</li>
            </ol>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
