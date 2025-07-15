"use client";
import Link from "next/link";
import classes from "../../styles/NavbarSimple.module.css";

interface Props {
  gemstones: any[];
  selected: string | null;
  onSelect: (stone: string) => void;
  activeStone: string | null;
}

export function EducationSidebar({
  gemstones,
  selected,
  onSelect,
  activeStone,
}: Props) {
  const links = gemstones.map((item: any) => {
    const isActive =
      item.title.toLowerCase() === selected?.toLowerCase() ||
      item.title.toLowerCase() === activeStone?.toLowerCase();

    return (
      <Link
        key={item.id}
        href={`?activeStone=${item.title.toLowerCase()}`} 
        replace 
        className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive
            ? "text-[#0b182d] font-semibold bg-gray-200"
            : "text-gray-700 hover:bg-gray-100 hover:text-black"
        }`}
      >
        {item.title} Knowledge
      </Link>
    );
  });

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>{links}</div>
    </nav>
  );
}
