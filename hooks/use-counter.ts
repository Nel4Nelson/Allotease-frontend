"use client";
import { useState, useCallback } from "react";

interface UseCounterProps {
  initialValue?: number;
  min?: number;
  max?: number;
}

export function useCounter({
  initialValue = 1,
  min = 1,
  max = 10,
}: UseCounterProps = {}) {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount((prev) => Math.min(prev + 1, max));
  }, [max]);

  const decrement = useCallback(() => {
    setCount((prev) => Math.max(prev - 1, min));
  }, [min]);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  const setValue = useCallback(
    (value: number) => {
      setCount(Math.max(min, Math.min(max, value)));
    },
    [min, max]
  );

  return {
    count,
    increment,
    decrement,
    reset,
    setValue,
    canIncrement: count < max,
    canDecrement: count > min,
  };
}
