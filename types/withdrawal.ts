export interface WithdrawalHistory {
  id: string;
  amountRequested: number;
  withdrawalFees: number;
  currency: string;
  dateRequested: string;
  payoutDate?: string;
  status: "pending" | "processing" | "paid" | "declined" | "cancelled";
  declineReason?: string;
  transactionId?: string;
}

export interface BankDetails {
  id: string;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  branchCode?: string;
  swiftBicCode?: string;
  routingNumber?: string;
  iban?: string;
  isDefault: boolean;
  isVerified: boolean;
  addedDate: string;
}

export interface WithdrawalAccount {
  balance: {
    amount: number;
    currency: string;
    isVisible: boolean;
    lastUpdated: string;
  };
  availableForWithdrawal: number;
  pendingWithdrawals: number;
  totalWithdrawn: number;
  bankDetails: BankDetails[];
  withdrawalHistory: WithdrawalHistory[];
}

export interface WithdrawalStats {
  totalWithdrawn: number;
  pendingAmount: number;
  successfulWithdrawals: number;
  failedWithdrawals: number;
  averageProcessingTime: string;
  lastWithdrawalDate?: string;
}

// Component Props
export interface WithdrawalBalanceCardProps {
  balance: WithdrawalAccount["balance"];
  availableAmount: number;
  onToggleVisibility: () => void;
  onWithdraw: () => void;
  isLoading?: boolean;
}

export interface BankDetailsCardProps {
  bankDetails: BankDetails[];
  onEdit: () => void;
  onAddNew: () => void;
  isLoading?: boolean;
}

export interface WithdrawalHistoryTableProps {
  withdrawals: WithdrawalHistory[];
  isLoading?: boolean;
  onViewDetails?: (withdrawalId: string) => void;
}

export interface WithdrawalPageHeaderProps {
  title: string;
  breadcrumb: string[];
  lastUpdated: string;
}
