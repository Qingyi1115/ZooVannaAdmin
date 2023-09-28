
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useApiJson from "../../../hooks/useApiJson";
import Employee from "src/models/Employee";
import ManageOperationStaff from "../../../components/AssetAndFacilityManagement/FacilityManagement/viewFacilityDetails/OperationStaff/ManageOperationStaff";
import RemoveOperationStaff from "../../../components/AssetAndFacilityManagement/FacilityManagement/viewFacilityDetails/OperationStaff/RemoveOperationStaff";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";



function ManageOperationStaffPage() {
  const apiJson = useApiJson();
  const { facilityId } = useParams<{ facilityId: string }>();
  const [empList, setEmpList] = useState<Employee[]>([]);
  const [currEmpList, setCurrEmpList] = useState<Employee[]>([]);
  const [refreshSeed, setRefreshSeed] = useState<any>(0);
  const { tab } = useParams<{ tab: string }>();

  useEffect(() => {
    let assignedStaffs: any = []
    apiJson.get(
      `http://localhost:3000/api/assetFacility/getAssignedOperationStaffOfFacility/${facilityId}`
    ).catch(e => console.log(e)).then(res => {
      setCurrEmpList(res["operationStaffs"]);
      assignedStaffs = res["operationStaffs"];
    }).then(() => {
      apiJson.post(
        "http://localhost:3000/api/assetFacility/getAllGeneralStaffs", { includes: ["maintainedFacilities", "operatedFacility", "sensors", "employee"] }
      ).catch(e => console.log(e)).then(res => {
        const allStaffs = res["operationStaffs"];
        const assignedStaffIds = []
        for (const staff of assignedStaffs) {
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
      <ManageOperationStaff facilityId={Number(facilityId)} employeeList={empList} setRefreshSeed={setRefreshSeed}></ManageOperationStaff>
      {/* <Tabs
        defaultValue={tab ? `${tab}` : "assignstaff"}
        className="w-full"
      >
        <TabsList className="no-scrollbar w-full justify-around overflow-x-auto px-4 text-xs xl:text-base">
          <TabsTrigger value="assignstaff">Assign Operations Staff</TabsTrigger>
          <TabsTrigger value="removestaff">Remove Operations Staff</TabsTrigger>
        </TabsList>
        <TabsContent value="assignstaff">
          {facilityId && <ManageOperationStaff facilityId={Number(facilityId)} employeeList={empList} setRefreshSeed={setRefreshSeed}></ManageOperationStaff>}
        </TabsContent>
        <TabsContent value="removestaff">
          {facilityId && <RemoveOperationStaff facilityId={Number(facilityId)} employeeList={currEmpList} setRefreshSeed={setRefreshSeed}></RemoveOperationStaff>}
        </TabsContent>
      </Tabs> */}
    </div>
  );
}

export default ManageOperationStaffPage;