
import { useParams } from "react-router-dom";
import FacilityMaintenanceChart from "../../../components/AssetAndFacilityManagement/MaintenanceOperation/FacilityMaintenanceChart";



function FacilityMaintenanceChartPage() {
  const { facilityId } = useParams<{ facilityId: string }>();

  return (
    <div className="flex w-full flex-col gap-6 rounded-lg bg-white p-5 text-black">
      <FacilityMaintenanceChart facilityId={Number(facilityId)} ></FacilityMaintenanceChart>
    </div>
  );
}

export default FacilityMaintenanceChartPage;