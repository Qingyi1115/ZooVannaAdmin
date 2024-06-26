import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useApiJson from "../../hooks/useApiJson";
import Animal from "../../models/Animal";
import AnimalActivity from "../../models/AnimalActivity";
import EnrichmentItem from "../../models/EnrichmentItem";
import Species from "../../models/Species";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableRow
} from "@/components/ui/table";
import { NavLink } from "react-router-dom";

import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";

import { useToast } from "@/components/ui/use-toast";
import { HiCheck, HiTrash, HiX } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

import { Dialog } from "primereact/dialog";
import AllAnimalActivityLogsDatatable from "../../components/AnimalManagement/ViewAnimalDetailsPage/AllAnimalActivityLogsDatatable";
import AllAnimalObservationLogsDatatable from "../../components/AnimalManagement/ViewAnimalDetailsPage/AllAnimalObservationLogsDatatable";
import {
  AcquisitionMethod,
  ActivityType,
  AnimalGrowthStage,
  AnimalSex,
} from "../../enums/Enumurated";
import beautifyText from "../../hooks/beautifyText";
import { useAuthContext } from "../../hooks/useAuthContext";

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

function ViewAnimalActivityDetails() {
  const apiJson = useApiJson();
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;

  const { animalActivityId } = useParams<{ animalActivityId: string }>();

  const [curAnimalActivity, setCurAnimalActivity] =
    useState<AnimalActivity | null>(null);
  const [refreshSeed, setRefreshSeed] = useState<number>(0);

  const [involvedAnimalList, setInvolvedAnimalList] = useState<Animal[]>();
  const [involvedAnimalGlobalFiler, setInvolvedAnimalGlobalFilter] =
    useState<string>("");
  const { tab } = useParams<{ tab: string }>();
  const employee = useAuthContext().state.user?.employeeData;
  const [involvedItemList, setInvolvedItemList] = useState<EnrichmentItem[]>(
    []
  );
  const [involvedItemGlobalFiler, setInvolvedItemGlobalFilter] =
    useState<string>("");

  useEffect(() => {
    const fetchAnimalActivity = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/animal/getAnimalActivityById/${animalActivityId}`
        );
        setCurAnimalActivity(responseJson.animalActivity as AnimalActivity);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchAnimalActivity();
  }, [refreshSeed]);

  useEffect(() => {
    if (curAnimalActivity?.animals && curAnimalActivity.enrichmentItems) {
      setInvolvedAnimalList(curAnimalActivity?.animals);
      setInvolvedItemList(curAnimalActivity?.enrichmentItems);
    }
  }, [curAnimalActivity]);

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
    <div className="p-10">
      {curAnimalActivity && (
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
                Animal Activity Details
              </span>
              <Button disabled className="invisible">
                Back
              </Button>
            </div>
            <Separator />
            <span className="mt-4 self-center text-title-xl font-bold">
              {curAnimalActivity.title}
            </span>
          </div>
          {/* body */}
          <div>
            <Tabs defaultValue={tab ? `${tab}` : "details"} className="w-full">
              <TabsList className="no-scrollbar mb-4 w-full justify-around overflow-x-auto px-4 text-xs xl:text-base">
                <TabsTrigger value="details">Basic Information</TabsTrigger>
                {curAnimalActivity.activityType == ActivityType.OBSERVATION ? (
                  <TabsTrigger value="observationlogs">
                    Observation Logs
                  </TabsTrigger>
                ) : (
                  <TabsTrigger value="activitylogs">Activity Logs</TabsTrigger>
                )}
              </TabsList>
              <TabsContent value="details">
                <div className="mb-10">
                  {(employee.superAdmin ||
                    employee.planningStaff?.plannerType == "CURATOR") && (
                      <NavLink
                        to={`/animal/editanimalactivity/${curAnimalActivity.animalActivityId}`}
                      >
                        <Button className="my-3">Edit Basic Information</Button>
                      </NavLink>
                    )}
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="w-1/3 font-bold" colSpan={2}>
                          ID
                        </TableCell>
                        <TableCell>
                          {curAnimalActivity.animalActivityId}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="w-1/3 font-bold" colSpan={2}>
                          Title
                        </TableCell>
                        <TableCell>{curAnimalActivity.title}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="w-1/3 font-bold" colSpan={2}>
                          Required number of keepers
                        </TableCell>
                        <TableCell>{curAnimalActivity.requiredNumberOfKeeper}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="w-1/3 font-bold" colSpan={2}>
                          Type
                        </TableCell>
                        <TableCell>
                          {beautifyText(curAnimalActivity.activityType)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="w-1/3 font-bold" colSpan={2}>
                          Period Start Date
                        </TableCell>
                        <TableCell>
                          {new Date(curAnimalActivity.startDate).toDateString()}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="w-1/3 font-bold" colSpan={2}>
                          Period End Date
                        </TableCell>
                        <TableCell>
                          {new Date(curAnimalActivity.endDate).toDateString()}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell className="w-1/3 font-bold" colSpan={2}>
                          Recurring Pattern
                        </TableCell>
                        <TableCell>
                          {beautifyText(curAnimalActivity.recurringPattern)}
                        </TableCell>
                      </TableRow>
                      {curAnimalActivity.recurringPattern == "WEEKLY" && (
                        <TableRow>
                          <TableCell className="w-1/3 font-bold" colSpan={2}>
                            Day Of Week
                          </TableCell>
                          <TableCell>
                            {beautifyText(curAnimalActivity.dayOfWeek)}
                          </TableCell>
                        </TableRow>
                      )}
                      {curAnimalActivity.recurringPattern == "MONTHLY" && (
                        <TableRow>
                          <TableCell className="w-1/3 font-bold" colSpan={2}>
                            Day Of Month
                          </TableCell>
                          <TableCell>
                            {curAnimalActivity.dayOfMonth &&
                              beautifyText(
                                Number(curAnimalActivity.dayOfMonth).toString()
                              )}
                          </TableCell>
                        </TableRow>
                      )}
                      <TableRow>
                        <TableCell className="w-1/3 font-bold" colSpan={2}>
                          Session Timing
                        </TableCell>
                        <TableCell>
                          {beautifyText(curAnimalActivity.eventTimingType)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="w-1/3 font-bold" colSpan={2}>
                          Duration (Minutes)
                        </TableCell>
                        <TableCell>
                          {curAnimalActivity.durationInMinutes}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="w-1/3 font-bold" colSpan={2}>
                          Details
                        </TableCell>
                        <TableCell>{curAnimalActivity.details}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
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
                    <DataTable
                      value={involvedItemList}
                      scrollable
                      scrollHeight="100%"
                      // selection={selectedAnimalToBecomeParent!}
                      selectionMode="single"
                      globalFilter={involvedItemGlobalFiler}
                      // onSelectionChange={(e) =>
                      //   setSelectedAnimalToBecomeParent(e.value)
                      // }
                      // onRowClick={(event) =>
                      //   navigate(
                      //     `/animal/viewanimaldetails/${event.data.animalCode}`
                      //   )
                      // }
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
                      {(employee.superAdmin ||
                        employee.planningStaff?.plannerType == "CURATOR") && (
                          <Column
                            body={itemActionBodyTemplate}
                            header="Actions"
                            exportable={false}
                            style={{ minWidth: "3rem" }}
                          ></Column>
                        )}
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
                </div>
              </TabsContent>
              {curAnimalActivity.activityType == ActivityType.OBSERVATION ? (
                <TabsContent value="observationlogs">
                  <AllAnimalObservationLogsDatatable
                    speciesCode={""}
                    animalCode={""}
                    animalActivityId={curAnimalActivity.animalActivityId}
                  />
                </TabsContent>
              ) : (
                <TabsContent value="activitylogs">
                  <AllAnimalActivityLogsDatatable
                    speciesCode={""}
                    animalCode={""}
                    animalActivityId={curAnimalActivity.animalActivityId}
                  />
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewAnimalActivityDetails;
