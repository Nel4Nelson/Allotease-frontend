/* eslint-disable react/no-unescaped-entities */
// /components/features/create/events/components/tag-selector.tsx
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { EVENT_CATEGORIES } from "@/types/events";

interface TagSelectorProps {
  value: string[];
  onChange: (tags: string[]) => void;
  error?: string;
}

export function TagSelector({ value, onChange, error }: TagSelectorProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>(value);
  const [customTag, setCustomTag] = useState("");

  const updateTags = (newTags: string[]) => {
    setSelectedTags(newTags);
    onChange(newTags);
  };

  const togglePresetTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      updateTags(selectedTags.filter((t) => t !== tag));
    } else {
      updateTags([...selectedTags, tag]);
    }
  };

  const addCustomTag = () => {
    const tag = customTag.trim();
    if (tag && !selectedTags.includes(tag)) {
      updateTags([...selectedTags, tag]);
      setCustomTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleCustomTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustomTag();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold font-space-grotesk text-[var(--title-color)]">
          Categories
        </h3>
        <p className="text-sm text-[var(--body-text)] font-source-sans-pro">
          This will be your event's title. Your title will be used to help
          create your event's summary, description, category, and tags — so be
          specific!
        </p>
      </div>

      {/* Preset Categories */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-[var(--title-color)] font-source-sans-pro">
          Choose from popular categories:
        </h4>
        <div className="flex flex-wrap gap-2">
          {EVENT_CATEGORIES.map((category) => (
            <button
              key={category.value}
              type="button"
              onClick={() => togglePresetTag(category.label)}
              className={`
                inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium font-source-sans-pro
                transition-all duration-200 border
                ${
                  selectedTags.includes(category.label)
                    ? "bg-[var(--feature-accent-orange)] text-white border-[var(--feature-accent-orange)]"
                    : "bg-white text-[var(--feature-accent-orange)] border-[var(--feature-accent-orange)] hover:bg-[var(--feature-accent-orange)]/5"
                }
              `}
            >
              <span
                className="w-2 h-2 rounded-full mr-2"
                style={{
                  backgroundColor: selectedTags.includes(category.label)
                    ? "white"
                    : category.color,
                }}
              />
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Tag Input */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-[var(--title-color)] font-source-sans-pro">
          Add custom tag:
        </h4>
        <div className="flex gap-2">
          <FormInput
            placeholder="Enter custom tag"
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            onKeyPress={handleCustomTagKeyPress}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={addCustomTag}
            disabled={!customTag.trim()}
            className="whitespace-nowrap"
          >
            Add Tag
          </Button>
        </div>
      </div>

      {/* Selected Tags Display */}
      {selectedTags.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-[var(--title-color)] font-source-sans-pro">
            Selected tags ({selectedTags.length}):
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => {
              const isPreset = EVENT_CATEGORIES.some(
                (cat) => cat.label === tag
              );
              //const category = EVENT_CATEGORIES.find(cat => cat.label === tag);

              return (
                <div
                  key={tag}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium font-source-sans-pro bg-[var(--feature-accent-orange)] text-white"
                >
                  {isPreset && (
                    <span className="w-2 h-2 rounded-full mr-2 bg-white" />
                  )}
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-white hover:text-gray-200 focus:outline-none"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm font-source-sans-pro" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
