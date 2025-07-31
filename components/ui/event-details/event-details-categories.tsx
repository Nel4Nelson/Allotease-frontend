import React from "react";
import { CategoryTag } from "@/components/ui/category-tag";

interface EventDetailsCategoriesProps {
  tags?: string[];
  className?: string;
}

export function EventDetailsCategories({
  tags,
  className = "",
}: EventDetailsCategoriesProps) {
  // Check if we have tags data
  const hasTagsData = tags && tags.length > 0;

  return (
    <div className={className}>
      {/* Section Title */}
      <h3 className="text-[var(--Title,#1F2024)] font-space-grotesk text-xl font-bold leading-[140%] tracking-[-0.4px] mb-4">
        Categories
      </h3>

      {hasTagsData ? (
        /* Category Tags */
        <div className="flex flex-wrap gap-3">
          {tags.map((tag, index) => (
            <CategoryTag key={`${tag}-${index}`} label={tag} />
          ))}
        </div>
      ) : (
        /* No Data Message */
        <div className="text-center py-6">
          <p className="text-[var(--body-text,#6B7280)] font-source-sans-pro text-base font-normal leading-[142.745%] tracking-[-0.32px]">
            No categories available for this event.
          </p>
        </div>
      )}
    </div>
  );
}
