// Reusable square option component
export const OptionSquare = ({
  label,
  value,
  selected,
  onClick,
}: {
  label: string;
  value: string;
  selected: boolean;
  onClick: (val: string) => void;
}) => (
  <div
    onClick={() => onClick(value)}
    className={`flex items-center justify-center px-4 py-2 min-w-[60px] text-sm border cursor-pointer select-none transition
      ${
        selected
          ? "border-[#0b182d] bg-[#0b182d] text-white"
          : "border-gray-300 bg-white text-gray-700 hover:border-[#0b182d]"
      }`}
  >
    {label}
  </div>
);
