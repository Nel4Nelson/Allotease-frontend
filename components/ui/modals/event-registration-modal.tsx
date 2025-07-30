"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import Link from "next/link";
import { FormInput } from "@/components/ui/form-input";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { Event, EventService } from "@/services/events-service";

interface EventRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  quantity: number;
  className?: string;
}

const registrationFormSchema = z.object({
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

export interface RegistrationFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
}

export function EventRegistrationModal({
  isOpen,
  onClose,
  event,
  quantity,
  className = "",
}: EventRegistrationModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationFormSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
    },
  });

  // Format date for display
  const formatEventDate = (startTime: string, endTime: string) => {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    const startDay = startDate.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    const endDay = endDate.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

    return `${startDay} - ${endDay}`;
  };

  // Format price
  const formatPrice = (price: number) => {
    if (price === 0) return "NGN 0.00";
    return `NGN ${price.toLocaleString()}.00`;
  };

  const handleRegistration = async (data: RegistrationFormData) => {
    setIsLoading(true);
    try {
      // TODO: Implement registration logic
      console.log("Registration data:", {
        ...data,
        eventId: event._id,
        quantity,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Close modal and reset form on success
      onClose();
      reset();
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      reset();
    }
  };

  if (!isOpen) return null;

  return (
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
          height: "443px",
          padding: "20px",
          alignItems: "center",
          gap: "24px",
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full transition-colors disabled:cursor-not-allowed"
          style={{ zIndex: 10 }}
        >
          <Image src="/icons/close.svg" alt="Close" width={20} height={20} />
        </button>

        {/* Left Side - Order Summary */}
        <div
          style={{
            borderRadius: "20px",
            border: "1px solid rgba(138, 174, 164, 0.20)",
            background:
              "linear-gradient(6deg, rgba(22, 244, 118, 0.08) 33.76%, rgba(255, 255, 255, 0.08) 56.29%)",
            boxShadow: "2px 2px 6px 0 rgba(0, 0, 0, 0.04)",
            backdropFilter: "blur(21px)",
            display: "flex",
            width: "344px",
            padding: "16px",
            flexDirection: "column",
            alignItems: "center",
            gap: "32px",
            flexShrink: 0,
            alignSelf: "stretch",
          }}
        >
          {/* Event Image */}
          <div
            style={{
              borderRadius: "8px",
              background: `url(${EventService.getEventCoverImage(
                event
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

            {/* Date Picker (Disabled) */}
            <DatePicker
              value={new Date(event.startTime ?? "")}
              placeholder={formatEventDate(
                event.startTime ?? "",
                event.endTime ?? ""
              )}
              onChange={() => {}} // Disabled, so no change handler needed
            />

            {/* Entry Details */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span
                  style={{
                    color: "#20232A",
                    fontFamily: "var(--font-source-sans), sans-serif",
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "160%",
                  }}
                >
                  {quantity}x Entry
                </span>
                <span
                  style={{
                    color: "#20232A",
                    fontFamily: "var(--font-source-sans), sans-serif",
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "160%",
                  }}
                >
                  {formatPrice(event.price * quantity)}
                </span>
              </div>

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
                  {formatPrice(event.price * quantity)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
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
          </div>

          {/* Registration Form */}
          <form
            onSubmit={handleSubmit(handleRegistration)}
            className="flex-1 flex flex-col"
          >
            <div className="space-y-4 flex-1">
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
            <div className="mt-6">
              <Button
                type="submit"
                variant="signup-primary"
                size="allotease-md"
                className="w-full"
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
  );
}
