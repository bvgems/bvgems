"use client";

import { IconBrandWhatsapp, IconX } from "@tabler/icons-react";
import { useState } from "react";

export const WhatsAppButton = () => {
  const [visible, setVisible] = useState(true);

  const phone = "2129444382";
  const message =
    "Hello! I came across your website and I'm interested in learning more about your gemstones. Could you please assist me?";
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${phone}?text=${encodedMessage}`;

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative"
      >
        <div className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-all">
          <IconBrandWhatsapp size={32} />
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            setVisible(false);
          }}
          className="absolute -top-2 -right-2 bg-white border border-gray-300 text-black rounded-full p-[2px] hover:bg-gray-100 transition-all cursor-pointer"
          style={{ width: "18px", height: "18px", fontSize: "12px" }}
        >
          <IconX size={12} />
        </button>
      </a>
    </div>
  );
};
