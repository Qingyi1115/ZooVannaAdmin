
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useApiJson from "../../../hooks/useApiJson";
import Employee from "src/models/Employee";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManageGeneralStaff from "../../../components/AssetAndFacilityManagement/AssetManagement/Sensor/GeneralStaff/ManageGeneralStaff";
import RemoveGeneralStaff from "../../../components/AssetAndFacilityManagement/AssetManagement/Sensor/GeneralStaff/RemoveGeneralStaff";



function ManageGeneralStaffPage() {
  const apiJson = useApiJson();
  const { sensorId } = useParams<{ sensorId: string }>();
  const [empList, setEmpList] = useState<Employee[]>([]);
  const [currEmpList, setCurrEmpList] = useState<Employee[]>([]);
  const [refreshSeed, setRefreshSeed] = useState<any>(0);
  const { tab } = useParams<{ tab: string }>();

  useEffect(() => {
    let assignedStaffs: any = []
    apiJson.get(
      `http://localhost:3000/api/assetFacility/getAssignedGeneralStaffOfFacility/${sensorId}`
    ).catch(e => console.log(e)).then(res => {
      setCurrEmpList(res["generalStaffs"]);
      assignedStaffs = res["generalStaffs"];
    }).then(() => {
      apiJson.post(
        "http://localhost:3000/api/assetFacility/getAllGeneralStaffs", { includes: ["maintainedFacilities", "operatedFacility", "sensors", "employee"] }
      ).catch(e => console.log(e)).then(res => {
        const allStaffs = res["generalStaffs"];
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
      <Tabs
        defaultValue={tab ? `${tab}` : "assignstaff"}
        className="w-full"
      >
        <TabsList className="no-scrollbar w-full justify-around overflow-x-auto px-4 text-xs xl:text-base">
          <TabsTrigger value="assignstaff">Assign Maintenance Staff</TabsTrigger>
          <TabsTrigger value="removestaff">Remove Maintenance Staff</TabsTrigger>
        </TabsList>
        <TabsContent value="assignstaff">
          {sensorId && <ManageGeneralStaff sensorId={Number(sensorId)} employeeList={empList} setRefreshSeed={setRefreshSeed}></ManageGeneralStaff>}
        </TabsContent>
        <TabsContent value="removestaff">
          {sensorId && <RemoveGeneralStaff sensorId={Number(sensorId)} employeeList={currEmpList} setRefreshSeed={setRefreshSeed}></RemoveGeneralStaff>}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ManageGeneralStaffPage;