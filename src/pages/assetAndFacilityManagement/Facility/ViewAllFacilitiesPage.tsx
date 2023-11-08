
import AllFacilityDatatable from "../../../components/AssetAndFacilityManagement/FacilityManagement/viewFacilityDetails/AllFacilityDatatable";

interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  quantity: number;
  inventoryStatus: string;
  rating: number;
}

function ViewAllFacilityPage() {
  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-10 text-black shadow-default">
        <AllFacilityDatatable />
      </div>
    </div>
  );
}

export default ViewAllFacilityPage;
