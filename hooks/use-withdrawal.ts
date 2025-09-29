import { useMutation, useQueryClient } from "@tanstack/react-query";
import { WithdrawalService, WithdrawRequest, WithdrawResponse } from "@/services/withdrawal-service";
import { balanceKeys } from "@/hooks/use-balance";
import { useAuthStore } from "@/stores/auth-store";
import { ApiError } from "@/services/api-client";
import toast from "react-hot-toast";

/**
 * Extract error message from withdrawal API response
 */
function extractWithdrawalErrorMessage(error: any): string {
  // Check if it's an API error with message
  if (error?.message) {
    return error.message;
  }
  
  // Check for specific withdrawal errors
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  // Check for validation errors
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }
  
  // Status-based error handling
  if (error?.response?.status === 400) {
    return error?.response?.data?.message || "Invalid withdrawal request";
  }
  
  if (error?.response?.status === 401) {
    return "Please log in to make withdrawals";
  }
  
  if (error?.response?.status === 403) {
    return "You don't have permission to make withdrawals";
  }
  
  if (error?.response?.status === 429) {
    return "Too many withdrawal requests. Please try again later";
  }
  
  if (error?.response?.status >= 500) {
    return "Server error. Please try again later";
  }
  
  // Network error
  if (!error?.response) {
    return "Network error. Please check your connection";
  }
  
  // Fallback
  return "Withdrawal failed. Please try again.";
}

/**
 * Hook to handle withdrawal with automatic balance refresh
 */
export function useWithdraw() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();

  return useMutation<WithdrawResponse, ApiError, WithdrawRequest>({
    mutationFn: async (data: WithdrawRequest) => {
      if (!isAuthenticated) {
        throw new Error("User must be authenticated to make withdrawals");
      }
      
      return WithdrawalService.withdraw(data);
    },
    onSuccess: (response, variables) => {
      // Format amount for success message
      const formattedAmount = WithdrawalService.formatWithdrawAmount(variables.amount);
      
      // Show success message based on response
      if (response.status === "success") {
        toast.success(
          response.message || 
          `Withdrawal of ${formattedAmount} initiated successfully!`
        );
      }
      
      // Invalidate and refetch balance to show updated amount
      queryClient.invalidateQueries({
        queryKey: balanceKeys.current(),
      });
      
      // Also refetch immediately to show updated balance
      queryClient.refetchQueries({
        queryKey: balanceKeys.current(),
      });
      
      // You can invalidate other related queries here if needed
      // Example: withdrawal history, transaction history, etc.
      // queryClient.invalidateQueries({ queryKey: ['withdrawalHistory'] });
    },
    onError: (error) => {
      console.error("Withdrawal failed:", error);
      
      // Extract and show specific error message
      const errorMessage = extractWithdrawalErrorMessage(error);
      
      // Handle authentication errors differently if needed
      if (error.message === "User must be authenticated to make withdrawals") {
        // Could trigger auth modal here if needed
        toast.error("Please log in to make withdrawals");
        return;
      }
      
      // Show the extracted error message
      toast.error(errorMessage);
    },
  });
}

/**
 * Hook to manually refresh withdrawal-related queries
 */
export function useRefreshWithdrawalData() {
  const queryClient = useQueryClient();

  const refreshWithdrawalData = async () => {
    // Refresh balance
    await queryClient.invalidateQueries({
      queryKey: balanceKeys.current(),
    });
    
    // Refresh other withdrawal-related queries if they exist
    // await queryClient.invalidateQueries({ queryKey: ['withdrawalHistory'] });
    
    // Optionally refetch immediately
    await queryClient.refetchQueries({
      queryKey: balanceKeys.current(),
    });
  };

  return { refreshWithdrawalData };
}

/**
 * Hook to validate withdrawal amount against current balance
 */
export function useValidateWithdrawal() {
  const validateWithdrawAmount = (amount: number, availableBalance: number) => {
    return WithdrawalService.validateWithdrawAmount(amount, availableBalance);
  };

  const formatAmount = (amount: number) => {
    return WithdrawalService.formatWithdrawAmount(amount);
  };

  return {
    validateWithdrawAmount,
    formatAmount,
  };
}