/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { CategoryTagIcon } from "../icons";

interface CategorySelectorProps {
  value?: string[];
  onChange?: (categories: string[]) => void;
  error?: string;
  required?: boolean;
}

// Predefined event categories/tags
const EVENT_CATEGORIES = [
  { value: "Entertainment & Lifestyle", label: "Entertainment & Lifestyle" },
  { value: "Education & Learning", label: "Education & Learning" },
  { value: "Business & Networking", label: "Business & Networking" },
  { value: "Sports & Recreation", label: "Sports & Recreation" },
  { value: "Community & Culture", label: "Community & Culture" },
  { value: "Tech", label: "Tech" },
] as const;

export function CategorySelector({
  value = [],
  onChange,
  error,
  required = false,
}: CategorySelectorProps) {
  const handleCategoryToggle = (categoryValue: string) => {
    if (value.includes(categoryValue)) {
      // Remove category if already selected
      const newSelection = value.filter((v) => v !== categoryValue);
      onChange?.(newSelection);
    } else {
      // Add category if not selected
      const newSelection = [...value, categoryValue];
      onChange?.(newSelection);
    }
  };

  return (
    <div className="space-y-4">
      {/* Categories Grid */}
      <div className="flex flex-wrap gap-3">
        {EVENT_CATEGORIES.map((category) => {
          const isSelected = value.includes(category.value);

          return (
            <button
              key={category.value}
              type="button"
              onClick={() => handleCategoryToggle(category.value)}
              className={`flex items-center justify-center gap-2.5 px-4 py-2 rounded-[54px] transition-all ${
                isSelected
                  ? "bg-[var(--feature-accent-orange)] text-white"
                  : "bg-[#F2F4F7] text-[var(--color-dark-slate)] hover:bg-gray-200"
              }`}
            >
              <CategoryTagIcon />
              <span className="font-source-sans-pro text-sm font-normal leading-normal">
                {category.label}
              </span>
              
              {/* Checkmark icon for selected categories */}
              {isSelected && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-1"
                >
                  <path
                    d="M13.3327 4L5.99935 11.3333L2.66602 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected count indicator */}
      {value.length > 0 && (
        <div className="text-sm text-gray-600">
          {value.length} {value.length === 1 ? "category" : "categories"} selected
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="text-red-500 text-sm font-source-sans-pro mt-2" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}