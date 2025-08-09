/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState } from "react";
import { PendingStayCard } from "@/components/ui/pending-stay-card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface PendingStay {
  _id: string;
  title: string;
  location: string;
  price: number;
  frequency: string;
  imageUrl: string;
  expiresAt: string;
}

// Mock data for pending stays
const mockPendingStays: PendingStay[] = [
  {
    _id: "1",
    title: "Wintess Garden",
    location: "Awka, Anambra, Nigeria",
    price: 455520,
    frequency: "Day",
    imageUrl: "/images/event-banner.svg",
    expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
  },
  {
    _id: "2",
    title: "Royal Lodge & Suites",
    location: "Awka, Anambra, Nigeria",
    price: 125000,
    frequency: "Night",
    imageUrl: "/images/event-banner.svg",
    expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
  },
  {
    _id: "3",
    title: "Comfort Inn & Suites",
    location: "Awka, Anambra, Nigeria",
    price: 85000,
    frequency: "Night",
    imageUrl: "/images/event-banner.svg",
    expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours from now
  },
];

export function TicketStaysPending() {
  const [stays, setStays] = useState<PendingStay[]>(mockPendingStays);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Calculate pagination
  const totalStays = stays.length;
  const totalPages = Math.ceil(totalStays / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStays = stays.slice(0, endIndex); // Show all up to current page
  const hasMore = endIndex < totalStays;

  const handleAccept = async (id: string) => {
    setLoading(true);
    try {
      // TODO: Integrate with actual API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Remove from pending stays (move to active)
      setStays(prev => prev.filter(stay => stay._id !== id));
      toast.success("Stay confirmed successfully!");
    } catch (error) {
      toast.error("Failed to confirm stay. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (id: string) => {
    setLoading(true);
    try {
      // TODO: Integrate with actual API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Remove from pending stays
      setStays(prev => prev.filter(stay => stay._id !== id));
      toast.success("Refund request submitted successfully!");
    } catch (error) {
      toast.error("Failed to request refund. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleShowMore = () => {
    if (!loading && hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleCollapse = () => {
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Title and Description */}
      <div>
        <h2 className="text-[var(--color-dark-slate)] font-source-sans-pro text-[20px] font-semibold leading-normal mb-2">
          Pending Stay Confirmations
        </h2>
        <p className="text-[#7A7A7A] font-source-sans-pro text-base font-normal leading-[160%] mb-4">
          These are your recently booked accommodations awaiting confirmation. You have a 3-day window to confirm your booking. 
          If you're satisfied with your choice, click "Accept" to confirm your payment. If you'd like to cancel, click "Refund" 
          to request a full refund.
        </p>
      </div>

      {/* Pending Stays */}
      {currentStays.length > 0 ? (
        <>
          <div className="space-y-4">
            {currentStays.map((stay) => (
              <PendingStayCard
                key={stay._id}
                id={stay._id}
                title={stay.title}
                location={stay.location}
                price={stay.price}
                frequency={stay.frequency}
                imageUrl={stay.imageUrl}
                expiresAt={stay.expiresAt}
                onAccept={handleAccept}
                onRefund={handleRefund}
              />
            ))}
          </div>

          {/* Show More / Collapse Buttons */}
          {totalStays > itemsPerPage && (
            <div className="flex justify-center gap-4 pt-4">
              {hasMore && (
                <Button
                  variant="signup-primary"
                  size="allotease-md"
                  onClick={handleShowMore}
                  disabled={loading}
                  loading={loading}
                >
                  Show More
                </Button>
              )}

              {currentPage > 1 && (
                <Button
                  variant="allotease-blur"
                  size="allotease-md"
                  onClick={handleCollapse}
                  disabled={loading}
                >
                  Collapse
                </Button>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No pending confirmations
          </h3>
          <p className="text-gray-500">
            You don't have any stays awaiting confirmation at the moment.
          </p>
        </div>
      )}
    </div>
  );
}