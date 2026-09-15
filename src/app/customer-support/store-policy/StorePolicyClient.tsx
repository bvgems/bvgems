"use client";

import RichTextRenderer from "@/components/StorePolicy/RichTextRenderer";
import { Container, Title, Card, Text, Group, ThemeIcon, Loader } from "@mantine/core";
import { IconShieldCheck } from "@tabler/icons-react";

export default function StorePolicyClient({ policyContent }: { policyContent: any }) {
  if (!policyContent) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader size="lg" color="#0b182d" />
      </div>
    );
  }

  return (
    <Container size="xl">
      <div className="flex justify-center items-center gap-2">
        <ThemeIcon
          variant="gradient"
          size="lg"
          gradient={{ from: "black", to: "#0b182d" }}
        >
          <IconShieldCheck size="1.5rem" />
        </ThemeIcon>
        <Title order={1} className="text-center" mb="xs">
          <span className="text-[1.7rem] text-[#0b182d]">Store Policy</span>
        </Title>
      </div>
      <Text className="text-center" size="md" color="dimmed" mb="lg">
        At B. V. Gems, we uphold the highest ethical standards as proud members
        of the AGTA. Read our comprehensive store policy below.
      </Text>

      <div className="mx-auto w-full max-w-4xl px-4 py-8">
        <RichTextRenderer content={policyContent} />
      </div>
    </Container>
  );
}
