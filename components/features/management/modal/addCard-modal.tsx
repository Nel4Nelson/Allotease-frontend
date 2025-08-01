// components/modal/addCard-modal.tsx
"use client";

import { ModalLayout } from "@/components/layout/modal-layout";
import { AddCardModalContent } from "./addCard-modal-content";
import { BankDetailsFormData } from "@/validation/bank-details";

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (cardData: BankDetailsFormData) => Promise<void>;
  isSubmitting: boolean;
}

export function AddCardModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: AddCardModalProps) {
  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      title="Add Bank Details"
      isLoading={isSubmitting}
    >
      <AddCardModalContent onSubmit={onSubmit} isSubmitting={isSubmitting} />
    </ModalLayout>
  );
}
