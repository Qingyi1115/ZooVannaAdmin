import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { NavLink, useNavigate } from "react-router-dom";
import { HiPencil } from "react-icons/hi";
import AnimalFeedingLog from "../../../models/AnimalFeedingLog";
import Animal from "../../../models/Animal";

interface ViewAnimalFeedingLogDetailsProps {
  curAnimalFeedingLog: AnimalFeedingLog
}

function ViewAnimalFeedingLogDetails(props: ViewAnimalFeedingLogDetailsProps) {
  const { curAnimalFeedingLog } = props;
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;

  return (
    <div className="flex flex-col">
      <div>
        <Button className="mr-2"
          onClick={() => {
            navigate(`/animal/viewAnimalFeedingLogDetails/${curAnimalFeedingLog.animalFeedingLogId}`, { replace: true })
            navigate(`/animal/editAnimalFeedingLog/${curAnimalFeedingLog.animalFeedingLogId}`)
          }}>
          <HiPencil className="mx-auto" />
          Edit Animal Feeding Log Details
        </Button>
      </div>


      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              ID
            </TableCell>
            <TableCell>{curAnimalFeedingLog.animalFeedingLogId}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Date
            </TableCell>
            <TableCell>{new Date(curAnimalFeedingLog.dateTime).toLocaleString()}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Duration In Minutes
            </TableCell>
            <TableCell>{curAnimalFeedingLog.durationInMinutes}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Details
            </TableCell>
            <TableCell>{curAnimalFeedingLog.details}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Animals
            </TableCell>
            <TableCell>{curAnimalFeedingLog.animals.map((animal: Animal) => animal.houseName).join(", ")}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Keeper
            </TableCell>
            <TableCell>{curAnimalFeedingLog.keeper.employee.employeeName}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

export default ViewAnimalFeedingLogDetails;