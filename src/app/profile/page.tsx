"use client";

import { PageHeader } from "@/components/CommonComponents/PageHeader";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { UnAuthorized } from "@/components/CommonComponents/UnAuthorized";
import { SettingsComponent } from "@/components/Settings/SettingsComponent";
import { SettingsSidebar } from "@/components/Settings/SettingsSidebar";
import { Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconLayoutSidebar } from "@tabler/icons-react";

const TAB_MAPPING: Record<string, { section: string; subSection: string }> = {
  "personal-information": { section: "My Account", subSection: "Personal Information" },
  "recently-viewed": { section: "My Account", subSection: "Recently Viewed" },
  "Recently Viewed": { section: "My Account", subSection: "Recently Viewed" },
  "shipping-address": { section: "My Account", subSection: "Shipping Address" },
  "aml-information": { section: "My Account", subSection: "AML Information" },
  "business-verification": { section: "Business Details", subSection: "Business Verification" },
  "business-references": { section: "Business Details", subSection: "Business References" },
  "memo-history": { section: "Memo", subSection: "Memo History" },
  "memo-hold-history": { section: "Memo", subSection: "Memo Hold History" },
};

function ProfilePageContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") || searchParams.get("subSection");
  const sectionParam = searchParams.get("section");

  const resolvedInitial = tabParam && TAB_MAPPING[tabParam]
    ? TAB_MAPPING[tabParam]
    : {
        section: sectionParam || "My Account",
        subSection: tabParam || "Personal Information",
      };

  const [selectedSection, setSelectedSection] = useState(resolvedInitial.section);
  const [selectedSubSection, setSelectedSubSection] = useState(
    resolvedInitial.subSection
  );

  useEffect(() => {
    if (tabParam && TAB_MAPPING[tabParam]) {
      setSelectedSection(TAB_MAPPING[tabParam].section);
      setSelectedSubSection(TAB_MAPPING[tabParam].subSection);
    } else if (sectionParam || tabParam) {
      if (sectionParam) setSelectedSection(sectionParam);
      if (tabParam) setSelectedSubSection(tabParam);
    }
  }, [tabParam, sectionParam]);

  const [opened, { open, close }] = useDisclosure(false);

  if (!user) return <UnAuthorized />;

  return (
    <div className="w-full flex flex-col min-h-screen">
      <PageHeader 
        title="My Profile" 
        subtitle="Manage your personal information, addresses, and settings." 
      />
      <div className="flex flex-col md:flex-row flex-1">
      {/* Sidebar on desktop */}
      <div className="hidden md:block w-[280px] shrink-0 border-r border-gray-200">
        <SettingsSidebar
          onSelect={(section, subSection) => {
            setSelectedSection(section);
            setSelectedSubSection(subSection ?? "Personal Information");
          }}
          selectedSection={selectedSection}
          selectedSubSection={selectedSubSection}
        />
      </div>

      <div className="flex-1 p-4 md:p-8 relative">
        <div className="md:hidden mb-4 flex justify-start">
          <button onClick={open} className="p-2 hover:bg-gray-100">
            <IconLayoutSidebar size={24} />
          </button>
        </div>

        <SettingsComponent
          activeSection={selectedSection}
          activeSubSection={selectedSubSection}
          onSelectSubSection={setSelectedSubSection}
        />
      </div>

      <Drawer
        opened={opened}
        onClose={close}
        title="Menu"
        padding="md"
        size={300}
        overlayProps={{ opacity: 0.4, blur: 2 }}
        hiddenFrom="md"
        withinPortal={false}
      >
        <SettingsSidebar
          onSelect={(section, subSection) => {
            setSelectedSection(section);
            setSelectedSubSection(subSection ?? "Personal Information");
            close();
          }}
          selectedSection={selectedSection}
          selectedSubSection={selectedSubSection}
        />
      </Drawer>
    </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={null}>
      <ProfilePageContent />
    </Suspense>
  );
}
