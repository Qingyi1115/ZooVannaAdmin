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
import MaintenanceLog from "../../../../../models/MaintenanceLog";

interface ViewMaintenanceLogDetailsProps {
  curMaintenanceLog: MaintenanceLog
}

function ViewMaintenanceLogDetails(props: ViewMaintenanceLogDetailsProps) {
  const { curMaintenanceLog } = props;
  console.log(props);

  const toastShadcn = useToast().toast;

  return (
    <div className="flex flex-col">

      <NavLink to={`/assetfacility/editfacilitylog/${curMaintenanceLog.logId}`}>
        <Button className="mr-2">
          <HiPencil className="mx-auto" />
        </Button>
      </NavLink>

      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Maintenance Log ID
            </TableCell>
            <TableCell>{curMaintenanceLog.logId}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Date
            </TableCell>
            <TableCell>{String(curMaintenanceLog.dateTime)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Title
            </TableCell>
            <TableCell>{curMaintenanceLog.title}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Details
            </TableCell>
            <TableCell>{curMaintenanceLog.details}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Remarks
            </TableCell>
            <TableCell>{curMaintenanceLog.remarks}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

export default ViewMaintenanceLogDetails;