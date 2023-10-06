import React, { useState, useRef } from "react";
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
import Sensor from "src/models/Sensor";
import { Separator } from "@radix-ui/react-select";
import { NavLink } from "react-router-dom";
import { HiPencil } from "react-icons/hi";
import { useAuthContext } from "../../../../hooks/useAuthContext";
import { BsWrenchAdjustable } from "react-icons/bs";

interface SensorDetailsProps {
  curSensor: Sensor;
}
function ViewSensorDetails(props: SensorDetailsProps) {
  const apiJson = useApiJson();
  const { curSensor } = props;
  const employee = useAuthContext().state.user?.employeeData;

  const toastShadcn = useToast().toast;

  return (
    <div className="flex flex-col">
      <div className="my-4 flex justify-start gap-6">
      {(employee.planningStaff?.plannerType == "OPERATIONS_MANAGER") && (
        <NavLink to={`/assetfacility/editsensor/${curSensor.sensorId}`}>
          <Button className="mr-2">
            <HiPencil className="mx-auto" />
          </Button>
        </NavLink>
      )}
      {(employee.generalStaff?.generalStaffType == "ZOO_MAINTENANCE") && (
      <NavLink to={`/assetfacility/createsensormaintenancelog/${curSensor.sensorId}`}>
        <Button className="mr-2">
          <BsWrenchAdjustable className="mx-auto" ></BsWrenchAdjustable>
          Complete maintenance
        </Button>
      </NavLink>
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
              Date of Activation
            </TableCell>
            <TableCell>{curSensor.dateOfActivation? new Date(curSensor.dateOfActivation).toLocaleString() : "Unknown"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Last Maintained
            </TableCell>
            <TableCell>{curSensor.dateOfLastMaintained? new Date(curSensor.dateOfLastMaintained).toLocaleString() : "Unknown"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Type
            </TableCell>
            <TableCell>{String(curSensor.sensorType)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

export default ViewSensorDetails;