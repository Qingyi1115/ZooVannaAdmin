import React, { useState, useEffect } from "react";
import * as Form from "@radix-ui/react-form";
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as Checkbox from "@radix-ui/react-checkbox";

import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";

import useApiFormData from "../../../hooks/useApiFormData";
import useApiJson from "../../../hooks/useApiJson";

import FormFieldInput from "../../FormFieldInput";
import FormFieldSelect from "../../FormFieldSelect";
import { ContinentEnum } from "../../../enums/ContinentEnum";
import { HiCheck } from "react-icons/hi";
import { BiomeEnum } from "../../../enums/BiomeEnum";
import FormFieldRadioGroup from "../../FormFieldRadioGroup";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

import { useNavigate } from "react-router-dom";
import Animal from "../../../models/Animal";

import {
  AcquisitionMethod,
  ActivityType,
  AnimalGrowthStage,
  AnimalSex,
  AnimalStatusType,
  EventTimingType,
  IdentifierType,
} from "../../../enums/Enumurated";

import { Calendar, CalendarChangeEvent } from "primereact/calendar";
import Species from "../../../models/Species";

import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";

import AnimalActivity from "../../../models/AnimalActivity";

interface EditAnimalActivityFormProps {
  curAnimalActivity: AnimalActivity;
  refreshSeed: number;
  setRefreshSeed: React.Dispatch<React.SetStateAction<number>>;
}

