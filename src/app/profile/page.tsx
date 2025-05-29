"use client";
import { UnAuthorized } from "@/components/CommonComponents/UnAuthorized";
import { SettingsComponent } from "@/components/Settings/SettingsComponent";
import { SettingsSidebar } from "@/components/Settings/SettingsSidebar";

import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

export default function ProfilePage() {
  const { user } = useAuth();
  const [selectedSection, setSelectedSection] = useState<string>("My Account");
  const [selectedSubSection, setSelectedSubSection] = useState<string>(
    "Personal Information"
  );

  if (!user) {
    return <UnAuthorized />;
  }

  return (
    <div className="flex">
      <div className="w-[300px] border-r border-gray-200">
        <SettingsSidebar
          onSelect={(section, subSection) => {
            setSelectedSection(section);
            setSelectedSubSection(subSection ?? "Personal Information");
          }}
          selectedSection={selectedSection}
          selectedSubSection={selectedSubSection}
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        <SettingsComponent
          activeSection={selectedSection}
          activeSubSection={selectedSubSection}
          onSelectSubSection={setSelectedSubSection}
        />
      </div>
    </div>
  );
}
