"use client";

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
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 pt-8 pb-12 shadow-sm">
        <Container size="xl">
          <Breadcrumbs separator="›" className="mb-8">
            {breadcrumbItems}
          </Breadcrumbs>
          
          <div className="flex justify-center items-center gap-3">
            <ThemeIcon 
              size={48} 
              radius="md" 
              variant="gradient"
              gradient={{ from: 'black', to: '#0b182d' }}
              className="shadow-md shadow-gray-200"
            >
              <IconQuestionMark size={28} stroke={2.5} />
            </ThemeIcon>
            <Title order={1} className="text-[#0b182d] text-4xl tracking-tight">
              Frequently Asked Questions
            </Title>
          </div>
          
          <p className="text-center text-gray-500 mt-4 max-w-2xl mx-auto">
            Find answers to common questions about our products, shipping, returns, and more. 
            If you need further assistance, don't hesitate to contact us.
          </p>
        </Container>
      </div>

      <Container size="md" className="mt-[-2rem] relative z-10">
        <FAQComponent faqContent={faqContent} />
      </Container>
    </div>
  );
}
