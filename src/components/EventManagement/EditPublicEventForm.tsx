import * as Form from "@radix-ui/react-form";
import React, { useState } from "react";


import useApiFormData from "../../hooks/useApiFormData";
import useApiJson from "../../hooks/useApiJson";

import FormFieldInput from "../FormFieldInput";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

import { useNavigate } from "react-router-dom";


import { Calendar } from "primereact/calendar";


import { Nullable } from "primereact/ts-helpers";
import beautifyText from "../../hooks/beautifyText";
import PublicEvent from "../../models/PublicEvent";

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';

interface EditPublicEventFormProps {
  curPublicEvent: PublicEvent;
}

function EditPublicEventForm(props: EditPublicEventFormProps) {
  const { curPublicEvent } = props;

  const apiFormData = useApiFormData();
  const apiJson = useApiJson();
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;

  const publicEventId = curPublicEvent.publicEventId;
  const [eventType, setEventType] = useState<string | undefined>(
    curPublicEvent.eventType
  );
  const [title, setTitle] = useState<string>(curPublicEvent.title);
  const [details, setDetails] = useState<string>(curPublicEvent.details);
  // const [date, setDate] = useState<Nullable<Date>>(
  //   new Date(curPublicEvent.date)
  // );
  const [imageFile, setImageFile] = useState<File | null>(null);

  // const [eventTimingType, setEventTimingType] = useState<string | undefined>(
  //   curPublicEvent.eventTimingType
  // );
  // const [recurringPattern, setRecurringPattern] = useState<string | undefined>(
  //   curPublicEvent.recurringPattern
  // );
  const [eventDates, setEventDates] = useState<any[]>(
    [new Date(curPublicEvent.startDate),
    (curPublicEvent.endDate ? new Date(curPublicEvent.endDate) : null)
    ]);
  const [startDate, setStartDate] = useState<Nullable<Date>>(
    new Date(curPublicEvent.startDate)
  );
  // const [dayOfWeek, setDayOfWeek] = useState<string | undefined>(
  //   curPublicEvent.dayOfWeek?.toString() || undefined
  // );
  // const [dayOfMonth, setDayOfMonth] = useState<string | undefined>(
  //   curPublicEvent.dayOfMonth?.toString() || undefined
  // );

  // validate functions
  function validateIdentifierType(props: ValidityState) {
    if (props != undefined) {
      if (eventType == undefined) {
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

  // function validateDurationInMinutes(props: ValidityState) {
  //   if (props != undefined) {
  //     if (durationInMinutes == undefined) {
  //       return (
  //         <div className="font-medium text-danger">
  //           * Please enter a duration
  //         </div>
  //       );
  //     } else if (durationInMinutes <= 0) {
  //       return (
  //         <div className="font-medium text-danger">
  //           * Duration must be greater than 0
  //         </div>
  //       );
  //     }
  //     // add any other cases here
  //   }
  //   return null;
  // }

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

  function validateEventDates(props: ValidityState) {
    if (props != undefined) {
      if (eventDates == null) {
        return (
          <div className="font-medium text-danger">
            * Please enter the date range of event
          </div>
        );
      }
    }
    // add any other cases here
    return null;
  }

  // end validate functions

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files && event.target.files[0];
    setImageFile(file);
  }

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

    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile || "");

      const response = await apiFormData.put(
        `http://localhost:3000/api/zooEvent/updatePublicEventImageById/${curPublicEvent.publicEventId}`,
        formData
      );

    }
    // if (validateDurationInMinutes(dummyValidityState) != null) {
    //   return;
    // }
    // else if (
    //   (recurringPattern != "NON-RECURRING" &&
    //     validateEndDate(dummyValidityState) != null &&
    //     validateStartDate(dummyValidityState) != null) ||
    //   (recurringPattern == "NON-RECURRING" &&
    //     validateOneOffDate(dummyValidityState) != null) ||
    //   (recurringPattern == "WEEKLY" &&
    //     validateDayOfWeek(dummyValidityState) != null) ||
    //   (recurringPattern == "MONTHLY" &&
    //     validateDayOfMonth(dummyValidityState) != null)
    // ) {
    //   return;
    // }
    console.log("eventDates.length", eventDates.length, eventDates)

    const updatedPublicEvent = {
      publicEventId,
      eventType,
      title,
      details,
      startDate: eventDates[0].getTime(),
      endDate: eventDates.length == 2 && eventDates[1] ? eventDates[1].getTime() : null,
    };

    console.log(updatedPublicEvent);

    const updatePublicEventApi = async () => {
      try {
        const response = await apiJson.put(
          `http://localhost:3000/api/zooEvent/updatePublicEventById/${curPublicEvent.publicEventId}`,
          updatedPublicEvent
        );
        // success
        toastShadcn({
          description: "Successfully updated public event",
        });
        navigate(-1);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while updating Public Event: \n" +
            error.message,
        });
      }
    };
    updatePublicEventApi();
  }

  return (
    <div>
      <Form.Root
        className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
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
            <span className="self-center text-lg text-graydark">
              Update Public Event
            </span>
            <Button disabled className="invisible">
              Back
            </Button>
          </div>
          <Separator />
          <span className="mt-4 self-center text-title-xl font-bold">
            {curPublicEvent.title}
          </span>
        </div>

        <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">

          <Form.Field
            name="animalFeedImage"
            className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
          >
            <Form.Label className="font-medium">Current Image</Form.Label>
            <img
              src={"http://localhost:3000/" + curPublicEvent.imageUrl}
              alt="Current animal image"
              className="my-4 aspect-square w-1/5 self-center rounded-full border object-cover shadow-4"
            />

            <Form.Label className="font-medium">
              Upload A New Image
            </Form.Label>
            <Form.Control
              type="file"
              placeholder="Change image"
              required={false}
              accept=".png, .jpg, .jpeg, .webp"
              onChange={handleFileChange}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
            />
          </Form.Field>




          {/* <FormFieldSelect
            formFieldName="eventType"
            label="Activity Type"
            required={true}
            placeholder="Select an activity type..."
            valueLabelPair={Object.keys(EventType).map((activiTypeKey) => [
              EventType[
                activiTypeKey as keyof typeof EventType
              ].toString(),
              EventType[
                activiTypeKey as keyof typeof EventType
              ].toString(),
            ])}
            value={eventType}
            setValue={setEventType}
            validateFunction={validateIdentifierType}
          /> */}
        </div>
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
        <div className="mb-1 block font-medium">
          Event Type<br /> <b>{beautifyText(eventType)}</b>
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


          {/* Event Dates */}
          <Form.Field
            name="eventDates"
            id="eventDatesDateField"
            className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
          >
            <Form.Label className="font-medium">
              <Box sx={{ width: 500 }}>
                <Grid item container xs={6} alignItems="flex-end" direction="column">
                  <Grid item>
                    <Tooltip title="Select start date, Select end date if neccessary" placement="right">
                      <div>Event Dates [<b>Info</b>]</div>
                    </Tooltip>
                  </Grid>
                </Grid>
              </Box>
            </Form.Label>

            <Form.Control
              className="hidden"
              type="text"
              value={eventDates?.toString()}
              required={true}
              onChange={() => null}
            ></Form.Control>
            <Calendar
              selectionMode="range"
              value={eventDates}
              className="w-full"
              onChange={(e: any) => {
                if (e && e.value !== undefined) {
                  setEventDates(e.value);
                  const element =
                    document.getElementById("eventDatesDateField");
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
            <Form.ValidityState>{validateEventDates}</Form.ValidityState>
          </Form.Field>

        </div>

        {/* Recurring Pattern */}

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

export default EditPublicEventForm;
