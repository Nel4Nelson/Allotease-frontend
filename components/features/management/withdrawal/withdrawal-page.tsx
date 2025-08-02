'use client';

import { useState } from 'react';
import { useBalance } from '@/hooks/use-balance';
import { WithdrawalBalance } from './withdrawal-balance';
import { BankDetails } from './bank-details';
import { WithdrawalHistory } from './withdrawal-history';
import { WithdrawalModal } from '../modal/withdrawal-modal';

interface BankDetailItem {
  label: string;
  value: string;
}

interface WithdrawalHistoryItem {
  id: string;
  amountRequested: string;
  withdrawalFees: string;
  dateRequested: string;
  payoutDate?: string;
  status: 'Paid' | 'Declined' | 'Pending';
}

interface WithdrawalPageProps {
  bankDetails?: BankDetailItem[];
  withdrawalHistory?: WithdrawalHistoryItem[];
  loading?: boolean;
}

export function WithdrawalPage({
  bankDetails,
  withdrawalHistory,
  loading = false,
}: WithdrawalPageProps) {
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');

  // Use balance hook
  const {
    balance,
    isLoading: balanceLoading,
    error: balanceError,
    withdraw,
    isWithdrawing,
    isValidWithdrawAmount,
  } = useBalance();

  // Use balance or fallback to 0 for display
  const displayBalance = balanceError ? 0 : balance;

  const handleWithdraw = () => {
    setShowWithdrawalModal(true);
    setWithdrawalAmount(''); // Clear amount field
  };

  const handleWithdrawalSubmit = async () => {
    if (!withdrawalAmount || !isValidWithdrawAmount(withdrawalAmount)) {
      return;
    }

    try {
      const result = await withdraw(withdrawalAmount);

      if (result.success) {
        // Close modal after showing success message
        setTimeout(() => {
          setShowWithdrawalModal(false);
          setWithdrawalAmount('');
        }, 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloseWithdrawalModal = () => {
    setShowWithdrawalModal(false);
    setWithdrawalAmount('');
  };

  return (
    <>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="px-4 md:px-8">
          <p className="text-sm text-[#71727A] font-source mb-2">
            Admin / Withdrawal
          </p>
          <h1 className="font-bold text-2xl text-[#1F2024]">Your Account</h1>
        </div>

        {/* Balance and Bank Details */}
        <div className="px-4 md:px-8">
          <div className="md:flex w-full justify-between items-start gap-8">
            <WithdrawalBalance
              balance={displayBalance}
              lastUpdated="October 10, 2024"
              onWithdraw={handleWithdraw}
              isLoading={balanceLoading}
              error={balanceError}
            />

            <BankDetails bankDetails={bankDetails} loading={loading} />
          </div>
        </div>

        {/* Withdrawal History */}
        <WithdrawalHistory histories={withdrawalHistory} loading={loading} />
      </div>

      {/* Withdrawal Modal */}
      <WithdrawalModal
        isOpen={showWithdrawalModal}
        onClose={handleCloseWithdrawalModal}
        withdrawalAmount={withdrawalAmount}
        setWithdrawalAmount={setWithdrawalAmount}
        onSubmit={handleWithdrawalSubmit}
        isWithdrawing={isWithdrawing}
        isValidWithdrawAmount={isValidWithdrawAmount}
      />
    </>
  );
}
