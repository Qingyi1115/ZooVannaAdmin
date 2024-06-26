import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import useApiJson from "../../../../hooks/useApiJson";

import {
  Table,
  TableBody,
  TableCell,
  TableRow
} from "@/components/ui/table";
import { BsWrenchAdjustable } from "react-icons/bs";
import { HiCamera, HiPencil } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import Sensor from "src/models/Sensor";
import beautifyText from "../../../../hooks/beautifyText";
import { useAuthContext } from "../../../../hooks/useAuthContext";

interface SensorDetailsProps {
  curSensor: Sensor;
}
function ViewSensorDetails(props: SensorDetailsProps) {
  const apiJson = useApiJson();
  const { curSensor } = props;
  const employee = useAuthContext().state.user?.employeeData;
  const navigate = useNavigate();

  const toastShadcn = useToast().toast;

  return (
    <div className="flex flex-col">
      <div className="my-4 flex justify-start gap-6">

        {curSensor.hubProcessor?.facility.enclosure ?
          <Button className="mr-2" onClick={() => {
            navigate(`/assetfacility/viewsensordetails/${curSensor.sensorId}/sensorDetails`, { replace: true });
            navigate(`/enclosure/viewenclosuredetails/${curSensor.hubProcessor?.facility.enclosure?.enclosureId}/environment`);
          }}>
            Enclosure Details
          </Button>
          :
          <Button className="mr-2" onClick={() => {
            navigate(`/assetfacility/viewsensordetails/${curSensor.sensorId}/sensorDetails`, { replace: true });
            navigate(`/assetfacility/viewfacilitydetails/${curSensor.hubProcessor?.facility.facilityId}`);
          }}>
            Facility Details
          </Button>
        }

        {(employee.superAdmin || employee.planningStaff?.plannerType == "OPERATIONS_MANAGER" || employee.planningStaff?.plannerType == "CURATOR") && (
          <Button className="mr-2" onClick={() => {
            navigate(`/assetfacility/viewsensordetails/${curSensor.sensorId}/sensorDetails`, { replace: true });
            navigate(`/assetfacility/editsensor/${curSensor.sensorId}`);
          }}>
            <HiPencil className="mx-auto" />
            Edit Sensor Details
          </Button>
        )}
        {(employee.superAdmin || employee.generalStaff?.generalStaffType == "ZOO_MAINTENANCE") && (
          <Button className="mr-2" onClick={() => {
            navigate(`/assetfacility/viewsensordetails/${curSensor.sensorId}/sensorDetails`, { replace: true });
            navigate(`/assetfacility/createsensormaintenancelog/${curSensor.sensorId}`);
          }}>
            <BsWrenchAdjustable className="mx-auto" ></BsWrenchAdjustable>
            Complete Maintenance
          </Button>
        )}
        {curSensor.sensorType == "CAMERA" && (

          <Button className="mr-2" onClick={() => {
            navigate(`/assetfacility/viewsensordetails/${curSensor.sensorId}/sensorDetails`, { replace: true });
            navigate(`/assetfacility/viewcamera/${curSensor.sensorId}`);
          }}>
            <HiCamera className="mx-auto" />
            View Camera
          </Button>
        )}

      </div>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              ID
            </TableCell>
            <TableCell>{curSensor.sensorId}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Name
            </TableCell>
            <TableCell>{String(curSensor.sensorName)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Facility
            </TableCell>
            <TableCell>{curSensor.hubProcessor?.facility?.facilityName}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Date of Activation
            </TableCell>
            <TableCell>{curSensor.dateOfActivation ? new Date(curSensor.dateOfActivation).toLocaleString() : "Unknown"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Last Maintained
            </TableCell>
            <TableCell>{curSensor.dateOfLastMaintained ? new Date(curSensor.dateOfLastMaintained).toLocaleString() : "Unknown"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Type
            </TableCell>
            <TableCell>{String(beautifyText(curSensor.sensorType))}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

export default ViewSensorDetails;