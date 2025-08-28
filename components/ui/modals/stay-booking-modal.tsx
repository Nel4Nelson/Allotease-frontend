/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { FormInput } from "@/components/ui/form-input";
import { Button } from "@/components/ui/button";
import { Stay, StayUnit, StaysService } from "@/services/stays-service";
import { useBookingStore } from "@/stores/booking-store";
import { useProfileStore } from "@/stores/profile-store";
import { apiClient } from "@/services/api-client";
import { PaymentTimerModal } from "@/components/ui/modals/payment-timer-modal";

interface StayBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  stay: Stay;
  stayUnits: StayUnit[];
  className?: string;
}

interface BookingResponse {
  message: string;
  data: string; // Paystack URL
  status: string;
  expiresIn?: number;
  timeoutInSeconds?: number;
}

interface ApiError {
  status: string;
  message: string;
  isOperational?: boolean;
}

const bookingFormSchema = z.object({
  fullName: z
    .string()
    .min(1, { message: "Full name is required." })
    .max(100, { message: "Full name must not exceed 100 characters." }),
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Please enter a valid email address." })
    .max(100, { message: "Email must not exceed 100 characters." }),
  phoneNumber: z
    .string()
    .min(1, { message: "Phone number is required." })
    .min(10, { message: "Phone number must be at least 10 digits." }),
});

export interface BookingFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
}

