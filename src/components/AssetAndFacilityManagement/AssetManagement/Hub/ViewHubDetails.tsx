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
import Hub from "../../../../models/Hub";
import { Separator } from "@radix-ui/react-select";
import { NavLink, useNavigate } from "react-router-dom";
import { HiPencil } from "react-icons/hi";

interface HubDetailsProps {
  pageFacilityId: string | undefined;
  curHub: Hub;
  refreshSeed: number;
  setRefreshSeed: React.Dispatch<React.SetStateAction<number>>;
}
function ViewHubDetails(props: HubDetailsProps) {
  const { pageFacilityId, curHub, refreshSeed, setRefreshSeed } = props;
  console.log(props);
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;

  return (
    <div className="flex flex-col">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-lg">

        <div className="flex justify-between">
          <Button variant={"outline"} type="button" onClick={() => navigate(-1)} className="">
            Back
          </Button>
          <span className="self-center text-lg text-graydark">
            View Hub Details
          </span>
          <Button disabled className="invisible">
            Back
          </Button>
        </div>

        <hr className="bg-stroke opacity-20" />
        <span className=" self-center text-title-xl font-bold">
          {curHub.processorName}
        </span>
        <NavLink to={`/assetfacility/edithub/${curHub.hubProcessorId}`}>
          <Button className="mr-2">
            <HiPencil className="mx-auto" />
          </Button>
        </NavLink>
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
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              IP Address Name
            </TableCell>
            <TableCell>{curHub.ipAddressName}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Last Data Update
            </TableCell>
            <TableCell>{String(curHub.lastDataUpdate)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Hub Secret
            </TableCell>
            <TableCell>{String(curHub.hubSecret) == "false" ? "No" : "Yes"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Hub Status
            </TableCell>
            <TableCell>{curHub.hubStatus}</TableCell>
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