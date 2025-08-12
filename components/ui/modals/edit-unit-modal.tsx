/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { FormInput } from "@/components/ui/form-input";
import { FormTextarea } from "@/components/ui/form-textarea";
import { FormSelect } from "@/components/ui/form-select";
import { Button } from "@/components/ui/button";
import type { UnitData } from "@/stores/stay-form-store";

// Icons as React components
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 3.5V12.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.5 8H12.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MinusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3.5 8H12.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Frequency options
const frequencyOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

interface EditUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit: UnitData | null;
  onUpdate: (unitId: string, updates: Partial<UnitData>) => void;
}

export function EditUnitModal({ isOpen, onClose, unit, onUpdate }: EditUnitModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    frequency: "daily" as "daily" | "weekly" | "monthly" | "yearly",
    quantity: 1,
  });

  // Populate form when unit changes
  useEffect(() => {
    if (unit) {
      setFormData({
        title: unit.title,
        description: unit.description,
        price: unit.price,
        frequency: unit.frequency,
        quantity: unit.quantity,
      });
    }
  }, [unit]);

  const handleSubmit = () => {
    if (unit && formData.title.trim() && formData.description.trim() && formData.price > 0 && formData.quantity > 0) {
      onUpdate(unit.id, formData);
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !unit) return null;

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
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full transition-colors z-20"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

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
            Edit space information
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
            This image will be the main visual representation of your event.
          </p>

          {/* Form */}
          <div className="w-full space-y-4">
            {/* Unit Name and Quantity Row */}
            <div className="flex gap-4">
              <div className="flex-1">
                <FormInput
                  label="Name"
                  placeholder="Name* e.g 2 bedroom flat"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required={true}
                />
              </div>
              
              {/* Quantity Controls */}
              <div className="flex flex-col gap-1">
                <span 
                  className="text-sm font-medium text-left"
                  style={{
                    color: "var(--color-dark-slate)",
                    fontFamily: "var(--font-source-sans), sans-serif",
                  }}
                >
                  Quantity
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, quantity: Math.max(1, formData.quantity - 1) })}
                    disabled={formData.quantity <= 1}
                    style={{
                      borderRadius: "50%",
                      border: "0.778px solid rgba(138, 174, 164, 0.50)",
                      display: "flex",
                      width: "28px",
                      height: "28px",
                      justifyContent: "center",
                      alignItems: "center",
                      background: "transparent",
                      cursor: formData.quantity <= 1 ? "not-allowed" : "pointer",
                      opacity: formData.quantity <= 1 ? 0.5 : 1,
                      padding: 0,
                    }}
                  >
                    <MinusIcon />
                  </button>

                  <span
                    style={{
                      color: "#20232A",
                      textAlign: "center",
                      fontFamily: "var(--font-source-sans), sans-serif",
                      fontSize: "16px",
                      fontWeight: 600,
                      lineHeight: "16px",
                      minWidth: "20px",
                    }}
                  >
                    {formData.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, quantity: formData.quantity + 1 })}
                    style={{
                      borderRadius: "50%",
                      border: "0.778px solid rgba(138, 174, 164, 0.50)",
                      display: "flex",
                      width: "28px",
                      height: "28px",
                      justifyContent: "center",
                      alignItems: "center",
                      background: "transparent",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    <PlusIcon />
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <FormTextarea
              label="Description"
              placeholder="Description*"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required={true}
            />

            {/* Price and Frequency Row */}
            <div className="flex gap-4">
              <div className="flex-1">
                <FormInput
                  label="Price"
                  placeholder="NGN Price*"
                  type="number"
                  value={formData.price || ""}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  required={true}
                />
              </div>
              
              <div className="flex-1">
                <FormSelect
                  label="Frequency"
                  placeholder="Select frequency"
                  options={frequencyOptions}
                  value={formData.frequency}
                  onValueChange={(value) => setFormData({ ...formData, frequency: value as any })}
                  required={true}
                />
              </div>
            </div>

            {/* Update Button */}
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!formData.title.trim() || !formData.description.trim() || formData.price <= 0 || formData.quantity <= 0}
              variant="signup-primary"
              size="allotease-md"
              className="w-full"
            >
              Update Space
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}