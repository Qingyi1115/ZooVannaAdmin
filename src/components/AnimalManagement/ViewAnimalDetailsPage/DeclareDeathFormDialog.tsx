import * as Form from "@radix-ui/react-form";
import React, { useState } from "react";


import useApiFormData from "../../../hooks/useApiFormData";
import useApiJson from "../../../hooks/useApiJson";

import FormFieldInput from "../../FormFieldInput";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import { useNavigate } from "react-router-dom";
import Animal from "../../../models/Animal";


import { Calendar } from "primereact/calendar";
import Species from "../../../models/Species";

import { Nullable } from "primereact/ts-helpers";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DeclareDeathFormProps {
  curAnimal: Animal;
  refreshSeed: number;
  setRefreshSeed: React.Dispatch<React.SetStateAction<number>>;
}

function DeclareDeathFormDialog(props: DeclareDeathFormProps) {
  const { curAnimal, refreshSeed, setRefreshSeed } = props;

  const apiFormData = useApiFormData();
  const apiJson = useApiJson();
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;

  // fields
  const [speciesList, setSpeciesList] = useState<Species[]>([]);

  const animalCode = curAnimal.animalCode;
  const [locationOfDeath, setLocationOfDeath] = useState<string>("");
  const [dateOfDeath, setDateOfDeath] = useState<Nullable<Date>>(null);
  const [causeOfDeath, setCauseOfDeath] = useState<string>("");

  const [openDialog, setOpenDialog] = useState<boolean>(false);

  // validate functions

  function validateDeathLocation(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter a death location
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateDateOfDeath(props: ValidityState) {
    if (props != undefined) {
      if (dateOfDeath == null) {
        return (
          <div className="font-medium text-danger">
            * Please enter the date of death
          </div>
        );
      }
    }
    // add any other cases here
    return null;
  }

  function validateCauseOfDeath(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter the cause of death
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  // end validate functions

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const imageUrl = curAnimal.imageUrl;
    const growthStage = curAnimal.growthStage;
    const animalCode = curAnimal.animalCode;
    const houseName = curAnimal.houseName;
    const sex = curAnimal.sex;
    const dateOfBirth = curAnimal.dateOfBirth;
    const placeOfBirth = curAnimal.placeOfBirth;
    const identifierType = "None";
    const identifierValue = "";
    const acquisitionMethod = curAnimal.acquisitionMethod;
    const dateOfAcquisition = curAnimal.dateOfAcquisition;
    const acquisitionRemarks = curAnimal.acquisitionRemarks;
    const physicalDefiningCharacteristics =
      curAnimal.physicalDefiningCharacteristics;
    const behavioralDefiningCharacteristics =
      curAnimal.behavioralDefiningCharacteristics;

    const animalStatus = "DECEASED";
    let dateOfDeathInMilliseconds = dateOfDeath?.getTime();

    const declareDeathAnimalObject = {
      animalCode,
      houseName,
      sex,
      dateOfBirth,
      placeOfBirth,
      identifierType,
      identifierValue,
      acquisitionMethod,
      dateOfAcquisition,
      acquisitionRemarks,
      physicalDefiningCharacteristics,
      behavioralDefiningCharacteristics,
      dateOfDeath: dateOfDeathInMilliseconds,
      locationOfDeath,
      causeOfDeath,
      growthStage,
      animalStatus,
      imageUrl,
    };

    // try {
    //   const responseJson = await apiJson.put(
    //     "http://localhost:3000/api/animal/updateAnimal",
    //     updatedAnimal
    //   );
    //   // success
    //   toastShadcn({
    //     description: "Successfully edited animal",
    //   });
    //   setRefreshSeed(refreshSeed + 1);
    //   const redirectUrl = `/animal/viewanimaldetails/${curAnimal.animalCode}/basicinfo`;
    //   navigate(redirectUrl);
    // } catch (error: any) {
    //   toastShadcn({
    //     variant: "destructive",
    //     title: "Uh oh! Something went wrong.",
    //     description:
    //       "An error has occurred while editing animal: \n" + error.message,
    //   });
    // }
    const declareDeathApi = async () => {
      try {
        const response = await apiJson.put(
          "http://localhost:3000/api/animal/updateAnimal",
          declareDeathAnimalObject
        );
        // success
        toastShadcn({
          description: "Successfully declared death!",
        });
        setRefreshSeed(refreshSeed + 1);
        setOpenDialog(false);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while declaring death: \n" + error.message,
        });
      }
    };
    declareDeathApi();
  }

  return (
    <div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button variant={"destructive"}>Declare Death</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Declare Death</DialogTitle>
            <DialogDescription>
              Enter information and declare the passing of an animal
            </DialogDescription>
          </DialogHeader>
          <Form.Root
            className="flex w-full flex-col gap-6 rounded-lg text-black"
            onSubmit={handleSubmit}
          >
            {/* locationOfDeath */}
            <FormFieldInput
              type="text"
              formFieldName="locationOfDeath"
              label="Location of Death"
              required={true}
              placeholder="e.g., Merlion Zoo - in enclosure,..."
              pattern={undefined}
              value={locationOfDeath}
              setValue={setLocationOfDeath}
              validateFunction={validateDeathLocation}
            />

            {/* Date of Acquisition */}
            <Form.Field
              name="dateOfDeath"
              id="dateOfDeathField"
              className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
            >
              <Form.Label className="font-medium">Date of Death</Form.Label>
              <Form.Control
                className="hidden"
                type="text"
                value={dateOfDeath?.toString()}
                required={true}
                onChange={() => null}
              ></Form.Control>
              <Calendar
                value={dateOfDeath}
                className="w-fit"
                onChange={(e: any) => {
                  if (e && e.value !== undefined) {
                    setDateOfDeath(e.value);

                    const element = document.getElementById("dateOfDeathField");
                    if (element) {
                      const isDataInvalid =
                        element.getAttribute("data-invalid");
                      if (isDataInvalid == "true") {
                        element.setAttribute("data-valid", "true");
                        element.removeAttribute("data-invalid");
                      }
                    }
                  }
                }}
              />
              <Form.ValidityState>{validateDateOfDeath}</Form.ValidityState>
            </Form.Field>

            {/* Cause of Death */}
            <Form.Field
              name="causeOfDeath"
              className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
            >
              <Form.Label className="font-medium">Cause of Death</Form.Label>
              <Form.Control
                asChild
                value={causeOfDeath}
                required={true}
                onChange={(e) => setCauseOfDeath(e.target.value)}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium shadow-md outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              >
                <textarea
                  rows={6}
                  placeholder="e.g., old age, cancer..."
                  // className="bg-blackA5 shadow-blackA9 selection:color-white selection:bg-blackA9 box-border inline-flex w-full resize-none appearance-none items-center justify-center rounded-[4px] p-[10px] text-[15px] leading-none text-white shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
                />
              </Form.Control>
              <Form.ValidityState>{validateCauseOfDeath}</Form.ValidityState>
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

export default DeclareDeathFormDialog;
