import React, { useState } from "react";

import * as Form from "@radix-ui/react-form";



import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "primereact/calendar";
import { useNavigate, useParams } from "react-router-dom";
import useApiJson from "../../hooks/useApiJson";

import { Nullable } from "primereact/ts-helpers";
import FormFieldInput from "../../components/FormFieldInput";
import FormFieldSelect from "../../components/FormFieldSelect";
import { DayOfWeek, RecurringPattern } from "../../enums/Enumurated";

function EditPublicEventSessionForm() {
  const apiJson = useApiJson();
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;
  const { publicEventSessionId } = useParams<{ publicEventSessionId: string }>();

  const [recurringPattern, setRecurringPattern] = useState<string | undefined>(
    undefined
  );
  const [timeSelect, setTimeSelect] = useState<Date>(new Date());
  const [oneDate, setOneDate] = useState<Date>(new Date());
  const [durationInMinutes, setDurationInMinutes] = useState<
    number | undefined
  >(undefined);
  const [dayOfWeek, setDayOfWeek] = useState<string | undefined>(undefined);
  const [dayOfMonth, setDayOfMonth] = useState<string | undefined>(undefined);

  const [daysInAdvanceNotification, setDaysInAdvanceNotification] = useState<number | undefined>(undefined);

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
      if (timeSelect == null) {
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


  function validateStartDate(props: ValidityState) {
    if (props != undefined) {
      if (oneDate == null) {
        return (
          <div className="font-medium text-danger">
            * Please enter the start date of the period for the recurring
            activity
          </div>
        );
      }
    }
    // add any other cases here
    return null;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // let dateInMilliseconds = date?.getTime();

    if (validateDurationInMinutes(dummyValidityState) != null) {
      return;
    } else if (
      (recurringPattern == "NON-RECURRING" &&
        validateOneOffDate(dummyValidityState) != null) ||
      (recurringPattern == "WEEKLY" &&
        validateDayOfWeek(dummyValidityState) != null) ||
      (recurringPattern == "MONTHLY" &&
        validateDayOfMonth(dummyValidityState) != null)
    ) {
      return;
    }

    // if (date instanceof Date) {
    //   const milliseconds = date.getTime(); // Convert to Unix epoch
    //   console.log(milliseconds); // This will print the number of milliseconds
    // } else {
    //   console.error('Invalid date format.');
    // }

    let time = timeSelect?.getHours() < 10 ? "0" + timeSelect?.getHours() : timeSelect?.getHours().toString();
    time += ":";
    time += timeSelect?.getMinutes() < 10 ? "0" + timeSelect?.getMinutes() : timeSelect?.getMinutes();

    const newPublicEventSession = {
      time: time,
      recurringPattern,
      dayOfWeek,
      dayOfMonth,
      durationInMinutes,
      daysInAdvanceNotification: daysInAdvanceNotification,
      oneDate: oneDate.getTime()
    };

    const editPublicEventSessionApi = async () => {
      try {
        const response = await apiJson.put(
          `http://localhost:3000/api/zooEvent/updatePublicEventSessionById/${publicEventSessionId}`,
          newPublicEventSession
        );
        // success
        toastShadcn({
          description: "Successfully edited session!",
        });
        navigate(-1);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while Editing Session: \n" +
            error.message,
        });
      }
    };
    editPublicEventSessionApi();
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
              Edit Public Event Session
            </span>
            <Button disabled className="invisible">
              Back
            </Button>
          </div>
          <Separator />
        </div>


        <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">

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
        <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">

          {/* daysInAdvanceNotification in days */}
          <FormFieldInput
            type="number"
            formFieldName="daysInAdvanceNotification"
            label={`Notify in advance (days)`}
            required={true}
            pattern={undefined}
            placeholder="e.g., 1.5"
            value={daysInAdvanceNotification}
            setValue={setDaysInAdvanceNotification}
            validateFunction={validateDurationInMinutes}
          />
        </div>

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
                name="timeSelect"
                id="oneoffDateField"
                className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
              >
                <Form.Label className="font-medium">
                  One-off Activity Date
                </Form.Label>
                <Form.Control
                  className="hidden"
                  type="text"
                  value={timeSelect?.toString()}
                  required={true}
                  onChange={() => null}
                ></Form.Control>
                <Calendar
                  value={oneDate}
                  className="w-full"
                  showTime
                  hourFormat="12"
                  onChange={(e: any) => {
                    if (e && e.value !== undefined) {
                      console.log("aa", e.value)
                      setOneDate(e.value);
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
                  name="timeSelect"
                  id="startDateField"
                  className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
                >
                  <Form.Label className="font-medium">
                    Select start time
                  </Form.Label>
                  <Form.Control
                    className="hidden"
                    type="text"
                    value={timeSelect?.toString()}
                    required={true}
                    onChange={() => null}
                  ></Form.Control>
                  <Calendar
                    value={timeSelect}
                    className="w-full"
                    timeOnly
                    hourFormat="12"
                    onChange={(e: any) => {
                      if (e && e.value !== undefined) {
                        setTimeSelect(e.value);
                        const element =
                          document.getElementById("startDateField");
                        if (element) {
                          if (
                            timeSelect == null
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

export default EditPublicEventSessionForm;
