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



function AssignMaintenanceStaffPage() {

  const apiJson = useApiJson();
  const { facilityId } = useParams<{ facilityId: string}>();
  const [assignedStaffs, setAssignedStaffs] = useState<GeneralStaff[]>([]);

  useEffect(() => {
    try {
      apiJson.post(
        `http://localhost:3000/api/assetFacility/getAssignedMaintenanceStaffOfFacility/${facilityId}`,
        {}
      ).catch(e=>console.log(e)).then(res=>{
        setAssignedStaffs(res["maintenanceStaffs"]);
      });

    } catch (error: any) {
      console.log(error);
    }
  }, []);

  return (
    <div className="my-4 flex justify-start gap-6">
    {facilityId && <AssignMaintenanceStaff facilityId={Number(facilityId)} assignedStaffs={assignedStaffs}></AssignMaintenanceStaff>}
    </div>
  );
}

export default AssignMaintenanceStaffPage;