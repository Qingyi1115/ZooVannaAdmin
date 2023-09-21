import React from "react";
import Species from "../../../models/Species";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SpeciesEduContentDetailsProps {
  curSpecies: Species;
}
function SpeciesEduContentDetails(props: SpeciesEduContentDetailsProps) {
  const { curSpecies } = props;
  return (
    <div className="overflow-hidden rounded-lg">
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
              Description
            </TableCell>
            <TableCell>{curSpecies.educationalDescription}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Fun Fact
            </TableCell>
            <TableCell>{curSpecies.educationalFunFact}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export default SpeciesEduContentDetails;
