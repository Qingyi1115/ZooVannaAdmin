import React, { useState, useEffect } from "react";

import * as Form from "@radix-ui/react-form";
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as Checkbox from "@radix-ui/react-checkbox";

import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";

import useApiFormData from "../../../hooks/useApiFormData";
import FormFieldInput from "../../FormFieldInput";
import FormFieldSelect from "../../FormFieldSelect";
import { HiCheck } from "react-icons/hi";

import useApiJson from "../../../hooks/useApiJson";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { NavLink } from "react-router-dom";
import {
  AcquisitionMethod,
  ActivityType,
  AnimalGrowthStage,
  AnimalSex,
  AnimalStatusType,
  DayOfWeek,
  EventTimingType,
  IdentifierType,
  RecurringPattern,
} from "../../../enums/Enumurated";
import { Calendar, CalendarChangeEvent } from "primereact/calendar";
import Species from "../../../models/Species";

import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Nullable } from "primereact/ts-helpers";

function CreateAnimalActivityForm() {
  const apiFormData = useApiFormData();
  const apiJson = useApiJson();
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;

  const [activityType, setActivityType] = useState<string | undefined>(
    undefined
  );
  const [title, setTitle] = useState<string>("");
  const [details, setDetails] = useState<string>("");
  const [date, setDate] = useState<Nullable<Date>>(null);
  const [session, setSession] = useState<string | undefined>(undefined);
  const [durationInMinutes, setDurationInMinutes] = useState<
    number | undefined
  >(undefined);
  const [recurringPattern, setRecurringPattern] = useState<string | undefined>(
    undefined
  );
  const [startDate, setStartDate] = useState<Nullable<Date>>(null);
  const [endDate, setEndDate] = useState<Nullable<Date>>(null);
  const [dayOfWeek, setDayOfWeek] = useState<string | undefined>(undefined);
  const [dayOfMonth, setDayOfMonth] = useState<string | undefined>(undefined);

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

    let dateInMilliseconds = date?.getTime();

    // if (date instanceof Date) {
    //   const milliseconds = date.getTime(); // Convert to Unix epoch
    //   console.log(milliseconds); // This will print the number of milliseconds
    // } else {
    //   console.error('Invalid date format.');
    // }

    const newAnimalActivity = {
      activityType,
      title,
      details,
      date: dateInMilliseconds,
      session,
      durationInMinutes,
    };

    const createAnimalActivityApi = async () => {
      try {
        const response = await apiJson.post(
          "http://localhost:3000/api/animal/createAnimalActivity",
          newAnimalActivity
        );
        // success
        toastShadcn({
          description: "Successfully created a new animal activity",
        });
        const redirectUrl = `/animal/animalactivities/`;
        navigate(redirectUrl);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while creating new animal activity: \n" +
            error.message,
        });
      }
    };
    createAnimalActivityApi();
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
              Create Animal Activity
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
            label="Session Timing"
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
        </div>

        {/* Recurring Pattern */}
        <FormFieldSelect
          formFieldName="recurringPattern"
          label="Session Timing"
          required={true}
          placeholder="Select a recurring pattern. Select NON-RECURRING if this is a one-off event. "
          valueLabelPair={Object.keys(RecurringPattern).map(
            (recurringPatternKey) => [
              RecurringPattern[
                recurringPatternKey as keyof typeof RecurringPattern
              ].toString(),
              RecurringPattern[
                recurringPatternKey as keyof typeof RecurringPattern
              ].toString(),
            ]
          )}
          value={recurringPattern}
          setValue={setRecurringPattern}
          validateFunction={() => null}
        />

        {recurringPattern != undefined &&
          recurringPattern == "NON-RECURRING" && (
            <div>
              {/* Specific Date for One Off Event */}
              <Form.Field
                name="startDate"
                id="oneoffDateField"
                className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
              >
                <Form.Label className="font-medium">
                  One-off Activity Date
                </Form.Label>
                <Form.Control
                  className="hidden"
                  type="text"
                  value={startDate?.toString()}
                  required={true}
                  onChange={() => null}
                ></Form.Control>
                <Calendar
                  value={startDate}
                  className="w-full"
                  onChange={(e: any) => {
                    if (e && e.value !== undefined) {
                      setStartDate(e.value);
                      setEndDate(e.value);
                      const element =
                        document.getElementById("oneoffDateField");
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
                <Form.ValidityState>{validateDate}</Form.ValidityState>
              </Form.Field>
            </div>
          )}

        {recurringPattern != undefined &&
          (recurringPattern == "DAILY" ||
            recurringPattern == "WEEKLY" ||
            recurringPattern == "MONTHLY") && (
            <div>
              {" "}
              <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
                {/* Start Date */}
                <Form.Field
                  name="startDate"
                  id="startDateField"
                  className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
                >
                  <Form.Label className="font-medium">
                    Period Start Date
                  </Form.Label>
                  <Form.Control
                    className="hidden"
                    type="text"
                    value={startDate?.toString()}
                    required={true}
                    onChange={() => null}
                  ></Form.Control>
                  <Calendar
                    value={startDate}
                    className="w-full"
                    onChange={(e: any) => {
                      if (e && e.value !== undefined) {
                        setStartDate(e.value);
                        const element =
                          document.getElementById("startDateField");
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
                  <Form.ValidityState>{validateDate}</Form.ValidityState>
                </Form.Field>

                {/* End Date */}
                <Form.Field
                  name="endDate"
                  id="endDateField"
                  className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
                >
                  <Form.Label className="font-medium">
                    Period End Date
                  </Form.Label>
                  <Form.Control
                    className="hidden"
                    type="text"
                    value={endDate?.toString()}
                    required={true}
                    onChange={() => null}
                  ></Form.Control>
                  <Calendar
                    value={endDate}
                    className="w-full"
                    onChange={(e: any) => {
                      if (e && e.value !== undefined) {
                        setEndDate(e.value);
                        const element = document.getElementById("endDateField");
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
                  <Form.ValidityState>{validateDate}</Form.ValidityState>
                </Form.Field>
              </div>
            </div>
          )}

        {recurringPattern != undefined && recurringPattern == "WEEKLY" && (
          <div>
            {/* Day of Week */}
            <FormFieldSelect
              formFieldName="dayOfWeek"
              label="Day of Week"
              required={true}
              placeholder="Select a day of the week for recurring event..."
              valueLabelPair={Object.keys(DayOfWeek).map((dayOfWeekKey) => [
                DayOfWeek[dayOfWeekKey as keyof typeof DayOfWeek].toString(),
                DayOfWeek[dayOfWeekKey as keyof typeof DayOfWeek].toString(),
              ])}
              value={dayOfWeek}
              setValue={setDayOfWeek}
              validateFunction={() => null}
            />
          </div>
        )}

        {recurringPattern != undefined && recurringPattern == "MONTHLY" && (
          <div>
            {" "}
            {/* Day of Month */}
            <FormFieldSelect
              formFieldName="dayOfMonth"
              label="Day of Month"
              required={true}
              placeholder="Select a day of the month for recurring event..."
              valueLabelPair={
                Array.from({ length: 31 }, (_, i) => [
                  (i + 1).toString(),
                  (i + 1).toString(),
                ])

                //   Object.keys(DayOfWeek).map((dayOfWeekKey) => [
                //   DayOfWeek[dayOfWeekKey as keyof typeof DayOfWeek].toString(),
                //   DayOfWeek[dayOfWeekKey as keyof typeof DayOfWeek].toString(),
                // ])
              }
              value={dayOfMonth}
              setValue={setDayOfMonth}
              validateFunction={() => null}
            />
          </div>
        )}

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

export default CreateAnimalActivityForm;
