import {
  CheckIcon,
  Combobox,
  ComboboxChevron,
  ComboboxDropdown,
  ComboboxOption,
  ComboboxOptions,
  ComboboxTarget,
  Container,
  Group,
  InputBase,
  InputPlaceholder,
  Text,
  useCombobox,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const ProductSpecifications = ({
  getProduct,
  product,
  allProducts,
}: any) => {
  const router = useRouter();

  const [allSizes, setAllSizes] = useState<any[]>([]);
  const [value, setValue] = useState<string | null>(product?.size ?? null);
  const [selectedQuality, setSelectedQuality] = useState<string | null>(
    product?.quality ?? null
  );

  const [isSizeChangedByUser, setIsSizeChangedByUser] = useState(false);
  const [isQualityChangedByUser, setIsQualityChangedByUser] = useState(false);

  const [qualityOptions, setQualityOptions] = useState<any[]>([]);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: (eventSource) => {
      if (eventSource === "keyboard") {
        combobox.selectActiveOption();
      } else {
        combobox.updateSelectedOptionIndex("active");
      }
    },
  });

  const qualityCombobox = useCombobox({
    onDropdownClose: () => qualityCombobox.resetSelectedOption(),
    onDropdownOpen: (eventSource) => {
      if (eventSource === "keyboard") {
        qualityCombobox.selectActiveOption();
      } else {
        qualityCombobox.updateSelectedOptionIndex("active");
      }
    },
  });

  const handleSizeChange = (val: any) => {
    setValue(val);
    setIsSizeChangedByUser(true);
  };

  const handleQualityChange = (val: any) => {
    setSelectedQuality(val);
    setIsQualityChangedByUser(true);
  };

  useEffect(() => {
    const isTriggeredByUser = isSizeChangedByUser || isQualityChangedByUser;

    if (!isTriggeredByUser || !allProducts || !value || !selectedQuality)
      return;

    const newProduct = allProducts.find((item: any) => {
      return item?.size === value && item?.quality === selectedQuality;
    });

    if (newProduct?.id) {
      getProduct(newProduct.id);
      router.push(`/product-details?id=${newProduct.id}`);
    }

    setIsSizeChangedByUser(false);
    setIsQualityChangedByUser(false);
  }, [value, selectedQuality, allProducts]);

  useEffect(() => {
    if (product?.size) setValue(product.size.toString());
    if (product?.quality) setSelectedQuality(product.quality.toString());
  }, [product?.size, product?.quality]);

  useEffect(() => {
    const sizes = allProducts
      ?.map((item: any) => item?.size)
      .filter((size: any) => size != null);

    const uniqueSizes = Array.from(new Set(sizes));
    const allSize = uniqueSizes.map((size: any) => ({
      label: size.toString(),
      value: size.toString(),
    }));

    setAllSizes(allSize);

    const filteredBySize = value
      ? allProducts?.filter((item: any) => item?.size === value)
      : allProducts;

    const qualities = filteredBySize
      ?.map((item: any) => item?.quality)
      .filter((q: any) => q != null);

    const uniqueQualities = Array.from(new Set(qualities));
    const qualityList = uniqueQualities.map((q: any) => ({
      label: q.toString(),
      value: q.toString(),
    }));

    setQualityOptions(qualityList);
  }, [allProducts]);

  useEffect(() => {
    if (!value || !allProducts) return;

    const filteredBySize = allProducts.filter(
      (item: any) => item?.size === value
    );

    const qualities = filteredBySize
      .map((item: any) => item?.quality)
      .filter((q: any) => q != null);

    const uniqueQualities = Array.from(new Set(qualities));
    const qualityList = uniqueQualities.map((q: any) => ({
      label: q.toString(),
      value: q.toString(),
    }));

    setQualityOptions(qualityList);

    if (!qualities.includes(selectedQuality)) {
      setSelectedQuality(null);
    }
  }, [value, allProducts]);

  return (
    <Container className="p-4">
      <div className="text-md flex flex-col gap-12">
        <div className="flex flex-row justify-between items-center">
          <div className="font-semibold">Stone</div>
          <Text>{product?.collection_slug}</Text>
        </div>

        <div className="flex flex-row justify-between items-center">
          <div className="font-semibold">Shape</div>
          <Text>{product?.shape}</Text>
        </div>

        <div className="flex flex-row justify-between items-center">
          <div className="font-semibold">Size</div>
          <Combobox
            store={combobox}
            resetSelectionOnOptionHover
            onOptionSubmit={handleSizeChange}
          >
            <ComboboxTarget targetType="button">
              <InputBase
                onChange={handleSizeChange}
                component="button"
                type="button"
                pointer
                rightSection={<ComboboxChevron />}
                rightSectionPointerEvents="none"
                onClick={() => combobox.toggleDropdown()}
                className="w-40"
              >
                {allSizes.find((item) => item.value === value)?.label || (
                  <InputPlaceholder>Select size</InputPlaceholder>
                )}
              </InputBase>
            </ComboboxTarget>

            <ComboboxDropdown>
              <ComboboxOptions>
                {allSizes.map((item) => (
                  <ComboboxOption value={item.value} key={item.value}>
                    <Group gap="xs">
                      {item.value === value && <CheckIcon size={12} />}
                      <span>{item.label}</span>
                    </Group>
                  </ComboboxOption>
                ))}
              </ComboboxOptions>
            </ComboboxDropdown>
          </Combobox>
        </div>

        <div className="flex flex-row justify-between items-center">
          <div className="font-semibold">Color</div>
          <div
            className={`text-${
              product?.color?.toLowerCase() === "purple"
                ? "violet-800"
                : product?.color?.toLowerCase()
            } font-bold`}
          >
            {product?.color}
          </div>
        </div>

        <div className="flex flex-row justify-between items-center">
          <div className="font-semibold">Quality</div>
          <Combobox
            store={qualityCombobox}
            resetSelectionOnOptionHover
            onOptionSubmit={handleQualityChange}
          >
            <ComboboxTarget targetType="button">
              <InputBase
                component="button"
                className="w-40"
                type="button"
                pointer
                rightSection={<ComboboxChevron />}
                rightSectionPointerEvents="none"
                onClick={() => qualityCombobox.toggleDropdown()}
              >
                {qualityOptions.find((item) => item.value === selectedQuality)
                  ?.label || (
                  <InputPlaceholder>Select quality</InputPlaceholder>
                )}
              </InputBase>
            </ComboboxTarget>

            <ComboboxDropdown>
              <ComboboxOptions>
                {qualityOptions.map((item) => (
                  <ComboboxOption value={item.value} key={item.value}>
                    <Group gap="xs">
                      {item.value === selectedQuality && (
                        <CheckIcon size={12} />
                      )}
                      <span>{item.label}</span>
                    </Group>
                  </ComboboxOption>
                ))}
              </ComboboxOptions>
            </ComboboxDropdown>
          </Combobox>
        </div>

        <div className="flex flex-row justify-between items-center">
          <div className="font-semibold">Cut</div>
          <Text>{product?.cut}</Text>
        </div>

        <div className="flex flex-row justify-between items-center">
          <div className="font-semibold">CT. Weight</div>
          <Text>{product?.ct_weight}</Text>
        </div>
      </div>
    </Container>
  );
};
