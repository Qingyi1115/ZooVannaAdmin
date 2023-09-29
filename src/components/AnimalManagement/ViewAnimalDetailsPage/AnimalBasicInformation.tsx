import React from "react";
import Animal from "../../../models/Animal";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SpeciesCard from "./SpeciesCard";

interface AnimalBasicInformationProps {
  curAnimal: Animal;
}

function AnimalBasicInformation(props: AnimalBasicInformationProps) {
  const { curAnimal } = props;
  return (
    <div>
      <div>
        {curAnimal.houseName} is a: <br />
        <div>
          <SpeciesCard curSpecies={curAnimal.species} />
        </div>
      </div>
      <div>
        Current Location: <br />
        <div>
          blabla enclosure card here, can navigate to view enclosure details
        </div>
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
              Animal Code
            </TableCell>
            <TableCell>{curAnimal.animalCode}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              House Name
            </TableCell>
            <TableCell>{curAnimal.houseName}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Sex
            </TableCell>
            <TableCell>{curAnimal.sex}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              RFID Tag Number (if any)
            </TableCell>
            <TableCell>{curAnimal.rfidTagNum}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Current Weight
            </TableCell>
            <TableCell>{curAnimal.weight} kg</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Age
            </TableCell>
            <TableCell>
              <span className="text-red-400">AGEEE AA DO SOMETHING</span>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Current Growth Stage
            </TableCell>
            <TableCell>{curAnimal.growthStage}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/5 font-bold" rowSpan={3}>
              Birth
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/6 font-bold">Date</TableCell>
            <TableCell>{curAnimal.dateOfBirth.toDateString()}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/6 font-bold">Place</TableCell>
            <TableCell>{curAnimal.placeOfBirth}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/5 font-bold" rowSpan={4}>
              Acquisition
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/6 font-bold">Date</TableCell>
            <TableCell>{curAnimal.dateOfAcquisition.toDateString()}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/6 font-bold">Method</TableCell>
            <TableCell>{curAnimal.acquisitionMethod}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/6 font-bold">Remarks</TableCell>
            <TableCell>{curAnimal.acquisitionRemarks}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Physical Defining Characteristics
            </TableCell>
            <TableCell>{curAnimal.physicalDefiningCharacteristics}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Behavioural Defining Characteristics
            </TableCell>
            <TableCell>{curAnimal.behavioralDefiningCharacteristics}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export default AnimalBasicInformation;
