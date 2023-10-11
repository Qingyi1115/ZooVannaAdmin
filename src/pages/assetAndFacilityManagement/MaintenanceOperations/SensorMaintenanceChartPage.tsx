
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useApiJson from "../../../hooks/useApiJson";
import Employee from "src/models/Employee";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SensorMaintenanceChart from "../../../components/AssetAndFacilityManagement/MaintenanceOperation/SensorMaintenanceChart";



function SensorMaintenanceChartPage() {
  const { sensorId } = useParams<{ sensorId: string }>();

  return (
    <div className="flex w-full flex-col gap-6 rounded-lg bg-white p-5 text-black">
      <SensorMaintenanceChart sensorId={Number(sensorId)} ></SensorMaintenanceChart>
    </div>
  );
}

export default SensorMaintenanceChartPage;