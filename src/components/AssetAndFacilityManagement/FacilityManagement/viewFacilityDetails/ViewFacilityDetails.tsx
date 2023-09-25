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

interface FacilityDetailsProps {
  curFacility: Facility;
}
function ViewFacilityDetails(props: FacilityDetailsProps) {
  const apiJson = useApiJson();
  const { curFacility } = props;
  console.log(props);

  const toastShadcn = useToast().toast;

  return (
    <div className="flex flex-col">
      <div className="my-4 flex justify-start gap-6">
        <NavLink to={`/assetfacility/editfacility/${curFacility.facilityId}`}>
          <Button className="mr-2">
            <HiPencil className="mx-auto" />
          </Button>
        </NavLink>
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
          <TableRow>
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
          </TableRow>
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