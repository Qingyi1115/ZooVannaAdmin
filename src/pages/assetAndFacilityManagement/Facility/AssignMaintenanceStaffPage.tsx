
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useApiJson from "../../../hooks/useApiJson";
import Employee from "src/models/Employee";
import AssignMaintenanceStaff from "../../../components/AssetAndFacilityManagement/FacilityManagement/AssignGeneralStaff";



function AssignMaintenanceStaffPage() {

  const apiJson = useApiJson();
  const { facilityId } = useParams<{ facilityId: string }>();
  const [assignedStaffIds, setAssignedStaffIds] = useState<number[]>([]);
  const [allStaffs, setAllStaffs] = useState<Employee[]>([]);
  const [empList, setEmpList] = useState<Employee[]>([]);

  useEffect(() => {
    try {
      apiJson.get(
        `http://localhost:3000/api/assetFacility/getAssignedMaintenanceStaffOfFacility/${facilityId}`
      ).catch(e => console.log(e)).then(res => {
        setAssignedStaffIds(res["maintenanceStaffs"].map((a: Employee) => a.employeeId));
      });
      apiJson.get(
        `http://localhost:3000/api/assetFacility/getAllMaintenanceStaff`
      ).catch(e => console.log(e)).then(res => {
        setAllStaffs(res["maintenanceStaffs"]);
      });
    } catch (error: any) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    const subset = []
    for (const employee of allStaffs) {
      if (!assignedStaffIds.includes(employee.employeeId)) {
        subset.push(employee);
      }
    }

    setEmpList(subset)
  }, [assignedStaffIds, allStaffs]);

  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-10 text-black shadow-default">
        {facilityId && <AssignMaintenanceStaff facilityId={Number(facilityId)} employeeList={empList}></AssignMaintenanceStaff>}
      </div>
    </div>
  );
}

export default AssignMaintenanceStaffPage;