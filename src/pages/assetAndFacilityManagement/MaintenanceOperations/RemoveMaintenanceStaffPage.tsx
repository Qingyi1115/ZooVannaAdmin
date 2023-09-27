import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useApiJson from "../../../hooks/useApiJson";
import Facility from "../../../models/Facility";
import Species from "../../../models/Species";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import GeneralStaff from "../../../models/GeneralStaff";
import RemoveMaintenanceStaff from "../../../components/AssetAndFacilityManagement/FacilityManagement/viewFacilityDetails/MaintenanceStaff/RemoveMaintenanceStaff";
import Employee from "src/models/Employee";



function RemoveMaintenanceStaffPage() {

  const apiJson = useApiJson();
  const { facilityId } = useParams<{ facilityId: string }>();
  const [assignedStaffs, setAssignedStaffs] = useState<Employee[]>([]);

  useEffect(() => {
    try {
      apiJson.get(
        `http://localhost:3000/api/assetFacility/getAssignedMaintenanceStaffOfFacility/${facilityId}`
      ).catch(e => console.log(e)).then(res => {
        console.log("getAssignedMaintenanceStaffOfFacility", res)
        setAssignedStaffs(res["maintenanceStaffs"]);
      });

    } catch (error: any) {
      console.log(error);
    }
  }, []);

  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg bg-white p-5 text-black">
        {facilityId && <RemoveMaintenanceStaff facilityId={Number(facilityId)} employeeList={assignedStaffs} setAssignedStaffs={setAssignedStaffs}></RemoveMaintenanceStaff>}
      </div>
    </div>

  );
}

export default RemoveMaintenanceStaffPage;