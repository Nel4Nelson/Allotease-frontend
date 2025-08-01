// components/modals/WithdrawalModal.tsx
"use client";

import { ModalLayout } from "@/components/layout/modal-layout";
import { WithdrawalModalContent } from "./withdrawal-modal-content";

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  withdrawalAmount: string;
  setWithdrawalAmount: (amount: string) => void;
  onSubmit: () => Promise<void>;
  isWithdrawing: boolean;
  isValidWithdrawAmount: (amount: string) => boolean;
}

export function WithdrawalModal({
  isOpen,
  onClose,
  withdrawalAmount,
  setWithdrawalAmount,
  onSubmit,
  isWithdrawing,
  isValidWithdrawAmount,
}: WithdrawalModalProps) {
  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      title="Withdrawal"
      isLoading={isWithdrawing}
    >
      <WithdrawalModalContent
        withdrawalAmount={withdrawalAmount}
        setWithdrawalAmount={setWithdrawalAmount}
        onSubmit={onSubmit}
        isWithdrawing={isWithdrawing}
        isValidWithdrawAmount={isValidWithdrawAmount}
      />
    </ModalLayout>
  );
}
