"use client";
import React, { useState, useEffect } from "react";
import { useDebouncedStaysFormStore } from "@/hooks/use-debounced-stay-store";
import { DateRangeSelector } from "@/components/ui/date-range-selector";
import { Divider } from "@/components/ui/divider";

// Icons as React components
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M8 3.5V12.5"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.5 8H12.5"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MinusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M3.5 8H12.5"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface StaysPreviewReservationCardProps {
  className?: string;
}

interface StaysPreviewReservationCardProps {
  className?: string;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export function StaysPreviewReservationCard({ 
  className = "",
  dateRange,
  onDateRangeChange
}: StaysPreviewReservationCardProps) {
  const { units } = useDebouncedStaysFormStore();

  const [days, setDays] = useState(1);
  const [selectedUnits, setSelectedUnits] = useState<Array<{
    unitId: string;
    numberOfUnits: number;
  }>>([]);

  // Initialize with first unit selected for preview
  useEffect(() => {
    if (units.length > 0 && selectedUnits.length === 0) {
      setSelectedUnits([{
        unitId: units[0].id,
        numberOfUnits: 1
      }]);
    }
  }, [units, selectedUnits.length]);

  // Calculate days when date range changes
  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      const timeDiff = dateRange.to.getTime() - dateRange.from.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      setDays(daysDiff > 0 ? daysDiff : 1);
    }
  }, [dateRange]);

  // Get selected units with their details
  const selectedUnitsWithDetails = selectedUnits
    .map((selectedUnit) => {
      const unitDetails = units.find((unit) => unit.id === selectedUnit.unitId);
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

  // Handle quantity change (preview only)
  const handleQuantityChange = (unitId: string, change: number) => {
    setSelectedUnits(prevUnits => 
      prevUnits.map(unit => 
        unit.unitId === unitId 
          ? { ...unit, numberOfUnits: Math.max(0, unit.numberOfUnits + change) }
          : unit
      ).filter(unit => unit.numberOfUnits > 0)
    );
  };

  // Handle days change
  const handleDaysChange = (change: number) => {
    const newDays = Math.max(1, days + change);
    setDays(newDays);
    
    // Update checkout date based on new days count
    if (dateRange.from) {
      const newToDate = new Date(dateRange.from);
      newToDate.setDate(newToDate.getDate() + newDays);
      onDateRangeChange({
        from: dateRange.from,
        to: newToDate,
      });
    }
  };

  return (
    <div
      className={`
        sticky top-4 lg:top-8 
        w-full max-w-sm mx-auto lg:max-w-none
        mb-6 lg:mb-0
        flex flex-col 
        rounded-2xl 
        border border-[rgba(138,174,164,0.20)]
        bg-[rgba(242,244,247,0.30)]
        backdrop-blur-[21px]
        overflow-hidden
        ${className}
      `}
    >
      {/* Header Section */}
      <div className="bg-[rgba(242,244,247,0.80)] backdrop-blur-[21px] flex py-4 lg:py-5 flex-col items-center gap-1">
        <h3 className="text-[#1F2024] text-center font-space-grotesk text-lg lg:text-xl font-bold leading-6 lg:leading-7 tracking-[-0.4px] m-0">
          Reservation
        </h3>
      </div>

      {/* Content Section */}
      <div className="flex flex-col p-4 lg:p-6 xl:px-6 xl:pt-8 xl:pb-5 gap-3 lg:gap-4">
        {/* Selected Units */}
        {selectedUnitsWithDetails.length > 0 ? (
          <div className="space-y-3 lg:space-y-4">
            {selectedUnitsWithDetails.map((unit) => (
              <div key={unit.unitId} className="space-y-2">
                {/* Unit Name and Quantity Controls */}
                <div className="flex items-start lg:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-[#20232A] font-source-sans text-sm lg:text-base font-semibold leading-4 lg:leading-4 truncate">
                      {unit.details?.title}
                    </div>
                    <div className="text-[#71727A] font-source-sans text-xs font-normal leading-[14px] mt-0.5 lg:mt-1">
                      {unit.details && formatPrice(unit.details.price)} / {unit.details?.frequency}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1.5 lg:gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleQuantityChange(unit.unitId, -1)}
                      disabled={unit.numberOfUnits <= 1}
                      className={`
                        rounded-full 
                        border border-[rgba(138,174,164,0.50)]
                        flex w-6 h-6 lg:w-7 lg:h-7
                        justify-center items-center
                        bg-transparent
                        transition-opacity
                        ${unit.numberOfUnits <= 1 
                          ? 'cursor-not-allowed opacity-50' 
                          : 'cursor-pointer hover:bg-gray-50'
                        }
                        p-0
                      `}
                    >
                      <MinusIcon />
                    </button>

                    <span className="text-[#20232A] text-center font-source-sans text-sm lg:text-base font-semibold leading-4 min-w-[16px] lg:min-w-[20px]">
                      {unit.numberOfUnits}
                    </span>

                    <button
                      onClick={() => handleQuantityChange(unit.unitId, 1)}
                      className="
                        rounded-full 
                        border border-[rgba(138,174,164,0.50)]
                        flex w-6 h-6 lg:w-7 lg:h-7
                        justify-center items-center
                        bg-transparent
                        cursor-pointer hover:bg-gray-50
                        transition-colors
                        p-0
                      "
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
          <div className="text-center py-3 lg:py-4">
            <p className="text-[#71727A] font-source-sans text-xs lg:text-sm font-normal m-0">
              Select rooms from availability section
            </p>
          </div>
        )}

        {/* Synchronized Date Range Selector */}
        <div className="space-y-2">
          <DateRangeSelector
            value={dateRange}
            onChange={onDateRangeChange}
            placeholder="check-in and check-out"
          />
        </div>

        {/* Days Counter */}
        <div className="flex items-center justify-between">
          <span className="text-[#20232A] font-source-sans text-sm lg:text-base font-semibold leading-4 m-0">
            Days
          </span>

          <div className="flex items-center gap-1.5 lg:gap-2">
            <button
              onClick={() => handleDaysChange(-1)}
              disabled={days <= 1}
              className={`
                rounded-full 
                border border-[rgba(138,174,164,0.50)]
                flex w-6 h-6 lg:w-7 lg:h-7
                justify-center items-center
                bg-transparent
                transition-opacity
                ${days <= 1 
                  ? 'cursor-not-allowed opacity-50' 
                  : 'cursor-pointer hover:bg-gray-50'
                }
                p-0
              `}
            >
              <MinusIcon />
            </button>

            <span className="text-[#20232A] text-center font-source-sans text-sm lg:text-base font-semibold leading-4 min-w-[16px] lg:min-w-[20px]">
              {days}
            </span>

            <button
              onClick={() => handleDaysChange(1)}
              className="
                rounded-full 
                border border-[rgba(138,174,164,0.50)]
                flex w-6 h-6 lg:w-7 lg:h-7
                justify-center items-center
                bg-transparent
                cursor-pointer hover:bg-gray-50
                transition-colors
                p-0
              "
            >
              <PlusIcon />
            </button>
          </div>
        </div>

        {/* Total Price */}
        {selectedUnitsWithDetails.length > 0 && (
          <div className="flex items-center justify-between pt-2 lg:pt-3 border-t border-gray-200">
            <span className="text-[#20232A] font-source-sans text-sm lg:text-base font-semibold leading-4 m-0">
              Total:
            </span>
            <span className="text-[#1F3A3A] font-source-sans text-base lg:text-lg font-bold leading-4 lg:leading-[18px] m-0">
              {formatPrice(calculateTotalPrice())}
            </span>
          </div>
        )}

        {/* Disabled Reserve Button */}
        <button
          disabled={true}
          className="
            w-full 
            h-10 lg:h-12
            mt-3 lg:mt-4
            rounded-[51px]
            bg-gray-300
            border-none
            text-gray-500
            text-sm lg:text-base
            font-semibold
            font-source-sans
            cursor-not-allowed
            opacity-60
            transition-all
          "
        >
          <span className="block lg:hidden">
            Reserve ({formatPrice(calculateTotalPrice())})
          </span>
          <span className="hidden lg:block">
            Reserve for {formatPrice(calculateTotalPrice())}
          </span>
        </button>

        {/* Preview Notice */}
        <div className="text-center mt-1 lg:mt-2">
          <p className="text-[#71727A] font-source-sans text-xs font-normal m-0 italic">
            Preview Mode - Booking disabled
          </p>
        </div>
      </div>
    </div>
  );
}