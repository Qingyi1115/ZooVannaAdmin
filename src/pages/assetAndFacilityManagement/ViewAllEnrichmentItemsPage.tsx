import React, { useState } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import AllEnrichmentItemDatatable from "../../components/AssetAndFacilityManagement/AssetManagement/AllEnrichmentItemDatatable";

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

function ViewAllEnrichmentItemPage() {
  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-10 text-black shadow-default">
        <span className="self-center text-title-xl font-bold">All Enrichment Items</span>
        <AllEnrichmentItemDatatable />
      </div>
    </div>
  );
}

export default ViewAllEnrichmentItemPage;
