import { Button, NumberInput, NumberInputHandlers, Select, Text } from "@mantine/core";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import React, { useEffect, useMemo, useRef } from "react";
import { getCaratOptions, getMinCaratWeight } from "@/utils/priceHelpers";

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

  const minWeight = useMemo(() => getMinCaratWeight(product), [product]);
  const caratOptions = useMemo(() => getCaratOptions(product), [product]);

  useEffect(() => {
    if (purchaseByCarat && minWeight > 0) {
      if (!caratWeight || Number(caratWeight) < minWeight) {
        setCaratWeight(minWeight);
        setCaratError(null);
        if (recalcTotal) recalcTotal(product, quantity, minWeight);
      }
    }
  }, [minWeight, purchaseByCarat, product]);

  const handleQuantityChanges = (value: number) => {
    const qty = Math.max(1, Number(value) || 1);
    setQuantity(qty);
    if (recalcTotal) recalcTotal(product, qty, caratWeight);
  };

  const handleCaratWeightChanges = (value: string | null) => {
    if (value) {
      const valNum = Number(value);
      if (valNum < minWeight) {
        setCaratError(`Minimum carat weight is ${minWeight} ct`);
        setCaratWeight(minWeight);
        if (recalcTotal) recalcTotal(product, quantity, minWeight);
      } else {
        setCaratWeight(valNum);
        setCaratError(null);
        if (recalcTotal) recalcTotal(product, quantity, valNum);
      }
    }
  };

  return purchaseByCarat ? (
    <div className="flex flex-col gap-2 mt-3">
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm font-medium text-gray-700">Carat Weight:</div>
        <Select
          data={caratOptions}
          value={String(caratWeight)}
          onChange={handleCaratWeightChanges}
          searchable
          allowDeselect={false}
          className="w-32"
        />
      </div>
      {minWeight > 1 && (
        <Text size="xs" color="dimmed" mt={1}>
          Minimum weight: {minWeight} ct (weight of one stone).
        </Text>
      )}
      <Text size="xs" color="dimmed" mt={minWeight > 1 ? 0 : 2}>
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
