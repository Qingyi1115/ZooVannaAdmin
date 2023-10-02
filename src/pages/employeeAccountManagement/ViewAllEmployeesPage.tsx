import React from "react";
import AllEmployeesDatatable from "../../components/EmployeeAccountManagement/AllEmployeesDatatable";

function ViewAllEmployeesPage() {
  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-10 text-black shadow-default">
        <span className="self-center text-title-xl font-bold">
          All Employees
        </span>
        <AllEmployeesDatatable />
      </div>
    </div>
  );
}

export default ViewAllEmployeesPage;
