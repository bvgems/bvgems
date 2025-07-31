"use client";

import { IconBrandWhatsapp } from "@tabler/icons-react";

export const WhatsAppButton = () => {
  const phone = "2129444382";
  const message =
    "Hello! I came across your website and I'm interested in learning more about your gemstones. Could you please assist me?";
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${phone}?text=${encodedMessage}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50"
    >
      <div className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-all">
        <IconBrandWhatsapp size={32} />
      </div>
    </a>
  );
};
