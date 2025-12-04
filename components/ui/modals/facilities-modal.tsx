/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FormInput } from "@/components/ui/form-input";
import { Button } from "@/components/ui/button";

interface FacilitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFacility: (facilityName: string) => void;
}

export function FacilitiesModal({
  isOpen,
  onClose,
  onAddFacility,
}: FacilitiesModalProps) {
  const [facilityName, setFacilityName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (facilityName.trim()) {
      setIsSubmitting(true);
      try {
        await onAddFacility(facilityName.trim());
        
        // Show success toast
        toast.success("Facility added successfully!");
        
        // Reset form
        setFacilityName("");
        onClose();
      } catch (error) {
        console.error("Failed to add facility:", error);
        // Show error toast
        toast.error("Failed to add facility. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFacilityName("");
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Check if form is valid
  const isFormValid = facilityName.trim().length > 0;

  if (!isOpen) return null;

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
          maxWidth: "90vw",
          padding: "32px",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 p-3 hover:bg-black/5 rounded-full transition-colors disabled:opacity-50 z-20"
          style={{ 
            minWidth: "44px", 
            minHeight: "44px",
            WebkitTapHighlightColor: "transparent",
            touchAction: "manipulation",
            background: "transparent",
            border: "none",
            cursor: "pointer"
          }}
          aria-label="Close modal"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Background Gradient Container */}
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.6,
            background:
              "linear-gradient(354deg, #FFF 24.04%, rgba(255, 243, 230, 0.35) 59.41%, #D5FFEB 113.97%)",
            filter: "blur(18.285715103149414px)",
            borderRadius: "20px",
          }}
        />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-8 w-full">
          {/* Title */}
          <h2
            style={{
              color: "var(--Title, #1F2024)",
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: "20px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "140%",
              letterSpacing: "-0.4px",
              margin: 0,
            }}
          >
            Add Custom Facility
          </h2>

          {/* Subtitle */}
          <p
            style={{
              color: "#7A7A7A",
              textAlign: "center",
              fontFamily: "var(--font-source-sans), sans-serif",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "140%",
              margin: 0,
              marginTop: "8px",
            }}
          >
            Add a custom facility that's unique to your space. This will be added to your accommodation's facilities.
          </p>

          {/* Form */}
          <div className="w-full space-y-6">
            {/* Facility Name Input */}
            <div className="mt-4">
              <FormInput
                label="Facility Name"
                placeholder="e.g., Rooftop Garden, Private Chef, Beach Access"
                value={facilityName}
                onChange={(e) => setFacilityName(e.target.value)}
                required={true}
                disabled={isSubmitting}
              />
            </div>

            {/* Add Facility Button */}
            <div className="flex justify-center pt-2">
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                loading={isSubmitting}
                variant="signup-primary"
                size="allotease-md"
                style={{
                  background: isFormValid ? "#FF5B06" : "#ccc",
                  borderRadius: "51px",
                  padding: "12px 24px",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: 600,
                  fontFamily: "var(--font-source-sans), sans-serif",
                  border: "none",
                  cursor: isFormValid ? "pointer" : "not-allowed",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (isFormValid && !isSubmitting) {
                    e.currentTarget.style.background = "#E54A00";
                  }
                }}
                onMouseLeave={(e) => {
                  if (isFormValid && !isSubmitting) {
                    e.currentTarget.style.background = "#FF5B06";
                  }
                }}
              >
                Add Facility
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}