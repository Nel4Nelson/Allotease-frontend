import { useCallback, useMemo } from "react";
import { debounce } from "lodash";
import { useEventFormStore } from "@/stores/event-form-store";
import type { EventsFormData } from "@/components/features/create/events-form";

export const useDebouncedFormStore = () => {
  const {
    formData,
    hasImage,
    updateFormData: immediateUpdate,
    setHasImage,
    isFormComplete,
    getMissingFields,
    ...storeActions
  } = useEventFormStore();

  // Create debounced update function
  const debouncedUpdate = useMemo(
    () =>
      debounce((data: Partial<EventsFormData>) => {
        immediateUpdate(data);
      }, 500), // 500ms delay
    [immediateUpdate]
  );

  // Immediate update for files and critical actions
  const updateFormDataImmediate = useCallback(
    (data: Partial<EventsFormData>) => {
      immediateUpdate(data);
      
      // Track image state when image data changes
      if (data.image !== undefined) {
        setHasImage(data.image.length > 0);
      }
    },
    [immediateUpdate, setHasImage]
  );

  // Debounced update for text inputs
  const updateFormDataDebounced = useCallback(
    (data: Partial<EventsFormData>) => {
      debouncedUpdate(data);
    },
    [debouncedUpdate]
  );

  return {
    formData,
    hasImage,
    updateFormDataDebounced,
    updateFormDataImmediate,
    isFormComplete,
    getMissingFields,
    ...storeActions,
  };
};