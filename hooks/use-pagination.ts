"use client";
import { useState, useCallback, useMemo } from "react";

interface UsePaginationProps {
  totalItems: number;
  initialPageSize?: number;
}

export function usePagination({
  totalItems,
  initialPageSize = 6,
}: UsePaginationProps) {
  const [visibleCount, setVisibleCount] = useState(initialPageSize);

  const hasMore = useMemo(
    () => visibleCount < totalItems,
    [visibleCount, totalItems]
  );
  const showingAll = useMemo(
    () => visibleCount >= totalItems,
    [visibleCount, totalItems]
  );

  const showMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + initialPageSize, totalItems));
  }, [initialPageSize, totalItems]);

  const showLess = useCallback(() => {
    setVisibleCount(initialPageSize);
  }, [initialPageSize]);

  const toggleShowMore = useCallback(() => {
    if (showingAll) {
      showLess();
    } else {
      showMore();
    }
  }, [showingAll, showMore, showLess]);

  return {
    visibleCount,
    hasMore,
    showingAll,
    showMore,
    showLess,
    toggleShowMore,
  };
}
