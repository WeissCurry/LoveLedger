// src/hooks/useLoveContract.ts
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACT_ADDRESS, LOVE_LEDGER_ABI } from "../lib/contract";

export function useLoveContract() {
    const { data: hash, writeContract, isPending, error } = useWriteContract();

    const { isLoading, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const createContract = async (
        partner: `0x${string}`,
        depositToken: `0x${string}`,
        depositAmount: bigint
    ) => {
        try {
            await writeContract({
                address: CONTRACT_ADDRESS as `0x${string}`,
                abi: LOVE_LEDGER_ABI,
                functionName: "startRelationship",
                args: [partner, depositToken, depositAmount],
            });
        } catch (err) {
            console.error("❌ Error:", err);
        }
    };

    return {
        createContract,
        isPending,
        isLoading,
        isSuccess,
        error,
    };
}
