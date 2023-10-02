import React, { useState } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import AllSpeciesDatatable from "../../components/SpeciesManagement/ViewAllSpeciesPage/AllSpeciesDatatable";

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

function ViewAllSpeciesPage() {
  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-10 text-black shadow-default">
        <AllSpeciesDatatable />
      </div>
    </div>
  );
}

export default ViewAllSpeciesPage;
