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
import AnimalObservationLog from "../../../models/AnimalObservationLog";
import Animal from "../../../models/Animal";
import AnimalFeedingPlanInvolvedAnimalDatatable from "../AnimalFeedingPlanDetailsPage/AnimalFeedingPlanInvolvedAnimalDatatable";

interface ViewAnimalObservationLogDetailsProps {
  curAnimalObservationLog: AnimalObservationLog
}

function ViewAnimalObservationLogDetails(props: ViewAnimalObservationLogDetailsProps) {
  const { curAnimalObservationLog } = props;
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;

  return (
    <div className="flex flex-col">
      <div>
        <Button className="mr-2"
          onClick={() => {
            navigate(`/animal/viewAnimalObservationLogDetails/${curAnimalObservationLog.animalObservationLogId}`, { replace: true })
            navigate(`/animal/editAnimalObservationLog/${curAnimalObservationLog.animalObservationLogId}`)
          }}>
          <HiPencil className="mx-auto" />
          Edit Animal Observation Log Details
        </Button>
      </div>


      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              ID
            </TableCell>
            <TableCell>{curAnimalObservationLog.animalObservationLogId}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Date
            </TableCell>
            <TableCell>{new Date(curAnimalObservationLog.dateTime).toLocaleString()}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Duration In Minutes
            </TableCell>
            <TableCell>{curAnimalObservationLog.durationInMinutes}</TableCell>
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
            <TableCell>{curAnimalObservationLog.animals.map((animal: Animal) => animal.houseName).join(", ")}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Keeper
            </TableCell>
            <TableCell>{curAnimalObservationLog.keeper.employee.employeeName}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <br />
      <span className="text-lg font-medium">Involved Animals:</span>
      <AnimalFeedingPlanInvolvedAnimalDatatable involvedAnimalList={curAnimalObservationLog.animals} />
    </div>
  )
}

export default ViewAnimalObservationLogDetails;