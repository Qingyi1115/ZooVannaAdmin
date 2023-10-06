import React, { useState, useRef } from "react";
import Employee from "../../../../models/Employee";
import { Button } from "@/components/ui/button";
import useApiJson from "../../../../hooks/useApiJson";
import { useToast } from "@/components/ui/use-toast";
import { Toast } from "primereact/toast";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Facility from "src/models/Facility";
import { Separator } from "@radix-ui/react-select";
import { NavLink } from "react-router-dom";
import { HiPencil } from "react-icons/hi";
import { useAuthContext } from "../../../../hooks/useAuthContext";
import { BsWrenchAdjustable } from "react-icons/bs";

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
        state={{prev:`/assetfacility/viewfacilitydetails/${curFacility.facilityId}`}}>
          <Button className="mr-2">
            <HiPencil className="mx-auto" ></HiPencil>
            Edit Facility Details
          </Button>
        </NavLink>
      )}
      {(employee.superAdmin || employee.generalStaff?.generalStaffType == "ZOO_MAINTENANCE") && (
      <NavLink to={`/assetfacility/completefacilitymaintenance/${curFacility.facilityId}`}
      state={{prev:`/assetfacility/viewfacilitydetails/${curFacility.facilityId}`}}>
        <Button className="mr-2">
          <BsWrenchAdjustable className="mx-auto" ></BsWrenchAdjustable>
          Complete maintenance
        </Button>
      </NavLink>
      )}
      {(employee.superAdmin || employee.generalStaff?.generalStaffType == "ZOO_OPERATIONS") && (
      <NavLink to={`/assetfacility/createfacilitylog/${curFacility.facilityId}`}
      state={{prev:`/assetfacility/viewfacilitydetails/${curFacility.facilityId}`}}>
        <Button className="mr-2">
          <BsWrenchAdjustable className="mx-auto" ></BsWrenchAdjustable>
          Create Operations Log
        </Button>
      </NavLink>
      )}

      </div>
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
            <TableCell>{curFacility.facilityDetail == "inHouse" ? "In-house" : "Third-party"}</TableCell>
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