function EditAnimalActivityForm(props: EditAnimalActivityFormProps) {
  const { curAnimalActivity, refreshSeed, setRefreshSeed } = props;

  const apiFormData = useApiFormData();
  const apiJson = useApiJson();
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;

  const animalActivityId = curAnimalActivity.animalActivityId;
  const [activityType, setActivityType] = useState<string | undefined>(
    curAnimalActivity.activityType
  );
  const [title, setTitle] = useState<string>(curAnimalActivity.title);
  const [details, setDetails] = useState<string>(curAnimalActivity.details);
  const [date, setDate] = useState<string | Date | Date[] | null>(
    new Date(curAnimalActivity.date)
  );
  const [session, setSession] = useState<string | undefined>(
    curAnimalActivity.session
  );
  const [durationInMinutes, setDurationInMinutes] = useState<
    number | undefined
  >(curAnimalActivity.durationInMinutes);

  // validate functions
  function validateIdentifierType(props: ValidityState) {
    if (props != undefined) {
      if (activityType == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please select an activity type!
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateTitle(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">* Please enter a title</div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateDetails(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter activity details!
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateDate(props: ValidityState) {
    if (props != undefined) {
      if (date == null) {
        return (
          <div className="font-medium text-danger">
            * Please enter the date of the activity
          </div>
        );
      }
    }
    // add any other cases here
    return null;
  }

  function validateSession(props: ValidityState) {
    if (props != undefined) {
      if (session == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please select a session timing!
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateDurationInMinutes(props: ValidityState) {
    if (props != undefined) {
      if (durationInMinutes == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please enter a duration
          </div>
        );
      } else if (durationInMinutes <= 0) {
        return (
          <div className="font-medium text-danger">
            * Duration must be greater than 0
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  // end validate functions

  // handle submit
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const updatedAnimalActivity = {
      animalActivityId,
      activityType,
      title,
      details,
      date,
      session,
      durationInMinutes,
    };

    const updateAnimalActivityApi = async () => {
      try {
        const response = await apiJson.put(
          "http://localhost:3000/api/animal/updateAnimalActivity",
          updatedAnimalActivity
        );
        // success
        toastShadcn({
          description: "Successfully updated animal activity",
        });
        const redirectUrl = `/animal/animalactivities/`;
        navigate(redirectUrl);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while updating animal activity: \n" +
            error.message,
        });
      }
    };
    updateAnimalActivityApi();
  }

  return (
    <div>
      <Form.Root
        className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark"
        onSubmit={handleSubmit}
        // encType="multipart/form-data"
      >
        <div className="flex flex-col">
          <div className="mb-4 flex justify-between">
            {/* <NavLink className="flex" to={`/animal/viewallanimals`}> */}
            <Button
              onClick={() => navigate(-1)}
              variant={"outline"}
              type="button"
              className=""
            >
              Back
            </Button>
            {/* </NavLink> */}
            <span className="self-center text-title-xl font-bold">
              Update Animal Activity
            </span>
            <Button disabled className="invisible">
              Back
            </Button>
          </div>
          <Separator />
        </div>

        <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
          {/* Title */}
          <FormFieldInput
            type="text"
            formFieldName="title"
            label="Title"
            required={true}
            placeholder="e.g., Chase yoga ball, mud bath..."
            pattern={undefined}
            value={title}
            setValue={setTitle}
            validateFunction={validateTitle}
          />

          {/* Activity Type */}
          <FormFieldSelect
            formFieldName="activityType"
            label="Activity Type"
            required={true}
            placeholder="Select an activity type..."
            valueLabelPair={Object.keys(ActivityType).map((activiTypeKey) => [
              ActivityType[
                activiTypeKey as keyof typeof ActivityType
              ].toString(),
              ActivityType[
                activiTypeKey as keyof typeof ActivityType
              ].toString(),
            ])}
            value={activityType}
            setValue={setActivityType}
            validateFunction={validateIdentifierType}
          />
        </div>

        {/* Details */}
        <Form.Field
          name="physicalDefiningCharacteristics"
          className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
        >
          <Form.Label className="font-medium">Details</Form.Label>
          <Form.Control
            asChild
            value={details}
            required={true}
            onChange={(e) => setDetails(e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium shadow-md outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
          >
            <textarea
              rows={3}
              placeholder="e.g., Leave yoga ball in the pen and pushes it towards the tiger,..."
              // className="bg-blackA5 shadow-blackA9 selection:color-white selection:bg-blackA9 box-border inline-flex w-full resize-none appearance-none items-center justify-center rounded-[4px] p-[10px] text-[15px] leading-none text-white shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
            />
          </Form.Control>
          <Form.ValidityState>{validateDetails}</Form.ValidityState>
        </Form.Field>

        <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
          {/* Session */}
          <FormFieldSelect
            formFieldName="session"
            label="Session"
            required={true}
            placeholder="Select a session timing..."
            valueLabelPair={Object.keys(EventTimingType).map(
              (eventTimingTypeKey) => [
                EventTimingType[
                  eventTimingTypeKey as keyof typeof EventTimingType
                ].toString(),
                EventTimingType[
                  eventTimingTypeKey as keyof typeof EventTimingType
                ].toString(),
              ]
            )}
            value={session}
            setValue={setSession}
            validateFunction={validateSession}
          />

          {/* Date */}
          <Form.Field
            name="dateOfMeasure"
            id="dateField"
            className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
          >
            <Form.Label className="font-medium">Date</Form.Label>
            <Form.Control
              className="hidden"
              type="text"
              value={date?.toString()}
              required={true}
              onChange={() => null}
            ></Form.Control>
            <Calendar
              value={date}
              className="w-fit"
              onChange={(e: CalendarChangeEvent) => {
                if (e && e.value !== undefined) {
                  setDate(e.value);

                  const element = document.getElementById("dateField");
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
            <Form.ValidityState>{validateDate}</Form.ValidityState>
          </Form.Field>
        </div>

        {/* Duration in minutes */}
        <FormFieldInput
          type="number"
          formFieldName="durationInMinutes"
          label={`Duration (minutes)`}
          required={true}
          pattern={undefined}
          placeholder="e.g., 8"
          value={durationInMinutes}
          setValue={setDurationInMinutes}
          validateFunction={validateDurationInMinutes}
        />

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

export default EditAnimalActivityForm;
