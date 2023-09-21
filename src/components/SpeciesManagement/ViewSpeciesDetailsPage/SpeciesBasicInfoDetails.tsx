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

interface SpeciesBasicInfoDetailsProps {
  curSpecies: Species;
}
function SpeciesBasicInfoDetails(props: SpeciesBasicInfoDetailsProps) {
  const { curSpecies } = props;
  return (
    <div className="overflow-hidden rounded-lg border border-strokedark/40 lg:mx-20">
      <Table>
        <TableHeader className=" bg-whiten">
          <TableRow>
            <TableHead className="w-1/3 font-bold" colSpan={2}>
              Attribute
            </TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Species Code
            </TableCell>
            <TableCell>{curSpecies.speciesCode}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Common Name
            </TableCell>
            <TableCell>{curSpecies.commonName}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Scientific Name
            </TableCell>
            <TableCell>{curSpecies.scientificName}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Alias Name&#40;s&#41;
            </TableCell>
            <TableCell>{curSpecies.aliasName}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Conservation Status
            </TableCell>
            <TableCell>{curSpecies.conservationStatus}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/5 font-bold" rowSpan={8}>
              Taxonomy
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/6 font-bold">Domain</TableCell>
            <TableCell>{curSpecies.domain}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/6 font-bold">Kingdom</TableCell>
            <TableCell>{curSpecies.kingdom}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/6 font-bold">Phylum</TableCell>
            <TableCell>{curSpecies.phylum}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/6 font-bold">Class</TableCell>
            <TableCell>{curSpecies.speciesClass}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/6 font-bold">Order</TableCell>
            <TableCell>{curSpecies.order}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/6 font-bold">Family</TableCell>
            <TableCell>{curSpecies.family}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/6 font-bold">Genus</TableCell>
            <TableCell>{curSpecies.genus}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Native Continent
            </TableCell>
            <TableCell>{curSpecies.nativeContinent}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Native Biome&#40;s&#41;
            </TableCell>
            <TableCell>{curSpecies.nativeBiomes.replace(/,/g, ", ")}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Group Sexual Dynamic
            </TableCell>
            <TableCell>{curSpecies.groupSexualDynamic}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              General Diet Preference
            </TableCell>
            <TableCell>{curSpecies.generalDietPreference}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Life Expectancy &#40;in Years&#41;
            </TableCell>
            <TableCell>{curSpecies.lifeExpectancyYears}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export default SpeciesBasicInfoDetails;
