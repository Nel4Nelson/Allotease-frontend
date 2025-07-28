import React from "react";
import { useEventFormStore } from "@/stores/event-form-store";
import { CategoryTag } from "@/components/ui/category-tag";

interface EventCategoriesProps {
  className?: string;
}

export function EventCategories({ className = "" }: EventCategoriesProps) {
  const { formData } = useEventFormStore();
  
  // Get categories or show placeholder
  const categories = formData.categories && formData.categories.length > 0 
    ? formData.categories 
    : [
        'Nigerian events',
        'Lagos events', 
        'Things to do in Lagos',
        'Lagos spirituality conference',
        'Innovation',
        'Future',
        'Conference',
        'Empowerment'
      ];

  const hasRealData = formData.categories && formData.categories.length > 0;

  return (
    <div className={className}>
      {/* Section Title */}
      <h3 className="text-[var(--Title,#1F2024)] font-space-grotesk text-xl font-bold leading-[140%] tracking-[-0.4px] mb-4">
        Categories
      </h3>
      
      {/* Category Tags */}
      <div className="flex flex-wrap gap-3">
        {categories.map((category, index) => (
          <CategoryTag
            key={hasRealData ? category : `placeholder-${index}`}
            label={category}
            className={!hasRealData ? 'text-gray-400 bg-gray-100' : ''}
          />
        ))}
      </div>
      
      {/* Placeholder Notice */}
      {!hasRealData && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 font-source-sans-pro">
            <strong>Preview Mode:</strong> Add categories in the event creation form to see your actual event categories here.
          </p>
        </div>
      )}
    </div>
  );
}