import { useCallback, useMemo } from "react";
import { debounce } from "lodash";
import { useStaysFormStore } from "@/stores/stay-form-store";

import type { FacilityDetail, UnitData } from "@/stores/stay-form-store";
import { StaysFormData } from "@/types/stays-form-schema";

export const useDebouncedStaysFormStore = () => {
  const {
    formData,
    hasImages,
    facilitiesCache,
    updateFormData: immediateUpdate,
    setHasImages,
    
    // Stay-level facilities
    addFacility,
    removeFacility,
    
    // Units management
    addUnit,
    updateUnit,
    removeUnit,
    addUnitFacility,
    removeUnitFacility,
    
    // Cache and getters
    setFacilitiesCache,
    getFacilityFromCache,
    clearFacilitiesCache,
    loadMissingFacilities, // New method for loading missing facilities
    getSelectedFacilities,
    getUnits,
    getUnit,
    isFormComplete,
    getMissingFields,
    ...storeActions
  } = useStaysFormStore();

  // Create debounced update function
  const debouncedUpdate = useMemo(
    () =>
      debounce((data: Partial<StaysFormData>) => {
        immediateUpdate(data);
      }, 500), // 500ms delay
    [immediateUpdate]
  );

  // Immediate update for files and critical actions
  const updateFormDataImmediate = useCallback(
    (data: Partial<StaysFormData>) => {
      immediateUpdate(data);
      
      // Track images state when images data changes
      if (data.images !== undefined) {
        setHasImages(data.images.length > 0);
      }
    },
    [immediateUpdate, setHasImages]
  );

  // Debounced update for text inputs
  const updateFormDataDebounced = useCallback(
    (data: Partial<StaysFormData>) => {
      debouncedUpdate(data);
    },
    [debouncedUpdate]
  );

  // Facility management helpers
  const addFacilityToSelection = useCallback(
    (facilityId: string) => {
      addFacility(facilityId);
    },
    [addFacility]
  );

  const removeFacilityFromSelection = useCallback(
    (facilityId: string) => {
      removeFacility(facilityId);
    },
    [removeFacility]
  );

  // Units management helpers
  const addUnitToStore = useCallback(
    (unit: Omit<UnitData, 'id'>) => {
      addUnit(unit);
    },
    [addUnit]
  );

  const updateUnitInStore = useCallback(
    (unitId: string, updates: Partial<UnitData>) => {
      updateUnit(unitId, updates);
    },
    [updateUnit]
  );

  const removeUnitFromStore = useCallback(
    (unitId: string) => {
      removeUnit(unitId);
    },
    [removeUnit]
  );

  // Unit facilities management
  const addFacilityToUnit = useCallback(
    (unitId: string, facilityId: string) => {
      addUnitFacility(unitId, facilityId);
    },
    [addUnitFacility]
  );

  const removeFacilityFromUnit = useCallback(
    (unitId: string, facilityId: string) => {
      removeUnitFacility(unitId, facilityId);
    },
    [removeUnitFacility]
  );

  const updateFacilitiesCache = useCallback(
    (facilities: FacilityDetail[]) => {
      setFacilitiesCache(facilities);
    },
    [setFacilitiesCache]
  );

  const getFacilityDetails = useCallback(
    (facilityId: string) => {
      return getFacilityFromCache(facilityId);
    },
    [getFacilityFromCache]
  );

  const clearCache = useCallback(() => {
    clearFacilitiesCache();
  }, [clearFacilitiesCache]);

  // Load missing facilities - exposed for components to use
  const loadMissingFacilitiesHelper = useCallback(
    async (facilityIds: string[]) => {
      try {
        await loadMissingFacilities(facilityIds);
      } catch (error) {
        console.error('Failed to load missing facilities:', error);
        throw error;
      }
    },
    [loadMissingFacilities]
  );

  // Get unit-specific data
  const getUnitFacilities = useCallback(
    (unitId: string) => {
      const unit = getUnit(unitId);
      return unit?.facilities || [];
    },
    [getUnit]
  );

  const getUnitById = useCallback(
    (unitId: string) => {
      return getUnit(unitId);
    },
    [getUnit]
  );

  return {
     // Form data
    formData,
    hasImages,
    facilitiesCache,
    
    // Form updates
    updateFormDataDebounced,
    updateFormDataImmediate,
    
    // Stay-level facilities management
    selectedFacilities: getSelectedFacilities(),
    addFacilityToSelection,
    removeFacilityFromSelection,
    
    // Units management
    units: getUnits(),
    addUnitToStore,
    updateUnitInStore,
    removeUnitFromStore,
    getUnitById,
    
    // Unit facilities management
    addFacilityToUnit,
    removeFacilityFromUnit,
    getUnitFacilities,
    
    // Cache management
    updateFacilitiesCache,
    getFacilityDetails,
    clearCache,
    loadMissingFacilities: loadMissingFacilitiesHelper, // Expose the helper method
    
    // Validation
    isFormComplete,
    getMissingFields,
    
    // Other store actions
    ...storeActions,
  };
};