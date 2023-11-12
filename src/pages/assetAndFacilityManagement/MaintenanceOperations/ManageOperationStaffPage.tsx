
import { useParams } from "react-router-dom";
import ManageOperationStaff from "../../../components/AssetAndFacilityManagement/FacilityManagement/viewFacilityDetails/OperationStaff/ManageOperationStaff";



function ManageOperationStaffPage() {
  const { facilityId } = useParams<{ facilityId: string }>();


  return (

    <div className="">
      <ManageOperationStaff facilityId={Number(facilityId)} ></ManageOperationStaff>
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