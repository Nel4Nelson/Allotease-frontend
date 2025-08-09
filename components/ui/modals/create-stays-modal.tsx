/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { StaysService } from "@/services/stays-service";
import { UnitsService } from "@/services/units-service";
import { useDebouncedStaysFormStore } from "@/hooks/use-debounced-stay-store";
import type { StaysFormData } from "@/types/stays-form-schema";

interface CreateStaysModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface StepStatus {
  status: 'pending' | 'loading' | 'success' | 'error';
  message?: string;
}

interface CreationSteps {
  createStay: StepStatus;
  addUnits: StepStatus;
}

export function CreateStaysModal({ isOpen, onClose, onSuccess }: CreateStaysModalProps) {
  const [steps, setSteps] = useState<CreationSteps>({
    createStay: { status: 'pending' },
    addUnits: { status: 'pending' },
  });
  
  const [isCreating, setIsCreating] = useState(false);
  const [currentStep, setCurrentStep] = useState<'createStay' | 'addUnits' | 'complete'>('createStay');
  const [createdStayId, setCreatedStayId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { formData, units, resetForm } = useDebouncedStaysFormStore();

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSteps({
        createStay: { status: 'pending' },
        addUnits: { status: 'pending' },
      });
      setIsCreating(false);
      setCurrentStep('createStay');
      setCreatedStayId(null);
      setError(null);
    }
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isCreating) {
      onClose();
    }
  };

  // Close modal
  const handleClose = () => {
    if (!isCreating) {
      onClose();
    }
  };

  // Create stay
  const createStay = async (): Promise<string> => {
    setSteps(prev => ({
      ...prev,
      createStay: { status: 'loading', message: 'Creating accommodation...' }
    }));

    try {
      // Validate form data first
      const validationErrors = StaysService.validateStayData(formData as StaysFormData);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      const response = await StaysService.createStay(formData as StaysFormData);
      
      console.log("Stay creation response:", response); // Debug log
      
      // Handle the actual response structure
      if (response.status === 'success' && response.data?._id) {
        setSteps(prev => ({
          ...prev,
          createStay: { status: 'success', message: 'Accommodation created successfully' }
        }));
        
        return response.data._id; // Stay ID is directly in response.data._id
      } else {
        throw new Error(response.message || 'Failed to create accommodation');
      }
    } catch (error: any) {
      console.error("Stay creation error:", error); // Debug log
      
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create accommodation';
      
      setSteps(prev => ({
        ...prev,
        createStay: { status: 'error', message: errorMessage }
      }));
      
      throw error;
    }
  };

  // Add units to stay
  const addUnitsToStay = async (stayId: string): Promise<void> => {
    if (units.length === 0) {
      setSteps(prev => ({
        ...prev,
        addUnits: { status: 'success', message: 'No units to add' }
      }));
      return;
    }

    // Validate all units first
    const validationResults = UnitsService.validateAllUnits(units);
    if (validationResults.length > 0) {
      const errors = validationResults.map(result => 
        `${result.unitTitle}: ${result.errors.join(', ')}`
      ).join('; ');
      throw new Error(`Unit validation failed: ${errors}`);
    }

    setSteps(prev => ({
      ...prev,
      addUnits: { status: 'loading', message: `Adding ${units.length} unit(s)...` }
    }));

    try {
      // Use the UnitsService to create units with progress tracking
      const result = await UnitsService.createUnitsWithProgress(
        stayId,
        units,
        (current, total, unitTitle) => {
          setSteps(prev => ({
            ...prev,
            addUnits: { 
              status: 'loading', 
              message: `Adding unit ${current} of ${total}: ${unitTitle}` 
            }
          }));
        }
      );

      if (result.status === 'success') {
        setSteps(prev => ({
          ...prev,
          addUnits: { 
            status: 'success', 
            message: `Successfully added ${result.data.successful} unit(s)` 
          }
        }));
      } else if (result.status === 'partial') {
        // Some units failed, but some succeeded
        setSteps(prev => ({
          ...prev,
          addUnits: { 
            status: 'success', 
            message: `Added ${result.data.successful} unit(s), ${result.data.failed} failed` 
          }
        }));
        
        // Log detailed errors for debugging
        if (result.data.errors) {
          console.warn('Unit creation errors:', result.data.errors);
        }
      }

    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to add units';
      
      setSteps(prev => ({
        ...prev,
        addUnits: { status: 'error', message: errorMessage }
      }));
      
      throw error;
    }
  };

  // Main creation process
  const handleCreateStays = async () => {
    setIsCreating(true);
    setError(null);
    
    try {
      // Step 1: Create stay
      setCurrentStep('createStay');
      const stayId = await createStay();
      setCreatedStayId(stayId);
      
      // Small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Step 2: Add units
      setCurrentStep('addUnits');
      await addUnitsToStay(stayId);
      
      // Complete
      setCurrentStep('complete');
      
      // Auto-close after success and reset form
      setTimeout(() => {
        resetForm();
        onSuccess();
        onClose();
      }, 2000);
      
    } catch (error: any) {
      setError(error.message);
      
      // Cleanup: Delete created stay if units failed
      if (createdStayId && currentStep === 'addUnits') {
        try {
          await StaysService.deleteStay(createdStayId);
          setSteps(prev => ({
            ...prev,
            createStay: { status: 'pending' },
            addUnits: { status: 'error', message: prev.addUnits.message }
          }));
        } catch (cleanupError) {
          console.error('Failed to cleanup stay:', cleanupError);
        }
      }
    } finally {
      setIsCreating(false);
    }
  };

  // Retry failed step
  const handleRetry = () => {
    if (steps.createStay.status === 'error') {
      handleCreateStays();
    } else if (steps.addUnits.status === 'error' && createdStayId) {
      setError(null);
      setIsCreating(true);
      addUnitsToStay(createdStayId)
        .then(() => {
          setCurrentStep('complete');
          setTimeout(() => {
            resetForm();
            onSuccess();
            onClose();
          }, 2000);
        })
        .catch((error) => {
          setError(error.message);
        })
        .finally(() => {
          setIsCreating(false);
        });
    }
  };

  // Step icon component
  const StepIcon = ({ status }: { status: StepStatus['status'] }) => {
    switch (status) {
      case 'pending':
        return (
          <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
        );
      case 'loading':
        return (
          <div className="w-6 h-6 border-2 border-[var(--feature-accent-orange)] rounded-full flex items-center justify-center">
            <div className="w-3 h-3 border-2 border-[var(--feature-accent-orange)] border-t-transparent rounded-full animate-spin"></div>
          </div>
        );
      case 'success':
        return (
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
    }
  };

  if (!isOpen) return null;

  const isComplete = currentStep === 'complete' && steps.createStay.status === 'success' && steps.addUnits.status === 'success';
  const hasError = steps.createStay.status === 'error' || steps.addUnits.status === 'error';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Modal */}
      <div
        className="relative"
        style={{
          borderRadius: "20px",
          background: "rgba(242, 244, 247, 0.60)",
          boxShadow: "0 4px 10px 0 rgba(0, 0, 0, 0.04)",
          backdropFilter: "blur(83.3499984741211px)",
          display: "flex",
          width: "600px",
          padding: "32px",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Only show if not creating */}
        {!isCreating && (
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full transition-colors z-20"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Background Gradient Container */}
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.6,
            background: "linear-gradient(354deg, #FFF 24.04%, rgba(255, 243, 230, 0.35) 59.41%, #D5FFEB 113.97%)",
            filter: "blur(18.285715103149414px)",
            borderRadius: "20px",
          }}
        />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center text-center space-y-6 w-full">
          {/* Title */}
          <h2
            style={{
              color: "var(--Title, #1F2024)",
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "140%",
              letterSpacing: "-0.4px",
              margin: 0,
            }}
          >
            {isComplete ? "🎉 Stays Created Successfully!" : "Creating Your Accommodation"}
          </h2>

          {/* Subtitle */}
          {!isComplete && (
            <p
              style={{
                color: "#7A7A7A",
                textAlign: "center",
                fontFamily: "var(--font-source-sans), sans-serif",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "140%",
                margin: 0,
              }}
            >
              Please wait while we set up your accommodation...
            </p>
          )}

          {/* Progress Steps */}
          <div className="w-full space-y-4">
            {/* Step 1: Create Stay */}
            <div className="flex items-center gap-4 p-4 bg-white/40 rounded-lg">
              <StepIcon status={steps.createStay.status} />
              <div className="flex-1 text-left">
                <h3 
                  className="font-semibold text-base"
                  style={{
                    fontFamily: "var(--font-source-sans), sans-serif",
                    color: "var(--Title, #1F2024)",
                  }}
                >
                  1. Creating Accommodation
                </h3>
                <p 
                  className="text-sm text-gray-600"
                  style={{ fontFamily: "var(--font-source-sans), sans-serif" }}
                >
                  {steps.createStay.message || "Setting up basic accommodation details"}
                </p>
              </div>
            </div>

            {/* Step 2: Add Units */}
            <div className="flex items-center gap-4 p-4 bg-white/40 rounded-lg">
              <StepIcon status={steps.addUnits.status} />
              <div className="flex-1 text-left">
                <h3 
                  className="font-semibold text-base"
                  style={{
                    fontFamily: "var(--font-source-sans), sans-serif",
                    color: "var(--Title, #1F2024)",
                  }}
                >
                  2. Adding Units
                </h3>
                <p 
                  className="text-sm text-gray-600"
                  style={{ fontFamily: "var(--font-source-sans), sans-serif" }}
                >
                  {steps.addUnits.message || `Preparing to add ${units.length} unit(s)`}
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
              <p 
                className="text-red-700 text-sm font-medium mb-2"
                style={{ fontFamily: "var(--font-source-sans), sans-serif" }}
              >
                ❌ {error}
              </p>
              <p 
                className="text-red-600 text-xs"
                style={{ fontFamily: "var(--font-source-sans), sans-serif" }}
              >
                Please check your internet connection and try again.
              </p>
            </div>
          )}

          {/* Success Message */}
          {isComplete && (
            <div className="w-full p-4 bg-green-50 border border-green-200 rounded-lg">
              <p 
                className="text-green-700 text-sm font-medium"
                style={{ fontFamily: "var(--font-source-sans), sans-serif" }}
              >
                Your accommodation has been created successfully! You'll be redirected shortly.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 w-full">
            {!isCreating && !isComplete && !hasError && (
              <Button
                type="button"
                onClick={handleCreateStays}
                variant="signup-primary"
                size="allotease-md"
                className="flex-1"
              >
                Start Creation
              </Button>
            )}

            {hasError && !isCreating && (
              <>
                <Button
                  type="button"
                  onClick={handleClose}
                  variant="outline"
                  size="allotease-md"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleRetry}
                  variant="signup-primary"
                  size="allotease-md"
                  className="flex-1"
                >
                  Retry
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}