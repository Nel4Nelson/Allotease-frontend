"use client";
import { useState, useCallback } from "react";

export function useSearch() {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSearch = useCallback(() => {
    setIsSearchVisible((prev) => !prev);
  }, []);

  const hideSearch = useCallback(() => {
    setIsSearchVisible(false);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    // Add search logic here later
    console.log("Searching for:", query);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  return {
    isSearchVisible,
    searchQuery,
    toggleSearch,
    hideSearch,
    handleSearch,
    clearSearch,
  };
}
