/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState } from "react";
import { OverviewPage } from "@/components/features/management/overview";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ManageOverviewPage() {
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);

  const handleWithdraw = () => {
    setShowWithdrawalModal(true);
  };

  const handleWithdrawalSubmit = () => {
    // TODO: Implement withdrawal logic
    console.log("Processing withdrawal...");
    setShowWithdrawalModal(false);

    // Could redirect to withdrawal page or show success message
    // router.push("/manage/withdrawal");
  };

  return (
    <>
      <div className="space-y-6">
        {/* Overview Content */}
        <OverviewPage onWithdraw={handleWithdraw} />
      </div>

      {/* Withdrawal Modal */}
      <Dialog open={showWithdrawalModal} onOpenChange={setShowWithdrawalModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogDescription>
              You're about to withdraw from your NGN balance of ₦2,150,500
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-center py-6">
              <div className="text-lg font-semibold text-gray-900 mb-2">
                Available Balance
              </div>
              <div className="text-3xl font-bold text-[#0A9355]">
                ₦2,150,500
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowWithdrawalModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleWithdrawalSubmit}
                className="flex-1 bg-[#FF5B00] hover:bg-[#E04F00]"
              >
                Continue to Withdrawal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
