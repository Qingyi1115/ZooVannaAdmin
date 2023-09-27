
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useApiJson from "../../../hooks/useApiJson";
import Employee from "src/models/Employee";
import ManageMaintenanceStaff from "../../../components/AssetAndFacilityManagement/FacilityManagement/viewFacilityDetails/MaintenanceStaff/ManageMaintenanceStaff";
import RemoveMaintenanceStaff from "../../../components/AssetAndFacilityManagement/FacilityManagement/viewFacilityDetails/MaintenanceStaff/RemoveMaintenanceStaff";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";



function ManageMaintenanceStaffPage() {

  const apiJson = useApiJson();
  const { facilityId } = useParams<{ facilityId: string }>();
  const [assignedStaffIds, setAssignedStaffIds] = useState<number[]>([]);
  const [allStaffs, setAllStaffs] = useState<Employee[]>([]);
  const [empList, setEmpList] = useState<Employee[]>([]);

  const [assignedStaffs, setAssignedStaffs] = useState<Employee[]>([]);

  const { tab } = useParams<{ tab: string }>();

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

    <div className="flex w-full flex-col gap-6 rounded-lg bg-white p-5 text-black">
      <Tabs
        defaultValue={tab ? `${tab}` : "assignstaff"}
        className="w-full"
      >
        <TabsList className="no-scrollbar w-full justify-around overflow-x-auto px-4 text-xs xl:text-base">
          <TabsTrigger value="assignstaff">Assign Maintenance Staff</TabsTrigger>
          <TabsTrigger value="removestaff">Remove Maintenance Staff</TabsTrigger>
        </TabsList>
        <TabsContent value="assignstaff">
          {facilityId && <ManageMaintenanceStaff facilityId={Number(facilityId)} employeeList={empList}></ManageMaintenanceStaff>}
        </TabsContent>
        <TabsContent value="removestaff">
          {facilityId && <RemoveMaintenanceStaff facilityId={Number(facilityId)} employeeList={assignedStaffs}></RemoveMaintenanceStaff>}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ManageMaintenanceStaffPage;