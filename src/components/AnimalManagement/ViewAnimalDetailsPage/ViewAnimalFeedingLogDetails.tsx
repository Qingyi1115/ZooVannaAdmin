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
import AnimalFeedingPlanInvolvedAnimalDatatable from "../AnimalFeedingPlanDetailsPage/AnimalFeedingPlanInvolvedAnimalDatatable";

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
              Amount Offered
            </TableCell>
            <TableCell>{curAnimalFeedingLog.amountOffered}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Amount Consumed
            </TableCell>
            <TableCell>{curAnimalFeedingLog.amountConsumed}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Amount Leftovers
            </TableCell>
            <TableCell>{curAnimalFeedingLog.amountLeftovers}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Presentation Method
            </TableCell>
            <TableCell>{curAnimalFeedingLog.presentationMethod}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Extra Remarks
            </TableCell>
            <TableCell>{curAnimalFeedingLog.extraRemarks}</TableCell>
          </TableRow>
          {/* <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Animals
            </TableCell>
            <TableCell>{curAnimalFeedingLog.animals.map((animal: Animal) => animal.houseName).join(", ")}</TableCell>
          </TableRow> */}
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Keeper
            </TableCell>
            <TableCell>{curAnimalFeedingLog.keeper.employee.employeeName}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <br />
      <span className="text-lg font-medium">Involved Animals:</span>
      <AnimalFeedingPlanInvolvedAnimalDatatable involvedAnimalList={curAnimalFeedingLog.animals} />
    </div>

  )
}

export default ViewAnimalFeedingLogDetails;