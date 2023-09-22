import React, { useState } from "react";
import Employee from "src/models/Employee";
import { useAuthContext } from "src/hooks/useAuthContext";
import UpdateProfile from "../../components/EmployeeCommonInfra/UpdateProfile";

function UpdateProfilePage() {
  return (
    <div className="p-10">
      <UpdateProfile />
    </div>
  );
}

export default UpdateProfilePage;
