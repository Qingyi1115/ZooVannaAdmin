import React, { useState, } from "react";
import Employee from "src/models/Employee";
import { useAuthContext } from "src/hooks/useAuthContext";
import EditPassword from "../../components/EmployeeCommonInfra/EditPassword";

function EditPasswordPage() {
  return (
    <div className="p-10">
        <EditPassword />
    </div>
  );
}

export default EditPasswordPage;