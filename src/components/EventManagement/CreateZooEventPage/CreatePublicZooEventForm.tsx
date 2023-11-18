import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import * as Form from "@radix-ui/react-form";
import { Calendar } from "primereact/calendar";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useApiFormData from "../../../hooks/useApiFormData";
import useApiJson from "../../../hooks/useApiJson";
import FormFieldInput from "../../FormFieldInput";
import FormFieldSelect from "../../FormFieldSelect";

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import beautifyText from "../../../hooks/beautifyText";
import Animal from "../../../models/Animal";
import Employee from "../../../models/Employee";
import Facility from "../../../models/Facility";

// Only local
enum EventType {
  SHOW = "SHOW",
  TALK = "TALK",
  ENRICHMENT = "ENRICHMENT",
  OBSERVATION = "OBSERVATION",
  ANIMAL_CHECKUP = "ANIMAL_CHECKUP",
}

function CreatePublicZooEventForm() {
  const apiFormData = useApiFormData();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const apiJson = useApiJson();
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;

  const [eventType, setEventType] = useState<string | undefined>(
    undefined
  );
  const [title, setTitle] = useState<string>("");
  const [details, setDetails] = useState<string>("");
  const [eventDates, setEventDates] = useState<Date[]>([]);
  // const [eventNotificationDate, setEventNotificationDate] = useState<Nullable<Date>>(null);

  const [curAnimalList, setCurAnimalList] = useState<any>(null);
  const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([]);

  const [curKeeperList, setCurKeeperList] = useState<any>(null);
  const [selectedKeepers, setSelectedKeepers] = useState<Employee[]>([]);

  const [curInHouseList, setCurInHouseList] = useState<any>(null);
  const [selectedInHouse, setSelectedInHouse] = useState<Facility[]>([]);

  // useEffect(() => {
  //   apiJson.get(`http://localhost:3000/api/animal/getAllAnimals/`).then(res => {
  //     setCurAnimalList(res as Animal[]);
  //     console.log(res);
  //   });
  // }, []);

  // useEffect(() => {
  //   apiJson.post(
  //     "http://localhost:3000/api/employee/getAllEmployees",
  //     { includes: ["keeper", "generalStaff", "planningStaff"] }
  //   ).then(res => {
  //     const allKeepers: Employee[] = []
  //     console.log(res.employees);
  //     setCurKeeperList(res["employees"]);
  //   });
  // }, []);

  useEffect(() => {
    apiJson
      .post("http://localhost:3000/api/assetFacility/getAllFacility", {
        includes: ["facilityDetail"],
      })
      .catch((e) => {
        console.log(e);
      })
      .then((res) => {
        console.log("req", res)
        setCurInHouseList(res["facilities"].filter((facility: Facility) => facility.facilityDetail == "inHouse"));
      });
  }, []);

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
          <div className="font-medium text-danger">* Please enter an event name</div>
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
            * Please enter an event description
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

  // function validateEventNotificationDate(props: ValidityState) {
  //   if (props != undefined) {
  //     if (eventNotificationDate == null) {
  //       return (
  //         <div className="font-medium text-danger">
  //           * Please enter the notification date of the event
  //         </div>
  //       );
  //     }
  //     if (eventNotificationDate > eventDates[0]) {
  //       return (
  //         <div className="font-medium text-danger">
  //           * Event notification date cannot be after the event start date
  //         </div>
  //       );
  //     }
  //   }
  //   // add any other cases here
  //   return null;
  // }

  function validateImage(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please upload an image
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateAnimals(props: ValidityState) {
    if (props != undefined) {
      if (selectedAnimals.length == 0) {
        return (
          <div className="font-medium text-danger">
            * Please select at least one animal
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateKeepers(props: ValidityState) {
    if (props != undefined) {
      if (selectedKeepers.length == 0) {
        return (
          <div className="font-medium text-danger">
            * Please select at least one keeper
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateInHouse(props: ValidityState) {
    if (props != undefined) {
      if (selectedInHouse.length == 0) {
        return (
          <div className="font-medium text-danger">
            * Please select at least one in-house facility
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  // end validate functions

  // Zoo event image
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
    const newPublicZooEvent = {
      title: title,
      eventType: eventType,
      details: details,
      startDate: eventDates[0].getTime(),
      endDate: eventDates[1] !== null ? eventDates[1].getTime() : null,
      animalCodes: selectedAnimals.map((animal: Animal) => animal.animalCode),
      keeperEmployeeIds: [selectedKeepers.map((keeper: Employee) => keeper.employeeId)],
      inHouseId: selectedInHouse[0].facilityId.toString()
    };

    console.log("newEvent", newPublicZooEvent)

    const formData = new FormData();
    formData.append("file", imageFile || "");
    formData.append("title", title);
    formData.append("eventType", eventType || "");
    formData.append("details", details);
    formData.append("startDate", eventDates[0].getTime().toString());
    if (eventDates[1] !== null) {
      formData.append("endDate", eventDates[1].getTime().toString());
    }
    formData.append("animalCodes", selectedAnimals.map((animal: Animal) => animal.animalCode).toString());
    formData.append("keeperEmployeeIds", selectedKeepers.map((keeper: Employee) => keeper.employeeId).toString());
    formData.append("inHouseId", selectedInHouse[0].facilityId.toString());

    const createPublicZooEventApi = async () => {
      try {
        const response = await apiFormData.post(
          "http://localhost:3000/api/zooEvent/createPublicEvent",
          formData
        );
        // success
        toastShadcn({
          description: "Successfully created a new public event!",
        });
        navigate(-1);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while creating new public event: \n" +
            error.message,
        });
      }
    };
    createPublicZooEventApi();
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
            <Button
              onClick={() => navigate(-1)}
              variant={"outline"}
              type="button"
              className=""
            >
              Back
            </Button>
            <span className="mt-4 self-center text-title-xl font-bold">
              Create Public Event
            </span>
            <Button disabled className="invisible">
              Back
            </Button>
          </div>
          <Separator />
        </div>

        {/* Zoo Event Picture */}
        <Form.Field
          name="zooEventImage"
          className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
        >
          <Form.Label className="font-medium">
            Zoo Event Image
          </Form.Label>
          <Form.Control
            type="file"
            required
            accept=".png, .jpg, .jpeg, .webp"
            onChange={handleFileChange}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
          />
          <Form.ValidityState>{validateImage}</Form.ValidityState>
        </Form.Field>

        {/* Title */}
        <FormFieldInput
          type="text"
          formFieldName="title"
          label="Title"
          required={true}
          placeholder="Event title"
          pattern={undefined}
          value={title}
          setValue={setTitle}
          validateFunction={validateTitle}
        />

        {/* Activity Type */}
        <FormFieldSelect
          formFieldName="eventType"
          label="Activity Type"
          required={true}
          placeholder="Select an Activity type..."
          valueLabelPair={Object.keys(EventType).map((activiTypeKey) => [
            EventType[
              activiTypeKey as keyof typeof EventType
            ].toString(),
            beautifyText(EventType[
              activiTypeKey as keyof typeof EventType
            ]),
          ])}
          value={eventType}
          setValue={setEventType}
          validateFunction={validateIdentifierType}
        />

        {/* Event Description */}
        <Form.Field
          name="details"
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
              placeholder="Details"
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
                      Event Dates [Info]
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



          {/* Event Notification Date */}
          {/* <Form.Field
            name="eventNotificationDate"
            id="eventNotificationDateField"
            className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
          >
            <Form.Label className="font-medium">
              Event Notification Date
            </Form.Label>
            <Form.Control
              className="hidden"
              type="text"
              value={eventNotificationDate?.toString()}
              required={true}
              onChange={() => null}
            ></Form.Control>
            <Calendar
              value={eventNotificationDate}
              className="w-full"
              onChange={(e: any) => {
                if (e && e.value !== undefined) {
                  setEventDates(e.value);
                  const element =
                    document.getElementById("eventNotificationDateField");
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
          </Form.Field> */}
        </div>

        {/* Animals */}
        {/* <Form.Field
          name="animals"
          className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
        > */}
        {/* <Form.Label className="font-medium">
            Animals
          </Form.Label> */}
        {/* <Form.Control
          asChild
          value={selectedAnimals.toString()}
          required={true}
          onChange={(e) => setSelectedAnimals(e.target.value)}
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium shadow-md outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
        /> */}
        {/* <MultiSelect
            value={selectedAnimals}
            onChange={(e: MultiSelectChangeEvent) => setSelectedAnimals(e.value)}
            options={curAnimalList}
            optionLabel="houseName"
            filter
            display="chip"
            placeholder="Select Animals"
            // maxSelectedLabels={3}
            className="w-full md:w-20rem" />
          <Form.ValidityState>
            {validateAnimals}
          </Form.ValidityState>
        </Form.Field> */}

        {/* Keepers */}
        {/* <Form.Field
          name="keepers"
          className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
        >
          <Form.Label className="font-medium">
            Keepers
          </Form.Label>
          <Form.Control
            asChild
            value={selectedKeepers.toString()}
            required={true}
            onChange={(e) => setSelectedAnimals(e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium shadow-md outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
          />
          <MultiSelect
            value={selectedKeepers}
            onChange={(e: MultiSelectChangeEvent) => setSelectedKeepers(e.value)}
            options={curKeeperList}
            optionLabel="employeeName"
            filter
            display="chip"
            placeholder="Select Keepers"
            // maxSelectedLabels={3}
            className="w-full md:w-20rem" />
          <Form.ValidityState>
            {validateKeepers}
          </Form.ValidityState>
        </Form.Field> */}

        {/* Facility */}
        <Form.Field
          name="facility"
          className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
        >
          <Form.Label className="font-medium">
            Facility
          </Form.Label>
          {/* <Form.Control
          asChild
          value={selectedKeepers.toString()}
          required={true}
          onChange={(e) => setSelectedAnimals(e.target.value)}
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium shadow-md outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
        /> */}
          <MultiSelect
            value={selectedInHouse}
            onChange={(e: MultiSelectChangeEvent) => setSelectedInHouse(e.value)}
            options={curInHouseList}
            optionLabel="facilityName"
            filter
            display="chip"
            selectionLimit={1}
            placeholder="Select Facility"
            // maxSelectedLabels={3}
            className="w-full md:w-20rem" />
          <Form.ValidityState>
            {validateInHouse}
          </Form.ValidityState>
        </Form.Field>


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

export default CreatePublicZooEventForm;
