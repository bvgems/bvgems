with open('src/components/FreeSizeGemtones/FreeSizeGridViewTopFilters.tsx', 'r') as f:
    content = f.read()

# Add MobileDropdownRangeFilter component right after RangeFilter
new_component = """
const MobileDropdownRangeFilter = ({
  label,
  value,
  onChange,
  bounds,
}: {
  label: string;
  value: RangeValue;
  onChange: (val: RangeValue) => void;
  bounds: { min: number; max: number };
}) => {
  const options = [];
  const minBound = Math.floor(bounds.min || 0);
  const maxBound = Math.ceil(bounds.max || 50);
  for (let i = minBound; i <= maxBound; i += 0.5) {
    options.push({ value: i.toString(), label: i.toString() });
  }

  return (
    <div className="flex flex-col gap-2 w-full max-w-[250px] items-center lg:items-start mx-auto lg:mx-0">
      <label className="text-sm font-bold text-[#0b182d] uppercase tracking-wide text-center lg:text-left w-full">
        {label}
      </label>
      
      {/* Mobile view: Dropdowns */}
      <div className="flex lg:hidden gap-2 mt-2 w-full">
        <Select
          placeholder="Min"
          data={options}
          value={value.min === "" ? null : value.min.toString()}
          onChange={(val) => onChange({ ...value, min: val === null ? "" : Number(val) })}
          searchable
          clearable
          className="w-1/2"
        />
        <Select
          placeholder="Max"
          data={options}
          value={value.max === "" ? null : value.max.toString()}
          onChange={(val) => onChange({ ...value, max: val === null ? "" : Number(val) })}
          searchable
          clearable
          className="w-1/2"
        />
      </div>

      {/* Desktop view: NumberInputs */}
      <div className="hidden lg:flex gap-2 mt-2">
        <NumberInput
          value={value.min}
          onChange={(val) => onChange({ ...value, min: val === "" ? "" : Number(val) })}
          placeholder="Min"
          min={0}
          max={value.max === "" ? undefined : Number(value.max)}
          leftSection={<span className="text-xs text-gray-500 ml-2">Min</span>}
          styles={{ input: { paddingLeft: 40, fontSize: '13px' } }}
          hideControls
        />
        <NumberInput
          value={value.max}
          onChange={(val) => onChange({ ...value, max: val === "" ? "" : Number(val) })}
          placeholder="Max"
          min={value.min === "" ? 0 : Number(value.min)}
          leftSection={<span className="text-xs text-gray-500 ml-2">Max</span>}
          styles={{ input: { paddingLeft: 40, fontSize: '13px' } }}
          hideControls
        />
      </div>
    </div>
  );
};
"""

# Insert it before FreeSizeGridViewTopFilters
content = content.replace('export const FreeSizeGridViewTopFilters = ({', new_component + '\nexport const FreeSizeGridViewTopFilters = ({')

# Replace the calls for Length and Width
old_len = '<RangeFilter label={`Length (MM)${toleranceEnabled ? " (±0.5)" : ""}`} value={lengthRange} onChange={setLengthRange} bounds={lengthBounds} />'
new_len = '<MobileDropdownRangeFilter label={`Length (MM)${toleranceEnabled ? " (±0.5)" : ""}`} value={lengthRange} onChange={setLengthRange} bounds={lengthBounds} />'
content = content.replace(old_len, new_len)

old_wid = '<RangeFilter label={`Width (MM)${toleranceEnabled ? " (±0.5)" : ""}`} value={widthRange} onChange={setWidthRange} bounds={widthBounds} />'
new_wid = '<MobileDropdownRangeFilter label={`Width (MM)${toleranceEnabled ? " (±0.5)" : ""}`} value={widthRange} onChange={setWidthRange} bounds={widthBounds} />'
content = content.replace(old_wid, new_wid)

with open('src/components/FreeSizeGemtones/FreeSizeGridViewTopFilters.tsx', 'w') as f:
    f.write(content)

print("Done")
