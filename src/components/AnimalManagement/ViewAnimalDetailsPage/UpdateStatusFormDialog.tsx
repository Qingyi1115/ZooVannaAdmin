import * as Form from "@radix-ui/react-form";
import React, { useEffect, useState } from "react";

import { ListBox } from "primereact/listbox";

import useApiJson from "../../../hooks/useApiJson";


import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

import { useNavigate } from "react-router-dom";
import Animal from "../../../models/Animal";

import {
  AnimalStatus
} from "../../../enums/Enumurated";



interface UpdateStatusFormDialogProps {
  curAnimal: Animal;
  refreshSeed: number;
  setRefreshSeed: any;
}

function UpdateStatusFormDialog(props: UpdateStatusFormDialogProps) {
  const { curAnimal, refreshSeed, setRefreshSeed } = props;

  // const apiFormData = useApiFormData();
  const apiJson = useApiJson();
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;

  const animalCode = curAnimal.animalCode;
  const [animalStatusString, setAnimalStatusString] = useState<string>(
    curAnimal.animalStatus
  );
  const [animalStatuses, setAnimalStatuses] = useState<string[]>(
    animalStatusString.split(",")
  );
  const [selectedStatuses, setSelectedStatuses] = useState<string | undefined>(
    undefined
  );

  const statusesAvailable = Object.keys(AnimalStatus)
    .filter(
      (animalStatus) =>
        AnimalStatus[animalStatus as keyof typeof AnimalStatus] !== "DECEASED"
    )
    .flatMap((animalStatus) => [
      AnimalStatus[animalStatus as keyof typeof AnimalStatus].toString(),
    ]);

  const [openDialog, setOpenDialog] = useState<boolean>(false);

  // set initial selected statuses
  useEffect(() => {
    // setAnimalStatusString(curAnimal.animalStatus);
    setAnimalStatuses(curAnimal.animalStatus.split(","));
  }, [curAnimal]);

  // validation
  // validate at least one status is selected
  function validateStatuses(props: ValidityState) {
    // if (props != undefined) {
    if (selectedStatuses == undefined || selectedStatuses.length < 1) {
      return (
        <div className="font-medium text-danger">
          * Please select at least one status!
        </div>
      );
    }
    // console.log("aaaa");
    // console.log(selectedStatuses.includes("NORMAL"));
    // console.log(selectedStatuses);
    // console.log("----------");
    if (
      selectedStatuses.includes("NORMAL") &&
      (selectedStatuses.includes("SICK") ||
        selectedStatuses.includes("INJURED"))
    ) {
      return (
        <div className="font-medium text-danger">
          * Animal that is pregnant, sick or injured cannot be "normal" as well!
        </div>
      );
    }
    if (
      selectedStatuses.includes("OFFSITE") &&
      selectedStatuses.includes("RELEASED")
    ) {
      return (
        <div className="font-medium text-danger">
          * Animal that is pregnant, sick or injured cannot be "normal" as well!
        </div>
      );
    }
    // add any other cases here
    // }
    return null;
  }
  // end validation

  //
  const statusTemplate = (statuses: string[]) => {
    return (
      <React.Fragment>
        <div className="flex gap-2">
          {statuses.map((status, index) => (
            <div
              key={index}
              className={` flex w-max items-center justify-center rounded px-1 text-sm font-bold
                ${
                  status === "NORMAL"
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

  //
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let animalStatus = selectedStatuses?.toString();
    const updatedStatuses = {
      animalCode,
      animalStatus,
    };

    console.log("hahah");

    const updateStatusApi = async () => {
      try {
        const response = await apiJson.put(
          "http://localhost:3000/api/animal/updateAnimalStatus",
          updatedStatuses
        );
        // success
        toastShadcn({
          description: "Successfully updated statuses!",
        });
        setRefreshSeed(refreshSeed + 1);
        setOpenDialog(false);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while updating statuses: \n" + error.message,
        });
      }
    };
    updateStatusApi();
  }

  return (
    <div>
      <style>
        {`
          /* Target the class name for ListBox items */
          .p-listbox-item {
            padding: 2px 8px;
          }
        `}
      </style>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button>Update Status</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Animal Status</DialogTitle>
            {/* <DialogDescription>
                Select one or multiple statuses
              </DialogDescription> */}
          </DialogHeader>
          <Form.Root
            className=""
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <div className="mb-2 w-full">
              Previous Status(es): <br />
              {statusTemplate(animalStatuses)}
            </div>
            <Form.Field
              id="selectMultiBiomeField"
              name="biomes"
              className="flex flex-col gap-1 data-[invalid]:text-danger lg:w-full"
            >
              <Form.Label>Select one or multiple status(es):</Form.Label>
              <Form.Control
                className="hidden"
                type="text"
                value={selectedStatuses}
                required={true}
              />
              <ListBox
                multiple
                value={selectedStatuses}
                onChange={(e) => setSelectedStatuses(e.value)}
                options={statusesAvailable}
                className="md:w-14rem w-full"
                style={{ fontSize: "14px", padding: "2px 6px" }}
              />
              <Form.ValidityState>{validateStatuses}</Form.ValidityState>
            </Form.Field>

            <DialogFooter className="mt-2">
              <Button
                type="button"
                variant={"ghost"}
                onClick={() => setOpenDialog(false)}
              >
                Cancel
              </Button>
              <Form.Submit asChild>
                <Button>Submit</Button>
              </Form.Submit>
            </DialogFooter>
          </Form.Root>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UpdateStatusFormDialog;
