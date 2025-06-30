import {
  WithdrawalAccount,
  WithdrawalHistory,
  BankDetails,
  WithdrawalStats,
} from "@/types/withdrawal";

export const sampleBankDetails: BankDetails[] = [
  {
    id: "bank-1",
    accountHolderName: "Flend Worldwide Ltd.",
    bankName: "Global Bank Inc.",
    accountNumber: "1234567890",
    branchCode: "00123",
    swiftBicCode: "GBINUS33",
    isDefault: true,
    isVerified: true,
    addedDate: "2023-01-15T10:30:00Z",
  },
  {
    id: "bank-2",
    accountHolderName: "Flend Worldwide Ltd.",
    bankName: "First National Bank",
    accountNumber: "9876543210",
    branchCode: "00456",
    swiftBicCode: "FNBUS44",
    isDefault: false,
    isVerified: false,
    addedDate: "2024-03-20T14:15:00Z",
  },
];

export const sampleWithdrawalHistory: WithdrawalHistory[] = [
  {
    id: "WD-2024-001",
    amountRequested: 300000,
    withdrawalFees: 3000,
    currency: "NGN",
    dateRequested: "2024-10-10T09:00:00Z",
    payoutDate: "2024-10-12T15:30:00Z",
    status: "paid",
    transactionId: "TXN-001234567",
  },
  {
    id: "WD-2024-002",
    amountRequested: 300000,
    withdrawalFees: 3000,
    currency: "NGN",
    dateRequested: "2024-10-10T11:20:00Z",
    status: "declined",
    declineReason: "Insufficient verification documents",
  },
  {
    id: "WD-2024-003",
    amountRequested: 150000,
    withdrawalFees: 1500,
    currency: "NGN",
    dateRequested: "2024-09-28T16:45:00Z",
    payoutDate: "2024-09-30T12:20:00Z",
    status: "paid",
    transactionId: "TXN-001234568",
  },
  {
    id: "WD-2024-004",
    amountRequested: 500000,
    withdrawalFees: 5000,
    currency: "NGN",
    dateRequested: "2024-09-15T08:30:00Z",
    status: "processing",
  },
  {
    id: "WD-2024-005",
    amountRequested: 75000,
    withdrawalFees: 750,
    currency: "NGN",
    dateRequested: "2024-09-05T14:10:00Z",
    payoutDate: "2024-09-07T11:45:00Z",
    status: "paid",
    transactionId: "TXN-001234569",
  },
];

export const sampleWithdrawalAccount: WithdrawalAccount = {
  balance: {
    amount: 2150500,
    currency: "NGN",
    isVisible: false,
    lastUpdated: "2024-10-10T16:30:00Z",
  },
  availableForWithdrawal: 2025500,
  pendingWithdrawals: 125000,
  totalWithdrawn: 1500000,
  bankDetails: sampleBankDetails,
  withdrawalHistory: sampleWithdrawalHistory,
};

export const sampleWithdrawalStats: WithdrawalStats = {
  totalWithdrawn: 1500000,
  pendingAmount: 125000,
  successfulWithdrawals: 8,
  failedWithdrawals: 1,
  averageProcessingTime: "2-3 business days",
  lastWithdrawalDate: "2024-10-12T15:30:00Z",
};

export const formatCurrency = (amount: number, currency: string = "NGN") => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currency === "NGN" ? "NGN" : "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};


