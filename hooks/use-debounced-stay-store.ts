import { useCallback, useMemo } from "react";
import { debounce } from "lodash";
import { useStaysFormStore } from "@/stores/stay-form-store";
import type { StaysFormData, UnitData } from "@/components/features/create/stays-form";
import type { FacilityDetail } from "@/stores/stay-form-store";

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
    
    // Validation
    isFormComplete,
    getMissingFields,
    
    // Other store actions
    ...storeActions,
  };
};