"use client";
import Link from "next/link";
import classes from "./NavbarSimple.module.css";

interface Props {
  gemstones: any[];
  selected: string | null;
  onSelect: (stone: string) => void;
}

export function EducationSidebar({ gemstones, selected, onSelect }: Props) {
  const links = gemstones.map((item: any) => {
    const isActive = item.title === selected;

    return (
      <Link
        key={item.id}
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onSelect(item.title);
        }}
        className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive
            ? "text-violet-800 font-semibold bg-violet-50"
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
