import React, { useState } from "react";
import * as Form from "@radix-ui/react-form";
import useApiFormData from "../../../hooks/useApiFormData";
import FormFieldInput from "../../FormFieldInput";
import FormFieldSelect from "../../FormFieldSelect";
import useApiJson from "../../../hooks/useApiJson";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import {
  AcquisitionMethod,
  AnimalGrowthStage,
  AnimalSex,
  EventType,
} from "../../../enums/Enumurated";
import { Calendar } from "primereact/calendar";

import { Nullable } from "primereact/ts-helpers";
import beautifyText from "../../../hooks/beautifyText";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import Animal from "../../../models/Animal";
import EnrichmentItem from "../../../models/EnrichmentItem";
import Species from "../../../models/Species";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { HiCheck, HiTrash, HiX } from "react-icons/hi";
import AllEmployeesDatatable from "../../EmployeeAccountManagement/AllEmployeesDatatable";

let emptySpecies: Species = {
  speciesId: -1,
  speciesCode: "",
  commonName: "",
  scientificName: "",
  aliasName: "",
  conservationStatus: "",
  domain: "",
  kingdom: "",
  phylum: "",
  speciesClass: "",
  order: "",
  family: "",
  genus: "",
  nativeContinent: "",
  nativeBiomes: "",
  educationalDescription: "",
  educationalFunFact: "",
  groupSexualDynamic: "",
  habitatOrExhibit: "habitat",
  imageUrl: "",
  generalDietPreference: "",
  ageToJuvenile: 0,
  ageToAdolescent: 1,
  ageToAdult: 2,
  ageToElder: 3,
  lifeExpectancyYears: 0,
};
let emptyAnimal: Animal = {
  animalId: -1,
  animalCode: "",
  imageUrl: "",
  isGroup: false,
  houseName: "",
  identifierType: "",
  identifierValue: "",
  sex: AnimalSex.MALE,
  dateOfBirth: new Date(),
  placeOfBirth: "",
  acquisitionMethod: AcquisitionMethod.INHOUSE_CAPTIVE_BRED,
  dateOfAcquisition: new Date(),
  acquisitionRemarks: "",
  physicalDefiningCharacteristics: "",
  behavioralDefiningCharacteristics: "",
  dateOfDeath: null,
  locationOfDeath: null,
  causeOfDeath: null,
  growthStage: AnimalGrowthStage.ADOLESCENT,
  animalStatus: "",
  species: emptySpecies,
};

let emptyItem: EnrichmentItem = {
  enrichmentItemId: -1,
  enrichmentItemImageUrl: "",
  enrichmentItemName: "",
};

