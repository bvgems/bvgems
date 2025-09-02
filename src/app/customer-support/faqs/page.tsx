"use client";
import { getFAQs } from "@/apis/api";
import { FAQComponent } from "@/components/FAQs/FAQComponent";
import {
  Anchor,
  Breadcrumbs,
  Card,
  Container,
  Group,
  Loader,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconQuestionMark } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default function FAQPage() {
  const [faqContent, setFaqContent] = useState();
  const breadcrumbItems = [
    { title: "Home", href: "/" },
    {
      title: "FAQs",
    },
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
  const fetchFAQs = async () => {
    const response = await getFAQs();
    if (response) {
      const rawValue = response?.faqs?.data?.page?.metafield?.value;
      let faqData;
      try {
        const firstParse = JSON.parse(rawValue);
        faqData =
          typeof firstParse === "string" ? JSON.parse(firstParse) : firstParse;
        setFaqContent(faqData);
      } catch (error) {
        console.error("Error parsing FAQ JSON:", error);
      }
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);
  return (
    <Container size="xl">
      <Breadcrumbs separator="›" className="mb-6">
        {breadcrumbItems}
      </Breadcrumbs>
      <div className="flex justify-center items-center gap-2">
        <ThemeIcon
          variant="gradient"
          size="md"
          gradient={{ from: "black", to: "#0b182d" }}
        >
          <IconQuestionMark size="1.5rem" />
        </ThemeIcon>{" "}
        <Title order={1} className="text-center" mb="xs">
          <span className="text-[1.7rem] text-[#0b182d]">FAQs</span>
        </Title>
      </div>

      <Card className="mt-5" radius="md" withBorder p="xl">
        {faqContent ? (
          <FAQComponent faqContent={faqContent} />
        ) : (
          <Group>
            <Loader variant="dots" />
          </Group>
        )}
      </Card>
    </Container>
  );
}
