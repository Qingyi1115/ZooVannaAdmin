import React from "react";
import Animal from "../../../models/Animal";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableRow
} from "@/components/ui/table";
import { NavLink, useNavigate } from "react-router-dom";
import beautifyText from "../../../hooks/beautifyText";
import AnimalParentsCard from "./AnimalParentsCard";
import EnclosureCard from "./EnclosureCard";
import SpeciesCard from "./SpeciesCard";
import UpdateStatusFormDialog from "./UpdateStatusFormDialog";

interface AnimalBasicInformationProps {
  curAnimal: Animal;
  setCurAnimal: any;
  refreshSeed: number;
  setRefreshSeed: any;
}

function AnimalBasicInformation(props: AnimalBasicInformationProps) {
  const { curAnimal, setCurAnimal, refreshSeed, setRefreshSeed } = props;

  const navigate = useNavigate();

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

  // const updateStatusDialog = (
  //   <Dialog>
  //     <DialogTrigger asChild>
  //       <Button>Update Status</Button>
  //     </DialogTrigger>
  //     <DialogContent className="sm:max-w-[425px]">
  //       <DialogHeader>
  //         <DialogTitle>Edit profile</DialogTitle>
  //         <DialogDescription>
  //           Make changes to your profile here. Click save when you're done.
  //         </DialogDescription>
  //       </DialogHeader>
  //       <div>
  //         <UpdateStatusForm
  //           curAnimal={curAnimal}
  //           refreshSeed={refreshSeed}
  //           setRefreshSeed={setRefreshSeed}
  //         />
  //       </div>
  //       <DialogFooter>
  //         <Button type="submit">Update Status</Button>
  //       </DialogFooter>
  //     </DialogContent>
  //   </Dialog>
  // );

  // const declareDeathDialog = (
  //   <Dialog>
  //     <DialogTrigger asChild>
  //       <Button variant={"destructive"}>Declare Death</Button>
  //     </DialogTrigger>
  //     <DialogContent className="sm:max-w-[425px]">
  //       <DialogHeader>
  //         <DialogTitle>Declare Death</DialogTitle>
  //         <DialogDescription>
  //           Enter information and declare the passing of an animal
  //         </DialogDescription>
  //       </DialogHeader>
  //       <DeclareDeathForm
  //         curAnimal={curAnimal}
  //         refreshSeed={refreshSeed}
  //         setRefreshSeed={setRefreshSeed}
  //       />
  //       <DialogFooter>
  //         <Button type="submit">Save changes</Button>
  //       </DialogFooter>
  //     </DialogContent>
  //   </Dialog>
  // );

  const statusTemplate = (statuses: string[]) => {
    return (
      <React.Fragment>
        <div className="flex gap-2">
          {statuses.map((status, index) => (
            <div
              key={index}
              className={` flex w-max items-center justify-center rounded px-1 text-sm font-bold
                ${status === "NORMAL"
                  ? " bg-emerald-100  text-emerald-900"
                  : status === "PREGNANT"
                    ? " bg-orange-100 p-[0.1rem] text-orange-900"
                    : status === "SICK"
                      ? " bg-yellow-100 p-[0.1rem]  text-yellow-900"
                      : status === "INJURED"
                        ? "bg-red-100 p-[0.1rem] text-red-900"
                        : status === "OFFSITE"
                          ? " bg-blue-100 p-[0.1rem]  text-blue-900"
                          : status === "RELEASED"
                            ? " bg-fuchsia-100 p-[0.1rem]  text-fuchsia-900"
                            : status === "DECEASED"
                              ? " bg-slate-300 p-[0.1rem]  text-slate-900"
                              : "bg-gray-100 text-black"
                }`}
            >
              {status}
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  };

  return (
    <div>
      <div className="flex h-80 w-full gap-6">
        <div className="flex h-full w-2/5 flex-col justify-between">
          <div className="w-full">
            <SpeciesCard curSpecies={curAnimal.species} />
          </div>
          <div className="w-full">
            <EnclosureCard curAnimal={curAnimal} />
          </div>
        </div>
        <div className="flex h-full w-3/5 flex-col">
          {!curAnimal.isGroup ? (
            <AnimalParentsCard
              curAnimal={curAnimal}
              setCurAnimal={setCurAnimal}
              refreshSeed={refreshSeed}
              setRefreshSeed={setRefreshSeed}
            />
          ) : (
            <div>
              <Card className="h-full">
                <CardContent className="flex h-full justify-center gap-2 p-4">
                  Lineage information not available for animal groups
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      <Separator className="mb-10 mt-14" />
      <span className="text-xl font-medium">Animal Details</span>
      <div className="my-4 flex justify-start gap-4">
        <NavLink to={`/animal/editanimal/${curAnimal.animalCode}`}>
          <Button>Edit Basic Information</Button>
        </NavLink>
        <UpdateStatusFormDialog
          curAnimal={curAnimal}
          refreshSeed={refreshSeed}
          setRefreshSeed={setRefreshSeed}
        />
        {/* <DeclareDeathFormDialog
          curAnimal={curAnimal}
          refreshSeed={refreshSeed}
          setRefreshSeed={setRefreshSeed}
        /> */}
        <Button
          variant={"destructive"}
          onClick={() =>
            navigate(`/animal/declaredeath/${curAnimal.animalCode}`)
          }
        >
          Declare Death
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
          <TableRow className="">
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Status
            </TableCell>
            <TableCell>
              {statusTemplate(curAnimal.animalStatus.split(","))}
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
            <TableCell>
              {curAnimal.sex == null || curAnimal.sex.toString() == "" ? (
                <span className="">—</span>
              ) : (
                beautifyText(curAnimal.sex)
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/5 font-bold" rowSpan={3}>
              Identifier
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/6 font-bold">Type</TableCell>
            <TableCell>
              {curAnimal.identifierType == "" ||
                curAnimal.identifierType == null ? (
                <span className="">—</span>
              ) : (
                curAnimal.identifierType
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/6 font-bold">Value</TableCell>
            <TableCell>
              {curAnimal.identifierValue == "" ||
                curAnimal.identifierValue == null ? (
                <span className="">—</span>
              ) : (
                curAnimal.identifierValue
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Age
            </TableCell>
            <TableCell>
              {curAnimal.dateOfBirth?.toString() == "" ||
                curAnimal.dateOfBirth == null ? (
                <span className="">—</span>
              ) : (
                calculateAge(new Date(curAnimal.dateOfBirth))
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Current Growth Stage
            </TableCell>
            <TableCell>{beautifyText(curAnimal.growthStage)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/5 font-bold" rowSpan={3}>
              Birth
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/6 font-bold">Date</TableCell>
            <TableCell>
              {curAnimal.dateOfBirth == null ? (
                <span className="">—</span>
              ) : (
                new Date(curAnimal.dateOfBirth).toDateString()
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/6 font-bold">Place</TableCell>
            <TableCell>
              {curAnimal.placeOfBirth == "" ? (
                <span className="">—</span>
              ) : (
                curAnimal.placeOfBirth
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/5 font-bold" rowSpan={4}>
              Acquisition
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/6 font-bold">Date</TableCell>
            <TableCell>
              {curAnimal.dateOfAcquisition == null ? (
                <span className="">—</span>
              ) : (
                new Date(curAnimal.dateOfAcquisition).toDateString()
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/6 font-bold">Method</TableCell>
            <TableCell>{beautifyText(curAnimal.acquisitionMethod)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/6 font-bold">Remarks</TableCell>
            <TableCell>
              {curAnimal.acquisitionRemarks == "" ||
                curAnimal.acquisitionRemarks == null ? (
                <span className="">—</span>
              ) : (
                curAnimal.acquisitionRemarks
              )}
            </TableCell>
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
          {curAnimal.animalStatus.split(",").includes("DECEASED") && (
            <TableRow>
              <TableCell className="w-1/3 font-bold" colSpan={2}>
                Death Location
              </TableCell>
              <TableCell>{curAnimal.locationOfDeath}</TableCell>
            </TableRow>
          )}
          {curAnimal.animalStatus.split(",").includes("DECEASED") && (
            <TableRow>
              <TableCell className="w-1/3 font-bold" colSpan={2}>
                Date of Death
              </TableCell>
              <TableCell>
                {curAnimal.dateOfDeath &&
                  new Date(curAnimal.dateOfDeath).toDateString()}
              </TableCell>
            </TableRow>
          )}
          {curAnimal.animalStatus.split(",").includes("DECEASED") && (
            <TableRow>
              <TableCell className="w-1/3 font-bold" colSpan={2}>
                Cause of Death
              </TableCell>
              <TableCell>{curAnimal.causeOfDeath}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default AnimalBasicInformation;
