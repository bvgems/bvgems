"use client";

import { PageHeader } from "@/components/CommonComponents/PageHeader";
import { FAQComponent } from "@/components/FAQs/FAQComponent";
import { FAQ_DATA, FAQItem } from "@/data/faqData";
import { Container } from "@mantine/core";

export default function FAQClient({ faqContent }: { faqContent?: FAQItem[] }) {
  const content =
    faqContent && Array.isArray(faqContent) && faqContent.length > 0
      ? faqContent
      : FAQ_DATA;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <PageHeader
        title="Gemstones & Memo Program FAQ"
        subtitle="Frequently asked questions regarding calibrated gemstones, loose colored stones, wholesale trade pricing, and the B.V. Gems Trade Memo Program."
      />

      <Container size="md" className="mt-[-2rem] relative z-10">
        <FAQComponent faqContent={content} />
      </Container>
    </div>
  );
}
