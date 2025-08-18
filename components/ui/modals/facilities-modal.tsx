/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { Button } from "@/components/ui/button";

interface FacilitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFacility: (facilityName: string, facilityIcon?: File | string) => void;
}

// Predefined facility icons using local SVG files
const facilityIcons = [
  {
    value: "wifi.svg", // Just filename, not full path
    label: "WiFi",
    displayPath: "/icons/wifi.svg" // Keep full path for display
  },
  {
    value: "swim.svg",
    label: "Swimming Pool",
    displayPath: "/icons/swim.svg"
  },
  {
    value: "prohibit.svg",
    label: "No Smoking",
    displayPath: "/icons/prohibit.svg"
  },
];

export function FacilitiesModal({
  isOpen,
  onClose,
  onAddFacility,
}: FacilitiesModalProps) {
  const [facilityName, setFacilityName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Convert preset icon to File object
  const convertPresetIconToFile = async (iconFilename: string): Promise<File> => {
    const iconPath = `/icons/${iconFilename}`;
    const response = await fetch(iconPath);
    const blob = await response.blob();
    return new File([blob], iconFilename, { type: blob.type });
  };

  const handleSubmit = async () => {
    if (facilityName.trim() && selectedIcon) {
      setIsSubmitting(true);
      try {
        // Convert preset icon to File object
        const iconToUse = await convertPresetIconToFile(selectedIcon);

        await onAddFacility(facilityName.trim(), iconToUse);
        
        // Show success toast
        toast.success("Facility added successfully!");
        
        // Reset form
        setFacilityName("");
        setSelectedIcon("");
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
      setSelectedIcon("");
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Get display path for selected icon
  const getSelectedIconDisplayPath = () => {
    const selectedIconData = facilityIcons.find(icon => icon.value === selectedIcon);
    return selectedIconData?.displayPath || selectedIcon;
  };

  // Check if form is valid
  const isFormValid = facilityName.trim() && selectedIcon;

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
            Add extra facility to space
          </h2>

          {/* Subtitle - Increased spacing */}
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
            This facility will be added to your accommodation's general facilities.
          </p>

          {/* Form */}
          <div className="w-full space-y-6">
            {/* Facility Name and Icon - Side by side */}
            <div className="grid grid-cols-1 gap-4">
              {/* Facility Name Input */}
              <div className="mt-4">
                <FormInput
                  label="Facility"
                  placeholder="Facility* e.g Outdoor swimming pool"
                  value={facilityName}
                  onChange={(e) => setFacilityName(e.target.value)}
                  required={true}
                  disabled={isSubmitting}
                />
              </div>

              {/* Icon Selection */}
              <div className="space-y-1">
                <p className="text-sm font-medium text-[var(--color-dark-slate)] text-left">
                  Choose icon:
                </p>
                
                <FormSelect
                  placeholder="Select facility icon*"
                  options={facilityIcons}
                  value={selectedIcon}
                  onValueChange={setSelectedIcon}
                  className="w-full"
                />
              </div>
            </div>

            {/* Elegant Icon Preview */}
            {selectedIcon && (
              <div className="flex items-center justify-center py-2">
                <div 
                  className="flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-200"
                  style={{
                    background: "rgba(255, 255, 255, 0.4)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)"
                  }}
                >
                  <div className="relative">
                    <Image
                      src={getSelectedIconDisplayPath()}
                      alt="Selected facility icon"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <span 
                    className="text-sm font-medium"
                    style={{
                      color: "var(--color-dark-slate)",
                      fontFamily: "var(--font-source-sans), sans-serif",
                    }}
                  >
                    {facilityIcons.find(icon => icon.value === selectedIcon)?.label}
                  </span>
                </div>
              </div>
            )}

            {/* Add Facility Button - Auto width */}
            <div className="flex justify-center">
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
                Add facility
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}