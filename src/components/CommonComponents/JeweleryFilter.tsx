"use client";

import {
  Button,
  Tooltip,
  Image,
  Grid,
  GridCol,
  Autocomplete,
  Text,
  Paper,
} from "@mantine/core";
import { IconInfoCircle, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  title: string;
  categoryOptions: any;
  selected: string;
  setSelected: (label: string) => void;
  isSelect?: boolean;
  error: any;
  clearError: (title: string) => void;
}

export const JeweleryFilter = ({
  title,
  categoryOptions,
  selected,
  setSelected,
  isSelect,
  error,
  clearError,
}: Props) => {
  const [hoveredPattern, setHoveredPattern] = useState<any | null>(null);

  const renderAutocompleteOption: any = ({ option }: any) => {
    const isPattern = title === "Pattern";
    const isHoverable = option?.value !== "custom-details";

    const handleMouseEnter = () => {
      if (isPattern && isHoverable) setHoveredPattern(option);
    };

    const handleMouseLeave = () => {
      if (isPattern) setHoveredPattern(null);
    };

    return (
      <div
        className="flex items-center gap-2.5"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {option?.image ? (
          <Image src={option.image} h={26} w={26} />
        ) : option?.color ? (
          <div
            style={{
              backgroundColor: option.color,
              width: 16,
              height: 16,
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
        ) : isPattern ? (
          <IconPlus color="gray" size={19} />
        ) : null}
        <Text size="sm">{option.label}</Text>
      </div>
    );
  };

  return (
    <div className="relative">
      <Grid className="items-center">
        <GridCol span={{ base: 12, md: 2 }}>
          <div className="h-full flex items-center">
            <h1 className="text-md">{title}</h1>
          </div>
        </GridCol>

        <GridCol span={{ base: 12, md: 10 }}>
          {isSelect ? (
            <>
              <Autocomplete
                onChange={(value) => {
                  setSelected(value);
                  clearError(title);
                }}
                data={categoryOptions}
                renderOption={renderAutocompleteOption}
                maxDropdownHeight={300}
                placeholder={`Select ${title}`}
                clearable
                radius="md"
                classNames={{
                  input:
                    "transition-all duration-300 border-gray-300 focus:border-gray-700 focus:shadow-md hover:shadow-sm placeholder-gray-400",
                }}
                styles={{
                  input: {
                    padding: "10px 14px",
                    fontSize: 14,
                    backgroundColor: "#fff",
                  },
                }}
              />
              {error && (
                <Text color="red" size="xs" mt={4}>
                  {error}
                </Text>
              )}
            </>
          ) : (
            <div className="flex flex-wrap gap-4 md:gap-6">
              {categoryOptions?.map((item: any, index: number) => {
                const isSelected = selected === item.label;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Tooltip label={item.label} position="bottom" withArrow>
                      <Button
                        onClick={() => {
                          setSelected(item.label);
                          clearError(title);
                        }}
                        variant={isSelected ? "default" : "light"}
                        color="gray"
                        radius="0"
                        w={165}
                        h={40}
                        className={`transition-all duration-300 ease-in-out rounded-md ${
                          isSelected
                            ? "bg-gray-100 border-2 border-gray-700 shadow-sm scale-[1.02]"
                            : "bg-white border border-transparent hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          {item?.image ? (
                            <Image
                              h={title === "Shape" ? 20 : 40}
                              w={title === "Shape" ? 20 : 40}
                              src={item.image}
                              alt={item.label}
                              className="object-contain w-full h-full"
                            />
                          ) : item?.icon ? (
                            <div>{item.icon}</div>
                          ) : null}
                          <span className="text-lg font-medium text-gray-800">
                            {item.label}
                          </span>
                        </div>
                      </Button>
                    </Tooltip>
                  </motion.div>
                );
              })}
            </div>
          )}

          {title === "Gold Color" && (
            <div className="flex gap-1 items-center mt-2">
              <IconInfoCircle size={12} color="gray" />
              <p className="text-gray-400 text-xs">All the Gold is 14K.</p>
            </div>
          )}
        </GridCol>
      </Grid>

      {hoveredPattern && (
        <Paper
          shadow="md"
          p="md"
          radius="md"
          className="absolute border border-gray-200 bg-white"
          style={{
            top: -300,
            left: 260,
            width: 260,
            zIndex: 1000,
            pointerEvents: "none",
          }}
        >
          <Text fw={600} mb={5}>
            {hoveredPattern.label}
          </Text>
          {hoveredPattern.image && (
            <Image
              src={hoveredPattern.image}
              height={100}
              fit="contain"
              mb={6}
            />
          )}
          {hoveredPattern.description && (
            <Text size="sm" c="dimmed">
              {hoveredPattern.description}
            </Text>
          )}
        </Paper>
      )}
    </div>
  );
};
