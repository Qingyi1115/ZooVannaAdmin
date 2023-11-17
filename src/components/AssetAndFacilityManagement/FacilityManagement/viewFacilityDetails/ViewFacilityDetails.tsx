import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import useApiJson from "../../../../hooks/useApiJson";

import {
  Table,
  TableBody,
  TableCell,
  TableRow
} from "@/components/ui/table";
import { HiPencil } from "react-icons/hi";
import { NavLink } from "react-router-dom";
import Facility from "src/models/Facility";
import { useAuthContext } from "../../../../hooks/useAuthContext";
import beautifyText from "../../../../hooks/beautifyText";

interface FacilityDetailsProps {
  curFacility: Facility;
}
function ViewFacilityDetails(props: FacilityDetailsProps) {
  const apiJson = useApiJson();
  const { curFacility } = props;
  const employee = useAuthContext().state.user?.employeeData;

  const toastShadcn = useToast().toast;

  return (
    <div className="flex flex-col">
      <div className="my-4 flex justify-start gap-6">

        {(employee.superAdmin || employee.planningStaff?.plannerType == "OPERATIONS_MANAGER") && (
          <NavLink to={`/assetfacility/editfacility/${curFacility.facilityId}`}
            state={{ prev: `/assetfacility/viewfacilitydetails/${curFacility.facilityId}` }}>
            <Button className="mr-2">
              <HiPencil className="mx-auto" ></HiPencil>
              Edit Facility Details
            </Button>
          </NavLink>
        )}
        {/* {(employee.superAdmin || employee.generalStaff?.generalStaffType == "ZOO_MAINTENANCE") && (
          <NavLink to={`/assetfacility/completeFacilityRepair/${curFacility.facilityId}`}
            state={{ prev: `/assetfacility/viewfacilitydetails/${curFacility.facilityId}` }}>
            <Button className="mr-2">
              <BsWrenchAdjustable className="mx-auto" ></BsWrenchAdjustable>
              Complete Maintenance
            </Button>
          </NavLink>
        )}
        {(employee.superAdmin || employee.generalStaff?.generalStaffType == "ZOO_OPERATIONS") && (
          <NavLink to={`/assetfacility/createfacilitylog/${curFacility.facilityId}`}
            state={{ prev: `/assetfacility/viewfacilitydetails/${curFacility.facilityId}` }}>
            <Button className="mr-2">
              <BsWrenchAdjustable className="mx-auto" ></BsWrenchAdjustable>
              Create Operations Log
            </Button>
          </NavLink>
        )} */}

      </div>
      {curFacility.imageUrl && <img
        src={"http://localhost:3000/" + curFacility.imageUrl}
        alt="Current facility image"
        className="my-4 aspect-square w-1/5 self-center rounded-full border object-cover shadow-4"
      />}
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Facility ID
            </TableCell>
            <TableCell>{curFacility.facilityId}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Name
            </TableCell>
            <TableCell>{curFacility.facilityName}</TableCell>
          </TableRow>
          {/* <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              X Coordinate
            </TableCell>
            <TableCell>{curFacility.xCoordinate}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Y Coordinate
            </TableCell>
            <TableCell>{curFacility.yCoordinate}</TableCell>
          </TableRow> */}
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Shelter available
            </TableCell>
            <TableCell>{String(curFacility.isSheltered) == "false" ? "No" : "Yes"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Owner Type
            </TableCell>
            <TableCell>
              {curFacility.facilityDetail == "inHouse" ? "In-house" :
                curFacility.facilityDetail == "thirdParty" ? "Third-party" :
              beautifyText(curFacility.facilityDetail)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

export default ViewFacilityDetails;