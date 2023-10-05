import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { NavLink } from "react-router-dom";
import { HiPencil } from "react-icons/hi";
import FacilityLog from "../../../../../models/FacilityLog";

interface ViewFacilityLogDetailsProps {
  curFacilityLog: FacilityLog
}

function ViewFacilityLogDetails(props: ViewFacilityLogDetailsProps) {
  const { curFacilityLog } = props;
  console.log(props);

  const toastShadcn = useToast().toast;

  return (
    <div className="flex flex-col">

      <NavLink to={`/assetfacility/editfacilitylog/${curFacilityLog.logId}`}>
        <Button className="mr-2">
          <HiPencil className="mx-auto" />
        </Button>
      </NavLink>

      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Facility Log ID
            </TableCell>
            <TableCell>{curFacilityLog.logId}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Date
            </TableCell>
            <TableCell>{String(curFacilityLog.dateTime)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Is maintenance?
            </TableCell>
            <TableCell>{curFacilityLog.isMaintenance ? "Yes" : "No"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Title
            </TableCell>
            <TableCell>{curFacilityLog.title}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Details
            </TableCell>
            <TableCell>{curFacilityLog.details}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Remarks
            </TableCell>
            <TableCell>{curFacilityLog.remarks}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

export default ViewFacilityLogDetails;