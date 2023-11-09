import { useEffect, useState } from "react";
import { useParams } from "react-router";

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

import AddAnimalToActivityForm from "../../components/AnimalManagement/CreateAnimalActivityPage/AddAnimalToActivityForm";
import beautifyText from "../../hooks/beautifyText";
import PublicEvent from "../../models/PublicEvent";
import AddAnimalToPublicEventForm from "../../components/EventManagement/AddAnimalToActivityForm";

function AddAnimalToPublicEventPage() {
  const apiJson = useApiJson();
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;

  const { publicEventId } = useParams<{ publicEventId: string }>();

  const [curPublicEvent, setCurPubliEvent] =
    useState<PublicEvent | null>(null);

  useEffect(() => {
    const fetchPubliEvent = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/zooEvent/getPublicEventById/${publicEventId}`
        );
        console.log("AddAnimalToPublicEventPage", responseJson)
        setCurPubliEvent(responseJson.publicEvent);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchPubliEvent();
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
              Add Animal To Activity
            </span>
            <Button disabled className="invisible">
              Back
            </Button>
          </div>
          <Separator />
        </div>

        {/* body */}
        {curPublicEvent && (
          <div>
            <div>Current Activity:</div>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="w-1/3 font-bold" colSpan={2}>
                    ID
                  </TableCell>
                  <TableCell>{curPublicEvent.publicEventId}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="w-1/3 font-bold" colSpan={2}>
                    Title
                  </TableCell>
                  <TableCell>{curPublicEvent.title}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="w-1/3 font-bold" colSpan={2}>
                    Type
                  </TableCell>
                  <TableCell>{beautifyText(curPublicEvent.eventType)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="w-1/3 font-bold" colSpan={2}>
                    Details
                  </TableCell>
                  <TableCell>{curPublicEvent.details}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Separator className="my-4" />
            <AddAnimalToPublicEventForm curPublicEvent={curPublicEvent} />
          </div>
        )}
      </div>
    </div>
  );
}

export default AddAnimalToPublicEventPage;
