import React, { useState } from "react";

import * as Form from "@radix-ui/react-form";

import useApiJson from "../../../hooks/useApiJson";
import FormFieldInput from "../../FormFieldInput";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { NavLink } from "react-router-dom";

import { Calendar, CalendarChangeEvent } from "primereact/calendar";

import { useNavigate } from "react-router-dom";
import Animal from "../../../models/Animal";

interface CreateWeightRecordFormProps {
  curAnimal: Animal;
}

function CreateWeightRecordForm(props: CreateWeightRecordFormProps) {
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;
  const navigate = useNavigate();
  const { curAnimal } = props;

  // fields
  const [dateOfMeasure, setDateOfMeasure] = useState<
    string | Date | Date[] | null
  >(null);
  const [weightInKg, setWeightInKg] = useState<number | undefined>(undefined);

  //////
  // validation functions
  /////
  function validateWeightInKg(props: ValidityState) {
    if (props != undefined) {
      if (weightInKg == undefined) {
        return (
          <div className="font-medium text-danger">* Please enter a weight</div>
        );
      } else if (weightInKg <= 0) {
        return (
          <div className="font-medium text-danger">
            * Weight must be greater than 0
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateDateOfMeasure(props: ValidityState) {
    if (props != undefined) {
      if (dateOfMeasure == null) {
        return (
          <div className="font-medium text-danger">* Please enter a date</div>
        );
      }
    }
    // add any other cases here
    return null;
  }

  // end validation functions

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Remember, your form must have enctype="multipart/form-data" for upload pictures
    e.preventDefault();
    const animalCode = curAnimal.animalCode;
    const newAnimalWeight = {
      animalCode,
      dateOfMeasure,
      weightInKg,
    };

    const createAnimalWeightRecordApi = async () => {
      try {
        const response = await apiJson.post(
          "http://localhost:3000/api/animal/addAnimalWeight",
          newAnimalWeight
        );
        // success
        toastShadcn({
          description:
            "Successfully created a new weight record for " +
            curAnimal.houseName,
        });
        const redirectUrl = `/animal/viewanimaldetails/${curAnimal.animalCode}/weight`;
        navigate(redirectUrl);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while creating weight record: \n" +
            error.message,
        });
      }
    };
    createAnimalWeightRecordApi();
  }

  return (
    <div>
      <Form.Root
        className="flex w-full flex-col gap-8 rounded-lg bg-white text-black"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="flex flex-col">
          <div className="mb-4 flex justify-between">
            <NavLink
              className="flex"
              to={`/animal/viewanimaldetails/${curAnimal.animalCode}/weight`}
            >
              <Button variant={"outline"} type="button" className="">
                Back
              </Button>
            </NavLink>
            <span className="self-center text-lg text-graydark">
              Create Animal Weight Record
            </span>
            <Button disabled className="invisible">
              Back
            </Button>
          </div>
          <Separator />
          <span className="mt-4 self-center text-title-xl font-bold">
            {curAnimal.houseName}
          </span>
        </div>

        <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
          {/* Amount Per Meal */}
          <FormFieldInput
            type="number"
            formFieldName="weightInKg"
            label={`Weight Recorded (kg)`}
            required={true}
            pattern={undefined}
            placeholder="e.g., 8"
            value={weightInKg}
            setValue={setWeightInKg}
            validateFunction={validateWeightInKg}
          />

          {/* Date of Measure */}
          <Form.Field
            name="dateOfMeasure"
            id="dateOfMeasureField"
            className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
          >
            <Form.Label className="font-medium">Date of Measurement</Form.Label>
            <Form.Control
              className="hidden"
              type="text"
              value={dateOfMeasure?.toString()}
              required={true}
              onChange={() => null}
            ></Form.Control>
            <Calendar
              value={dateOfMeasure}
              className="w-fit"
              onChange={(e: CalendarChangeEvent) => {
                if (e && e.value !== undefined) {
                  setDateOfMeasure(e.value);

                  const element = document.getElementById("dateOfMeasureField");
                  if (element) {
                    const isDataInvalid = element.getAttribute("data-invalid");
                    if (isDataInvalid == "true") {
                      element.setAttribute("data-valid", "true");
                      element.removeAttribute("data-invalid");
                    }
                  }
                }
              }}
            />
            <Form.ValidityState>{validateDateOfMeasure}</Form.ValidityState>
          </Form.Field>
        </div>

        <Form.Submit asChild>
          <Button
            disabled={apiJson.loading}
            className="h-12 w-2/3 self-center rounded-full text-lg"
          >
            {!apiJson.loading ? <div>Submit</div> : <div>Loading</div>}
          </Button>
        </Form.Submit>
      </Form.Root>
    </div>
  );
}

export default CreateWeightRecordForm;
