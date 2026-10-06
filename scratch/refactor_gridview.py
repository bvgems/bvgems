import re

with open('src/components/GridView/GridView.tsx', 'r') as f:
    code = f.read()

# Replace the existing searchParams useEffect
old_effect = '''  // Apply Search Params whenever URL changes (once data is loaded)
  useEffect(() => {
    if (searchItems.length > 0) {
      const initShape = searchParams.get("shape");
      const initColor = searchParams.get("color");
      const initType = searchParams.get("type");

      if (initShape) {
        const shapeObj = ShapeFilterList.find(s => s.label.toLowerCase() === initShape.toLowerCase());
        setSelectedShapes(shapeObj ? [shapeObj.value] : []);
      } else {
        setSelectedShapes([]);
      }

      if (initColor) {
        const colorTitle = initColor.charAt(0).toUpperCase() + initColor.slice(1).toLowerCase();
        setSelectedSapphireColors([colorTitle]);
      } else {
        setSelectedSapphireColors([]);
      }

      if (initType) {
        setSelectedTypes([initType]);
      } else {
        setSelectedTypes([]);
      }
      
      // Reset other local filters so it acts as a fresh page load
      setSelectedGems([]);
      setWeight("");
      setSelectedDimensions({});
    }
  }, [searchItems, searchParams]);'''

new_effect = '''  // --- URL State Sync Logic ---
  const currentFiltersStr = searchParams.get("filters");
  const isInitialized = useRef(false);

  // 1. Sync URL -> State (runs on mount and when user clicks Back/Forward)
  useEffect(() => {
    if (searchItems.length === 0) return;

    if (currentFiltersStr) {
      try {
        const parsed = JSON.parse(decodeURIComponent(currentFiltersStr));
        setSelectedGems(parsed.selectedGems || []);
        setSelectedShapes(parsed.selectedShapes || []);
        setSelectedSapphireColors(parsed.selectedSapphireColors || []);
        setSelectedTypes(parsed.selectedTypes || []);
        setWeight(parsed.weight || "");
        setSelectedDimensions(parsed.selectedDimensions || {});
        setToleranceEnabled(parsed.toleranceEnabled || false);
        if (parsed.viewMode) setViewMode(parsed.viewMode);
        isInitialized.current = true;
        return;
      } catch (e) {
        console.error("Failed to parse filters from URL");
      }
    }

    // If no filters in URL (fresh load or navigating from Home)
    if (!isInitialized.current) {
      const initShape = searchParams.get("shape");
      const initColor = searchParams.get("color");
      const initType = searchParams.get("type");

      if (initShape) {
        const shapeObj = ShapeFilterList.find(s => s.label.toLowerCase() === initShape.toLowerCase());
        setSelectedShapes(shapeObj ? [shapeObj.value] : []);
      } else {
        setSelectedShapes([]);
      }

      if (initColor) {
        const colorTitle = initColor.charAt(0).toUpperCase() + initColor.slice(1).toLowerCase();
        setSelectedSapphireColors([colorTitle]);
      } else {
        setSelectedSapphireColors([]);
      }

      if (initType) {
        setSelectedTypes([initType]);
      } else {
        setSelectedTypes([]);
      }

      setSelectedGems([]);
      setWeight("");
      setSelectedDimensions({});
      isInitialized.current = true;
    }
  }, [searchItems, currentFiltersStr]); // Re-run if URL filters change (e.g. Back button)

  // 2. Sync State -> URL (runs when user changes a filter)
  useEffect(() => {
    if (!isInitialized.current) return;

    const state = {
      selectedGems,
      selectedShapes,
      selectedSapphireColors,
      selectedTypes,
      weight,
      selectedDimensions,
      toleranceEnabled,
      viewMode
    };
    
    const newFiltersStr = encodeURIComponent(JSON.stringify(state));
    
    if (newFiltersStr !== currentFiltersStr) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("filters", newFiltersStr);
      // Remove the old query params if we are transitioning to state-based URL
      params.delete("shape");
      params.delete("color");
      params.delete("type");
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [
    selectedGems,
    selectedShapes,
    selectedSapphireColors,
    selectedTypes,
    weight,
    selectedDimensions,
    toleranceEnabled,
    viewMode,
    currentFiltersStr,
    router,
    searchParams
  ]);
  // ----------------------------'''

if old_effect in code:
    code = code.replace(old_effect, new_effect)
    with open('src/components/GridView/GridView.tsx', 'w') as f:
        f.write(code)
    print("Successfully replaced in GridView.tsx")
else:
    print("Could not find the target block in GridView.tsx")

