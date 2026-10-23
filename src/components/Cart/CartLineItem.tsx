"use client";

import { Checkbox, Image, NumberInput } from "@mantine/core";
import {
  IconInfoCircle,
  IconMinus,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { formatCartWeight, isLabGrown } from "@/utils/priceHelpers";

const CERTIFICATION_FEE = 75;
const MAX_CARAT_WEIGHT = 100; // mirrors the 1–100 ct options on the product page

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const formatUSD = (n: number) => usd.format(Number.isFinite(n) ? n : 0);

const formatCt = (n: number | string | undefined | null) =>
  `${formatCartWeight(n as any)} ct`;

const KIND_LABEL: Record<string, string> = {
  stone: "Calibrated gemstone",
  freeSizeStone: "Free-size gemstone",
  layouts: "Layout",
  bead: "Beads",
  ringJewelry: "Ring",
  necklaceJewelry: "Necklace",
  braceletJewelry: "Bracelet",
  earringJewelry: "Earrings",
};

type Spec = { label: string; value: string };

/** Labelled, unit-bearing attributes — replaces the old "Size: x | Weight: y" run-on line. */
const getSpecs = (p: any, byCarat: boolean, quantity: number): Spec[] => {
  const specs: Spec[] = [];
  const push = (label: string, value: any) => {
    if (value !== undefined && value !== null && value !== "") {
      specs.push({ label, value: String(value) });
    }
  };

  switch (p?.productType) {
    case "stone": {
      push("Size", p.size);
      // "each" removes the ambiguity between one stone's weight and the weight you're buying
      if (p.ct_weight) {
        push(
          "Stone weight",
          byCarat || quantity > 1 ? `${formatCt(p.ct_weight)} each` : formatCt(p.ct_weight),
        );
      }
      if (!isLabGrown(p)) push("Quality", p.quality);
      push("Color", p.color);
      const showEmeraldShade = p.collection_slug === "Emerald" && p.shade;
      const showSapphireShade =
        p.collection_slug === "Sapphire" && p.color === "Blue" && !isLabGrown(p) && p.shade;
      if (showEmeraldShade || showSapphireShade) push("Shade", p.shade);
      break;
    }
    case "freeSizeStone":
      push("Size", p.size);
      if (p.ct_weight) push("Weight", formatCt(p.ct_weight));
      push("Color", p.color);
      break;
    case "layouts":
      push("Stone size", p.size);
      if (p.ct_weight) push("Weight", formatCt(p.ct_weight));
      push("Stone count", p.stoneCount);
      push("Quality", p.quality);
      break;
    case "bead":
      push("Stone size", p.size);
      break;
    case "ringJewelry":
      push("Gold", p.goldColor);
      push("Ring size", p.size);
      break;
    case "necklaceJewelry":
      push("Gold", p.goldColor);
      push("Length", p.length);
      push("Gemstone size", p.size);
      break;
    case "braceletJewelry":
      push("Gold", p.goldColor);
      push("Length", p.length);
      break;
    case "earringJewelry":
      push("Gold", p.goldColor);
      if (p.totalCaratWeight) push("Total weight", `${p.totalCaratWeight} ct`);
      push("Stone", p.gemstone);
      break;
  }
  return specs;
};

/** − value + control. Same component for quantity and carat weight so both feel identical. */
function Stepper({
  value,
  min,
  max,
  suffix,
  label,
  onChange,
}: {
  value: number;
  min: number;
  max?: number;
  suffix?: string;
  label: string;
  onChange: (n: number) => void;
}) {
  const atMin = value <= min;
  const atMax = max !== undefined && value >= max;
  const btn =
    "grid h-9 w-9 place-items-center text-gray-700 transition-[transform,color,background-color] duration-100 ease-out " +
    "hover:bg-gray-100 active:scale-[0.94] disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent " +
    "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#0b182d]";

  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex h-9 items-center overflow-hidden rounded-lg border border-gray-300 bg-white"
    >
      <button
        type="button"
        className={btn}
        disabled={atMin}
        aria-label={`Decrease ${label.toLowerCase()}`}
        onClick={() => {
          const next = Number.isInteger(value) ? value - 1 : Math.floor(value);
          onChange(Math.max(min, next));
        }}
      >
        <IconMinus size={14} stroke={2} />
      </button>
      <NumberInput
        variant="unstyled"
        hideControls
        aria-label={label}
        value={value}
        min={min}
        max={max}
        suffix={suffix}
        allowDecimal={!Number.isInteger(min)}
        decimalScale={Number.isInteger(min) ? 0 : 2}
        allowNegative={false}
        clampBehavior="strict"
        onChange={(v) => {
          if (typeof v === "number" && v >= min) onChange(v);
        }}
        styles={{
          input: {
            width: suffix ? 64 : 44,
            height: 34,
            minHeight: 34,
            padding: 0,
            textAlign: "center",
            fontSize: 15,
            fontWeight: 500,
            fontVariantNumeric: "tabular-nums",
          },
        }}
      />
      <button
        type="button"
        className={btn}
        disabled={atMax}
        aria-label={`Increase ${label.toLowerCase()}`}
        onClick={() => {
          const next = Number.isInteger(value) ? value + 1 : Math.ceil(value);
          const safeNext = next <= value ? value + 1 : next;
          onChange(max !== undefined ? Math.min(max, safeNext) : safeNext);
        }}
      >
        <IconPlus size={14} stroke={2} />
      </button>
    </div>
  );
}

