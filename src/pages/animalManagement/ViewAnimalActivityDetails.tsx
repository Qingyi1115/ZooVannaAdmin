import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useApiJson from "../../hooks/useApiJson";
import AnimalActivity from "../../models/AnimalActivity";
import Animal from "../../models/Animal";
import EnrichmentItem from "../../models/EnrichmentItem";

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
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

function ViewAnimalActivityDetails() {
  const apiJson = useApiJson();

  const { animalActivityId } = useParams<{ animalActivityId: string }>();

  const [curAnimalActivity, setCurAnimalActivity] =
    useState<AnimalActivity | null>(null);
  const [refreshSeed, setRefreshSeed] = useState<number>(0);

  useEffect(() => {
    const fetchAnimalActivity = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/animal/getAnimalActivityById/${animalActivityId}`
        );
        setCurAnimalActivity(responseJson as AnimalActivity);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchAnimalActivity();
  }, [refreshSeed]);

  return (
    <div className="p-10">
      {curAnimalActivity && (
        <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-lg">
          {/* Header */}
          <div className="flex flex-col">
            <div className="mb-4 flex justify-between">
              <NavLink className="flex" to={`/animal/viewallanimals/`}>
                <Button variant={"outline"} type="button" className="">
                  Back
                </Button>
              </NavLink>
              <span className="mt-4 self-center text-title-xl font-bold">
                Animal Activity Details
              </span>
              <Button disabled className="invisible">
                Back
              </Button>
            </div>
            <Separator />
          </div>
          {/* body */}
          <div>
            {/*  */}
            <div className="text-xl font-medium">Basic Information:</div>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="w-1/3 font-bold" colSpan={2}>
                    ID
                  </TableCell>
                  <TableCell>{curAnimalActivity.animalActivityId}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="w-1/3 font-bold" colSpan={2}>
                    Title
                  </TableCell>
                  <TableCell>{curAnimalActivity.title}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="w-1/3 font-bold" colSpan={2}>
                    Type
                  </TableCell>
                  <TableCell>{curAnimalActivity.activityType}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="w-1/3 font-bold" colSpan={2}>
                    Date
                  </TableCell>
                  <TableCell>
                    {new Date(curAnimalActivity.date).toDateString()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="w-1/3 font-bold" colSpan={2}>
                    Session Timing
                  </TableCell>
                  <TableCell>{curAnimalActivity.session}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="w-1/3 font-bold" colSpan={2}>
                    Duration (Minutes)
                  </TableCell>
                  <TableCell>{curAnimalActivity.durationInMinutes}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="w-1/3 font-bold" colSpan={2}>
                    Details
                  </TableCell>
                  <TableCell>{curAnimalActivity.details}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            {/*  */}
            <div className="text-xl font-medium">Involved Animal(s):</div>
            {/*  */}
            <div className="text-xl font-medium">Item(s) to be used:</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewAnimalActivityDetails;
