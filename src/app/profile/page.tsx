"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { UnAuthorized } from "@/components/CommonComponents/UnAuthorized";
import { SettingsComponent } from "@/components/Settings/SettingsComponent";
import { SettingsSidebar } from "@/components/Settings/SettingsSidebar";
import { Drawer, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconLayoutSidebar, IconSettings } from "@tabler/icons-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const [selectedSection, setSelectedSection] = useState("My Account");
  const [selectedSubSection, setSelectedSubSection] = useState(
    "Personal Information"
  );

  const [opened, { open, close }] = useDisclosure(false);

  if (!user) return <UnAuthorized />;

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Sidebar on desktop */}
      <div className="hidden md:block w-[300px] border-r border-gray-200">
        <SettingsSidebar
          onSelect={(section, subSection) => {
            setSelectedSection(section);
            setSelectedSubSection(subSection ?? "Personal Information");
          }}
          selectedSection={selectedSection}
          selectedSubSection={selectedSubSection}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
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
  );
}
