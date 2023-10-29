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
import Hub from "../../../../models/HubProcessor";
import { Separator } from "@radix-ui/react-select";
import { useNavigate } from "react-router-dom";
import { HiPencil } from "react-icons/hi";
import { useAuthContext } from "../../../../hooks/useAuthContext";
import beautifyText from "../../../../hooks/beautifyText";

interface HubDetailsProps {
  curHub: Hub;
  refreshSeed: number;
  setRefreshSeed: React.Dispatch<React.SetStateAction<number>>;
}
function ViewHubDetails(props: HubDetailsProps) {
  const { curHub, refreshSeed, setRefreshSeed } = props;
  const employee = useAuthContext().state.user?.employeeData;
  const navigate = useNavigate();

  const toastShadcn = useToast().toast;

  return (
    <div className="flex flex-col">
      <div className="my-4 flex justify-start gap-6">
        {(employee.superAdmin || employee.planningStaff?.plannerType == "OPERATIONS_MANAGER") && (
          <div>
            <Button className="mr-2" onClick={() => {
              navigate(`/assetfacility/viewhubdetails/${curHub.hubProcessorId}/hubDetails`, { replace: true });
              navigate(`/assetfacility/edithub/${curHub.hubProcessorId}`);
            }}>
              <HiPencil className="mx-auto" />
              Edit Hub Details
            </Button>
          </div>
        )}
        <Button className="mr-2" onClick={() => {
          navigate(`/assetfacility/viewhubdetails/${curHub.hubProcessorId}/hubDetails`, { replace: true });
          navigate(`/assetfacility/viewfacilitydetails/${curHub.facility.facilityId}`);
        }}>
          View Facility Details
        </Button>
      </div>
      <Table>
        {/* <TableHeader className=" bg-whiten">
            <TableRow>
              <TableHead className="w-1/3 font-bold" colSpan={2}>
                Attribute
              </TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader> */}
        <TableBody>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Hub ID
            </TableCell>
            <TableCell>{curHub.hubProcessorId}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Name
            </TableCell>
            <TableCell>{curHub.processorName}</TableCell>
          </TableRow>
          {curHub.hubStatus != "PENDING" && (
            <TableRow>
              <TableCell className="w-1/3 font-bold" colSpan={2}>
                IP Address Name
              </TableCell>
              <TableCell>{curHub.ipAddressName}</TableCell>
            </TableRow>
          )}
          {curHub.hubStatus != "PENDING" && (
            <TableRow>
              <TableCell className="w-1/3 font-bold" colSpan={2}>
                Last Data Update
              </TableCell>
              <TableCell>{new Date((curHub.lastDataUpdate as any)).toLocaleString()}</TableCell>
            </TableRow>
          )}
          {curHub.hubStatus != "PENDING" && (
            <TableRow>
              <TableCell className="w-1/3 font-bold" colSpan={2}>
                Radio Group
              </TableCell>
              <TableCell>{String(curHub.radioGroup)}</TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Hub Status
            </TableCell>
            <TableCell>{beautifyText(curHub.hubStatus)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

export default ViewHubDetails;