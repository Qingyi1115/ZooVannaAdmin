
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
  const [empList, setEmpList] = useState<Employee[]>([]);
  const [currEmpList, setCurrEmpList] = useState<Employee[]>([]);
  const [refreshSeed, setRefreshSeed] = useState<any>(0);
  const { tab } = useParams<{ tab: string }>();

  useEffect(() => {
    let assignedStaffs : any = []
      apiJson.get(
        `http://localhost:3000/api/assetFacility/getAssignedMaintenanceStaffOfFacility/${facilityId}`
      ).catch(e => console.log(e)).then(res => {
        setCurrEmpList(res["maintenanceStaffs"]);
        assignedStaffs = res["maintenanceStaffs"];
      }).then(()=>{
        apiJson.get(
          `http://localhost:3000/api/assetFacility/getAllMaintenanceStaff`
        ).catch(e => console.log(e)).then(res => {
          const allStaffs = res["maintenanceStaffs"];
          const assignedStaffIds = []
          for (const staff of assignedStaffs){
            assignedStaffIds.push(staff.employeeId)
          }
          const subset = []
          for (const employee of allStaffs) {
            if (!assignedStaffIds.includes(employee.employeeId)) {
              subset.push(employee);
            }
          }
      
          setEmpList(subset)
        });
      });
  }, [refreshSeed]);


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
          {facilityId && <ManageMaintenanceStaff facilityId={Number(facilityId)} employeeList={empList} setRefreshSeed={setRefreshSeed}></ManageMaintenanceStaff>}
        </TabsContent>
        <TabsContent value="removestaff">
          {facilityId && <RemoveMaintenanceStaff facilityId={Number(facilityId)} employeeList={currEmpList} setRefreshSeed={setRefreshSeed}></RemoveMaintenanceStaff>}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ManageMaintenanceStaffPage;