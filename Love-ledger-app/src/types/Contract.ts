export type ContractStatus = "Dating" | "BrokeUp" | "Married";

export interface Contract {
    id: string;
    creatorWallet: string;
    partnerWallet: string;
    amount: string;
    duration: string;
    refundOption: string;
    status: ContractStatus;
    verifiedCreator: boolean;
    verifiedPartner: boolean;
    createdAt: string;
    lastActivity: string;
    paired: boolean;
    verifiedAt?: string;
    terminatedBy?: string;
    terminatedAt?: string;
}
