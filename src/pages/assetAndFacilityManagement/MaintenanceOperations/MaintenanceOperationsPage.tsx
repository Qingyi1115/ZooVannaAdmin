import React, { useState } from "react";
import MaintenanceOperationSuggestion from "../../../components/AssetAndFacilityManagement/MaintenanceOperation/MaintenanceOperationSuggestion";

function MaintenanceOperationSuggestionPage() {
  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-10 text-black shadow-default">
        <span className="self-center text-title-xl font-bold">All Sensors</span>
        <MaintenanceOperationSuggestion />
      </div>
    </div>
  );
}

export default MaintenanceOperationSuggestionPage;
