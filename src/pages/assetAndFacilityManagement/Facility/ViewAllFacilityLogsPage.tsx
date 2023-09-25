import React, { useState } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import AllFacilityLogsDatatable from "../../../components/AssetAndFacilityManagement/FacilityManagement/viewFacilityDetails/FacilityLog/AllFacilityLogsDatatable";

function ViewAllFacilityLogsPage() {
  return (
    <div className="flex w-full flex-col gap-6 rounded-lg bg-white p-5 text-black">
      <AllFacilityLogsDatatable />
    </div>
  );
}

export default ViewAllFacilityLogsPage;
