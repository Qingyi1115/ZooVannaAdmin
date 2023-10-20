import React, { useEffect, useState } from "react";

import * as Form from "@radix-ui/react-form";
import FormFieldRadioGroup from "../../FormFieldRadioGroup";
import FormFieldInput from "../../FormFieldInput";
import FormFieldSelect from "../../FormFieldSelect";
import useApiJson from "../../../hooks/useApiJson";
import useApiFormData from "../../../hooks/useApiFormData";
import { useToast } from "@/components/ui/use-toast";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Animal from "../../../models/Animal";
import { Calendar, CalendarChangeEvent } from "primereact/calendar";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import Employee from "../../../models/Employee";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { set } from "date-fns";

// interface CreateNewAnimalActivityLogProps {
//   speciesCode: string;
// }

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

function CreateNewAnimalActivityLogForm() {
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;
  const navigate = useNavigate();
  const [activityType, setActivityType] = useState<string | undefined>(
    undefined); // dropdown
  const [durationInMinutes, setDurationInMinutes] = useState<string>(""); // text input
  const [sessionRating, setSessionRating] = useState<string | undefined>(
    undefined); // dropdown
  const [details, setDetails] = useState<string>(""); // text input
  const [animalReaction, setAnimalReaction] = useState<string | undefined>(undefined); // text input
  const [dateTime, setDateTime] = useState<Date | null>(null);
  const employee = useAuthContext().state.user?.employeeData;
  const [formError, setFormError] = useState<string | null>(null);


  const [curAnimalList, setCurAnimalList] = useState<any>(null);
  const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([]);

  useEffect(() => {
    apiJson.get(`http://localhost:3000/api/animal/getAllAnimals/`).then(res => {
      setCurAnimalList(res as Animal[]);
      console.log(res);
    });
  }, []);

  async function handleSubmit(e: any) {
    // Remember, your form must have enctype="multipart/form-data" for upload pictures
    e.preventDefault();
    const newAnimalActivityLog = {
      activityType: activityType,
      dateTime: dateTime?.getTime(),
      durationInMinutes: durationInMinutes,
      sessionRating: sessionRating,
      animalReaction: animalReaction,
      details: details,
      animalCodes: selectedAnimals.map((animal: Animal) => animal.animalCode)
    }
    console.log(newAnimalActivityLog);

    try {
      const responseJson = await apiJson.post(
        `http://localhost:3000/api/animal/createAnimalActivityLog`,
        newAnimalActivityLog);
      // success
      toastShadcn({
        description: "Successfully created animal activity log",
      });
      navigate(-1);
    } catch (error: any) {
      toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "An error has occurred while creating animal activity log details: \n" +
          error.message,
      });
    }
    console.log(apiJson.result);

    // handle success case or failurecase using apiJson
  }

  return (
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
          <span className="self-center text-title-xl font-bold">
            Create Animal Activity Log
          </span>
          <Button disabled className="invisible">
            Back
          </Button>
        </div>
        <Separator />
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
      <div className="card justify-content-center block ">
        <div className="mb-1 block font-medium">Date</div>
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
      {/* Animal Reaction */}
      <FormFieldSelect
        formFieldName="animalReaction"
        label="Animal Reaction"
        required={true}
        placeholder="Select a reaction"
        valueLabelPair={[
          ["POSITIVE_RESPONSE", "Positive Response"],
          ["RESPONSIVE", "Responsive"],
          ["ENTHUSIASTIC", "Enthusiastic"],
          ["ENGAGED", "Engaged"],
          ["PLAYFUL", "Playful"],
          ["CONTENT", "Content"],
          ["NEUTRAL_RESPONSE", "Neutral Response"],
          ["OBSERVANT", "Observant"],
          ["CAUTIOUS", "Cautious"],
          ["NEGATIVE_RESPONSE", "Negative Response"],
          ["STRESSED", "Stressed"],
          ["AVOIDANT", "Avoidant"],
          ["RESISTANT", "Resistant"],
          ["AGGRESSIVE", "Aggressive"],
          ["FEARFUL", "Fearful"],
          ["OTHER_RESPONSE", "Other Response"],
          ["ENERGETIC", "Energetic"],
          ["RELAXED", "Relaxed"],
          ["INDETERMINATE", "Indeterminate"],
          ["UNDETERMINED", "Undetermined"],
        ]}
        value={animalReaction}
        setValue={setAnimalReaction}
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
        maxSelectedLabels={3}
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
  );
}

export default CreateNewAnimalActivityLogForm;
