export const OptionSquare = ({
  label,
  value,
  selected,
  onClick,
  disabled = false,
}: {
  label: string;
  value: string;
  selected: boolean;
  onClick: (val: string) => void;
  disabled?: boolean;
}) => (
  <div
    onClick={() => {
      if (!disabled) {
        onClick(value);
      }
    }}
    className={`flex items-center justify-center px-4 py-2 min-w-[60px] text-sm border select-none transition
      ${
        disabled
          ? "border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed opacity-60"
          : selected
            ? "border-[#0b182d] bg-[#0b182d] text-white cursor-pointer"
            : "border-gray-300 bg-white text-gray-700 hover:border-[#0b182d] cursor-pointer"
      }`}
  >
    {label}
  </div>
);
