import React, {useState, useRef} from "react";
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

interface EmployeeInfoDetailsProps {
  curFacility: Facility;
  }
function ViewFacilityDetails(props: EmployeeInfoDetailsProps) {
    const apiJson = useApiJson();
    const {curFacility} = props;
    console.log(props);

    const toastShadcn = useToast().toast;

    return(
      <div className="">
        <Table>
          {/* <TableHeader className=" bg-whiten">
            <TableRow>
              <TableHead className="w-1/3 font-bold" colSpan={2}>
                Attribute
              </TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader> */}
          <TableBody>
            <TableRow>
              <TableCell className="w-1/3 font-bold" colSpan={2}>
                Facility Id
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

          </TableBody>
        </Table>
      </div>
    )
}

export default ViewFacilityDetails;