import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";

import { useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import useApiJson from "../../hooks/useApiJson";
import FeedingPlan from "../../models/FeedingPlan";
import { Separator } from "@/components/ui/separator";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnimalFeedingPlanSessionsSchedule from "../../components/AnimalManagement/AnimalFeedingPlanDetailsPage/AnimalFeedingPlanSessionsSchedule";
import AnimalFeedingPlanInvolvedAnimalDatatable from "../../components/AnimalManagement/AnimalFeedingPlanDetailsPage/AnimalFeedingPlanInvolvedAnimalDatatable";

function AnimalFeedingPlanDetailsPage() {
  const apiJson = useApiJson();
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;

  const { feedingPlanId } = useParams<{ feedingPlanId: string }>();
  const [curFeedingPlan, setCurFeedingPlan] = useState<FeedingPlan | null>(
    null
  );

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/animal/getFeedingPlanById/${feedingPlanId}`
        );
        setCurFeedingPlan(responseJson as FeedingPlan);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchSpecies();
  }, []);

  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-lg">
        {/* Header */}
        <div className="flex flex-col">
          <div className="mb-4 flex justify-between">
            {/* <NavLink className="flex" to={(-1)}> */}
            <Button
              onClick={() => navigate(-1)}
              variant={"outline"}
              type="button"
              className=""
            >
              Back
            </Button>
            {/* </NavLink> */}
            <span className="mt-4 self-center text-title-xl font-bold">
              Feeding Plan Details
            </span>
            <Button disabled className="invisible">
              Back
            </Button>
          </div>
          <Separator />
        </div>
        {/* body */}

        {curFeedingPlan && (
          <div>
            <div>
              <Button>Edit Details and Involved Animals</Button>
              <div className="text-lg font-bold">Basic Information</div>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="w-1/3 font-bold" colSpan={2}>
                      ID
                    </TableCell>
                    <TableCell>{curFeedingPlan?.feedingPlanId}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="w-1/3 font-bold" colSpan={2}>
                      Title
                    </TableCell>
                    <TableCell>{curFeedingPlan?.feedingPlanDesc}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="w-1/3 font-bold" colSpan={2}>
                      Period Start Date
                    </TableCell>
                    <TableCell>
                      {new Date(curFeedingPlan.startDate).toDateString()}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="w-1/3 font-bold" colSpan={2}>
                      Period End Date
                    </TableCell>
                    <TableCell>
                      {new Date(curFeedingPlan.endDate).toDateString()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <br />
              <div className="">
                <div className="text-lg font-bold">Involved Animal List.</div>
                <AnimalFeedingPlanInvolvedAnimalDatatable
                  involvedAnimalList={
                    curFeedingPlan.animals ? curFeedingPlan.animals : []
                  }
                />
              </div>
            </div>
            <div>
              <div className="text-lg font-bold">Schedule and Logs</div>
              <Tabs defaultValue={"sessionSchedule"} className="w-full">
                <TabsList className="no-scrollbar my-4 w-full justify-around overflow-x-auto px-4 text-xs xl:text-base">
                  <TabsTrigger value="sessionSchedule">
                    Session Schedule
                  </TabsTrigger>
                  <TabsTrigger value="feedingLogs">Feeding Logs</TabsTrigger>
                </TabsList>
                <TabsContent value="sessionSchedule">
                  Sessions Schedule Calendar showing sessions and items.
                  Hm...after updating animal, need to remove items that contains
                  that animal. For
                  <Button>Edit Sessions</Button>
                  <AnimalFeedingPlanSessionsSchedule
                    curFeedingPlan={curFeedingPlan}
                    setCurFeedingPlan={setCurFeedingPlan}
                  />
                </TabsContent>
                <TabsContent value="feedingLogs">Feeding Logs</TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnimalFeedingPlanDetailsPage;
