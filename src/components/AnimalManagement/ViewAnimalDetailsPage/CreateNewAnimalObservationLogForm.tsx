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
import AnimalActivity from "../../../models/AnimalActivity";

interface CreateNewAnimalObservationLogProps {
  curAnimalActivity: AnimalActivity;
}

function validateAnimalObservationLogName(props: ValidityState) {
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

function CreateNewAnimalObservationLogForm(props: CreateNewAnimalObservationLogProps) {
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;
  const navigate = useNavigate();

  const { curAnimalActivity } = props;
  const [durationInMinutes, setDurationInMinutes] = useState<string>(""); // text input
  const [observationQuality, setObservationQuality] = useState<string | undefined>(
    undefined); // dropdown
  const [details, setDetails] = useState<string>(""); // text input
  const [dateTime, setDateTime] = useState<Date | null>(null);
  const employee = useAuthContext().state.user?.employeeData;
  const [formError, setFormError] = useState<string | null>(null);


  // const [curAnimalList, setCurAnimalList] = useState<any>(null);
  // const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([]);

  // useEffect(() => {
  //   apiJson.get(`http://localhost:3000/api/animal/getAllAnimals/`).then(res => {
  //     setCurAnimalList(res as Animal[]);
  //     console.log(res);
  //   });
  // }, []);

  async function handleSubmit(e: any) {
    // Remember, your form must have enctype="multipart/form-data" for upload pictures
    e.preventDefault();

    const newAnimalObservationLog = {
      animalActivityId: curAnimalActivity.animalActivityId,
      dateTime: dateTime?.getTime(),
      durationInMinutes: durationInMinutes,
      observationQuality: observationQuality,
      details: details,
      // animalCodes: selectedAnimals.map((animal: Animal) => animal.animalCode)
    }
    console.log(newAnimalObservationLog);

    try {
      const responseJson = await apiJson.post(
        `http://localhost:3000/api/animal/createAnimalObservationLog`,
        newAnimalObservationLog);
      // success
      toastShadcn({
        description: "Successfully created animal observation log",
      });
      navigate(-1);
    } catch (error: any) {
      toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "An error has occurred while creating animal observation log details: \n" +
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
            Create Animal Observation Log
          </span>
          <Button disabled className="invisible">
            Back
          </Button>
        </div>
        <Separator />
      </div>
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
        validateFunction={validateAnimalObservationLogName}
        pattern={undefined}
      />

      {/* Observation Quality */}
      <FormFieldSelect
        formFieldName="observationQuality"
        label="Observation Quality"
        required={true}
        placeholder="Select a rating..."
        valueLabelPair={[
          ["EXCELLENT", "Excellent"],
          ["GOOD", "Good"],
          ["FAIR", "Fair"],
          ["POOR", "Poor"],
          ["NOT_RECORDED", "Not Recorded"]
        ]}
        value={observationQuality}
        setValue={setObservationQuality}
        validateFunction={validateAnimalObservationLogName}
      />

      {/* Details */}
      <Form.Field
        name="details"
        className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
      >
        <Form.Label className="font-medium">
          Details
        </Form.Label>
        <Form.Control
          asChild
          value={details}
          required={true}
          onChange={(e) => setDetails(e.target.value)}
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium shadow-md outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
        >
          <textarea
            rows={6}
            placeholder="Observation details..."
          />
        </Form.Control>
        <Form.ValidityState>
          {validateAnimalObservationLogName}
        </Form.ValidityState>
      </Form.Field>

      {/* Animals
      <MultiSelect
        value={selectedAnimals}
        onChange={(e: MultiSelectChangeEvent) => setSelectedAnimals(e.value)}
        options={curAnimalList}
        optionLabel="houseName"
        filter
        placeholder="Select Animals"
        maxSelectedLabels={3}
        className="w-full md:w-20rem" /> */}

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

export default CreateNewAnimalObservationLogForm;
