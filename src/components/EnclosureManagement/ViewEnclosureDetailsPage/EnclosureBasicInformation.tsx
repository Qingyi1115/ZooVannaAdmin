import React from "react";
import Enclosure from "../../../models/Enclosure";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface EnclosureBasicInformationProps {
  curEnclosure: Enclosure;
}

function EnclosureBasicInformation(props: EnclosureBasicInformationProps) {
  const { curEnclosure } = props;

  const navigate = useNavigate();

  const statusTemplate = (status: string) => {
    return (
      <React.Fragment>
        <div className="flex gap-2">
          {/* {statuses.map((status, index) => ( */}
          <div
            // key={index}
            className={` flex w-max items-center justify-center rounded px-1 text-sm font-bold
                ${
                  status === "ACTIVE"
                    ? " bg-emerald-100  text-emerald-900"
                    : status === "CLOSED"
                    ? "bg-red-100 p-[0.1rem] text-red-900"
                    : status === "CONSTRUCTING"
                    ? " bg-blue-100 p-[0.1rem]  text-blue-900"
                    : "bg-gray-100 text-black"
                }`}
          >
            {status}
          </div>
          {/* ))} */}
        </div>
      </React.Fragment>
    );
  };

  return (
    <div>
      <Button
        onClick={() =>
          navigate(
            `/enclosure/editenclosurebasicinfo/${curEnclosure.enclosureId}`
          )
        }
        type="button"
        className=""
      >
        Edit Basic Information
      </Button>
      <br />
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
          <TableRow className="">
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Status
            </TableCell>
            <TableCell>
              {statusTemplate(curEnclosure?.enclosureStatus)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Name
            </TableCell>
            <TableCell>{curEnclosure.name}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Remarks
            </TableCell>
            <TableCell>{curEnclosure.remark}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Length (m)
            </TableCell>
            <TableCell>{Number(curEnclosure.length).toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Width (m)
            </TableCell>
            <TableCell>{Number(curEnclosure.width).toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Height (m)
            </TableCell>
            <TableCell>{Number(curEnclosure.height).toFixed(2)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export default EnclosureBasicInformation;
