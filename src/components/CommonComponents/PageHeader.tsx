"use client";

import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="bg-[#0b182d] text-white py-12 px-6 text-center shadow-sm">
      <div>
        <h1 className="text-3xl md:text-4xl uppercase tracking-[0.15em] font-light mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-300 font-light max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
