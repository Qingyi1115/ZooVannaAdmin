import { useEffect, useState } from "react";
import { useParams } from "react-router";

import AnimalActivity from "../../models/AnimalActivity";




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

import AddItemToActivityForm from "../../components/AnimalManagement/CreateAnimalActivityPage/AddItemToActivityForm";
import beautifyText from "../../hooks/beautifyText";

function AddItemToActivityPage() {
  const apiJson = useApiJson();
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;

  const { animalActivityId } = useParams<{ animalActivityId: string }>();

  const [curAnimalActivity, setCurAnimalActivity] =
    useState<AnimalActivity | null>(null);

  useEffect(() => {
    const fetchAnimalActivity = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/animal/getAnimalActivityById/${animalActivityId}`
        );
        setCurAnimalActivity(responseJson.animalActivity as AnimalActivity);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchAnimalActivity();
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
              Add Item To Activity
            </span>
            <Button disabled className="invisible">
              Back
            </Button>
          </div>
          <Separator />
        </div>

        {/* body */}
        {curAnimalActivity && (
          <div>
            <div>Current Activity:</div>
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
                  <TableCell>{beautifyText(curAnimalActivity.activityType)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="w-1/3 font-bold" colSpan={2}>
                    Details
                  </TableCell>
                  <TableCell>{curAnimalActivity.details}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Separator className="my-4" />
            <AddItemToActivityForm curAnimalActivity={curAnimalActivity} />
          </div>
        )}
      </div>
    </div>
  );
}

export default AddItemToActivityPage;
