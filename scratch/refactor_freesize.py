import re

with open('src/components/FreeSizeGemtones/FreeSizeGridView.tsx', 'r') as f:
    code = f.read()

# Add useSearchParams
code = code.replace(
    'import { useRouter } from "next/navigation";',
    'import { useRouter, useSearchParams } from "next/navigation";'
)
code = code.replace(
    'import { useEffect, useState } from "react";',
    'import { useEffect, useState, useRef } from "react";'
)

# Insert sync logic after isMobile definition
target = 'const isMobile = useMediaQuery("(max-width: 1024px)");'

new_logic = '''  const isMobile = useMediaQuery("(max-width: 1024px)");

  const searchParams = useSearchParams();
  const currentFiltersStr = searchParams.get("filters");
  const isInitialized = useRef(false);

  // 1. Sync URL -> State
  useEffect(() => {
    if (allItems.length === 0) return;

    if (currentFiltersStr) {
      try {
        const parsed = JSON.parse(decodeURIComponent(currentFiltersStr));
        if (parsed.searchValue !== undefined) setSearchValue(parsed.searchValue);
        if (parsed.selectedGem !== undefined) setSelectedGem(parsed.selectedGem);
        if (parsed.sortOrder !== undefined) setSortOrder(parsed.sortOrder);
        if (parsed.viewMode !== undefined) setViewMode(parsed.viewMode);
        isInitialized.current = true;
        return;
      } catch (e) {
        console.error("Failed to parse FreeSize filters from URL");
      }
    }

    if (!isInitialized.current) {
      // Just initialize once
      isInitialized.current = true;
    }
  }, [allItems, currentFiltersStr]);

  // 2. Sync State -> URL
  useEffect(() => {
    if (!isInitialized.current) return;

    const state = {
      searchValue,
      selectedGem,
      sortOrder,
      viewMode
    };
    
    const newFiltersStr = encodeURIComponent(JSON.stringify(state));
    
    if (newFiltersStr !== currentFiltersStr) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("filters", newFiltersStr);
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [
    searchValue,
    selectedGem,
    sortOrder,
    viewMode,
    currentFiltersStr,
    router,
    searchParams
  ]);'''

if target in code:
    code = code.replace(target, new_logic)
    with open('src/components/FreeSizeGemtones/FreeSizeGridView.tsx', 'w') as f:
        f.write(code)
    print("Successfully added URL sync to FreeSizeGridView.tsx")
else:
    print("Could not find the target block in FreeSizeGridView.tsx")

