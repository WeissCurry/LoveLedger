import { useState, useEffect } from "react";
import { toast, Toaster } from "sonner@2.0.3";
import { WalletConnect } from "./components/WalletConnect";
import { LandingPage } from "./components/LandingPage";
import { CreateContract } from "./components/CreateContract";
import { Dashboard } from "./components/Dashboard";
import type { ContractData } from "./components/CreateContract";
import { getSupabaseUrl, getSupabaseAnonKey } from "./utils/supabase/client";

type View = "landing" | "create" | "dashboard";

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

interface Stats {
  totalContracts: number;
  activeContracts: number;
  verifiedContracts: number;
  totalLocked: number;
}

const SERVER_URL = `${getSupabaseUrl()}/functions/v1/make-server-c17b8718`;

export default function App() {
  const [wallet, setWallet] = useState<string | null>(null);
  const [view, setView] = useState<View>("landing");
  const [contract, setContract] = useState<Contract | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalContracts: 0,
    activeContracts: 0,
    verifiedContracts: 0,
    totalLocked: 0,
  });
  const [loading, setLoading] = useState(false);

  // Mock wallet connection
  const connectWallet = () => {
    const mockWallet = `0x${Math.random().toString(16).slice(2, 42)}`;
    setWallet(mockWallet);
    toast.success("💘 Wallet Connected", {
      description: `Connected: ${mockWallet.slice(0, 10)}...`,
    });
    fetchContract(mockWallet);
  };

  const disconnectWallet = () => {
    setWallet(null);
    setContract(null);
    setView("landing");
    toast.success("Wallet Disconnected");
  };

  // Fetch global stats
  const fetchStats = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/stats`, {
        headers: {
          Authorization: `Bearer ${getSupabaseAnonKey()}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Fetch contract for wallet
  const fetchContract = async (walletAddress: string) => {
    try {
      const response = await fetch(`${SERVER_URL}/contracts/wallet/${walletAddress}`, {
        headers: {
          Authorization: `Bearer ${getSupabaseAnonKey()}`,
        },
      });
      const data = await response.json();
      if (data.success && data.contract) {
        setContract(data.contract);
      }
    } catch (error) {
      console.error("Error fetching contract:", error);
    }
  };

  // Create contract
  const createContract = async (formData: ContractData) => {
    if (!wallet) return;

    setLoading(true);
    try {
      const response = await fetch(`${SERVER_URL}/contracts/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getSupabaseAnonKey()}`,
        },
        body: JSON.stringify({
          creatorWallet: wallet,
          partnerWallet: formData.partnerWallet,
          amount: formData.amount,
          duration: formData.duration,
          refundOption: formData.refundOption,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setContract(data.contract);
        setView("dashboard");
        toast.success("💞 Contract Created!", {
          description: "Love Fund locked and awaiting pairing.",
        });
        fetchStats();
      } else {
        toast.error("Failed to create contract", {
          description: data.error || "Please try again",
        });
      }
    } catch (error) {
      console.error("Error creating contract:", error);
      toast.error("Error creating contract", {
        description: String(error),
      });
    } finally {
      setLoading(false);
    }
  };

  // Pair wallet
  const pairWallet = async () => {
    if (!wallet || !contract) return;

    setLoading(true);
    try {
      const response = await fetch(`${SERVER_URL}/contracts/pair`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getSupabaseAnonKey()}`,
        },
        body: JSON.stringify({
          contractId: contract.id,
          partnerWallet: wallet,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setContract(data.contract);
        toast.success("💘 Wallets Paired!", {
          description: "Both wallets connected. Commitment active.",
        });
        fetchStats();
      } else {
        toast.error("Failed to pair", {
          description: data.error || "Please try again",
        });
      }
    } catch (error) {
      console.error("Error pairing wallet:", error);
      toast.error("Error pairing wallet", {
        description: String(error),
      });
    } finally {
      setLoading(false);
    }
  };

  // Verify marriage
  const verifyMarriage = async () => {
    if (!wallet || !contract) return;

    setLoading(true);
    try {
      const response = await fetch(`${SERVER_URL}/contracts/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getSupabaseAnonKey()}`,
        },
        body: JSON.stringify({
          contractId: contract.id,
          wallet: wallet,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setContract(data.contract);
        
        if (data.bothVerified) {
          toast.success("💍 Marriage Verified!", {
            description: "Love Fund released and NFT minted.",
          });
        } else {
          toast.success("✓ You've Verified!", {
            description: "Waiting for your partner to verify...",
          });
        }
        fetchStats();
      } else {
        toast.error("Failed to verify", {
          description: data.error || "Please try again",
        });
      }
    } catch (error) {
      console.error("Error verifying marriage:", error);
      toast.error("Error verifying marriage", {
        description: String(error),
      });
    } finally {
      setLoading(false);
    }
  };

  // Unpair contract
  const unpairContract = async () => {
    if (!wallet || !contract) return;

    const confirmed = confirm(
      "Are you sure you want to terminate this contract? This action cannot be undone."
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await fetch(`${SERVER_URL}/contracts/unpair`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getSupabaseAnonKey()}`,
        },
        body: JSON.stringify({
          contractId: contract.id,
          wallet: wallet,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setContract(data.contract);
        toast.error("💔 Contract Terminated", {
          description: "Contract has been terminated by one party.",
        });
        fetchStats();
      } else {
        toast.error("Failed to terminate", {
          description: data.error || "Please try again",
        });
      }
    } catch (error) {
      console.error("Error terminating contract:", error);
      toast.error("Error terminating contract", {
        description: String(error),
      });
    } finally {
      setLoading(false);
    }
  };

  // Load stats on mount
  useEffect(() => {
    fetchStats();
  }, []);

  // Refresh contract when wallet changes
  useEffect(() => {
    if (wallet) {
      fetchContract(wallet);
    }
  }, [wallet]);

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" theme="dark" />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0F0A1E]/80 backdrop-blur-lg border-b border-[#FF3EA5]/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setView("landing")}
          >
            <div className="text-2xl">💘</div>
            <span className="text-xl bg-gradient-to-r from-[#FF3EA5] to-[#FFD465] bg-clip-text text-transparent">
              LOVE LEDGER
            </span>
          </div>
          <WalletConnect
            wallet={wallet}
            onConnect={connectWallet}
            onDisconnect={disconnectWallet}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {view === "landing" && (
          <LandingPage
            onCreateContract={() => {
              if (!wallet) {
                toast.error("Please connect your wallet first");
                return;
              }
              setView("create");
            }}
            onViewDashboard={() => {
              if (!wallet) {
                toast.error("Please connect your wallet first");
                return;
              }
              setView("dashboard");
            }}
            stats={stats}
          />
        )}

        {view === "create" && wallet && (
          <CreateContract
            wallet={wallet}
            onBack={() => setView("landing")}
            onSubmit={createContract}
          />
        )}

        {view === "dashboard" && wallet && (
          <Dashboard
            wallet={wallet}
            contract={contract}
            onBack={() => setView("landing")}
            onPair={pairWallet}
            onVerify={verifyMarriage}
            onUnpair={unpairContract}
          />
        )}
      </main>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#2A1E5C] p-8 rounded-lg border border-[#FF3EA5]/30">
            <div className="animate-spin w-12 h-12 border-4 border-[#FF3EA5] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-300">Processing transaction...</p>
          </div>
        </div>
      )}
    </div>
  );
}
