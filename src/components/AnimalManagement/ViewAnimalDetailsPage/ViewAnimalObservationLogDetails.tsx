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
import AnimalObservationLog from "../../../models/AnimalObservationLog";

interface ViewAnimalObservationLogDetailsProps {
  curAnimalObservationLog: AnimalObservationLog
}

function ViewAnimalObservationLogDetails(props: ViewAnimalObservationLogDetailsProps) {
  const { curAnimalObservationLog } = props;
  console.log(props);

  const toastShadcn = useToast().toast;

  return (
    <div className="flex flex-col">

      <NavLink to={`/animal/editAnimalObservationLog/${curAnimalObservationLog.animalObservationLogId}`}>
        <Button className="mr-2">
          <HiPencil className="mx-auto" />
        </Button>
      </NavLink>

      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Animal Observation Log ID
            </TableCell>
            <TableCell>{curAnimalObservationLog.animalObservationLogId}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Date
            </TableCell>
            <TableCell>{String(curAnimalObservationLog.dateTime)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Duration In Minutes
            </TableCell>
            <TableCell>{curAnimalObservationLog.durationInMinutes ? "Yes" : "No"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Observation Quality
            </TableCell>
            <TableCell>{curAnimalObservationLog.observationQuality}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Details
            </TableCell>
            <TableCell>{curAnimalObservationLog.details}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Animals
            </TableCell>
            <TableCell>{curAnimalObservationLog.animals.toString()}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Employee
            </TableCell>
            <TableCell>{curAnimalObservationLog.employee.employeeName}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

export default ViewAnimalObservationLogDetails;