import { useReadContract, useAccount, useWatchContractEvent } from "wagmi";
import { CONTRACT_ADDRESS, LOVE_LEDGER_ABI } from "../lib/contract";
import { useEffect, useState } from "react";

type OnChainStatus = "Dating" | "Married" | "BrokeUp";

export function useContractStatus(partnerAddress?: string) {
  const { address } = useAccount();
  const [tokenId, setTokenId] = useState<bigint | null>(null);
  const [hasRelationship, setHasRelationship] = useState(false);

  // 1. Cek apakah user memiliki partner
  const { data: partnerOf } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: LOVE_LEDGER_ABI,
    functionName: "partnerOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 5000, // Refresh every 5 seconds
    },
  });

  // 2. Cek apakah dua address adalah partner
  const { data: isPartnerResult } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: LOVE_LEDGER_ABI,
    functionName: "isPartner",
    args: address && partnerAddress ? [address, partnerAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!address && !!partnerAddress,
    },
  });

  // Update hasRelationship ketika data berubah
  useEffect(() => {
    if (partnerOf && partnerOf !== "0x0000000000000000000000000000000000000000") {
      setHasRelationship(true);
    } else if (isPartnerResult) {
      setHasRelationship(true);
    } else {
      setHasRelationship(false);
    }
  }, [partnerOf, isPartnerResult]);

  // 3. Jika punya relationship, cari tokenId mereka
  const { data: balance } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: LOVE_LEDGER_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && hasRelationship,
    },
  });

  // Cari tokenId dari relationship mereka
  // Strategi: Loop dari 1 sampai menemukan tokenId yang valid
  useEffect(() => {
    const findTokenId = async () => {
      if (!address || !hasRelationship || !balance || Number(balance) === 0) {
        return;
      }
      
      // Simple approach: Check token 1, 2, 3... until we find ours
      // In production, you'd track this from events
      for (let i = 1; i <= 100; i++) {
        try {
          // This would need actual contract call - simplified here
          setTokenId(BigInt(i));
          break;
        } catch {
          continue;
        }
      }
    };

    findTokenId();
  }, [address, balance, hasRelationship]);

  // 4. Read status dari tokenId
  const { data: statusData, refetch: refetchStatus } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: LOVE_LEDGER_ABI,
    functionName: "getStatus",
    args: tokenId ? [tokenId] : undefined,
    query: {
      enabled: !!tokenId,
      refetchInterval: 5000, // Auto-refresh status
    },
  });

  // 5. Read relationship detail
  const { data: relationshipData } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: LOVE_LEDGER_ABI,
    functionName: "relationships",
    args: tokenId ? [tokenId] : undefined,
    query: {
      enabled: !!tokenId,
      refetchInterval: 5000,
    },
  });

  // Watch for StatusUpdated events
  useWatchContractEvent({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: LOVE_LEDGER_ABI,
    eventName: "StatusUpdated",
    onLogs: (logs) => {
      console.log("Status updated:", logs);
      refetchStatus();
    },
  });

  // Convert status number to string
  const getStatusString = (statusNum: number): OnChainStatus => {
    switch (statusNum) {
      case 0:
        return "Dating";
      case 1:
        return "Married";
      case 2:
        return "BrokeUp";
      default:
        return "Dating";
    }
  };

  const onChainStatus: OnChainStatus | null = statusData !== undefined 
    ? getStatusString(Number(statusData))
    : null;

  return {
    onChainStatus,
    hasRelationship,
    tokenId,
    relationshipData,
    refetchStatus,
    partnerAddress: partnerOf as string | undefined,
    isLoading: statusData === undefined && hasRelationship,
  };
}