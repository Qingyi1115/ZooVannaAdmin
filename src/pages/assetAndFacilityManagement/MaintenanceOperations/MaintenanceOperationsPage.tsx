import React, { useState } from "react";
import SensorMaintenanceSuggestion from "../../../components/AssetAndFacilityManagement/MaintenanceOperation/SensorMaintenanceSuggestion";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FactilityMaintenanceSuggestion from "../../../components/AssetAndFacilityManagement/MaintenanceOperation/FacilityMaintenanceSuggestion";
import AllCustomerReportsDatatable from "../../../components/AssetAndFacilityManagement/FacilityManagement/viewFacilityDetails/CustomerReport/AllCustomerReportsDatatable";


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
            <TabsTrigger value="customerReports">Customer Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="facilityMaintenance">
            <FactilityMaintenanceSuggestion />
          </TabsContent>
          <TabsContent value="sensorMaintenance">
            <SensorMaintenanceSuggestion />
          </TabsContent>
          <TabsContent value="customerReports">
            <AllCustomerReportsDatatable />
          </TabsContent></Tabs>
      </div>
    </div>
  );
}

export default MaintenanceOperationSuggestionPage;
