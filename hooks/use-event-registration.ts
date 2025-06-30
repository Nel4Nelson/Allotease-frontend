/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useCallback } from "react";
import { EventRegistration } from "@/types/event-details";

interface UseEventRegistrationProps {
  eventId: string;
  registration: EventRegistration;
}

export function useEventRegistration({
  eventId,
  registration,
}: UseEventRegistrationProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [attendeeCount, setAttendeeCount] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const incrementAttendees = useCallback(() => {
    setAttendeeCount((prev) => Math.min(prev + 1, 10)); // Max 10 attendees per registration
  }, []);

  const decrementAttendees = useCallback(() => {
    setAttendeeCount((prev) => Math.max(prev - 1, 1)); // Min 1 attendee
  }, []);

  const registerForEvent = useCallback(async () => {
    if (!registration.isOpen) {
      setError("Registration is closed for this event");
      return;
    }

    setIsRegistering(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsRegistered(true);
      console.log(
        `Registered ${attendeeCount} attendee(s) for event ${eventId}`
      );
    } catch (err) {
      setError("Failed to register for event. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  }, [eventId, attendeeCount, registration.isOpen]);

  const cancelRegistration = useCallback(async () => {
    setIsRegistering(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsRegistered(false);
      console.log(`Cancelled registration for event ${eventId}`);
    } catch (err) {
      setError("Failed to cancel registration. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  }, [eventId]);

  return {
    isRegistering,
    isRegistered,
    attendeeCount,
    error,
    incrementAttendees,
    decrementAttendees,
    registerForEvent,
    cancelRegistration,
    canRegister: registration.isOpen && !isRegistered,
  };
}
