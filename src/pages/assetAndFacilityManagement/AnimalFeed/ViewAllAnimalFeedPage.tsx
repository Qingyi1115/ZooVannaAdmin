import React, { useState } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import AllAnimalFeedDatatable from "../../../components/AssetAndFacilityManagement/AssetManagement/AnimalFeed/AllAnimalFeedDatatable";

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

function ViewAllAnimalFeedPage() {
  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-10 text-black shadow-default">
        <AllAnimalFeedDatatable />
      </div>
    </div>
  );
}

export default ViewAllAnimalFeedPage;
