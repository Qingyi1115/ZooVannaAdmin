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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import SpeciesCard from "./SpeciesCard";
import EnclosureCard from "./EnclosureCard";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimalParentsCard from "./AnimalParentsCard";

interface AnimalBasicInformationProps {
  curAnimal: Animal;
}

function AnimalBasicInformation(props: AnimalBasicInformationProps) {
  const { curAnimal } = props;

  const statusColorClass =
    curAnimal.animalStatus === "NORMAL"
      ? "bg-green-600"
      : curAnimal.animalStatus === "PREGNANT"
      ? "bg-warning"
      : curAnimal.animalStatus === "SICK" ||
        curAnimal.animalStatus === "INJURED"
      ? "bg-destructive"
      : "";

  function calculateAge(dateOfBirth: Date): string {
    const dob = dateOfBirth;
    const todayDate = new Date();

    // Calculate the difference in milliseconds between the two dates
    const ageInMilliseconds = todayDate.getTime() - dob.getTime();

    // Convert milliseconds to years (assuming an average year has 365.25 days)
    const ageInYears = ageInMilliseconds / (365.25 * 24 * 60 * 60 * 1000);

    // Calculate the remaining months
    const ageInMonths = (ageInYears - Math.floor(ageInYears)) * 12;

    // Format the result as "x years & y months"
    const formattedAge = `${Math.floor(ageInYears)} years & ${Math.floor(
      ageInMonths
    )} months`;

    return formattedAge;
  }

  const updateStatusDialog = (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Update Status</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">test</div>
          <div className="grid grid-cols-4 items-center gap-4">input</div>
        </div>
        <DialogFooter>
          <Button type="submit">Update Status</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const declateDeathDialog = (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"destructive"}>Declare Death</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">test</div>
          <div className="grid grid-cols-4 items-center gap-4">input</div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div>
      <div className="flex w-full justify-between gap-10">
        <div className="w-full">
          <span className="text-xl font-medium">
            {curAnimal.isGroup ? (
              <span>{curAnimal.houseName} are a group of:</span>
            ) : (
              <span>{curAnimal.houseName} is a:</span>
            )}
          </span>{" "}
          <br />
          <SpeciesCard curSpecies={curAnimal.species} />
        </div>
        <div className="w-full">
          <span className="text-xl font-medium">Current Location: </span>
          <br />
          <EnclosureCard />
        </div>
      </div>
      <br />
      <div>
        <span className="text-xl font-medium">(Known) Parents:</span>
        <AnimalParentsCard curAnimal={curAnimal} />
      </div>
      <br />
      <span className="text-xl font-medium">
        {curAnimal.houseName}'s Details:
      </span>
      <div className="my-4 flex justify-start gap-4">
        <NavLink to={`/animal/editanimal/${curAnimal.animalCode}`}>
          <Button>Edit Basic Information</Button>
        </NavLink>
        {updateStatusDialog}
        {declateDeathDialog}
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
          <TableRow className="">
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Status
            </TableCell>
            <TableCell>
              <div
                className={`${statusColorClass} w-min rounded-sm p-2 font-bold text-whiter`}
              >
                {curAnimal.animalStatus}
              </div>
            </TableCell>
          </TableRow>
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
            <TableCell className="w-1/5 font-bold" rowSpan={3}>
              Identifier
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/6 font-bold">Type</TableCell>
            <TableCell>{curAnimal.identifierType}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/6 font-bold">Value</TableCell>
            <TableCell>{curAnimal.identifierValue}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Age
            </TableCell>
            <TableCell>
              {calculateAge(new Date(curAnimal.dateOfBirth))}
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
            <TableCell>
              {new Date(curAnimal.dateOfBirth).toDateString()}
            </TableCell>
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
            <TableCell>
              {new Date(curAnimal.dateOfAcquisition).toDateString()}
            </TableCell>
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
