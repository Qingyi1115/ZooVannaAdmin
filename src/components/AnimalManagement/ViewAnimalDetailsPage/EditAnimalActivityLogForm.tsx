import React, { useEffect, useState } from "react";
import * as Form from "@radix-ui/react-form";


import FormFieldInput from "../../FormFieldInput";
import useApiJson from "../../../hooks/useApiJson";
import { useToast } from "@/components/ui/use-toast";
import FormFieldSelect from "../../FormFieldSelect";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import AnimalActivityLog from "../../../models/AnimalActivityLog";
import { useAuthContext } from "../../../hooks/useAuthContext";
import Animal from "../../../models/Animal";
import { Calendar, CalendarChangeEvent } from "primereact/calendar";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { set } from "date-fns";

interface EditAnimalActivityLogFormProps {
  curAnimalActivityLog: AnimalActivityLog
}

function EditAnimalActivityLogForm(props: EditAnimalActivityLogFormProps) {
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;
  const navigate = useNavigate();
  const [activityType, setActivityType] = useState<string | undefined>(
    undefined); // dropdown
  const [durationInMinutes, setDurationInMinutes] = useState<string>(""); // text input
  const [sessionRating, setSessionRating] = useState<string | undefined>(
    undefined); // dropdown
  const [details, setDetails] = useState<string>(""); // text input
  const { curAnimalActivityLog } = props;
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
      setSelectedAnimals(res.filter((animal: Animal) => curAnimalActivityLog.animals.map((animal: Animal) => animal.animalCode).includes(animal.animalCode)));
    });
  }, [curAnimalActivityLog]);

  useEffect(() => {
    setActivityType(String(curAnimalActivityLog.activityType))
    setDurationInMinutes(String(curAnimalActivityLog.durationInMinutes));
    setSessionRating(curAnimalActivityLog.sessionRating);
    setDetails(curAnimalActivityLog.details);
    setDateTime(new Date(curAnimalActivityLog.dateTime))
    console.log("curAnimalActivityLog22",curAnimalActivityLog);

  }, [curAnimalActivityLog]);

  function validateAnimalActivityLogName(props: ValidityState) {
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

    const newAnimalActivityLog = {
      activityType: activityType,
      dateTime: dateTime,
      durationInMinutes: durationInMinutes,
      sessionRating: sessionRating,
      details: details,
      animalCodes: selectedAnimals.map((animal: Animal) => animal.animalCode)
    }
    console.log(newAnimalActivityLog);

    try {
      const responseJson = await apiJson.put(
        `http://localhost:3000/api/animal/updateAnimalActivityLog/${curAnimalActivityLog.animalActivityLogId}`,
        newAnimalActivityLog);
      // success
      toastShadcn({
        description: "Successfully edited animal activity log",
      });
    } catch (error: any) {
      toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "An error has occurred while editing animal activity log details: \n" +
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
              Edit Animal Activity Log
            </span>
            <Button disabled className="invisible">
              Back
            </Button>
          </div>
          <Separator />
          <span className="mt-4 self-center text-title-xl font-bold">
            {curAnimalActivityLog.animalActivityLogId}
          </span>
        </div>
        {/* Activity Type */}
        <FormFieldSelect
          formFieldName="activityType"
          label="Activity Type"
          required={true}
          placeholder="Select an activity type..."
          valueLabelPair={[
            ["TRAINING", "Training"],
            ["ENRICHMENT", "Enrichment"]
          ]}
          value={activityType}
          setValue={setActivityType}
          validateFunction={validateAnimalActivityLogName}
        />

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
          validateFunction={validateAnimalActivityLogName}
          pattern={undefined}
        />

        {/* Session Rating */}
        <FormFieldSelect
          formFieldName="sessionRating"
          label="Session Rating"
          required={true}
          placeholder="Select a rating..."
          valueLabelPair={[
            ["EXCELLENT", "Excellent"],
            ["GOOD", "Good"],
            ["FAIR", "Fair"],
            ["POOR", "Poor"],
            ["NOT_RECORDED", "Not Recorded"]
          ]}
          value={sessionRating}
          setValue={setSessionRating}
          validateFunction={validateAnimalActivityLogName}
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
          validateFunction={validateAnimalActivityLogName}
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

export default EditAnimalActivityLogForm;
