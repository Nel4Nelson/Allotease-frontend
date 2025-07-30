"use client";
import React, { useState, useEffect } from "react";
import type { StayUnit } from "@/services/stays-service";
import { useBookingStore } from "@/stores/booking-store";
import { DateRangeSelector } from "@/components/ui/date-range-selector";
import { MinusIcon, PlusIcon } from "@/components/icons";
import { Divider } from "../divider";

interface StayDetailsReservationCardProps {
  stayId: string;
  units: StayUnit[];
  className?: string;
}

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export function StayDetailsReservationCard({
  stayId,
  units,
  className = "",
}: StayDetailsReservationCardProps) {
  const {
    bookingData,
    setStayId,
    updateUnitQuantity,
    setDateRange,
    //getTotalUnits,
    getBookingPayload,
  } = useBookingStore();

  const [dateRange, setDateRangeState] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [days, setDays] = useState(1);

  // Set stay ID when component mounts
  useEffect(() => {
    setStayId(stayId);
  }, [stayId, setStayId]);

  // Calculate days when date range changes
  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      const timeDiff = dateRange.to.getTime() - dateRange.from.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      setDays(daysDiff > 0 ? daysDiff : 1);

      // Update store with new dates
      setDateRange(dateRange.from, dateRange.to);
    }
  }, [dateRange, setDateRange]);

  // Get selected units with their details
  const selectedUnitsWithDetails = bookingData.units
    .map((selectedUnit) => {
      const unitDetails = units.find(
        (unit) => unit._id === selectedUnit.unitId
      );
      return {
        ...selectedUnit,
        details: unitDetails,
      };
    })
    .filter((unit) => unit.details); // Filter out units that couldn't be found

  // Calculate total price
  const calculateTotalPrice = () => {
    return selectedUnitsWithDetails.reduce((total, unit) => {
      if (unit.details) {
        return total + unit.details.price * unit.numberOfUnits * days;
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

  // Handle date range change
  const handleDateRangeChange = (range: DateRange) => {
    setDateRangeState(range);
  };

  // Handle reservation
  const handleReservation = () => {
    const payload = getBookingPayload();
    console.log("Booking payload:", payload);
    // TODO: Implement actual booking logic
    alert("Booking functionality coming soon!");
  };

  // Check if reservation is possible
  const canReserve =
    selectedUnitsWithDetails.length > 0 && dateRange.from && dateRange.to;

  return (
    <div
      className={`sticky top-8 ${className}`}
      style={{
        width: "300px",
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

        {/* Date Range Selector */}
        <div className="space-y-2">
          <DateRangeSelector
            value={dateRange}
            onChange={handleDateRangeChange}
            placeholder="check-in and check-out"
          />
        </div>

        {/* Days Counter */}
        <div className="flex items-center justify-between">
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
            Days
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (days > 1) {
                  setDays(days - 1);
                  // Update checkout date based on new days count
                  if (dateRange.from) {
                    const newToDate = new Date(dateRange.from);
                    newToDate.setDate(newToDate.getDate() + (days - 1));
                    handleDateRangeChange({
                      from: dateRange.from,
                      to: newToDate,
                    });
                  }
                }
              }}
              disabled={days <= 1}
              style={{
                borderRadius: "50%",
                border: "0.778px solid rgba(138, 174, 164, 0.50)",
                display: "flex",
                width: "28px",
                height: "28px",
                justifyContent: "center",
                alignItems: "center",
                background: "transparent",
                cursor: days <= 1 ? "not-allowed" : "pointer",
                opacity: days <= 1 ? 0.5 : 1,
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
              {days}
            </span>

            <button
              onClick={() => {
                setDays(days + 1);
                // Update checkout date based on new days count
                if (dateRange.from) {
                  const newToDate = new Date(dateRange.from);
                  newToDate.setDate(newToDate.getDate() + (days + 1));
                  handleDateRangeChange({
                    from: dateRange.from,
                    to: newToDate,
                  });
                }
              }}
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
  );
}
