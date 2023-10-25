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
} from "../../enums/Enumurated";
import { Dialog } from "primereact/dialog";
import { Nullable } from "primereact/ts-helpers";
import * as Form from "@radix-ui/react-form";
import FormFieldInput from "src/components/FormFieldInput";
import { Calendar, CalendarChangeEvent } from "primereact/calendar";

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
        console.log("a", responseJson)
        setCurZooEvent(responseJson["zooEvent"] as ZooEvent);
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
  const [eventNotificationDate, setEventNotificationDate] = useState<string | Date | Date[] | null>();
  const [eventEndDateTime, setEventEndDateTime] = useState<string | Date | Date[] | null>();
  const [imageUrl, setImageUrl] = useState<string | null>();
  const [imageFile, setImageFile] = useState<File | null>();
  const [formError, setFormError] = useState<string | null>(null);

  const showMakePublicDialog = () => {
    setMakePublicDialog(true);
  };

  const hideMakePublicDialog = () => {
    setMakePublicDialog(false);
  };

  const makeEventPublic = async () => {

    const updatedZooEvent = {
      zooEventId: curZooEvent?.zooEventId,
      eventIsPublic: true,
      eventNotificationDate,
      eventEndDateTime,
      imageUrl

    };

    useEffect(() => {
      apiJson.put(
        "http://localhost:3000/api/animal/updateZooEvent",
        updatedZooEvent
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
    }, [refreshSeed]);
  }


  const makeEventPublicDialogFooter = (
    <React.Fragment>
      <Button onClick={hideMakePublicDialog}>
        <HiX className="mr-2" />
        No
      </Button>
      <Button variant={"destructive"} onClick={makeEventPublic}>
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
              <span className="mt-4 self-center text-title-xl font-bold">
                Event Details
              </span>
              <Button disabled className="invisible">
                Back
              </Button>
            </div>
            <Separator />
          </div>
          {/* body */}
          <div>
            <div className="mb-10 ">
              <div className="text-xl font-medium">Basic Information:</div>
              <div className="my-4 flex justify-start gap-6">
                <Button
                  onClick={() => {
                    navigate(`/zooevent/viewzooeventdetails/${curZooEvent.zooEventId}`, { replace: true })
                    navigate(`/zooevent/editzooevent/${curZooEvent.zooEventId}`)
                  }}
                  className="my-3">Edit Basic Information
                </Button>
                <Button
                  onClick={() => {
                    showMakePublicDialog();
                  }}
                  className="my-3">Make Event Public
                </Button>
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
            </div>

            <div className="w-full">
              <div className="mb-2 text-xl font-medium">
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
            <br />
            <div className="w-full">
              <div className="mb-2 text-xl font-medium">
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
              <Dialog
                visible={makeEventPublicDialog}
                style={{ width: "50rem" }}
                breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                header="Make Event Public"
                // position={"right"}
                footer={
                  <Button
                    disabled={apiJson.loading}
                    className="h-12 w-2/3 self-center rounded-full text-lg"
                    onClick={makeEventPublic}
                  >
                    {!apiJson.loading ? (
                      <div>Make Event Public</div>
                    ) : (
                      <div>Loading</div>
                    )}
                  </Button>}
                onHide={hideMakePublicDialog}>
                <div className="confirmation-content">
                  <Form.Root
                    className="flex w-full flex-col gap-6  bg-white p-20 text-black "

                    encType="multipart/form-data"
                  >
                    {/* Event Notification Date */}
                    <div className="card justify-content-center block ">
                      <div className="mb-1 block font-medium">Event Notification Date</div>
                      <Calendar
                        value={eventNotificationDate}
                        onChange={(e: CalendarChangeEvent) => {
                          if (e && e.value !== undefined) {
                            setEventNotificationDate(e.value);
                          }
                        }}
                        className="border-100 bg-white "
                      />
                    </div>
                    {/* Event End Date */}
                    <div className="card justify-content-center block ">
                      <div className="mb-1 block font-medium">End Date</div>
                      <Calendar
                        value={eventEndDateTime}
                        onChange={(e: CalendarChangeEvent) => {
                          if (e && e.value !== undefined) {
                            setEventEndDateTime(e.value);
                          }
                        }}
                        className="border-100 bg-white "
                      />
                    </div>
                    {/* <Form.Submit asChild> */}
                    {/* <Button
                  disabled={apiJson.loading || selectedEmployees.length == 0}
                  className="h-12 w-2/3 self-center rounded-full text-lg"
                  onClick={confirmAssignment}
                >
                  {!apiJson.loading ? (
                    <div>Assign Selected Staff</div>
                  ) : (
                    <div>Loading</div>
                  )}
                </Button> */}
                    {/* </Form.Submit> */}
                    {formError && (
                      <div className="m-2 border-danger bg-red-100 p-2">{formError}</div>
                    )}
                  </Form.Root>
                </div>
              </Dialog>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewZooEventDetails;
