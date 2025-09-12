import { Tabs, TabsList, TabsTab } from "@mantine/core";
import React, { useState } from "react";

export const ColorStoneLayoutsAvailable = () => {
  const [activeTab, setActiveTab] = useState("alphabetical");

  return (
    // <div className="p-12">
    //   <Tabs color="gray" value={activeTab} onChange={setActiveTab}>
    //     <div className="flex justify-between items-center w-full">
    //       <TabsList className="flex space-x-6">
    //         <TabsTab value="alphabetical">
    //           <span
    //             className={`text-xl ${
    //               activeTab === "alphabetical" ? "text-gray-500" : "text-black"
    //             }`}
    //           >
    //             LATEST
    //           </span>
    //         </TabsTab>
    //         <TabsTab value="newest">
    //           <span
    //             className={`text-xl ${
    //               activeTab === "newest" ? "text-gray-500" : "text-black"
    //             }`}
    //           >
    //             MOST SOLD
    //           </span>
    //         </TabsTab>
    //       </TabsList>

    //       {/* <FilterDialog /> */}
    //     </div>
    //   </Tabs>
    // </div>
  );
};
