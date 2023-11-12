import { useEffect, useState } from "react";
import { useParams } from "react-router";

import ZooEvent from "../../models/ZooEvent";




import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableRow
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import useApiJson from "../../hooks/useApiJson";

import AddAnimalToEventForm from "../../components/EventManagement/CreateZooEventPage/AddAnimalToZooEventForm";
import beautifyText from "../../hooks/beautifyText";

function AddAnimalToZooEventPage() {
  const apiJson = useApiJson();
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;

  const { zooEventId } = useParams<{ zooEventId: string }>();

  const [curZooEvent, setCurZooEvent] =
    useState<ZooEvent | null>(null);

  useEffect(() => {
    const fetchZooEvent = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/zooEvent/getZooEventById/${zooEventId}`
        );
        setCurZooEvent(responseJson["zooEvent"] as ZooEvent);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchZooEvent();
  }, []);

  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-10 text-black shadow-default">
        {/* Header */}
        <div className="flex flex-col">
          <div className="mb-4 flex justify-between">
            <Button
              variant={"outline"}
              type="button"
              className=""
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
            <span className=" self-center text-title-xl font-bold">
              Add Animal To Event
            </span>
            <Button disabled className="invisible">
              Back
            </Button>
          </div>
          <Separator />
        </div>

        {/* body */}
        {curZooEvent && (
          <div>
            <div>Current Event:</div>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="w-1/3 font-bold" colSpan={2}>
                    ID
                  </TableCell>
                  <TableCell>{curZooEvent.zooEventId}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="w-1/3 font-bold" colSpan={2}>
                    Name
                  </TableCell>
                  <TableCell>{curZooEvent.eventName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="w-1/3 font-bold" colSpan={2}>
                    Type
                  </TableCell>
                  <TableCell>{beautifyText(curZooEvent.eventType)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="w-1/3 font-bold" colSpan={2}>
                    Description
                  </TableCell>
                  <TableCell>{curZooEvent.eventDescription}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Separator className="my-4" />
            <AddAnimalToEventForm curZooEvent={curZooEvent} />
          </div>
        )}
      </div>
    </div>
  );
}

export default AddAnimalToZooEventPage;
