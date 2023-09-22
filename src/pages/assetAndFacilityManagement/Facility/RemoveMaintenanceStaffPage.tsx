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
import RemoveMaintenanceStaff from "../../../components/AssetAndFacilityManagement/FacilityManagement/RemoveMaintenanceStaff";
import Employee from "src/models/Employee";



function RemoveMaintenanceStaffPage() {

  const apiJson = useApiJson();
  const { facilityId } = useParams<{ facilityId: string}>();
  const [assignedStaffs, setAssignedStaffs] = useState<Employee[]>([]);

  useEffect(() => {
    try {
      apiJson.get(
        `http://localhost:3000/api/assetFacility/getAssignedMaintenanceStaffOfFacility/${facilityId}`
      ).catch(e=>console.log(e)).then(res=>{
        console.log("getAssignedMaintenanceStaffOfFacility", res)
        setAssignedStaffs(res["maintenanceStaffs"]);
      });

    } catch (error: any) {
      console.log(error);
    }
  }, []);

  return (
    <div className="my-4 flex justify-start gap-6">
    {facilityId && <RemoveMaintenanceStaff facilityId={Number(facilityId)} employeeList={assignedStaffs}></RemoveMaintenanceStaff>}
    </div>
  );
}

export default RemoveMaintenanceStaffPage;