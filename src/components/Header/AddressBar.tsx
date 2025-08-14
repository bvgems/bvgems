import { IconMail, IconPhone } from "@tabler/icons-react";
import React from "react";

export const AddressBar = () => {
  return (
    <div
      style={{ fontFamily: "system-ui, sans-serif" }}
      className="flex justify-evenly py-1 bg-[#F9F5F0] text-black text-sm"
    >
      <a
        href="https://www.google.com/maps/search/?api=1&query=66+West+47th+Street,+NYC,+NY+10036"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline"
      >
        66 W 47th St, Booth #9 and #10, New York, NY 10036
      </a>
      <div className="flex justify-around gap-6">
        <a href="tel:+12129444382" className="flex gap-2 hover:underline">
          <IconPhone /> +1 (212) 944-4382
        </a>
        <a
          href="mailto:sales@bvgems.com"
          className="flex gap-2 hover:underline"
        >
          <IconMail /> sales@bvgems.com
        </a>
      </div>
    </div>
  );
};
