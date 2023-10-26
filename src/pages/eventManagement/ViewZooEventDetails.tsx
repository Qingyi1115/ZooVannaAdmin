import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useApiJson from "../../hooks/useApiJson";
import ZooEvent from "../../models/ZooEvent";
import Animal from "../../models/Animal";
import Species from "../../models/Species";
import EnrichmentItem from "../../models/EnrichmentItem";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NavLink } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";

import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { HiCheck, HiEye, HiTrash, HiX } from "react-icons/hi";

import {
  AcquisitionMethod,
  AnimalGrowthStage,
  AnimalSex,
  EventType,
} from "../../enums/Enumurated";
import { Dialog } from "primereact/dialog";
import { Nullable } from "primereact/ts-helpers";
import * as Form from "@radix-ui/react-form";
import FormFieldInput from "src/components/FormFieldInput";
import { Calendar, CalendarChangeEvent } from "primereact/calendar";
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from "lucide-react";
import { set } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AllEventEmployeesDatatable from "../../components/EventManagement/ViewZooEventDetails/AllEventEmployeesDatatable";

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

function ViewZooEventDetails() {
  const apiJson = useApiJson();
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;

  const { zooEventId } = useParams<{ zooEventId: string }>();
  const { tab } = useParams<{ tab: string }>();

  const [curZooEvent, setCurZooEvent] =
    useState<ZooEvent | null>(null);
  const [refreshSeed, setRefreshSeed] = useState<number>(0);

  const [involvedAnimalList, setInvolvedAnimalList] = useState<Animal[]>();
  const [involvedAnimalGlobalFiler, setInvolvedAnimalGlobalFilter] =
    useState<string>("");

  const [involvedItemList, setInvolvedItemList] = useState<EnrichmentItem[]>(
    []
  );
  const [involvedItemGlobalFiler, setInvolvedItemGlobalFilter] =
    useState<string>("");

  useEffect(() => {
    const fetchZooEvent = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/zooEvent/getZooEventById/${zooEventId}`
        );
        setCurZooEvent(responseJson["zooEvent"] as ZooEvent);
        setInvolvedAnimalList(responseJson["zooEvent"].animals);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchZooEvent();
  }, [refreshSeed]);

  // useEffect(() => {
  //   if (curZooEvent?.animals && curZooEvent.enrichmentItems) {
  //     setInvolvedAnimalList(curZooEvent?.animals);
  //     setInvolvedItemList(curZooEvent?.enrichmentItems);
  //   }
  // }, [curZooEvent]);

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
      zooEventId,
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
            className="mr-2"
            onClick={() => {
              navigate(`/zooevent/viewzooeventdetails/${curZooEvent?.zooEventId}`, { replace: true });
              navigate(`/animal/viewanimaldetails/${animal.animalCode}`);
            }}
          >
            <HiEye className="mx-auto" />
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
      zooEventId,
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

  // Make Event Public stuff
  const [makeEventPublicDialog, setMakePublicDialog] = useState<boolean>(false);
  const [eventNotificationDate, setEventNotificationDate] = useState<Nullable<Date>>();
  const [eventStartDateTime, setEventStartDateTime] = useState<Nullable<Date>>();
  const [eventEndDateTime, setEventEndDateTime] = useState<Nullable<Date>>();
  const [imageUrl, setImageUrl] = useState<string | null>();
  const [imageFile, setImageFile] = useState<File | null>();
  const [formError, setFormError] = useState<string | null>(null);
  const [updateFuture, setUpdateFuture] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);

  const showMakePublicDialog = () => {
    setMakePublicDialog(true);
  };

  const hideMakePublicDialog = () => {
    setMakePublicDialog(false);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    console.log(curZooEvent);
    e.preventDefault();
    const zooEventDetails = {
      zooEventId: curZooEvent?.zooEventId,
      eventIsPublic: true,
      eventNotificationDate: eventNotificationDate?.getTime(),
      eventEndDateTime: eventEndDateTime?.getTime(),
      imageUrl

    };
    console.log(updateFuture)
    if (updateFuture) {
      const data = {
        eventName: curZooEvent?.eventName,
        eventDescription: curZooEvent?.eventDescription,
        eventIsPublic: curZooEvent?.eventIsPublic,
        eventType: curZooEvent?.eventType,
        eventStartDateTime: eventStartDateTime?.getTime(),
        requiredNumberOfKeeper: curZooEvent?.requiredNumberOfKeeper,

        eventDurationHrs: curZooEvent?.eventDurationHrs,
        eventTiming: curZooEvent?.eventTiming,

        eventNotificationDate: eventNotificationDate?.getTime(),
        eventEndDateTime: curZooEvent?.eventEndDateTime,
      };
      console.log(data);
      apiJson.put(
        `http://localhost:3000/api/zooEvent/updateZooEventIncludeFuture/${curZooEvent?.zooEventId}`,
        data
      ).then(res => {
        // success
        toastShadcn({
          description: "Successfully updated event",
        });
        setMakePublicDialog(false);
      }).catch(error => {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while updating event: \n" +
            error.message,
        });
      });
    } else {
      console.log(zooEventDetails);
      apiJson.put(
        `http://localhost:3000/api/zooEvent/updateZooEventSingle/${curZooEvent?.zooEventId}`,
        { zooEventDetails: zooEventDetails }
      ).then(res => {
        // success
        toastShadcn({
          description: "Successfully updated event",
        });
        setMakePublicDialog(false);
      }).catch(error => {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while updating event: \n" +
            error.message,
        });
      });
    }
  }



  const makeEventPublicDialogFooter = (
    <React.Fragment>
      <Button onClick={hideMakePublicDialog}>
        <HiX className="mr-2" />
        No
      </Button>
      <Button
        variant={"destructive"}
      // onClick={handleSubmit}
      >
        <HiCheck className="mr-2" />
        Yes
      </Button>
    </React.Fragment>
  );

  const involvedAnimalsHeader = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="m-1">Manage Involved Animals</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          placeholder="Search..."
          onInput={(e) => {
            const target = e.target as HTMLInputElement;
            setInvolvedAnimalGlobalFilter(target.value);
          }}
        />
      </span>
    </div>
  );

  const involvedItemsHeader = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="m-1">Manage Items</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          placeholder="Search..."
          onInput={(e) => {
            const target = e.target as HTMLInputElement;
            setInvolvedItemGlobalFilter(target.value);
          }}
        />
      </span>
    </div>
  );

  const statusTemplate = (animal: Animal) => {
    const statuses = animal.animalStatus.split(",");

    return (
      <React.Fragment>
        <div className="flex flex-col gap-1">
          {statuses.map((status, index) => (
            <div
              key={index}
              className={
                status === "NORMAL"
                  ? "flex items-center justify-center rounded bg-emerald-100 p-[0.1rem] text-sm font-bold text-emerald-900"
                  : status === "PREGNANT"
                    ? "flex items-center justify-center rounded bg-orange-100 p-[0.1rem] text-sm font-bold text-orange-900"
                    : status === "SICK"
                      ? "flex items-center justify-center rounded bg-yellow-100 p-[0.1rem] text-sm font-bold text-yellow-900"
                      : status === "INJURED"
                        ? "flex items-center justify-center rounded bg-red-100 p-[0.1rem] text-sm font-bold text-red-900"
                        : status === "OFFSITE"
                          ? "flex items-center justify-center rounded bg-blue-100 p-[0.1rem] text-sm font-bold text-blue-900"
                          : status === "RELEASED"
                            ? "flex items-center justify-center rounded bg-fuchsia-100 p-[0.1rem] text-sm font-bold text-fuchsia-900"
                            : status === "DECEASED"
                              ? "flex items-center justify-center rounded bg-slate-300 p-[0.1rem] text-sm font-bold text-slate-900"
                              : "bg-gray-100 flex items-center justify-center rounded p-[0.1rem] text-sm font-bold text-black"
              }
            >
              {status}
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  };

  function validateStartDate(props: ValidityState) {
    if (props != undefined) {
      if (eventStartDateTime == null) {
        return (
          <div className="font-medium text-danger">
            * Please enter the start date of the period for the recurring
            event
          </div>
        );
      }
    }

    if (
      eventStartDateTime != null &&
      eventEndDateTime != null &&
      new Date(eventStartDateTime) > new Date(eventEndDateTime)
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
      if (eventEndDateTime == null) {
        return (
          <div className="font-medium text-danger">
            * Please enter the end date of the period for the recurring event
          </div>
        );
      }
    }

    if (
      eventEndDateTime != null &&
      eventStartDateTime != null &&
      new Date(eventStartDateTime) > new Date(eventEndDateTime)
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

  function validateDate(props: ValidityState) {
    if (props != undefined) {
      if (eventStartDateTime == null) {
        return (
          <div className="font-medium text-danger">
            * Please enter a date!
          </div>
        );
      }
    }
    // add any other cases here
    return null;
  }

  return (
    <div className="p-10">
      {curZooEvent && (
        <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-lg">
          {/* Header */}
          <div className="flex flex-col">
            <div className="mb-4 flex justify-between">
              {/* <NavLink className="flex" to={(-1)}> */}
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
                View Event Details
              </span>
              <Button disabled className="invisible">
                Back
              </Button>
            </div>
            <Separator />
            <span className="mt-4 self-center text-title-xl font-bold">
              {curZooEvent.eventName}
            </span>
          </div>
          {/* body */}
          <div>
            <div className="mb-10 ">
              <Tabs
                defaultValue={tab ? `${tab}` : "details"}
                className="w-full"
              >
                <TabsList className="no-scrollbar w-full justify-around overflow-x-auto px-4 text-xs xl:text-base">
                  <TabsTrigger value="details">Details</TabsTrigger>

                  <TabsTrigger value="involvedAnimals">Involved Animals</TabsTrigger>
                  {curZooEvent.animalActivity != null && <TabsTrigger value="involvedItems">Involved Items</TabsTrigger>}
                  <TabsTrigger value="assignedEmployees">Assigned Employees</TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                  <div className="my-4 text-xl font-medium">Basic Information:</div>
                  <div className="my-4 flex justify-start gap-6">
                    <Button
                      onClick={() => {
                        // if (curZooEvent.animalActivity != null) {
                        //   navigate(`/animal/editanimalactivity/${curZooEvent.zooEventId}`, { replace: true })
                        //   navigate(`/zooevent/editzooevent/${curZooEvent.zooEventId}`)
                        // }
                        navigate(`/zooevent/viewzooeventdetails/${curZooEvent.zooEventId}`, { replace: true })
                        navigate(`/zooevent/editzooevent/${curZooEvent.zooEventId}`)
                      }}
                      className="my-3">Edit Basic Information
                    </Button>
                    {!curZooEvent.eventIsPublic ?
                      <Button
                        onClick={() => {
                          showMakePublicDialog();
                        }}
                        className="my-3">Make Event Public
                      </Button> :
                      <Button
                        disabled
                        className="invisible my-3"
                      >Make Event Public
                      </Button>
                    }
                  </div>

                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="w-1/3 font-bold" colSpan={2}>
                          ID
                        </TableCell>
                        <TableCell>{curZooEvent.zooEventId}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="w-1/3 font-bold" colSpan={2}>
                          Name
                        </TableCell>
                        <TableCell>{curZooEvent.eventName}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="w-1/3 font-bold" colSpan={2}>
                          Type
                        </TableCell>
                        <TableCell>{curZooEvent.eventType}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="w-1/3 font-bold" colSpan={2}>
                          Start Date
                        </TableCell>
                        <TableCell>
                          {new Date(curZooEvent.eventStartDateTime).toDateString()}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="w-1/3 font-bold" colSpan={2}>
                          Session Timing
                        </TableCell>
                        <TableCell>{curZooEvent.eventTiming}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="w-1/3 font-bold" colSpan={2}>
                          Duration (Hours)
                        </TableCell>
                        <TableCell>{curZooEvent.eventDurationHrs}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="w-1/3 font-bold" colSpan={2}>
                          Description
                        </TableCell>
                        <TableCell>{curZooEvent.eventDescription}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <Dialog
                    visible={makeEventPublicDialog}
                    style={{ width: "50rem" }}
                    breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                    header="Make Event Public"
                    // footer={
                    //   <Button
                    //     disabled={apiJson.loading}
                    //     className="h-12 w-2/3 self-center rounded-full text-lg"
                    //     onClick={makeEventPublic}
                    //   >
                    //     {!apiJson.loading ? (
                    //       <div>Make Event Public</div>
                    //     ) : (
                    //       <div>Loading</div>
                    //     )}
                    //   </Button>}
                    onHide={hideMakePublicDialog}>
                    <div className="confirmation-content">
                      <Form.Root
                        className="flex w-full flex-col gap-6  bg-white p-10 text-black "
                        onSubmit={handleSubmit}
                        encType="multipart/form-data"
                      >
                        {/* Start Date */}
                        <Form.Field
                          name="eventStartDateTime"
                          id="eventStartDateField"
                          className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
                        >
                          <Form.Label className="font-medium">Start Date</Form.Label>
                          <Form.Control
                            className="hidden"
                            type="text"
                            value={eventStartDateTime?.toString()}
                            required={true}
                            onChange={() => null}
                          ></Form.Control>
                          <Calendar
                            value={eventStartDateTime}
                            className="w-fit"
                            showTime hourFormat="24"
                            onChange={(e: any) => {
                              if (e && e.value !== undefined) {
                                setEventStartDateTime(e.value);

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
                          <Form.ValidityState>{validateStartDate}</Form.ValidityState>
                        </Form.Field>
                        {/* End Date */}
                        {/* <Form.Field
                          name="eventEndDateTime"
                          id="eventEndDateField"
                          className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
                        >
                          <Form.Label className="font-medium">End Date</Form.Label>
                          <Form.Control
                            className="hidden"
                            type="text"
                            value={eventEndDateTime?.toString()}
                            required={true}
                            onChange={() => null}
                          ></Form.Control>
                          <Calendar
                            value={eventEndDateTime}
                            className="w-fit"
                            onChange={(e: any) => {
                              if (e && e.value !== undefined) {
                                setEventEndDateTime(e.value);

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
                          <Form.ValidityState>{validateEndDate}</Form.ValidityState>
                        </Form.Field> */}
                        {/* Notification Date */}
                        <Form.Field
                          name="eventNotificationDate"
                          id="eventNotificationDateField"
                          className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
                        >
                          <Form.Label className="font-medium">Notification Date</Form.Label>
                          <Form.Control
                            className="hidden"
                            type="text"
                            value={eventNotificationDate?.toString()}
                            required={true}
                            onChange={() => null}
                          ></Form.Control>
                          <Calendar
                            value={eventNotificationDate}
                            className="w-fit"
                            onChange={(e: any) => {
                              if (e && e.value !== undefined) {
                                setEventNotificationDate(e.value);

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
                        {/* Update Future*/}
                        <Form.Field
                          name="updateFuture"
                          id="updateFutureField"
                          className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
                        >
                          <Form.Label className="font-medium">Update this and future events?</Form.Label>
                          <Form.Control
                            className="hidden"
                            type="text"
                            value={updateFuture?.toString()}
                            required={true}
                            onChange={() => null}
                          ></Form.Control>
                          <Checkbox.Root
                            className="flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-[4px] bg-white shadow outline-none focus:shadow-[0_0_0_2px_gray]"
                            id="c1"
                            onCheckedChange={(event: boolean) => { setUpdateFuture(event) }}
                          >
                            <Checkbox.Indicator>
                              <CheckIcon />
                            </Checkbox.Indicator>
                          </Checkbox.Root>
                        </Form.Field>
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
                  </Dialog>
                </TabsContent>

                <TabsContent value="involvedAnimals">
                  <div className="w-full">
                    <div className="my-4mb-2 text-xl font-medium">
                      Involved Animal(s):
                    </div>
                    <DataTable
                      value={involvedAnimalList}
                      scrollable
                      scrollHeight="100%"
                      selectionMode="single"
                      globalFilter={involvedAnimalGlobalFiler}
                      header={involvedAnimalsHeader}
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
                        style={{ minWidth: "4rem" }}
                      ></Column>
                      <Column
                        field="houseName"
                        header="House Name"
                        sortable
                        style={{ minWidth: "5rem" }}
                      ></Column>
                      <Column
                        body={statusTemplate}
                        header="Animal Status"
                        sortable
                        style={{ minWidth: "5rem" }}
                      ></Column>
                      <Column
                        body={(animal) => {
                          return animal.sex == "" || animal.sex == null ? (
                            <span className="flex justify-center ">—</span>
                          ) : (
                            animal.sex
                          );
                        }}
                        field="sex"
                        header="Sex"
                        sortable
                        style={{ minWidth: "4rem" }}
                      ></Column>
                      <Column
                        body={(animal) => {
                          return animal.identifierType == "" ||
                            animal.identifierType == null ? (
                            <span className="flex justify-center">—</span>
                          ) : (
                            animal.identifierType
                          );
                        }}
                        field="identifierType"
                        header="Identifier Type"
                        sortable
                        style={{ minWidth: "5rem" }}
                      ></Column>
                      <Column
                        body={(animal) => {
                          return animal.identifierValue == "" ||
                            animal.identifierValue == null ? (
                            <span className="flex justify-center">—</span>
                          ) : (
                            animal.identifierValue
                          );
                        }}
                        field="identifierValue"
                        header="Identifier Value"
                        sortable
                        style={{ minWidth: "5rem" }}
                      ></Column>
                      <Column
                        body={animalActionBodyTemplate}
                        header="Actions"
                        exportable={false}
                        style={{ minWidth: "3rem" }}
                      ></Column>
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
                            {selectedAnimal.houseName} from the current activity? ?
                          </span>
                        )}
                      </div>
                    </Dialog>
                  </div>
                </TabsContent>

                {curZooEvent.animalActivity != null && <TabsContent value="involvedItems">
                  <div>
                    <div className="my-4 mb-2 text-xl font-medium">
                      Item(s) to be used:
                    </div>
                    <DataTable
                      value={involvedItemList}
                      scrollable
                      scrollHeight="100%"
                      selectionMode="single"
                      globalFilter={involvedItemGlobalFiler}
                      header={involvedItemsHeader}
                      dataKey="enrichmentItemid"
                      style={{ height: "50vh" }}
                      className="h-1/2 overflow-hidden rounded border border-graydark/30"
                    >
                      <Column
                        field="enrichmentItemImageUrl"
                        body={enrichmentItemImageBodyTemplate}
                        style={{ minWidth: "3rem" }}
                      ></Column>
                      <Column
                        field="enrichmentItemId"
                        header="ID"
                        sortable
                        style={{ minWidth: "3rem" }}
                      ></Column>
                      <Column
                        field="enrichmentItemName"
                        header="Name"
                        sortable
                        style={{ minWidth: "5rem" }}
                      ></Column>
                    </DataTable>
                    <Dialog
                      visible={removeItemDialog}
                      style={{ width: "32rem" }}
                      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                      header="Confirm"
                      modal
                      footer={removeItemDialogFooter}
                      onHide={hideRemoveItemDialog}
                    >
                      <div className="confirmation-content">
                        <i
                          className="pi pi-exclamation-triangle mr-3"
                          style={{ fontSize: "2rem" }}
                        />
                        {selectedItem && (
                          <span>
                            Are you sure you want to remove{" "}
                            {selectedItem.enrichmentItemName} from the current
                            activity? ?
                          </span>
                        )}
                      </div>
                    </Dialog>
                  </div>

                </TabsContent>}

                <TabsContent value="assignedEmployees">
                  <AllEventEmployeesDatatable zooEventId={zooEventId as any} />
                </TabsContent>
              </Tabs>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewZooEventDetails;
