"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Title, Text, Loader, Card, Button } from "@mantine/core";
import dynamic from "next/dynamic";

import { useEffect, useState } from "react";
import { changeApproveStatus } from "@/apis/api";

const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
);

export default function AccountApprovalComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const [status, setStatus] = useState("Processing...");
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    const approveAccount = async (userId: any) => {
      const response = await changeApproveStatus(userId);
      return response;
    };

    if (userId) {
      approveAccount(userId).then((res) => {
        if (res.flag) {
          setStatus("Account approved successfully!");
          setIsSuccess(true);
        } else {
          setStatus("Failed to approve account.");
          setIsSuccess(false);
        }
      });
    } else {
      setStatus("Missing userId");
      setIsSuccess(false);
    }
  }, [userId]);

  const handleBack = () => {
    router.push("/");
  };

  return (
    <div>
      <Card radius="md" padding="lg">
        <Title className="flex justify-center mt-14" order={2}>
          Account Approval
        </Title>
        {isSuccess === null ? (
          <div className="flex justify-center items-center mt-10">
            <Loader color="violet" />
            <Text size="lg" color="dimmed">
              {status}
            </Text>
          </div>
        ) : (
          <div className="mt-5 flex flex-col gap-3 justify-center items-center">
            {isSuccess ? (
              <Player
                autoplay
                loop
                src="/assets/account-approved.json"
                style={{ height: "300px", width: "300px" }}
              />
            ) : (
              <Player
                autoplay
                loop
                src="/assets/failed-approval.json"
                style={{ height: "300px", width: "300px" }}
              />
            )}
            <Text
              size="lg"
              className="flex justify-center items-center"
              color={isSuccess ? "green" : "red"}
            >
              {status}
            </Text>
            <Button variant="light" color="violet" onClick={handleBack}>
              Back to Home
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
