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
  {
    value: "gym.svg",
    label: "Gym",
    displayPath: "/icons/gym.svg"
  },
  {
    value: "parking.svg",
    label: "Parking",
    displayPath: "/icons/parking.svg"
  },
  {
    value: "restaurant.svg",
    label: "Restaurant",
    displayPath: "/icons/restaurant.svg"
  },
  {
    value: "spa.svg",
    label: "Spa",
    displayPath: "/icons/spa.svg"
  },
  {
    value: "laundry.svg",
    label: "Laundry",
    displayPath: "/icons/laundry.svg"
  },
  {
    value: "elevator.svg",
    label: "Elevator",
    displayPath: "/icons/elevator.svg"
  },
  {
    value: "conference.svg",
    label: "Conference Room",
    displayPath: "/icons/conference.svg"
  },
  {
    value: "bar.svg",
    label: "Bar",
    displayPath: "/icons/bar.svg"
  },
  {
    value: "garden.svg",
    label: "Garden",
    displayPath: "/icons/garden.svg"
  }
];

export function FacilitiesModal({
  isOpen,
  onClose,
  onAddFacility,
}: FacilitiesModalProps) {
  const [facilityName, setFacilityName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Convert preset icon to File object
  const convertPresetIconToFile = async (iconFilename: string): Promise<File> => {
    const iconPath = `/icons/${iconFilename}`;
    const response = await fetch(iconPath);
    const blob = await response.blob();
    return new File([blob], iconFilename, { type: blob.type });
  };

  const handleSubmit = async () => {
    if (facilityName.trim()) {
      setIsSubmitting(true);
      try {
        let iconToUse: File | undefined = undefined;

        if (uploadedFile) {
          // Use uploaded file directly
          iconToUse = uploadedFile;
        } else if (selectedIcon) {
          // Convert preset icon to File object
          iconToUse = await convertPresetIconToFile(selectedIcon);
        }

        await onAddFacility(facilityName.trim(), iconToUse);
        
        // Show success toast
        toast.success("Facility added successfully!");
        
        // Reset form
        setFacilityName("");
        setSelectedIcon("");
        setUploadedFile(null);
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
      setUploadedFile(null);
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }
      
      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      
      setUploadedFile(file);
      setSelectedIcon(""); // Clear selected icon when file is uploaded
    }
  };

  // Get display path for selected icon
  const getSelectedIconDisplayPath = () => {
    const selectedIconData = facilityIcons.find(icon => icon.value === selectedIcon);
    return selectedIconData?.displayPath || selectedIcon;
  };

  const isSelectDisabled = isSubmitting || !!uploadedFile;

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
          width: "666px",
          padding: "20px",
          justifyContent: "center",
          alignItems: "center",
          gap: "40px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full transition-colors disabled:opacity-50 z-20"
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
        <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-6 w-full">
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
            }}
          >
            This facility will be added to your accommodation's general facilities.
          </p>

          {/* Form */}
          <div className="w-full space-y-4">
            {/* Facility Name Input */}
            <FormInput
              label="Facility"
              placeholder="Facility* e.g Outdoor swimming pool"
              value={facilityName}
              onChange={(e) => setFacilityName(e.target.value)}
              required={true}
              disabled={isSubmitting}
            />

            {/* Icon Selection Options */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-[var(--color-dark-slate)] text-left">
                Choose icon (optional):
              </p>
              
              {/* Predefined Icons Selector */}
              <div className="space-y-2">
                <label className="text-xs text-gray-600 text-left block">Select from presets:</label>
                <div className={isSelectDisabled ? "opacity-50 pointer-events-none" : ""}>
                  <FormSelect
                    placeholder="Select preset icon"
                    options={facilityIcons}
                    value={selectedIcon}
                    onValueChange={(value) => {
                      setSelectedIcon(value);
                      setUploadedFile(null); // Clear uploaded file when preset is selected
                    }}
                    className="w-full"
                  />
                </div>
              </div>

              {/* OR Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-xs text-gray-500">OR</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <label className="text-xs text-gray-600 text-left block">Upload custom icon:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isSubmitting || !!selectedIcon}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                />
                {uploadedFile && (
                  <p className="text-xs text-green-600">
                    ✓ {uploadedFile.name} selected
                  </p>
                )}
              </div>
            </div>

            {/* Elegant Icon Preview */}
            {(selectedIcon || uploadedFile) && (
              <div className="flex items-center justify-center py-3">
                <div 
                  className="flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200"
                  style={{
                    background: "rgba(255, 255, 255, 0.4)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)"
                  }}
                >
                  <div className="relative">
                    {uploadedFile ? (
                      <div className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-xs">📁</span>
                      </div>
                    ) : (
                      <Image
                        src={getSelectedIconDisplayPath()}
                        alt="Selected facility icon"
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                    )}
                  </div>
                  <span 
                    className="text-xs font-medium"
                    style={{
                      color: "var(--color-dark-slate)",
                      fontFamily: "var(--font-source-sans), sans-serif",
                    }}
                  >
                    {uploadedFile ? uploadedFile.name : "Selected icon"}
                  </span>
                </div>
              </div>
            )}

            {/* Add Facility Button */}
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!facilityName.trim() || isSubmitting}
              loading={isSubmitting}
              variant="signup-primary"
              size="allotease-md"
              className="w-full"
            >
              Add facility
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}