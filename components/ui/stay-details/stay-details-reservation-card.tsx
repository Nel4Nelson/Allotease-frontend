/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import type { Stay, StayUnit } from "@/services/stays-service";
import { useBookingStore } from "@/stores/booking-store";
import { DateRangeSelector } from "@/components/ui/date-range-selector";
import { PlusIcon, MinusIcon } from "@/components/icons";
import { StayBookingModal } from "@/components/ui/modals/stay-booking-modal";
import { BookingSuccessModal } from "@/components/ui/modals/booking-success-modal";
import { Divider } from "../divider";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface StayDetailsReservationCardProps {
  stay: Stay;
  stayUnits: StayUnit[];
  className?: string;
}

export function StayDetailsReservationCard({
  stay,
  stayUnits,
  className = "",
}: StayDetailsReservationCardProps) {
  const {
    bookingData,
    setStayId,
    updateUnitQuantity,
    updateUnitDateRange,
    updateUnitFrequencyCount,
    getUnitData,
    clearBookingData,
  } = useBookingStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Set stay ID when component mounts
  useEffect(() => {
    setStayId(stay._id);
  }, [stay._id, setStayId]);

  // Listen for successful payment callback
  useEffect(() => {
    const handleCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const type = urlParams.get("type");
      const trxref = urlParams.get("trxref");
      const reference = urlParams.get("reference");

      if (type === "stays" && (trxref || reference)) {
        setIsModalOpen(false);
        setShowSuccessModal(true);
        clearBookingData();
      }
    };

    handleCallback();
    window.addEventListener("popstate", handleCallback);

    return () => {
      window.removeEventListener("popstate", handleCallback);
    };
  }, [clearBookingData]);

  // Get selected units with their details
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

  // Calculate total price
  const calculateTotalPrice = () => {
    return selectedUnitsWithDetails.reduce((total, unit) => {
      if (unit.details) {
        const frequencyCount = unit.frequencyCount || 1; // Fallback to 1 if undefined
        const numberOfUnits = unit.numberOfUnits || 1; // Fallback to 1 if undefined
        const price = unit.details.price || 0; // Fallback to 0 if undefined

        if (
          typeof frequencyCount === "number" &&
          !isNaN(frequencyCount) &&
          frequencyCount > 0
        ) {
          return total + price * numberOfUnits * frequencyCount;
        }
      }
      return total;
    }, 0);
  };

  // Format price
  const formatPrice = (price: number) => {
    const formatter = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    });
    return formatter.format(price);
  };

  // Get display label for frequency
  const getFrequencyLabel = (frequency: string, count: number) => {
    const labels = {
      daily: count === 1 ? "Day" : "Days",
      weekly: count === 1 ? "Week" : "Weeks",
      monthly: count === 1 ? "Month" : "Months",
      yearly: count === 1 ? "Year" : "Years",
    };
    return labels[frequency as keyof typeof labels] || frequency;
  };

  // Get day equivalent text for non-daily frequencies
  const getDayEquivalent = (frequency: string, count: number) => {
    if (frequency === "daily") return "";

    const totalDays = (() => {
      switch (frequency) {
        case "weekly":
          return count * 7;
        case "monthly":
          return count * 30;
        case "yearly":
          return count * 365;
        default:
          return count;
      }
    })();

    return `(${totalDays} day${totalDays !== 1 ? "s" : ""})`;
  };

  // Handle quantity change
  const handleQuantityChange = (unitId: string, change: number) => {
    const currentUnit = bookingData.units.find((u) => u.unitId === unitId);
    if (currentUnit) {
      const newQuantity = Math.max(0, currentUnit.numberOfUnits + change);
      updateUnitQuantity(unitId, newQuantity);
    }
  };

  // Handle frequency counter change for a specific unit
  const handleFrequencyCountChange = (unitId: string, change: number) => {
    const unitData = getUnitData(unitId);
    const unitDetails = stayUnits.find((unit) => unit._id === unitId);

    if (unitData && unitDetails) {
      const currentCount = unitData.frequencyCount || 1; // Fallback to 1
      const newCount = Math.max(1, currentCount + change);

      console.log("Frequency change:", {
        unitId,
        currentCount,
        newCount,
        frequency: unitDetails.frequency,
        unitData,
      });

      updateUnitFrequencyCount(unitId, newCount, unitDetails.frequency);
    } else {
      console.error("Missing data for frequency change:", {
        unitId,
        unitData,
        unitDetails,
      });
    }
  };

  // Handle date range change for a specific unit
  const handleUnitDateRangeChange = (unitId: string, range: DateRange) => {
    if (range.from && range.to) {
      const unitDetails = stayUnits.find((unit) => unit._id === unitId);
      if (unitDetails) {
        updateUnitDateRange(
          unitId,
          range.from,
          range.to,
          unitDetails.frequency
        );
      }
    }
  };

  // Convert unit dates to DateRange format
  const getUnitDateRange = (unit: any): DateRange => {
    return {
      from: unit.checkInDate ? new Date(unit.checkInDate) : undefined,
      to: unit.checkOutDate ? new Date(unit.checkOutDate) : undefined,
    };
  };

  // Handle reservation
  const handleReservation = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  // Check if reservation is possible
  const canReserve =
    selectedUnitsWithDetails.length > 0 &&
    selectedUnitsWithDetails.every(
      (unit) => unit.checkInDate && unit.checkOutDate
    );

  return (
    <>
      <div
        className={`sticky top-8 ${className}`}
        style={{
          display: "flex",
          flexDirection: "column",
          borderRadius: "16px",
          border: "1px solid rgba(138, 174, 164, 0.20)",
          background: "rgba(242, 244, 247, 0.30)",
          backdropFilter: "blur(21px)",
          overflow: "hidden",
        }}
      >
        {/* Header Section */}
        <div
          style={{
            background: "rgba(242, 244, 247, 0.80)",
            backdropFilter: "blur(21px)",
            display: "flex",
            padding: "20px 0",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <h3
            style={{
              color: "#1F2024",
              textAlign: "center",
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: "20px",
              fontWeight: 700,
              lineHeight: "28px",
              letterSpacing: "-0.4px",
              margin: 0,
            }}
          >
            Reservation
          </h3>
        </div>

        {/* Content Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "32px 24px 20px 24px",
            gap: "16px",
          }}
        >
          {/* Selected Units */}
          {selectedUnitsWithDetails.length > 0 ? (
            <div className="space-y-6">
              {selectedUnitsWithDetails.map((unit, index) => (
                <div key={unit.unitId}>
                  {index > 0 && <Divider />}

                  <div className="space-y-4">
                    {/* Unit Name and Quantity Controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <div
                          style={{
                            color: "#20232A",
                            fontFamily: "var(--font-source-sans), sans-serif",
                            fontSize: "16px",
                            fontWeight: 600,
                            lineHeight: "16px",
                            margin: 0,
                          }}
                        >
                          {unit.details?.title}
                        </div>
                        <div
                          style={{
                            color: "#71727A",
                            fontFamily: "var(--font-source-sans), sans-serif",
                            fontSize: "12px",
                            fontWeight: 400,
                            lineHeight: "14px",
                            marginTop: "2px",
                          }}
                        >
                          {unit.details && formatPrice(unit.details.price)} /{" "}
                          {unit.details?.frequency}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(unit.unitId, -1)}
                          disabled={unit.numberOfUnits <= 1}
                          style={{
                            borderRadius: "50%",
                            border: "0.778px solid rgba(138, 174, 164, 0.50)",
                            display: "flex",
                            width: "28px",
                            height: "28px",
                            justifyContent: "center",
                            alignItems: "center",
                            background: "transparent",
                            cursor:
                              unit.numberOfUnits <= 1
                                ? "not-allowed"
                                : "pointer",
                            opacity: unit.numberOfUnits <= 1 ? 0.5 : 1,
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
                          {unit.numberOfUnits}
                        </span>

                        <button
                          onClick={() => handleQuantityChange(unit.unitId, 1)}
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

                    {/* Individual Unit Date Range */}
                    <div className="space-y-2">
                      <div
                        style={{
                          color: "#20232A",
                          fontFamily: "var(--font-source-sans), sans-serif",
                          fontSize: "14px",
                          fontWeight: 500,
                          lineHeight: "16px",
                        }}
                      >
                        {unit.details?.title} Dates:
                      </div>
                      <DateRangeSelector
                        value={getUnitDateRange(unit)}
                        onChange={(range) =>
                          handleUnitDateRangeChange(unit.unitId, range)
                        }
                        placeholder="check-in and check-out dates"
                      />
                    </div>

                    {/* Individual Unit Duration Counter */}
                    {unit.details && (
                      <div className="flex items-center justify-between">
                        <div>
                          <span
                            style={{
                              color: "#20232A",
                              fontFamily: "var(--font-source-sans), sans-serif",
                              fontSize: "16px",
                              fontWeight: 600,
                              lineHeight: "16px",
                              margin: 0,
                            }}
                          >
                            Duration (
                            {getFrequencyLabel(
                              unit.details.frequency,
                              unit.frequencyCount || 1
                            )}
                            )
                          </span>
                          {getDayEquivalent(
                            unit.details.frequency,
                            unit.frequencyCount || 1
                          ) && (
                            <div
                              style={{
                                color: "#71727A",
                                fontFamily:
                                  "var(--font-source-sans), sans-serif",
                                fontSize: "12px",
                                fontWeight: 400,
                                lineHeight: "14px",
                                marginTop: "2px",
                              }}
                            >
                              {getDayEquivalent(
                                unit.details.frequency,
                                unit.frequencyCount || 1
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleFrequencyCountChange(unit.unitId, -1)
                            }
                            disabled={(unit.frequencyCount || 1) <= 1}
                            style={{
                              borderRadius: "50%",
                              border: "0.778px solid rgba(138, 174, 164, 0.50)",
                              display: "flex",
                              width: "28px",
                              height: "28px",
                              justifyContent: "center",
                              alignItems: "center",
                              background: "transparent",
                              cursor:
                                (unit.frequencyCount || 1) <= 1
                                  ? "not-allowed"
                                  : "pointer",
                              opacity:
                                (unit.frequencyCount || 1) <= 1 ? 0.5 : 1,
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
                            {unit.frequencyCount || 1}
                          </span>

                          <button
                            onClick={() =>
                              handleFrequencyCountChange(unit.unitId, 1)
                            }
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
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p
                style={{
                  color: "#71727A",
                  fontFamily: "var(--font-source-sans), sans-serif",
                  fontSize: "14px",
                  fontWeight: 400,
                  margin: 0,
                }}
              >
                Select rooms from availability section
              </p>
            </div>
          )}

          {/* Total Price */}
          {selectedUnitsWithDetails.length > 0 && (
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <span
                style={{
                  color: "#20232A",
                  fontFamily: "var(--font-source-sans), sans-serif",
                  fontSize: "16px",
                  fontWeight: 600,
                  lineHeight: "16px",
                  margin: 0,
                }}
              >
                Total:
              </span>
              <span
                style={{
                  color: "#1F3A3A",
                  fontFamily: "var(--font-source-sans), sans-serif",
                  fontSize: "18px",
                  fontWeight: 700,
                  lineHeight: "18px",
                  margin: 0,
                }}
              >
                {formatPrice(calculateTotalPrice())}
              </span>
            </div>
          )}

          {/* Reserve Button */}
          <button
            onClick={handleReservation}
            disabled={!canReserve}
            style={{
              width: "100%",
              height: "48px",
              marginTop: "16px",
              borderRadius: "51px",
              background: canReserve ? "#FF5B06" : "#ccc",
              border: "none",
              color: "white",
              fontSize: "16px",
              fontWeight: 600,
              fontFamily: "var(--font-source-sans), sans-serif",
              cursor: canReserve ? "pointer" : "not-allowed",
              transition: "background-color 0.2s ease",
            }}
          >
            Reserve for {formatPrice(calculateTotalPrice())}
          </button>
        </div>
      </div>

      {/* Booking Modal */}
      <StayBookingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        stay={stay}
        stayUnits={stayUnits}
      />

      {/* Success Modal */}
      <BookingSuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        type="stays"
      />
    </>
  );
}
