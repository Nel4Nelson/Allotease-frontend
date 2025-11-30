import { create } from "zustand";

export type SearchContext = "stays" | "events" | "allocators" | null;

interface SearchState {
  searchQuery: string;
  activeContext: SearchContext;
  setSearchQuery: (query: string) => void;
  setActiveContext: (context: SearchContext) => void;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  searchQuery: "",
  activeContext: null,

  setSearchQuery: (query: string) =>
    set({ searchQuery: query }),

  setActiveContext: (context: SearchContext) =>
    set({ activeContext: context }),

  clearSearch: () =>
    set({ searchQuery: "" }),
}));