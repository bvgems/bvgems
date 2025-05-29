"use client";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
} from "@mantine/core";
import { ProfileInfo } from "../Profile/ProfileInfo";
import { ShippingAddress } from "../ShippingAddress/ShipppingAddress";
import { getUserProfile } from "@/apis/api";
import { useUserStore } from "@/store/useUserStore";
import { AMLInfo } from "../AML/AMLInfo";
import { BusinessReference } from "../Business/BusinessReference";

interface Props {
  activeSection?: string;
  activeSubSection?: string;
  onSelectSubSection?: (title: string) => void;
}

export const SettingsComponent = ({
  activeSection,
  activeSubSection,
  onSelectSubSection,
}: Props) => {
  const { user, setUser } = useUserStore();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response: any = await getUserProfile(user?.id);
      if (response?.flag && response?.user) {
        const freshUserData = {
          id: response.user.id || "",
          firstName: response.user.firstName || "",
          lastName: response.user.lastName || "",
          email: response.user.email || "",
          companyName: response.user.companyName || "",
          phoneNumber: response.user.phoneNumber || "",
        };
        setUserData(freshUserData);
        setUser(response.user);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchUserProfile();
    }
  }, [user?.id]);

  if (!activeSection || isLoading) return null;

  const sectionAccordions: Record<
    string,
    { title: string; content: React.ReactNode }[]
  > = {
    "My Account": [
      {
        title: "Personal Information",
        content: <ProfileInfo userData={userData} />,
      },
      {
        title: "Shipping Address",
        content: <ShippingAddress />,
      },
      {
        title: "AML Information",
        content: <AMLInfo />,
      },
    ],
    "Business Details": [
      {
        title: "Business Verification",
        content: "<BusinessVerification />",
      },
      {
        title: "Business References",
        content: <BusinessReference />,
      },
    ],
    Memo: [
      {
        title: "Memo History",
        content: "<MemoHistory />",
      },
      {
        title: "Memo Hold History",
        content: "<MemoHoldHistory />",
      },
    ],
  };

  const accordions = sectionAccordions[activeSection] ?? [];

  return (
    <div className="p-6">
      <Accordion
        chevronPosition="left"
        value={activeSubSection ?? null}
        onChange={(value) => {
          if (typeof value === "string") {
            onSelectSubSection?.(value);
          }
        }}
      >
        {accordions.map((item) => (
          <AccordionItem key={item.title} value={item.title}>
            <AccordionControl>{item.title}</AccordionControl>
            <AccordionPanel>{item.content}</AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
