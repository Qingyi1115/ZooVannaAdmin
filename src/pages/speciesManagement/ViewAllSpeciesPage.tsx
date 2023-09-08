import React, { useState } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

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
    <div className="p-4">
      <span>All Species</span>
      <div className="flex justify-center">
        <DataTable
          stripedRows
          virtualScrollerOptions={{ itemSize: 15 }}
          value={products}
          className="w-full border"
        >
          {columns.map((col, i) => (
            <Column key={col.field} field={col.field} header={col.header} />
          ))}
        </DataTable>
      </div>
    </div>
  );
}

export default ViewAllSpeciesPage;
