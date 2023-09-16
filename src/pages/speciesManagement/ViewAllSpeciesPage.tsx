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
  const [products, setProducts] = useState<Product[]>([
    {
      id: "12",
      code: "string",
      name: "string",
      description: "string",
      image: "string",
      price: 2345,
      category: "string",
      quantity: 15,
      inventoryStatus: "string",
      rating: 5,
    },
    {
      id: "12",
      code: "string",
      name: "string",
      description: "string",
      image: "string",
      price: 2345,
      category: "string",
      quantity: 15,
      inventoryStatus: "string",
      rating: 5,
    },
  ]);
  const columns = [
    { field: "code", header: "Code" },
    { field: "name", header: "Name" },
    { field: "category", header: "Category" },
    { field: "inventoryStatus", header: "Inv Status" },
    { field: "price", header: "Price" },
    { field: "description", header: "Description" },
    { field: "rating", header: "Rating" },
  ];

  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-10 text-black shadow-default">
        <span>All Species</span>
        <AllSpeciesDatatable />
      </div>
    </div>
  );
}

export default ViewAllSpeciesPage;
