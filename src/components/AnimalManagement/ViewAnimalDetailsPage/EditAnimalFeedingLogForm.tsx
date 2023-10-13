import React, { useEffect, useState } from "react";
import * as Form from "@radix-ui/react-form";


import FormFieldInput from "../../FormFieldInput";
import useApiJson from "../../../hooks/useApiJson";
import { useToast } from "@/components/ui/use-toast";
import FormFieldSelect from "../../FormFieldSelect";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import AnimalFeedingLog from "../../../models/AnimalFeedingLog";
import { useAuthContext } from "../../../hooks/useAuthContext";
import Animal from "../../../models/Animal";
import { Calendar, CalendarChangeEvent } from "primereact/calendar";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { set } from "date-fns";

interface EditAnimalFeedingLogFormProps {
  curAnimalFeedingLog: AnimalFeedingLog
}

function EditAnimalFeedingLogForm(props: EditAnimalFeedingLogFormProps) {
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;
  const navigate = useNavigate();
  const [durationInMinutes, setDurationInMinutes] = useState<string>(""); // text input
  const [details, setDetails] = useState<string>(""); // text input
  const { curAnimalFeedingLog } = props;
  const [dateTime, setDateTime] = useState<
    string | Date | Date[] | null
  >(null);
  const employee = useAuthContext().state.user?.employeeData;
  const [formError, setFormError] = useState<string | null>(null);


  const [curAnimalList, setCurAnimalList] = useState<any>(null);
  const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([]);

  useEffect(() => {
    apiJson.get(`http://localhost:3000/api/animal/getAllAnimals/`).then(res => {
      setCurAnimalList(res as Animal[]);
      setSelectedAnimals(res.filter((animal: Animal) => curAnimalFeedingLog.animals.map((animal: Animal) => animal.animalCode).includes(animal.animalCode)));
    });
  }, [curAnimalFeedingLog]);

  useEffect(() => {
    setDurationInMinutes(String(curAnimalFeedingLog.durationInMinutes))
    setDetails(curAnimalFeedingLog.details);
    setDateTime(new Date(curAnimalFeedingLog.dateTime))
    console.log(curAnimalFeedingLog.animals);

  }, [curAnimalFeedingLog]);

  function validateAnimalFeedingLogName(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">* Please enter a value</div>
        );
      }
      // add any other cases here
    }
    return null;
  }


  // end field validations

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newAnimalFeedingLog = {
      dateTime: dateTime,
      durationInMinutes: durationInMinutes,
      details: details,
      animalCodes: selectedAnimals.map((animal: Animal) => animal.animalCode)
    }
    console.log(newAnimalFeedingLog);

    try {
      const responseJson = await apiJson.put(
        `http://localhost:3000/api/animal/updateAnimalFeedingLog/${curAnimalFeedingLog.animalFeedingLogId}`,
        newAnimalFeedingLog);
      // success
      toastShadcn({
        description: "Successfully edited animal feeding log",
      });
    } catch (error: any) {
      toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "An error has occurred while editing animal feeding log details: \n" +
          error.message,
      });
    }
    console.log(apiJson.result);
  }



  return (
    <div className="flex flex-col">

      <Form.Root
        className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        {/* Title Header and back button */}
        <div className="flex flex-col">
          <div className="mb-4 flex justify-between">
            <Button variant={"outline"} type="button" onClick={() => navigate(-1)} className="">
              Back
            </Button>
            <span className="self-center text-lg text-graydark">
              Edit Animal Feeding Log
            </span>
            <Button disabled className="invisible">
              Back
            </Button>
          </div>
          <Separator />
          <span className="mt-4 self-center text-title-xl font-bold">
            {curAnimalFeedingLog.animalFeedingLogId}
          </span>
        </div>

        {/* DateTime */}
        <div className="flex justify-content-center">
          <label htmlFor="dateTimeCalendar" className="self-center mx-3 text-lg text-dark ">Date</label>
          <Calendar id="dateTimeCalendar" showTime hourFormat="12" value={dateTime} onChange={(e: CalendarChangeEvent) => {
            if (e && e.value !== null) {
              setDateTime(e.value as Date);
            }
          }} />
        </div>

        {/* Duration in Minutes */}
        <FormFieldInput
          type="number"
          formFieldName="durationInMinutes"
          label="Duration in Minutes"
          required={true}
          placeholder=""
          value={durationInMinutes}
          setValue={setDurationInMinutes}
          validateFunction={validateAnimalFeedingLogName}
          pattern={undefined}
        />

        {/* Details */}
        <FormFieldInput
          type="text"
          formFieldName="details"
          label="Details"
          required={true}
          placeholder=""
          value={details}
          setValue={setDetails}
          validateFunction={validateAnimalFeedingLogName}
          pattern={undefined}
        />
        {/* Animals */}
        <MultiSelect
          value={selectedAnimals}
          onChange={(e: MultiSelectChangeEvent) => setSelectedAnimals(e.value)}
          options={curAnimalList}
          optionLabel="houseName"
          filter
          placeholder="Select Animals"
          className="w-full md:w-20rem" />
        <Form.Submit asChild>
          <Button
            disabled={apiJson.loading}
            className="h-12 w-2/3 self-center rounded-full text-lg"
          >
            {!apiJson.loading ? (
              <div>Submit</div>
            ) : (
              <div>Loading</div>
            )}
          </Button>
        </Form.Submit>
        {formError && (
          <div className="m-2 border-danger bg-red-100 p-2">{formError}</div>
        )}

      </Form.Root>

    </div>
  );
}

export default EditAnimalFeedingLogForm;
