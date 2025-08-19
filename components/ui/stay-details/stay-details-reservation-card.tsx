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
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  className?: string;
}

export function StayDetailsReservationCard({
  stay,
  stayUnits,
  dateRange,
  onDateRangeChange,
  className = "",
}: StayDetailsReservationCardProps) {
  const {
    bookingData,
    setStayId,
    updateUnitQuantity,
    setDateRange,
    clearBookingData,
  } = useBookingStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Independent counters for each frequency
  const [frequencyCounters, setFrequencyCounters] = useState<Record<string, number>>({
    daily: 1,
    weekly: 1,
    monthly: 1,
    yearly: 1,
  });

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

      // Check if this is a successful payment callback from Paystack
      // Paystack returns trxref and reference parameters on successful payment
      if (type === "stays" && (trxref || reference)) {
        // Close booking modal and show success modal
        setIsModalOpen(false);
        setShowSuccessModal(true);
        clearBookingData();
      }
    };

    // Check on component mount
    handleCallback();

    // Listen for popstate events (back/forward navigation)
    window.addEventListener("popstate", handleCallback);

    return () => {
      window.removeEventListener("popstate", handleCallback);
    };
  }, [clearBookingData]);

  // Update store with dates when date range changes (optional)
  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      setDateRange(dateRange.from, dateRange.to);
    }
  }, [dateRange, setDateRange]);

  // Get unique frequencies from selected units
  const getSelectedFrequencies = () => {
    const frequencies = new Set<string>();
    selectedUnitsWithDetails.forEach(unit => {
      if (unit.details) {
        frequencies.add(unit.details.frequency);
      }
    });
    return Array.from(frequencies).sort((a, b) => {
      const order = { 'daily': 1, 'weekly': 2, 'monthly': 3, 'yearly': 4 };
      return (order[a as keyof typeof order] || 5) - (order[b as keyof typeof order] || 5);
    });
  };

  // Get counter value for a specific frequency
  const getCounterValue = (frequency: string) => {
    return frequencyCounters[frequency] || 1;
  };

  // Set counter value for a specific frequency (independent)
  const setCounterValue = (frequency: string, value: number) => {
    setFrequencyCounters(prev => ({
      ...prev,
      [frequency]: Math.max(1, value)
    }));
  };

  // Get display label for frequency
  const getFrequencyLabel = (frequency: string) => {
    const labels = {
      'daily': 'Days',
      'weekly': 'Weeks',
      'monthly': 'Months',
      'yearly': 'Years'
    };
    return labels[frequency as keyof typeof labels] || frequency;
  };

  // Get day equivalent text for non-daily frequencies
  const getDayEquivalent = (frequency: string, value: number) => {
    if (frequency === 'daily') return '';
    
    const totalDays = (() => {
      switch (frequency) {
        case 'weekly': return value * 7;
        case 'monthly': return value * 30;
        case 'yearly': return value * 365;
        default: return value;
      }
    })();
    
    return `(${totalDays} day${totalDays !== 1 ? 's' : ''})`;
  };

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
    .filter((unit) => unit.details); // Filter out units that couldn't be found

  // Calculate total price with independent frequency pricing
  const calculateTotalPrice = () => {
    return selectedUnitsWithDetails.reduce((total, unit) => {
      if (unit.details) {
        const frequency = unit.details.frequency;
        const counterValue = getCounterValue(frequency);
        return total + unit.details.price * unit.numberOfUnits * counterValue;
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

  // Handle quantity change
  const handleQuantityChange = (unitId: string, change: number) => {
    const currentUnit = bookingData.units.find((u) => u.unitId === unitId);
    if (currentUnit) {
      const newQuantity = Math.max(0, currentUnit.numberOfUnits + change);
      updateUnitQuantity(unitId, newQuantity);
    }
  };

  // Handle counter change for specific frequency (independent)
  const handleCounterChange = (frequency: string, change: number) => {
    const currentValue = getCounterValue(frequency);
    const newValue = Math.max(1, currentValue + change);
    setCounterValue(frequency, newValue);
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

  // Check if reservation is possible (only requires selected units now)
  const canReserve = selectedUnitsWithDetails.length > 0;

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
            <div className="space-y-4">
              {selectedUnitsWithDetails.map((unit) => (
                <div key={unit.unitId} className="space-y-2">
                  {/* Unit Name and Quantity Controls */}
                  <div className="flex items-center justify-between">
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
                            unit.numberOfUnits <= 1 ? "not-allowed" : "pointer",
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
                  <Divider />
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

          {/* Optional Date Range Selector */}
          <div className="space-y-2">
            <DateRangeSelector
              value={dateRange}
              onChange={onDateRangeChange}
              placeholder="check-in and check-out (optional)"
            />
          </div>

          {/* Independent Frequency Duration Counters */}
          {(() => {
            const selectedFrequencies = getSelectedFrequencies();
            
            if (selectedFrequencies.length === 0) {
              return null;
            }

            return (
              <div className="space-y-3">
                {selectedFrequencies.map((frequency, index) => {
                  const value = getCounterValue(frequency);
                  const label = getFrequencyLabel(frequency);
                  const dayEquivalent = getDayEquivalent(frequency, value);
                  const isOnlyDaily = selectedFrequencies.length === 1 && frequency === 'daily';

                  return (
                    <div key={frequency}>
                      {index > 0 && <Divider />}
                      
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
                            {isOnlyDaily ? "Duration" : label}
                          </span>
                          {dayEquivalent && (
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
                              {dayEquivalent}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCounterChange(frequency, -1)}
                            disabled={value <= 1}
                            style={{
                              borderRadius: "50%",
                              border: "0.778px solid rgba(138, 174, 164, 0.50)",
                              display: "flex",
                              width: "28px",
                              height: "28px",
                              justifyContent: "center",
                              alignItems: "center",
                              background: "transparent",
                              cursor: value <= 1 ? "not-allowed" : "pointer",
                              opacity: value <= 1 ? 0.5 : 1,
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
                            {value}
                          </span>

                          <button
                            onClick={() => handleCounterChange(frequency, 1)}
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
                  );
                })}
              </div>
            );
          })()}

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