// components/ui/SearchHeader.tsx
"use client";

import React, { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Export } from "phosphor-react";

type SearchHeaderProps = {
  onSearch: (value: string) => void;
  showSort?: boolean;
  showExport?: boolean;
  sortOptions?: string[];
  onSortChange?: (option: string) => void;
  onExport?: () => void;
};

const SearchHeader: React.FC<SearchHeaderProps> = ({
  onSearch,
  showSort = true,
  showExport = false,
  sortOptions = ["Time", "Date", "Price"],
  onSortChange,
  onExport,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedSort, setSelectedSort] = useState(sortOptions[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  };

  const handleSortSelect = (option: string) => {
    setSelectedSort(option);
    setDropdownOpen(false);
    onSortChange?.(option);
  };

  return (
    <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 font-source">
      {/* Search Input */}
      <div className="relative w-full md:max-w-xs">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71727A]"
          size={18}
        />
        <input
          type="text"
          placeholder="Search by address"
          value={searchValue}
          onChange={handleSearchChange}
          className="w-full bg-white border border-[#8AAEA433] text-[#71727A] placeholder-[#71727A] pl-10 pr-4 py-2 rounded-full font-medium text-sm  md:text-base focus:outline-none"
        />
      </div>

      {/* Right Buttons */}
      <div className="flex gap-3 flex-wrap">
        {showSort && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 border border-[#8AAEA433] text-[#1F3A3A] font-semibold md:font-bold md:text-md px-4 py-2 rounded-full cursor-pointer"
            >
              Sort By: {selectedSort}
              <ChevronDown size={18} color="#71727A" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-[#8AAEA433] rounded-md shadow z-10">
                {sortOptions.map((option) => (
                  <div
                    key={option}
                    onClick={() => handleSortSelect(option)}
                    className="px-4 py-2 hover:bg-[#F2F4F780] text-[#1F3A3A] cursor-pointer text-sm"
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {showExport && (
          <button
            onClick={onExport}
            className="flex items-center gap-2 border border-[#8AAEA433] text-[#1F3A3A] font-semibold md:font-bold md:text-md px-4 py-2 rounded-full cursor-pointer"
          >
            Export Table
            <Export size={18} color="#71727A" />{" "}
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchHeader;
