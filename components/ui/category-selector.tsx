import React, { useState, useRef } from "react";
import { FormInput } from "@/components/ui/form-input";
import { CategoryTagIcon } from "../icons";

interface CategorySelectorProps {
  value?: string[]; // Changed from string to string[]
  onChange?: (categories: string[]) => void; // Changed to return array
  error?: string;
  required?: boolean;
}

const initialCategories: { id: string; label: string }[] = [];

export function CategorySelector({
  value = [], // Default to empty array
  onChange,
  error,
  required = false,
}: CategorySelectorProps) {
  const [inputValue, setInputValue] = useState("");
  const [categories, setCategories] = useState(initialCategories);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCategorySelect = (categoryId: string) => {
    // Check if category is already selected
    if (!value.includes(categoryId)) {
      const newSelection = [...value, categoryId];
      onChange?.(newSelection);
    }
    setInputValue(""); // Clear input after selection
  };

  const handleCategoryRemove = (categoryId: string) => {
    // Remove from selection
    const newSelection = value.filter(id => id !== categoryId);
    onChange?.(newSelection);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();

      // Create a new category ID from the input value
      const newCategoryId = inputValue.toLowerCase().replace(/\s+/g, "-");

      // Check if category already exists
      const existingCategory = categories.find(
        (cat) =>
          cat.id === newCategoryId ||
          cat.label.toLowerCase() === inputValue.toLowerCase()
      );

      if (!existingCategory) {
        // Add new category to the list
        const newCategory = { id: newCategoryId, label: inputValue.trim() };
        setCategories((prev) => [...prev, newCategory]);
      }

      // Select the category (existing or new)
      const categoryToSelect = existingCategory || {
        id: newCategoryId,
        label: inputValue.trim(),
      };
      handleCategorySelect(categoryToSelect.id);
    }
  };

 

  // Get category label by ID
  const getCategoryLabel = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.label || categoryId;
  };

  return (
    <div className="space-y-4">
      {/* Input Field */}
      <FormInput
        ref={inputRef}
        label="Enter category"
        placeholder="Enter category*"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        error={error}
        required={required}
        showLabel={false}
      />

      {/* Selected Categories */}
      {value.length > 0 && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {value.map((categoryId) => (
              <div key={categoryId} className="relative group">
                <div className="flex items-center justify-center gap-2.5 px-3 py-1.5 rounded-[54px] bg-[#F2F4F7] text-(--color-dark-slate) font-source-sans-pro text-sm font-normal leading-normal capitalize">
                  <CategoryTagIcon />
                  <span>{getCategoryLabel(categoryId)}</span>
                </div>
                
                {/* Remove button for selected categories */}
                <button
                  type="button"
                  onClick={() => handleCategoryRemove(categoryId)}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-xs leading-none opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
                  aria-label={`Remove ${getCategoryLabel(categoryId)} category`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}