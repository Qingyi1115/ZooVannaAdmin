import React, { useState } from "react";
import MaintenanceOperationSuggestion from "../../../components/AssetAndFacilityManagement/MaintenanceOperation/MaintenanceOperationSuggestion";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


function MaintenanceOperationSuggestionPage() {
  const { tab } = useParams<{ tab: string }>();
  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-10 text-black shadow-default">
        <span className="self-center text-title-xl font-bold">Maintenance Management</span>
        <Tabs
          defaultValue={tab ? `${tab}` : "facilityMaintenance"}
          className="w-full"
        ><TabsList className="no-scrollbar w-full justify-around overflow-x-auto px-4 text-xs xl:text-base">
            <TabsTrigger value="facilityMaintenance">Facility Maintenance</TabsTrigger>
            <TabsTrigger value="sensorMaintenance">Sensor Maintenance</TabsTrigger>
          </TabsList>
          <TabsContent value="facilityMaintenance">
            {/* Facility maintenance page uhhhhhhhhhh */}
          </TabsContent>
          <TabsContent value="sensorMaintenance">
            <MaintenanceOperationSuggestion />
          </TabsContent></Tabs>
      </div>
    </div>
  );
}

export default MaintenanceOperationSuggestionPage;
