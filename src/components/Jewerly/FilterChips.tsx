"use client";

import { Badge, Button, Group } from "@mantine/core";

interface FilterChipsProps {
  selectedStones: string[];
  setSelectedStones: (stones: string[]) => void;
  selectedShapes: string[];
  setSelectedShapes: (shapes: string[]) => void;
  selectedTypes: string[];
  setSelectedTypes: (types: string[]) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  defaultPriceRange: [number, number];
}

export const FilterChips = ({
  selectedStones,
  setSelectedStones,
  selectedShapes,
  setSelectedShapes,
  selectedTypes,
  setSelectedTypes,
  priceRange,
  setPriceRange,
  defaultPriceRange,
}: FilterChipsProps) => {
  const hasFilters =
    selectedStones.length > 0 ||
    selectedShapes.length > 0 ||
    selectedTypes.length > 0 ||
    priceRange[0] !== defaultPriceRange[0] ||
    priceRange[1] !== defaultPriceRange[1];

  const removeStone = (stone: string) =>
    setSelectedStones(selectedStones.filter((s) => s !== stone));

  const removeShape = (shape: string) =>
    setSelectedShapes(selectedShapes.filter((s) => s !== shape));

  const removeType = (type: string) =>
    setSelectedTypes(selectedTypes.filter((t) => t !== type));

  const removePrice = () => setPriceRange(defaultPriceRange);

  const clearAll = () => {
    setSelectedStones([]);
    setSelectedShapes([]);
    setSelectedTypes([]);
    setPriceRange(defaultPriceRange);
  };

  if (!hasFilters) return null;

  return (
    <div className="px-5 md:px-8 mt-4 mb-2">
      <Group>
        {selectedStones.map((stone) => (
          <Badge
            key={stone}
            rightSection={<span onClick={() => removeStone(stone)}>✕</span>}
            variant="light"
            color="dark"
            radius="sm"
          >
            Gemstone: {stone}
          </Badge>
        ))}

        {selectedShapes.map((shape) => (
          <Badge
            key={shape}
            rightSection={<span onClick={() => removeShape(shape)}>✕</span>}
            variant="light"
            color="dark"
            radius="sm"
          >
            Shape: {shape}
          </Badge>
        ))}

        {selectedTypes.map((type) => (
          <Badge
            key={type}
            rightSection={<span onClick={() => removeType(type)}>✕</span>}
            variant="light"
            color="dark"
            radius="sm"
          >
            Ring Type: {type}
          </Badge>
        ))}

        {(priceRange[0] !== defaultPriceRange[0] ||
          priceRange[1] !== defaultPriceRange[1]) && (
          <Badge
            rightSection={<span onClick={removePrice}>✕</span>}
            variant="light"
            color="dark"
            radius="sm"
          >
            Price: ${priceRange[0]} - ${priceRange[1]}
          </Badge>
        )}

        <Button variant="subtle" color="red" size="xs" onClick={clearAll}>
          Clear All
        </Button>
      </Group>
    </div>
  );
};
