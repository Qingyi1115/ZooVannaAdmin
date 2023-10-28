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
import AnimalActivityLog from "../../../models/AnimalActivityLog";
import Animal from "../../../models/Animal";
import AnimalFeedingPlanInvolvedAnimalDatatable from "../AnimalFeedingPlanDetailsPage/AnimalFeedingPlanInvolvedAnimalDatatable";
import { useAuthContext } from "../../../hooks/useAuthContext";
import beautifyText from "../../../hooks/beautifyText";

interface ViewAnimalActivityLogDetailsProps {
  curAnimalActivityLog: AnimalActivityLog
}

function ViewAnimalActivityLogDetails(props: ViewAnimalActivityLogDetailsProps) {
  const { curAnimalActivityLog } = props;
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;
  const employee = useAuthContext().state.user?.employeeData;

  return (
    <div className="flex flex-col">
      <div>
        {(curAnimalActivityLog.keeper.employee.employeeName == employee.employeeName
          || (employee.superAdmin || employee.planningStaff?.plannerType == "CURATOR")
        ) &&
          <Button className="mr-2"
            onClick={() => {
              navigate(`/animal/viewAnimalActivityLogDetails/${curAnimalActivityLog.animalActivityLogId}`, { replace: true })
              navigate(`/animal/editAnimalActivityLog/${curAnimalActivityLog.animalActivityLogId}`)
            }}>
            <HiPencil className="mx-auto" />
            Edit Animal Activity Log Details
          </Button>
        }
      </div>


      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              ID
            </TableCell>
            <TableCell>{curAnimalActivityLog.animalActivityLogId}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Activity Type
            </TableCell>
            <TableCell>{beautifyText(curAnimalActivityLog.activityType)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Date
            </TableCell>
            <TableCell>{new Date(curAnimalActivityLog.dateTime).toLocaleString()}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Duration In Minutes
            </TableCell>
            <TableCell>{curAnimalActivityLog.durationInMinutes}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Session Rating
            </TableCell>
            <TableCell>{beautifyText(curAnimalActivityLog.sessionRating)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Animal Reaction
            </TableCell>
            <TableCell>{beautifyText(curAnimalActivityLog.animalReaction)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Details
            </TableCell>
            <TableCell>{curAnimalActivityLog.details}</TableCell>
          </TableRow>
          {/* <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Animals
            </TableCell>
            <TableCell>{curAnimalActivityLog.animals.map((animal: Animal) => animal.houseName).join(", ")}</TableCell>
          </TableRow> */}
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Keeper
            </TableCell>
            <TableCell>{beautifyText(curAnimalActivityLog.keeper.employee.employeeName)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <br />
      <span className="text-lg font-medium">Involved Animals:</span>
      <AnimalFeedingPlanInvolvedAnimalDatatable involvedAnimalList={curAnimalActivityLog.animals} />
    </div>
  )
}

export default ViewAnimalActivityLogDetails;