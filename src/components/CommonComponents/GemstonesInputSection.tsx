import { Button, NumberInput, NumberInputHandlers, Select, Text } from "@mantine/core";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import React, { useRef } from "react";

export const GemstonesInputSection = ({
  purchaseByCarat,
  caratWeight,
  product,
  quantity,
  setQuantity,
  caratError,
  setCaratError,
  setCaratWeight,
  recalcTotal,
}: any) => {
  const handlersRef = useRef<NumberInputHandlers>(null);

  const handleQuantityChanges = (value: number) => {
    const qty = Math.max(1, Number(value) || 1);
    setQuantity(qty);
  };

  const handleCaratWeightChanges = (value: string | null) => {
    if (value) {
      setCaratWeight(Number(value));
      setCaratError(null);
    }
  };

  const caratOptions = Array.from({ length: 100 }, (_, i) => String(i + 1));

  return purchaseByCarat ? (
    <div className="flex flex-col gap-2 mt-3">
      <div className="flex items-center justify-between gap-2">
        <div>Carat Weight:</div>
        <Select
          data={caratOptions}
          value={String(caratWeight)}
          onChange={handleCaratWeightChanges}
          searchable
          allowDeselect={false}
          className="w-32"
        />
      </div>
      <Text size="xs" color="dimmed" mt={4}>
        We will deliver the order by using the closest number of stones possible for selected weight. For any other request feel free to contact us.
      </Text>
    </div>
  ) : (
    <div className="flex items-center justify-between gap-2 mt-3">
      <div>Quantity:</div>
      <Button
        onClick={() => handlersRef.current?.decrement()}
        variant="default"
      >
        <IconMinus />
      </Button>
      <NumberInput
        value={quantity}
        onChange={(value: any) => handleQuantityChanges(value)}
        handlersRef={handlersRef}
        min={1}
        hideControls
      />
      <Button
        onClick={() => handlersRef.current?.increment()}
        variant="default"
      >
        <IconPlus />
      </Button>
    </div>
  );
};
