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
} from "@mantine/core";
import { IconShieldCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default function StorePolicy() {
  const [policyContent, setPolicyContent] = useState<any>(null);

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

  return (
    <Container size="xl">
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
          <RichTextRenderer content={policyContent} />
        ) : (
          <Group>
            <Loader variant="dots" />
          </Group>
        )}
      </Card>
    </Container>
  );
}
