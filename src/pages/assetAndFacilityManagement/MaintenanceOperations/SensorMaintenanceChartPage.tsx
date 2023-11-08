
import { useParams } from "react-router-dom";
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