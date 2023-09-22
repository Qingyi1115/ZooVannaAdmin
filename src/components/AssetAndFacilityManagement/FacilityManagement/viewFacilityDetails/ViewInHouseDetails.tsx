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
import InHouse from "src/models/InHouse";

interface InHouseDetailsProps {
  curInHouse: InHouse;
  }
function ViewInHouseDetails(props: InHouseDetailsProps) {
    const {curInHouse} = props;

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
                Is Paid
              </TableCell>
              <TableCell>{String(curInHouse.isPaid)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="w-1/3 font-bold" colSpan={2}>
                Facility Type
              </TableCell>
              <TableCell>{curInHouse.facilityType}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="w-1/3 font-bold" colSpan={2}>
                Maximum Accommodation Size
              </TableCell>
              <TableCell>{curInHouse.maxAccommodationSize}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="w-1/3 font-bold" colSpan={2}>
                Air Condition Avaliable
              </TableCell>
              <TableCell>{String(curInHouse.hasAirCon)}</TableCell>
            </TableRow>

          </TableBody>
        </Table>
      </div>
    )
}

export default ViewInHouseDetails;