export function StayBookingModal({
  isOpen,
  onClose,
  stay,
  stayUnits,
  className = "",
}: StayBookingModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [timeoutInSeconds, setTimeoutInSeconds] = useState<number>(0);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [timercompleted, setTimercompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { bookingData, getBookingPayload } = useBookingStore();

  // Get profile data from store
  const { 
    fetchProfile, 
    getFullName, 
    getEmail,
    profile,
    isLoading: isProfileLoading 
  } = useProfileStore();

  // Get phone number from profile
  const getPhoneNumber = () => {
    return useProfileStore.getState().getProfileField('phoneNumber') || 
           useProfileStore.getState().getProfileField('phone') || '';
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
    },
  });

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Fetch profile and populate form when modal opens
  useEffect(() => {
    if (isOpen) {
      // Reset all payment-related states when modal opens
      setPaymentUrl(null);
      setShowTimerModal(false);
      setTimercompleted(false);
      setTimeoutInSeconds(0);
      setError(null);

      // Fetch profile if not available or needs refresh
      const loadProfileData = async () => {
        try {
          await fetchProfile();
          
          // Populate form fields with profile data
          const fullName = getFullName();
          const email = getEmail();
          const phoneNumber = getPhoneNumber();

          if (fullName) {
            setValue('fullName', fullName);
          }
          if (email) {
            setValue('email', email);
          }
          if (phoneNumber) {
            setValue('phoneNumber', phoneNumber);
          }
        } catch (error) {
          console.error('Failed to load profile data:', error);
        }
      };

      loadProfileData();
    }
  }, [isOpen, fetchProfile, getFullName, getEmail, setValue]);

  // Also populate form when profile data becomes available
  useEffect(() => {
    if (profile && isOpen) {
      const fullName = getFullName();
      const email = getEmail();
      const phoneNumber = getPhoneNumber();

      if (fullName && !document.querySelector('input[name="fullName"]')?.getAttribute('value')) {
        setValue('fullName', fullName);
      }
      if (email && !document.querySelector('input[name="email"]')?.getAttribute('value')) {
        setValue('email', email);
      }
      if (phoneNumber && !document.querySelector('input[name="phoneNumber"]')?.getAttribute('value')) {
        setValue('phoneNumber', phoneNumber);
      }
    }
  }, [profile, isOpen, getFullName, getEmail, setValue]);

  // Get selected units with details
  const selectedUnitsWithDetails = bookingData.units
    .map((selectedUnit) => {
      const unitDetails = stayUnits.find(
        (unit) => unit._id === selectedUnit.unitId
      );
      return {
        ...selectedUnit,
        details: unitDetails,
      };
    })
    .filter((unit) => unit.details);

  // Calculate total price with frequency multiplier
  const calculateTotalPrice = () => {
    return selectedUnitsWithDetails.reduce((total, unit) => {
      if (unit.details && typeof unit.frequencyCount === 'number' && !isNaN(unit.frequencyCount)) {
        return total + unit.details.price * unit.numberOfUnits * unit.frequencyCount;
      }
      return total;
    }, 0);
  };

  // Format price
  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    return `NGN ${price.toLocaleString()}.00`;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  // Handle booking submission
  const handleBooking = async (data: BookingFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const payload = getBookingPayload({
        email: data.email,
        phoneNumber: data.phoneNumber,
        fullName: data.fullName,
      });

      const response = await apiClient.post<BookingResponse>(
        "/book/stay-unit",
        payload
      );

      if (response.status === "success") {
        setPaymentUrl(response.data);
        setTimeoutInSeconds(response.timeoutInSeconds || 600);
        setTimercompleted(false);
        setShowTimerModal(true);
        toast.success("Booking created! Complete payment within 10 minutes.");
      } else {
        throw new Error(response.message || "Booking failed");
      }
    } catch (error: any) {
      console.error("Booking failed:", error);

      let errorMessage = "Booking failed. Please try again.";

      if (error?.response?.data) {
        const apiError = error.response.data as ApiError;
        if (apiError.status === "fail" && apiError.message) {
          errorMessage = apiError.message;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle timer modal proceed
  const handleTimerProceed = () => {
    if (paymentUrl) {
      setShowTimerModal(false);
      toast.success("Redirecting to payment...");
      window.location.href = paymentUrl;
    }
  };

  // Handle timer modal cancel
  const handleTimerCancel = () => {
    setShowTimerModal(false);
    setPaymentUrl(null);
    setTimeoutInSeconds(0);
    setError(null);
  };

  // Handle timer expiry
  const handleTimercompleted = () => {
    setShowTimerModal(false);
    setTimercompleted(true);
    setPaymentUrl(null);
    toast.error("Payment time completed. Please try again.");
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      reset();
      setPaymentUrl(null);
      setShowTimerModal(false);
      setTimercompleted(false);
      setTimeoutInSeconds(0);
      setError(null);
    }
  };

  const handleRetryBooking = () => {
    setTimercompleted(false);
    setPaymentUrl(null);
    setShowTimerModal(false);
    setTimeoutInSeconds(0);
    setError(null);
  };

  // Don't render until mounted (prevents hydration issues)
  if (!isMounted || !isOpen) return null;

  const modalContent = (
    <>
      {/* Timer completed state */}
      {timercompleted ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20" onClick={handleClose} />
          <div className="relative bg-white rounded-xl p-6 sm:p-8 max-w-md w-full text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Payment Time completed
              </h3>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                Your booking session has completed. Please re-initiate your
                booking to continue.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleRetryBooking}
                className="flex-1"
                style={{ background: "#FF5B06" }}
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Main Booking Modal */
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/20" onClick={handleClose} />

          {/* Modal */}
          <div
            className={`relative ${className}`}
            style={{
              borderRadius: "20px",
              background: "rgba(242, 244, 247, 0.60)",
              boxShadow: "0 4px 10px 0 rgba(0, 0, 0, 0.04)",
              backdropFilter: "blur(83.3499984741211px)",
              display: "flex",
              width: "666px",
              maxWidth: "95vw",
              maxHeight: "90vh",
              padding: "20px",
              alignItems: "center",
              gap: "24px",
            }}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full transition-colors disabled:cursor-not-allowed z-10"
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

            {/* Left Side - Order Summary - Hidden on mobile */}
            <div
              className="hidden lg:flex"
              style={{
                borderRadius: "20px",
                border: "1px solid rgba(138, 174, 164, 0.20)",
                background:
                  "linear-gradient(6deg, rgba(22, 244, 118, 0.08) 33.76%, rgba(255, 255, 255, 0.08) 56.29%)",
                boxShadow: "2px 2px 6px 0 rgba(0, 0, 0, 0.04)",
                backdropFilter: "blur(21px)",
                width: "344px",
                padding: "16px",
                flexDirection: "column",
                alignItems: "center",
                gap: "32px",
                flexShrink: 0,
                alignSelf: "stretch",
              }}
            >
              {/* Stay Image */}
              <div
                style={{
                  borderRadius: "8px",
                  background: `url(${StaysService.getStayBannerImage(
                    stay
                  )}) lightgray 50% / cover no-repeat`,
                  display: "flex",
                  height: "147px",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  alignItems: "flex-start",
                  gap: "10px",
                  alignSelf: "stretch",
                }}
              />

              {/* Order Summary Content */}
              <div className="w-full space-y-4">
                {/* Order Summary Title */}
                <h3
                  style={{
                    color: "#1F2024",
                    fontFamily: "var(--font-space-grotesk), sans-serif",
                    fontSize: "18px",
                    fontWeight: 700,
                    lineHeight: "140%",
                    letterSpacing: "-0.36px",
                    margin: 0,
                  }}
                >
                  Order summary
                </h3>

                {/* Selected Units with Individual Dates */}
                <div className="space-y-3">
                  {selectedUnitsWithDetails.map((unit) => (
                    <div key={unit.unitId} className="space-y-2">
                      {/* Unit Details */}
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <span
                            style={{
                              color: "#20232A",
                              fontFamily: "var(--font-source-sans), sans-serif",
                              fontSize: "14px",
                              fontWeight: 600,
                              lineHeight: "160%",
                            }}
                          >
                            {unit.numberOfUnits}x {unit.details?.title}
                          </span>
                          <div
                            style={{
                              color: "#71727A",
                              fontFamily: "var(--font-source-sans), sans-serif",
                              fontSize: "12px",
                              fontWeight: 400,
                              lineHeight: "160%",
                            }}
                          >
                            {unit.frequencyCount} {unit.details?.frequency}
                            {unit.frequencyCount !== 1 ? 's' : ''}
                          </div>
                        </div>
                        <span
                          style={{
                            color: "#20232A",
                            fontFamily: "var(--font-source-sans), sans-serif",
                            fontSize: "14px",
                            fontWeight: 400,
                            lineHeight: "160%",
                          }}
                        >
                          {unit.details &&
                            formatPrice(unit.details.price * unit.numberOfUnits * unit.frequencyCount)}
                        </span>
                      </div>

                      {/* Unit Date Range */}
                      {unit.checkInDate && unit.checkOutDate && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                          <div className="flex items-center gap-2">
                            <svg
                              className="w-4 h-4 text-gray-400 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span
                              style={{
                                color: "#71727A",
                                fontFamily: "var(--font-source-sans), sans-serif",
                                fontSize: "12px",
                                fontWeight: 400,
                                lineHeight: "160%",
                              }}
                            >
                              {formatDate(unit.checkInDate)} - {formatDate(unit.checkOutDate)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Total */}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span
                      style={{
                        color: "#20232A",
                        fontFamily: "var(--font-source-sans), sans-serif",
                        fontSize: "16px",
                        fontWeight: 600,
                        lineHeight: "normal",
                      }}
                    >
                      Total
                    </span>
                    <span
                      style={{
                        color: "#20232A",
                        fontFamily: "var(--font-source-sans), sans-serif",
                        fontSize: "16px",
                        fontWeight: 600,
                        lineHeight: "normal",
                      }}
                    >
                      {formatPrice(calculateTotalPrice())}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Booking Form - Full width on mobile */}
            <div className="flex-1 h-full flex flex-col">
              {/* Form Header */}
              <div className="mb-6">
                <h2
                  style={{
                    color: "#1F2024",
                    fontFamily: "var(--font-space-grotesk), sans-serif",
                    fontSize: "20px",
                    fontWeight: 700,
                    lineHeight: "140%",
                    letterSpacing: "-0.4px",
                    margin: 0,
                  }}
                >
                  Enter your info
                </h2>
                {isProfileLoading && (
                  <p className="text-sm text-gray-500 mt-1">
                    Loading your profile information...
                  </p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Booking Form */}
              <form
                onSubmit={handleSubmit(handleBooking)}
                className="flex-1 flex flex-col"
              >
                <div className="space-y-4">
                  <FormInput
                    label="Full name"
                    placeholder="Full name*"
                    type="text"
                    required
                    error={errors.fullName?.message}
                    {...register("fullName")}
                  />

                  <FormInput
                    label="Email"
                    placeholder="Email*"
                    type="email"
                    required
                    error={errors.email?.message}
                    {...register("email")}
                  />

                  <FormInput
                    label="Phone number"
                    placeholder="Phone number*"
                    type="tel"
                    required
                    error={errors.phoneNumber?.message}
                    {...register("phoneNumber")}
                  />
                </div>

                {/* Submit Button */}
                <div className="mt-4 flex justify-center">
                  <Button
                    type="submit"
                    variant="signup-primary"
                    size="allotease-md"
                    loading={isLoading}
                    disabled={isLoading || !isValid}
                    style={{
                      background: "#FF5B06",
                      borderRadius: "51px",
                    }}
                  >
                    Pay with Paystack
                  </Button>
                </div>

                {/* Footer Text */}
                <div className="mt-4 text-center">
                  <p
                    style={{
                      color: "#71727A",
                      fontFamily: "var(--font-source-sans), sans-serif",
                      fontSize: "12px",
                      fontWeight: 400,
                      lineHeight: "160%",
                    }}
                  >
                    By selecting Register, I agree to the{" "}
                    <span
                      style={{
                        color: "#939393",
                        textDecorationLine: "underline",
                      }}
                    >
                      Allotease Terms of Service
                    </span>
                  </p>
                </div>

                {/* Powered by Allotease */}
                <div className="flex justify-center items-center gap-2 mt-6">
                  <p
                    style={{
                      color: "#71727A",
                      fontFamily: "var(--font-source-sans), sans-serif",
                      fontSize: "12px",
                      fontWeight: 400,
                      lineHeight: "160%",
                    }}
                  >
                    Powered by
                  </p>
                  <Link href="/" className="flex items-center group">
                    <Image
                      src="/images/brand-logo/logo-black.svg"
                      alt="Allotease Logo"
                      height={32}
                      width={50}
                      priority
                      className="transition-transform group-hover:scale-105 w-auto"
                    />
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Payment Timer Modal - Todo: rendered in portal */}
      <PaymentTimerModal
        isOpen={showTimerModal}
        onCancel={handleTimerCancel}
        onProceed={handleTimerProceed}
        timeoutInSeconds={timeoutInSeconds}
        onTimecompleted={handleTimercompleted}
      />
    </>
  );

  // Render modal content in a portal to document.body
  return createPortal(modalContent, document.body);
}