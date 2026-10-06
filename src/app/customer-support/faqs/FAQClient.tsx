"use client";

import { PageHeader } from "@/components/CommonComponents/PageHeader";
import { FAQComponent } from "@/components/FAQs/FAQComponent";
import {
  Anchor,
  Breadcrumbs,
  Container,
  Loader,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconQuestionMark } from "@tabler/icons-react";

export default function FAQClient({ faqContent }: { faqContent: any }) {
  const breadcrumbItems = [
    { title: "Home", href: "/" },
    { title: "FAQs" },
  ].map((item, index) => (
    <Anchor
      size="sm"
      href={item.href}
      key={index}
      className="text-gray-600 hover:text-black"
    >
      {item.title}
    </Anchor>
  ));

  if (!faqContent) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader size="lg" color="#0b182d" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <PageHeader 
        title="Frequently Asked Questions" 
        subtitle="Find answers to common questions about our products, shipping, returns, and more. If you need further assistance, don't hesitate to contact us." 
      />

      <Container size="md" className="mt-[-2rem] relative z-10">
        <FAQComponent faqContent={faqContent} />
      </Container>
    </div>
  );
}
