import Enclosure from "../../../models/Enclosure";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableRow
} from "@/components/ui/table";
import { HiPencil } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import useApiJson from "../../../hooks/useApiJson";
import { useAuthContext } from "../../../hooks/useAuthContext";

interface EnclosureSafetyProps {
  curEnclosure: Enclosure;
}
function EnclosureSafety(props: EnclosureSafetyProps) {
  const { curEnclosure } = props;

  const apiJson = useApiJson();
  const navigate = useNavigate();
  const employee = useAuthContext().state.user?.employeeData;

  return (
    <div>

      {(employee.superAdmin || employee.planningStaff?.plannerType == "CURATOR") && (
        <Button className="mr-2" onClick={() => {
          navigate(`/enclosure/viewenclosuredetails/${curEnclosure.enclosureId}/safety`, { replace: true });
          navigate(`/enclosure/editenclosuresafety/${curEnclosure.enclosureId}`);
        }}>
          <HiPencil className="mx-auto" ></HiPencil>
          Edit Safety Details
        </Button>
      )}

      <Table className="rounded-lg shadow-lg">
        <TableBody>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Receommended Stand-off Barrier Distance (m)
            </TableCell>
            <TableCell>
              {curEnclosure.standOffBarrierDist}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <br />
    </div>
  );
}

export default EnclosureSafety;