function CreatePublicZooEventForm() {
  const apiFormData = useApiFormData();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const apiJson = useApiJson();
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;

  const [eventType, setEventType] = useState<string | undefined>(
    undefined
  );
  const [eventName, setEventName] = useState<string>("");
  const [eventDescription, setEventDescription] = useState<string>("");
  const [eventDates, setEventDates] = useState<Date[]>([]);
  const [eventNotificationDate, setEventNotificationDate] = useState<Nullable<Date>>(null);

  const [involvedAnimalList, setInvolvedAnimalList] = useState<Animal[]>();
  const [involvedAnimalGlobalFiler, setInvolvedAnimalGlobalFilter] =
    useState<string>("");
  const employee = useAuthContext().state.user?.employeeData;
  const [involvedItemList, setInvolvedItemList] = useState<EnrichmentItem[]>(
    []
  );
  const [involvedItemGlobalFiler, setInvolvedItemGlobalFilter] =
    useState<string>("");

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

  function validateEventName(props: ValidityState) {
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

  function validateEventDescription(props: ValidityState) {
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

  function validateEventNotificationDate(props: ValidityState) {
    if (props != undefined) {
      if (eventNotificationDate == null) {
        return (
          <div className="font-medium text-danger">
            * Please enter the notification date of the event
          </div>
        );
      }
      if (eventNotificationDate > eventDates[0]) {
        return (
          <div className="font-medium text-danger">
            * Event notification date cannot be after the event start date
          </div>
        );
      }
    }
    // add any other cases here
    return null;
  }

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
      eventIsPublic: true,
      eventNotificationDate: eventNotificationDate,
      eventStartDateTime: eventDates[0].getTime(),
      eventEndDateTime: eventDates[1].getTime(),
      eventName: eventName,
      eventDescription: eventDescription
    };

    const createPublicZooEventApi = async () => {
      try {
        const response = await apiJson.post(
          "http://localhost:3000/api/zooEvent/createPublicZooEvent",
          newPublicZooEvent
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

  const animalImageBodyTemplate = (rowData: Animal) => {
    return (
      <img
        src={"http://localhost:3000/" + rowData.imageUrl}
        alt={rowData.houseName}
        className="aspect-square w-16 rounded-full border border-white object-cover shadow-4"
      />
    );
  };

  const enrichmentItemImageBodyTemplate = (rowData: EnrichmentItem) => {
    return (
      <img
        src={"http://localhost:3000/" + rowData.enrichmentItemImageUrl}
        alt={rowData.enrichmentItemName}
        className="aspect-square w-16 rounded-full border border-white object-cover shadow-4"
      />
    );
  };

  /////
  // remove animal stuff
  const [selectedAnimal, setSelectedAnimal] = useState<Animal>(emptyAnimal);
  const [removeAnimalDialog, setRemoveAnimalDialog] = useState<boolean>(false);
  const confirmRemoveAnimal = (animal: Animal) => {
    setSelectedAnimal(animal);
    setRemoveAnimalDialog(true);
  };

  const hideRemoveAnimalDialog = () => {
    setRemoveAnimalDialog(false);
  };

  const removeAnimal = async () => {
    if (involvedAnimalList == undefined) {
      toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Involved animal list is invalid",
      });
      return;
    }

    let _animals = involvedAnimalList.filter(
      (val) => val.animalId !== selectedAnimal?.animalId
    );

    let animalCode = selectedAnimal.animalCode;
    const animalToRemoveApiObj = {
      animalActivityId,
      animalCode,
    };

    const removeAnimalApi = async () => {
      try {
        const responseJson = await apiJson.put(
          "http://localhost:3000/api/animal/removeAnimalFromActivity/",
          animalToRemoveApiObj
        );

        toastShadcn({
          // variant: "destructive",
          title: "Deletion Successful",
          description:
            "Successfully removed animal: " +
            selectedAnimal.houseName +
            " from the activity",
        });
        setInvolvedAnimalList(_animals);
        setRemoveAnimalDialog(false);
        setSelectedAnimal(emptyAnimal);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while removing animal from activity: \n" +
            error.message,
        });
      }
    };
    removeAnimalApi();
  };

  const removeAnimalDialogFooter = (
    <React.Fragment>
      <Button onClick={hideRemoveAnimalDialog}>
        <HiX className="mr-2" />
        No
      </Button>
      <Button variant={"destructive"} onClick={removeAnimal}>
        <HiCheck className="mr-2" />
        Yes
      </Button>
    </React.Fragment>
  );

  ////
  const animalActionBodyTemplate = (animal: Animal) => {
    return (
      <React.Fragment>
        <div className="mx-auto">
          <Button
            variant={"destructive"}
            className="mr-2"
            onClick={() => confirmRemoveAnimal(animal)}
          >
            <HiTrash className="mx-auto" />
          </Button>
        </div>
      </React.Fragment>
    );
  };

  /////
  // remove item stuff
  const [selectedItem, setSelectedItem] = useState<EnrichmentItem>(emptyItem);
  const [removeItemDialog, setRemoveItemDialog] = useState<boolean>(false);
  const confirmRemoveItem = (item: EnrichmentItem) => {
    setSelectedItem(item);
    setRemoveItemDialog(true);
  };

  const hideRemoveItemDialog = () => {
    setRemoveItemDialog(false);
  };

  const removeItem = async () => {
    if (involvedItemList == undefined) {
      toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Involved animal list is invalid",
      });
      return;
    }

    let _animals = involvedItemList.filter(
      (val) => val.enrichmentItemId !== selectedItem?.enrichmentItemId
    );

    let enrichmentItemId = selectedItem.enrichmentItemId;
    const animalToRemoveApiObj = {
      animalActivityId,
      enrichmentItemId,
    };

    const removeItemApi = async () => {
      try {
        const responseJson = await apiJson.put(
          "http://localhost:3000/api/animal/removeItemFromActivity/",
          animalToRemoveApiObj
        );

        toastShadcn({
          // variant: "destructive",
          title: "Deletion Successful",
          description:
            "Successfully removed animal: " +
            selectedItem.enrichmentItemName +
            " from the activity",
        });
        setInvolvedItemList(_animals);
        setRemoveItemDialog(false);
        setSelectedItem(emptyItem);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while removing animal from activity: \n" +
            error.message,
        });
      }
    };
    removeItemApi();
  };

  const removeItemDialogFooter = (
    <React.Fragment>
      <Button onClick={hideRemoveItemDialog}>
        <HiX className="mr-2" />
        No
      </Button>
      <Button variant={"destructive"} onClick={removeItem}>
        <HiCheck className="mr-2" />
        Yes
      </Button>
    </React.Fragment>
  );
  ////
  const itemActionBodyTemplate = (item: EnrichmentItem) => {
    return (
      <React.Fragment>
        <div className="mx-auto">
          <Button
            variant={"destructive"}
            className="mr-2"
            onClick={() => confirmRemoveItem(item)}
          >
            <HiTrash className="mx-auto" />
          </Button>
        </div>
      </React.Fragment>
    );
  };

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
          formFieldName="eventName"
          label="Title"
          required={true}
          placeholder="Event title"
          pattern={undefined}
          value={eventName}
          setValue={setEventName}
          validateFunction={validateEventName}
        />

        {/* Event Type */}
        <FormFieldSelect
          formFieldName="eventType"
          label="Event Type"
          required={true}
          placeholder="Select an event type..."
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
          name="eventDescription"
          className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
        >
          <Form.Label className="font-medium">Description</Form.Label>
          <Form.Control
            asChild
            value={eventDescription}
            required={true}
            onChange={(e) => setEventDescription(e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium shadow-md outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
          >
            <textarea
              rows={3}
              placeholder="Event description"
            // className="bg-blackA5 shadow-blackA9 selection:color-white selection:bg-blackA9 box-border inline-flex w-full resize-none appearance-none items-center justify-center rounded-[4px] p-[10px] text-[15px] leading-none text-white shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
            />
          </Form.Control>
          <Form.ValidityState>{validateEventDescription}</Form.ValidityState>
        </Form.Field>

        <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">

          {/* Event Dates */}
          <Form.Field
            name="eventDates"
            id="eventDatesDateField"
            className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
          >
            <Form.Label className="font-medium">
              Event Dates
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
          <Form.Field
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
          </Form.Field>
        </div>

        <Form.Submit asChild>
          <Button
            disabled={apiJson.loading}
            className="h-12 w-2/3 self-center rounded-full text-lg"
          >
            {!apiJson.loading ? <div>Submit</div> : <div>Loading</div>}
          </Button>
        </Form.Submit>


        <div className="flex w-full gap-20">
          <div className="w-full">
            <div className="mb-2 text-xl font-medium">
              Involved Animal(s):
            </div>
            <div className="flex justify-between">
              <InputText
                type="search"
                placeholder="Search..."
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  setInvolvedAnimalGlobalFilter(target.value);
                }}
                className="mb-2 h-full w-60"
              />
              {(employee.superAdmin ||
                employee.planningStaff?.plannerType == "CURATOR") && (
                  <Button
                    onClick={() =>
                      navigate(
                        `/animal/assignanimalstoactivity/${curAnimalActivity.animalActivityId}`
                      )
                    }
                    type="button"
                    className="h-12 w-60"
                  >
                    Assign Animal(s)
                  </Button>
                )}
            </div>
            <DataTable
              value={involvedAnimalList}
              scrollable
              scrollHeight="100%"
              // selection={selectedAnimalToBecomeParent!}
              selectionMode="single"
              globalFilter={involvedAnimalGlobalFiler}
              // onSelectionChange={(e) =>
              //   setSelectedAnimalToBecomeParent(e.value)
              // }
              style={{ height: "50vh" }}
              dataKey="animalCode"
              className="h-1/2 overflow-hidden rounded border border-graydark/30"
            >
              <Column
                field="imageUrl"
                body={animalImageBodyTemplate}
                style={{ minWidth: "3rem" }}
              ></Column>
              <Column
                field="animalCode"
                header="Code"
                sortable
                style={{ minWidth: "7rem" }}
              ></Column>
              <Column
                field="houseName"
                header="House Name"
                sortable
                style={{ minWidth: "5rem" }}
              ></Column>
              {(employee.superAdmin ||
                employee.planningStaff?.plannerType == "CURATOR") && (
                  <Column
                    body={animalActionBodyTemplate}
                    header="Actions"
                    exportable={false}
                    style={{ minWidth: "3rem" }}
                  ></Column>
                )}
            </DataTable>
            <Dialog
              visible={removeAnimalDialog}
              style={{ width: "32rem" }}
              breakpoints={{ "960px": "75vw", "641px": "90vw" }}
              header="Confirm"
              modal
              footer={removeAnimalDialogFooter}
              onHide={hideRemoveAnimalDialog}
            >
              <div className="confirmation-content">
                <i
                  className="pi pi-exclamation-triangle mr-3"
                  style={{ fontSize: "2rem" }}
                />
                {selectedAnimal && (
                  <span>
                    Are you sure you want to remove{" "}
                    {selectedAnimal.houseName} from the current
                    activity? ?
                  </span>
                )}
              </div>
            </Dialog>
          </div>
          <div className="w-full">
            <div className="mb-2 text-xl font-medium">
              Item(s) to be used:
            </div>
            <div className="flex justify-between">
              <InputText
                type="search"
                placeholder="Search..."
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  setInvolvedItemGlobalFilter(target.value);
                }}
                className="mb-2 h-min w-60"
              />
              {(employee.superAdmin ||
                employee.planningStaff?.plannerType == "CURATOR") && (
                  <Button
                    onClick={() =>
                      navigate(
                        `/animal/assignitemstoactivity/${curAnimalActivity.animalActivityId}`
                      )
                    }
                    type="button"
                    className="h-12 w-60"
                  >
                    Assign Item(s)
                  </Button>
                )}
            </div>
          </div>
        </div>
        <AllEmployeesDatatable></AllEmployeesDatatable>
      </Form.Root>
    </div>
  );
}

export default CreatePublicZooEventForm;
