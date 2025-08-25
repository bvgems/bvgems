import { Button, NumberInput, NumberInputHandlers } from "@mantine/core";
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
    // recalcTotal(product, qty, caratWeight);
  };

  const handleCaratWeightChanges = (value: number) => {
    const minWeight = product?.ct_weight || 0.01;
    const ctw = Number(value) || minWeight;

    if (ctw < minWeight) {
      setCaratError(`Minimum carat weight is ${minWeight} ct`);
      setCaratWeight(minWeight);
    } else {
      setCaratError(null);
      setCaratWeight(ctw);
    }

    // recalcTotal(product, quantity, Math.max(minWeight, ctw));
  };
  return purchaseByCarat ? (
    <div className="flex items-center justify-between gap-2 mt-3">
      <div>Carat Weight:</div>
      <NumberInput
        value={caratWeight}
        onChange={(value: any) => handleCaratWeightChanges(value)}
        min={product?.ct_weight || 0.01}
        step={0.01}
        error={caratError}
      />
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
