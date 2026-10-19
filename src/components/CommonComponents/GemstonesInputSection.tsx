import { Button, NumberInput, NumberInputHandlers, Select, Text } from "@mantine/core";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import React, { useEffect, useMemo, useRef } from "react";
import { calculateNearestStones, formatCartWeight, getCaratOptions, getMinCaratWeight, getStoneWeight } from "@/utils/priceHelpers";

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
  const stoneWeight = useMemo(() => getStoneWeight(product), [product]);
  const caratOptions = useMemo(() => getCaratOptions(product), [product]);

  const nearest = useMemo(() => {
    if (!purchaseByCarat || stoneWeight <= 0) return null;
    return calculateNearestStones(stoneWeight, Number(caratWeight) || minWeight);
  }, [purchaseByCarat, stoneWeight, caratWeight, minWeight]);

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
      {nearest && (
        <div className="rounded-md bg-blue-50/70 px-2.5 py-1.5 text-xs text-blue-900 flex items-center justify-between">
          <span>Closest whole stones:</span>
          <span className="font-semibold tabular-nums">
            {nearest.stoneCount} stone{nearest.stoneCount > 1 ? "s" : ""} ({formatCartWeight(nearest.totalCarats)} ct)
          </span>
        </div>
      )}
      {minWeight > 1 && (
        <Text size="xs" color="dimmed" mt={1}>
          Minimum weight: {minWeight} ct (weight of one stone).
        </Text>
      )}
      <Text size="xs" color="dimmed" mt={minWeight > 1 ? 0 : 1}>
        We deliver the order by using the closest whole number of stones possible for your selected weight.
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
