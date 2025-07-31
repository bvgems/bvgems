"use client";

import Link from "next/link";
import { IconReceipt2, IconUser, IconFileInvoice } from "@tabler/icons-react";
import { useState } from "react";

const data = [
  {
    title: "My Account",
    link: "",
    icon: IconUser,
    children: [
      { title: "Personal Information", link: "#" },
      { title: "Shipping Address", link: "#" },
      { title: "AML Information", link: "#" },
    ],
  },
  {
    title: "Business Details",
    link: "",
    icon: IconReceipt2,
    children: [
      { title: "Business Verification", link: "#" },
      { title: "Business References", link: "#" },
    ],
  },
  {
    title: "Memo",
    link: "",
    icon: IconFileInvoice,
    children: [
      { title: "Memo History", link: "#" },
      { title: "Memo Hold History", link: "#" },
    ],
  },
];

export function SettingsSidebar({
  onSelect,
  selectedSection,
  selectedSubSection,
}: {
  onSelect: (section: string, subSection?: string) => void;
  selectedSection: string;
  selectedSubSection: string;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(data.map((item) => item.title))
  );

  const toggleItem = (title: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(title) ? next.delete(title) : next.add(title);
      return next;
    });
  };

  return (
    <nav className="p-4">
      {data.map((item, index) => {
        const isActive = expanded.has(item.title);
        const Icon = item.icon;

        return (
          <div key={index} className="mb-2">
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                toggleItem(item.title);
                onSelect(item.title, item.children?.[0]?.title);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "text-[#0b182d] font-semibold bg-gray-200"
                  : "text-gray-700 hover:bg-gray-100 hover:text-black"
              }`}
            >
              <Icon size={18} />
              {item.title}
            </Link>
            {isActive && item.children && (
              <div className="ml-6 mt-1">
                {item.children.map((child, idx) => {
                  const isChildActive =
                    item.title === selectedSection &&
                    child.title === selectedSubSection;

                  return (
                    <Link
                      key={idx}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onSelect(item.title, child.title);
                      }}
                      className={`block px-3 py-1 text-sm rounded-md ${
                        isChildActive
                          ? "text-black font-semibold"
                          : "text-gray-600 hover:text-black hover:font-medium"
                      }`}
                    >
                      {child.title}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
