import AllFacilityCrowdLevelDataTable from "../../../components/AssetAndFacilityManagement/FacilityManagement/viewFacilityDetails/AllFacilityCrowdLevelDataTable";

function ViewAllFacilityCrowdLevelPage() {
  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-10 text-black shadow-default">
        <AllFacilityCrowdLevelDataTable />
      </div>
    </div>
  );
}

export default ViewAllFacilityCrowdLevelPage;
