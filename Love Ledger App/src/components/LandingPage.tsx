import { motion } from "motion/react";
import { Heart, Lock, Shield, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface LandingPageProps {
  onCreateContract: () => void;
  onViewDashboard: () => void;
  stats: {
    totalContracts: number;
    activeContracts: number;
    verifiedContracts: number;
    totalLocked: number;
  };
}

export function LandingPage({ onCreateContract, onViewDashboard, stats }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0A1E] via-[#1A1332] to-[#0F0A1E]">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-[#FF3EA5]/10 rounded-full border border-[#FF3EA5]/30">
            <Heart className="w-4 h-4 text-[#FF3EA5]" />
            <span className="text-sm text-[#FF3EA5]">Blockchain Proof of Relationship Commitment</span>
          </div>
          
          <h1 className="text-6xl mb-6 bg-gradient-to-r from-[#FF3EA5] via-[#FFD465] to-[#FF3EA5] bg-clip-text text-transparent">
            LOVE LEDGER
          </h1>
          
          <p className="text-2xl mb-4 text-gray-300">
            Because real love deserves verification.
          </p>
          
          <p className="text-lg mb-12 text-gray-400 max-w-2xl mx-auto">
            Lock your love. Prove your future. A Web3 platform for couples to create smart contract commitments towards marriage, secured on blockchain.
          </p>

          <div className="flex gap-4 justify-center mb-16">
            <Button
              onClick={onCreateContract}
              size="lg"
              className="bg-[#FF3EA5] hover:bg-[#FF3EA5]/90 text-lg px-8"
            >
              Create Love Contract
            </Button>
            <Button
              onClick={onViewDashboard}
              size="lg"
              variant="outline"
              className="border-[#FF3EA5]/30 hover:bg-[#FF3EA5]/10 text-lg px-8"
            >
              View Dashboard
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <Card className="bg-[#2A1E5C]/50 border-[#FF3EA5]/20 p-6">
              <div className="text-3xl text-[#FFD465] mb-2">{stats.totalContracts}</div>
              <div className="text-sm text-gray-400">Total Contracts</div>
            </Card>
            <Card className="bg-[#2A1E5C]/50 border-[#FF3EA5]/20 p-6">
              <div className="text-3xl text-[#FF3EA5] mb-2">{stats.activeContracts}</div>
              <div className="text-sm text-gray-400">Active Couples</div>
            </Card>
            <Card className="bg-[#2A1E5C]/50 border-[#FF3EA5]/20 p-6">
              <div className="text-3xl text-[#FFD465] mb-2">{stats.verifiedContracts}</div>
              <div className="text-sm text-gray-400">Verified Marriages</div>
            </Card>
            <Card className="bg-[#2A1E5C]/50 border-[#FF3EA5]/20 p-6">
              <div className="text-3xl text-[#FFD465] mb-2">{stats.totalLocked.toFixed(0)}</div>
              <div className="text-sm text-gray-400">MATIC Locked</div>
            </Card>
          </div>
        </motion.div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl text-center mb-12 text-[#FF3EA5]">How It Works</h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-[#2A1E5C]/50 border-[#FF3EA5]/20 p-8 h-full">
              <Lock className="w-12 h-12 text-[#FF3EA5] mb-4" />
              <h3 className="text-xl mb-3 text-[#FFD465]">Lock Love Fund</h3>
              <p className="text-gray-400">
                Both partners contribute to a shared escrow vault, demonstrating financial commitment to the relationship's future.
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-[#2A1E5C]/50 border-[#FF3EA5]/20 p-8 h-full">
              <Shield className="w-12 h-12 text-[#FF3EA5] mb-4" />
              <h3 className="text-xl mb-3 text-[#FFD465]">Mutual Verification</h3>
              <p className="text-gray-400">
                Both wallets must verify marriage independently. Only when both confirm, the contract executes and releases funds.
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-[#2A1E5C]/50 border-[#FF3EA5]/20 p-8 h-full">
              <TrendingUp className="w-12 h-12 text-[#FF3EA5] mb-4" />
              <h3 className="text-xl mb-3 text-[#FFD465]">Receive Love NFT</h3>
              <p className="text-gray-400">
                Upon successful verification, both receive a soulbound Love Proof NFT and their share of the Love Fund.
              </p>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Value Proposition */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl mb-6 text-[#FF3EA5]">Love meets logic.</h2>
          <p className="text-lg text-gray-400 mb-8">
            Love Ledger isn't about storing memories or romantic gestures. It's about creating verifiable, blockchain-based commitment that proves both partners are serious about building a future together.
          </p>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="bg-[#2A1E5C]/30 border border-[#FF3EA5]/20 rounded-lg p-6">
              <h3 className="mb-2 text-[#FFD465]">For Couples</h3>
              <p className="text-sm text-gray-400">
                A digital commitment medium that demands seriousness towards marriage, backed by transparent smart contracts.
              </p>
            </div>
            <div className="bg-[#2A1E5C]/30 border border-[#FF3EA5]/20 rounded-lg p-6">
              <h3 className="mb-2 text-[#FFD465]">For Web3 Community</h3>
              <p className="text-sm text-gray-400">
                Novel social contract model based on trust, transparency, and dual-party verification on blockchain.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
