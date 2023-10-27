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
  DayOfWeek,
  EventTimingType,
  IdentifierType,
  RecurringPattern,
} from "../../../enums/Enumurated";

import { Calendar, CalendarChangeEvent } from "primereact/calendar";
import Species from "../../../models/Species";

import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";

import AnimalActivity from "../../../models/AnimalActivity";
import { Nullable } from "primereact/ts-helpers";

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
  // const [date, setDate] = useState<Nullable<Date>>(
  //   new Date(curAnimalActivity.date)
  // );
  const [eventTimingType, setEventTimingType] = useState<string | undefined>(
    curAnimalActivity.eventTimingType
  );
  const [durationInMinutes, setDurationInMinutes] = useState<
    number | undefined
  >(curAnimalActivity.durationInMinutes);
  const [requiredNumberOfKeeper, setRequiredNumberOfKeeper] = useState<
    number | undefined
  >(curAnimalActivity.requiredNumberOfKeeper);
  const [recurringPattern, setRecurringPattern] = useState<string | undefined>(
    RecurringPattern[
    curAnimalActivity.recurringPattern as keyof typeof RecurringPattern
    ]
  );
  const [startDate, setStartDate] = useState<Nullable<Date>>(
    new Date(curAnimalActivity.startDate)
  );
  const [endDate, setEndDate] = useState<Nullable<Date>>(
    new Date(curAnimalActivity.endDate)
  );
  const [dayOfWeek, setDayOfWeek] = useState<string | undefined>(
    curAnimalActivity.dayOfWeek?.toString() || undefined
  );
  const [dayOfMonth, setDayOfMonth] = useState<string | undefined>(
    curAnimalActivity.dayOfMonth?.toString() || undefined
  );

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

  // function validateDate(props: ValidityState) {
  //   if (props != undefined) {
  //     if (date == null) {
  //       return (
  //         <div className="font-medium text-danger">
  //           * Please enter the date of the activity
  //         </div>
  //       );
  //     }
  //   }
  //   // add any other cases here
  //   return null;
  // }

  function validateEventTimingType(props: ValidityState) {
    if (props != undefined) {
      if (eventTimingType == undefined) {
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

  function validateRecurringPattern(props: ValidityState) {
    if (props != undefined) {
      if (recurringPattern == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please select a recurring pattern!
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateOneOffDate(props: ValidityState) {
    if (props != undefined) {
      if (startDate == null) {
        return (
          <div className="font-medium text-danger">
            * Please enter the date for the activity
          </div>
        );
      }
    }
    // add any other cases here
    return null;
  }

  function validateStartDate(props: ValidityState) {
    if (props != undefined) {
      if (startDate == null) {
        return (
          <div className="font-medium text-danger">
            * Please enter the start date of the period for the recurring
            activity
          </div>
        );
      }
    }

    if (
      startDate != null &&
      endDate != null &&
      new Date(startDate) > new Date(endDate)
    ) {
      return (
        <div className="font-medium text-danger">
          * Start Date must not be after End Date
        </div>
      );
    }
    // add any other cases here
    return null;
  }

  function validateEndDate(props: ValidityState) {
    if (props != undefined) {
      if (endDate == null) {
        return (
          <div className="font-medium text-danger">
            * Please enter the end date of the period for the recurring activity
          </div>
        );
      }
    }

    if (
      endDate != null &&
      startDate != null &&
      new Date(startDate) > new Date(endDate)
    ) {
      return (
        <div className="font-medium text-danger">
          * End Date must not be before Start Date
        </div>
      );
    }
    // add any other cases here
    return null;
  }

  function validateDayOfWeek(props: ValidityState) {
    if (recurringPattern == "WEEKLY") {
      if (props != undefined) {
        if (dayOfWeek == undefined) {
          return (
            <div className="font-medium text-danger">
              * Please select a day of week for recurring activity!
            </div>
          );
        }
        // add any other cases here
      }
    }
    return null;
  }

  function validateDayOfMonth(props: ValidityState) {
    if (recurringPattern == "MONTHLY") {
      if (props != undefined) {
        if (dayOfMonth == undefined) {
          return (
            <div className="font-medium text-danger">
              * Please select a day of month for recurring activity!
            </div>
          );
        }
        // add any other cases here
      }
    }
    return null;
  }

  function validateRequiredNumberOfKeeper(props: ValidityState) {
    if (props != undefined) {
      if (requiredNumberOfKeeper == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please enter the number of keepers required
          </div>
        );
      } else if (requiredNumberOfKeeper <= 0) {
        return (
          <div className="font-medium text-danger">
            * Number of keepers must be greater than 0
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  // end validate functions

  // handle submit
  const dummyValidityState: ValidityState = {
    customError: false,
    patternMismatch: false,
    rangeOverflow: false,
    rangeUnderflow: false,
    stepMismatch: false,
    tooLong: false,
    tooShort: false,
    typeMismatch: false,
    valid: true,
    valueMissing: false,
    badInput: false,
  };
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // let dateInMilliseconds = date?.getTime();

    if (validateDurationInMinutes(dummyValidityState) != null) {
      return;
    } else if (
      (recurringPattern != "NON-RECURRING" &&
        validateEndDate(dummyValidityState) != null &&
        validateStartDate(dummyValidityState) != null) ||
      (recurringPattern == "NON-RECURRING" &&
        validateOneOffDate(dummyValidityState) != null) ||
      (recurringPattern == "WEEKLY" &&
        validateDayOfWeek(dummyValidityState) != null) ||
      (recurringPattern == "MONTHLY" &&
        validateDayOfMonth(dummyValidityState) != null)
    ) {
      return;
    }

    const updatedAnimalActivity = {
      animalActivityId,
      activityType,
      title,
      details,
      startDate: startDate?.getTime(),
      endDate: endDate?.getTime(),
      recurringPattern,
      dayOfWeek,
      dayOfMonth,
      eventTimingType,
      durationInMinutes,
      requiredNumberOfKeeper
    };

    console.log(updatedAnimalActivity);

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


          {/* <FormFieldSelect
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
          /> */}
        </div>
        {/* Activity Type */}
        <div className="mb-1 block font-medium">
          Activity Type<br /> <b>{activityType}</b>
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
            label="Shift Timing"
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
            value={eventTimingType}
            setValue={setEventTimingType}
            validateFunction={validateEventTimingType}
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

        {/* Number of keepers required */}
        <FormFieldInput
          type="number"
          formFieldName="durationInMinutes"
          label={`Number of keepers required`}
          required={true}
          pattern={undefined}
          placeholder="e.g., 2"
          value={requiredNumberOfKeeper}
          setValue={setRequiredNumberOfKeeper}
          validateFunction={validateRequiredNumberOfKeeper}
        />

        {/* Recurring Pattern */}
        <FormFieldSelect
          formFieldName="recurringPattern"
          label="Recurring Pattern"
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
          validateFunction={validateRecurringPattern}
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
                <Form.ValidityState>{validateOneOffDate}</Form.ValidityState>
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
                          if (
                            startDate != null &&
                            endDate != null &&
                            new Date(startDate) > new Date(endDate)
                          ) {
                            const isDataInvalid =
                              element.getAttribute("data-invalid");
                            if (isDataInvalid == "true") {
                              element.setAttribute("data-valid", "true");
                              element.removeAttribute("data-invalid");
                            }
                          }
                        }
                      }
                    }}
                  />
                  <Form.ValidityState>{validateStartDate}</Form.ValidityState>
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
                        if (
                          startDate != null &&
                          endDate != null &&
                          new Date(startDate) > new Date(endDate)
                        ) {
                          const element =
                            document.getElementById("endDateField");
                          if (element) {
                            const isDataInvalid =
                              element.getAttribute("data-invalid");
                            if (isDataInvalid == "true") {
                              element.setAttribute("data-valid", "true");
                              element.removeAttribute("data-invalid");
                            }
                          }
                        }
                      }
                    }}
                  />
                  <Form.ValidityState>{validateEndDate}</Form.ValidityState>
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
              validateFunction={validateDayOfWeek}
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
              validateFunction={validateDayOfMonth}
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

export default EditAnimalActivityForm;
