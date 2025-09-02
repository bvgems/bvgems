"use client";

import { getStorePolicies } from "@/apis/api";
import RichTextRenderer from "@/components/StorePolicy/RichTextRenderer";
import {
  Container,
  Title,
  Card,
  Text,
  Group,
  ThemeIcon,
  Loader,
  Anchor,
  Breadcrumbs,
} from "@mantine/core";
import { IconShieldCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default function StorePolicy() {
  const [policyContent, setPolicyContent] = useState<any>(null);
  const breadcrumbItems = [
    { title: "Home", href: "/" },
    {
      title: "Store Policy",
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

  const fetchStorePolicies = async () => {
    const response = await getStorePolicies();
    if (response) {
      const policyData = JSON.parse(
        response?.storePolicies?.data?.page?.metafield?.value
      );
      setPolicyContent(policyData);
    }
  };

  useEffect(() => {
    fetchStorePolicies();
  }, []);

  function transformEmails(node: any): any {
    if (Array.isArray(node)) {
      return node.flatMap(transformEmails); // flatten children arrays
    }

    if (typeof node === "object" && node !== null) {
      if (node.type === "text" && typeof node.value === "string") {
        const emailRegex = /\b[A-Z0-9._%+-]+@bvgems\.com\b/gi;

        if (emailRegex.test(node.value)) {
          const parts = node.value.split(emailRegex);
          const matches = node.value.match(emailRegex) || [];

          const children: any[] = [];
          parts.forEach((part: any, i: any) => {
            if (part) {
              children.push({ type: "text", value: part });
            }
            if (matches[i]) {
              children.push({
                type: "link",
                url: `mailto:${matches[i]}`,
                children: [{ type: "text", value: matches[i] }],
              });
            }
          });

          // 🔹 return children instead of wrapping in a paragraph
          return children;
        }
      }

      // Recursively process children
      const newNode: any = { ...node };
      if (node.children) {
        newNode.children = transformEmails(node.children);
      }
      return newNode;
    }

    return node;
  }

  return (
    <Container size="xl">
      <Breadcrumbs separator="›" className="mb-6">
        {breadcrumbItems}
      </Breadcrumbs>
      <div className="flex justify-center items-center gap-2">
        <ThemeIcon
          variant="gradient"
          size="lg"
          gradient={{ from: "black", to: "#0b182d" }}
        >
          <IconShieldCheck size="1.5rem" />
        </ThemeIcon>{" "}
        <Title order={1} className="text-center" mb="xs">
          <span className="text-[1.7rem] text-[#0b182d]">Store Policy</span>
        </Title>
      </div>
      <Text className="text-center" size="md" color="dimmed" mb="lg">
        At B. V. Gems, we uphold the highest ethical standards as proud members
        of the AGTA. Read our comprehensive store policy below.
      </Text>
      <Card className="mt-5" radius="md" withBorder p="xl">
        {policyContent ? (
          <RichTextRenderer content={transformEmails(policyContent)} />
        ) : (
          <Group>
            <Loader variant="dots" />
          </Group>
        )}
      </Card>
    </Container>
  );
}
