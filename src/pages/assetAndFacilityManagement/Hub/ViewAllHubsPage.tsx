import React, { useState } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import AllHubDatatable from "../../../components/AssetAndFacilityManagement/AssetManagement/Hub/AllHubDatatable";

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

function ViewAllHubPage() {
  return (
      <div className="flex w-full flex-col gap-6 rounded-lg bg-white p-5 text-black">
        <AllHubDatatable />
      </div>
  );
}

export default ViewAllHubPage;