/** One labelled cell of the price equation. Stacks label/value on mobile rows, columns on desktop. */
function EquationCell({
  label,
  children,
  align = "left",
}: {
  label: string;
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <div
      className={`flex min-w-0 items-center justify-between gap-3 sm:block ${
        align === "right" ? "sm:text-right" : ""
      }`}
    >
      <div className="text-xs text-gray-500 sm:mb-1">{label}</div>
      <div className="text-[15px] font-medium text-gray-900 tabular-nums">{children}</div>
    </div>
  );
}

const Operator = ({ children }: { children: React.ReactNode }) => (
  <span aria-hidden className="hidden pb-1.5 text-lg leading-none text-gray-400 sm:block">
    {children}
  </span>
);

export function CartLineItem({
  value,
  onOpenProduct,
  onRemove,
  onRequestPricing,
  onQuantityChange,
  onCaratWeightChange,
  onToggleCertification,
}: {
  value: any;
  onOpenProduct: () => void;
  onRemove: () => void;
  onRequestPricing: () => void;
  onQuantityChange: (n: number) => void;
  onCaratWeightChange: (n: number) => void;
  onToggleCertification: (checked: boolean) => void;
}) {
  const p = value?.product ?? {};
  const isStoneLike = p.productType === "stone" || p.productType === "freeSizeStone";
  const byCarat = isStoneLike && !!p.purchaseByCarat;
  const quantity = Number(value?.quantity) || 1;

  const unitPrice = Number(p.price) || 0;
  const displayPrice = value?.jewelryProduct?.price ?? p.price;
  const needsQuote = Number(displayPrice) === 0;

  // Calibrated stones: the buyer chooses the carat weight. Free-size stones: one unique
  // stone, so the "amount" is that stone's own weight and isn't editable.
  const caratAmount = byCarat
    ? p.productType === "stone"
      ? Number(value?.caratWeight) || 0
      : Number(p.ct_weight) || 0
    : 0;

  const stoneWeight = Number(p.ct_weight) || 0;
  const minCarat = stoneWeight > 1 ? Number(stoneWeight.toFixed(2)) : 1;
  const safeCaratAmount = byCarat && p.productType === "stone" && caratAmount > 0 && caratAmount < minCarat
    ? minCarat
    : caratAmount;
  const requestedCarats = Number(value?.requestedCarats) || safeCaratAmount;

  const merchandise = byCarat ? unitPrice * safeCaratAmount : unitPrice * quantity;
  const certFee = p.needCertification
    ? CERTIFICATION_FEE * (byCarat ? 1 : quantity)
    : 0;
  const itemTotal = merchandise + certFee;

  const totalWeight =
    isStoneLike && !byCarat && stoneWeight > 0 && quantity > 1
      ? Number((stoneWeight * quantity).toFixed(3))
      : null;

  const title = p.collection_slug ? `${p.collection_slug} ${p.shape ?? ""}`.trim() : p.title;
  const kind = KIND_LABEL[p.productType] ?? "Item";
  const origin = isStoneLike && p.type ? (isLabGrown(p) ? "Lab Grown" : "Natural") : null;
  const specs = getSpecs(p, byCarat, quantity);

  const priceLabel = byCarat ? "Price per carat" : isStoneLike ? "Price per stone" : "Price";
  const priceSuffix = byCarat ? " / ct" : isStoneLike ? " / stone" : " each";
  const amountLabel = byCarat
    ? p.productType === "stone"
      ? "Carat weight"
      : "Stone weight"
    : "Quantity";

  return (
    <article
      className="rounded-2xl border p-4 sm:p-5 border-gray-200 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
    >
      <div className="grid grid-cols-[72px_minmax(0,1fr)] gap-x-4 gap-y-3 sm:grid-cols-[104px_minmax(0,1fr)] sm:gap-x-5 sm:gap-y-2.5">
        {/* Image */}
        <button
          type="button"
          onClick={onOpenProduct}
          className="self-start overflow-hidden rounded-xl bg-gray-50 transition-transform duration-150 ease-out active:scale-[0.97] sm:row-span-2"
          aria-label={`View ${title}`}
        >
          <Image
            loading="lazy"
            src={value?.jewelryProduct?.image_url ?? p.image_url}
            alt={title}
            className="aspect-square h-full w-full"
            fit="cover"
          />
        </button>

        {/* Identity: what is this? */}
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-gray-500">
                  {kind}
                </span>
                {origin && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      origin === "Lab Grown"
                        ? "bg-indigo-50 text-indigo-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {origin}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={onOpenProduct}
                className="mt-0.5 text-left text-[17px] font-semibold leading-snug tracking-[-0.01em] text-gray-900 hover:underline hover:underline-offset-4"
              >
                {title}
              </button>
            </div>

            <button
              type="button"
              onClick={onRemove}
              className="-mr-2 inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-gray-500 transition-[transform,color,background-color] duration-100 ease-out hover:bg-red-50 hover:text-red-600 active:scale-[0.97]"
              aria-label={`Remove ${title} from cart`}
            >
              <IconTrash size={16} stroke={1.75} />
              <span className="hidden sm:inline">Remove</span>
            </button>
          </div>

          {specs.length > 0 && (
            <dl className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {specs.map((s) => (
                <div key={s.label} className="flex items-baseline gap-1.5">
                  <dt className="text-gray-500">{s.label}</dt>
                  <dd className="font-medium capitalize text-gray-800">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {/* Price: how is the total calculated? Full-width on mobile, under the text on desktop. */}
        <div className="col-span-2 sm:col-span-1 sm:col-start-2">
          <div className="rounded-xl bg-gray-50 p-3 sm:p-4">
            {needsQuote ? (
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-gray-600">Pricing for this item is quoted on request.</span>
                <button
                  type="button"
                  onClick={onRequestPricing}
                  className="shrink-0 rounded-lg bg-[#0b182d] px-3 py-1.5 text-sm font-medium text-white transition-transform duration-100 ease-out active:scale-[0.97]"
                >
                  Request pricing
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-end sm:gap-4">
                  <EquationCell label={priceLabel}>
                    {formatUSD(unitPrice)}
                    <span className="font-normal text-gray-500">{priceSuffix}</span>
                  </EquationCell>

                  <Operator>×</Operator>

                  <EquationCell label={amountLabel}>
                    {byCarat && p.productType !== "stone" ? (
                      formatCt(caratAmount)
                    ) : byCarat ? (
                      <Stepper
                        label="Carat weight"
                        value={requestedCarats}
                        min={minCarat}
                        max={Math.max(MAX_CARAT_WEIGHT, requestedCarats)}
                        suffix=" ct"
                        onChange={onCaratWeightChange}
                      />
                    ) : (
                      <Stepper
                        label="Quantity"
                        value={quantity}
                        min={1}
                        onChange={onQuantityChange}
                      />
                    )}
                  </EquationCell>

                  <Operator>=</Operator>

                  <EquationCell label={certFee ? "Subtotal" : "Item total"} align="right">
                    <span
                      aria-live="polite"
                      className={certFee ? "" : "text-base font-semibold text-[#0b182d]"}
                    >
                      {formatUSD(merchandise)}
                    </span>
                  </EquationCell>
                </div>

                {((byCarat && p.productType === "stone" && stoneWeight > 0) || totalWeight) && (
                  <p className="mt-3 flex items-start gap-1.5 text-xs leading-relaxed text-gray-500">
                    <IconInfoCircle size={14} className="mt-px shrink-0" />
                    {byCarat && p.productType === "stone" && stoneWeight > 0 ? (
                      <span>
                        <span className="font-medium text-gray-700">
                          {quantity} stone{quantity > 1 ? "s" : ""}
                        </span>{" "}
                        at {formatCt(stoneWeight)} each ={" "}
                        <span className="font-medium text-gray-700">{formatCt(safeCaratAmount)} total</span>
                        {requestedCarats !== safeCaratAmount ? (
                          <span className="text-gray-500"> (closest whole match for {formatCt(requestedCarats)} requested)</span>
                        ) : null}
                        .
                      </span>
                    ) : (
                      <span>
                        Total weight{" "}
                        <span className="font-medium text-gray-700">≈ {formatCt(totalWeight)}</span>{" "}
                        ({quantity} × {formatCt(stoneWeight)})
                      </span>
                    )}
                  </p>
                )}

                {certFee > 0 && (
                  <div className="mt-3 space-y-1.5 border-t border-gray-200 pt-3 text-sm tabular-nums">
                    <div className="flex items-center justify-between gap-3 text-gray-600">
                      <span>
                        Certification
                        {!byCarat && quantity > 1 && (
                          <span className="text-gray-400">
                            {" "}
                            · {formatUSD(CERTIFICATION_FEE)} × {quantity}
                          </span>
                        )}
                      </span>
                      <span>+{formatUSD(certFee)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-gray-900">Item total</span>
                      <span aria-live="polite" className="text-base font-semibold text-[#0b182d]">
                        {formatUSD(itemTotal)}
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <Checkbox
            color="#0b182d"
            size="sm"
            mt="sm"
            checked={!!p.needCertification}
            onChange={(e) => onToggleCertification(e.currentTarget.checked)}
            label={
              <span className="text-sm text-gray-600">
                Add certification{" "}
                <span className="text-gray-400">
                  {byCarat
                    ? `(+${formatUSD(CERTIFICATION_FEE)} for this lot)`
                    : quantity > 1
                      ? `(+${formatUSD(CERTIFICATION_FEE)} per piece)`
                      : `(+${formatUSD(CERTIFICATION_FEE)})`}
                </span>
              </span>
            }
          />
        </div>
      </div>
    </article>
  );
}
