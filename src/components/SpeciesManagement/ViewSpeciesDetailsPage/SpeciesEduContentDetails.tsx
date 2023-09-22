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
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface SpeciesEduContentDetailsProps {
  curSpecies: Species;
}
function SpeciesEduContentDetails(props: SpeciesEduContentDetailsProps) {
  const { curSpecies } = props;
  return (
    <div className="">
      <div className="my-4 flex justify-start gap-6">
        <NavLink to={`/species/editeducontent/${curSpecies.speciesCode}`}>
          <Button>Edit Educational Content</Button>
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
