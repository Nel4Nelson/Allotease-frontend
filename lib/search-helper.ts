/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Search helper utilities for managing search across different contexts
 */

export type SearchContext = "stays" | "events" | "allocators" | null;

/**
 * Configuration for search placeholders and API parameter keys
 */
const SEARCH_CONFIG = {
  stays: {
    placeholder: "Search spaces...",
    paramKey: "query",
  },
  events: {
    placeholder: "Search events...",
    paramKey: "query",
  },
  allocators: {
    placeholder: "Search allocation admins...",
    paramKey: "allocatorName",
  },
} as const;

/**
 * Get the appropriate search placeholder text based on context
 */
export function getSearchPlaceholder(context: SearchContext): string {
  if (!context) return "Search...";
  return SEARCH_CONFIG[context].placeholder;
}

/**
 * Get the API parameter key for search based on context
 */
export function getSearchParamKey(context: SearchContext): string {
  if (!context) return "query";
  return SEARCH_CONFIG[context].paramKey;
}

/**
 * Build search parameters for API calls
 * Automatically uses the correct parameter key based on context
 */
export function buildSearchParams<T extends Record<string, any>>(
  baseParams: T,
  searchQuery: string | undefined,
  context: SearchContext
): T {
  if (!searchQuery || searchQuery.trim() === "") {
    return baseParams;
  }

  const paramKey = getSearchParamKey(context);
  
  return {
    ...baseParams,
    [paramKey]: searchQuery.trim(),
  };
}