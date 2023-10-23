import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";

import { useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import useApiJson from "../../hooks/useApiJson";
import { Separator } from "@/components/ui/separator";

import Species from "../../models/Species";
import Animal from "../../models/Animal";

import * as Form from "@radix-ui/react-form";
import { PickList } from "primereact/picklist";
import { Nullable } from "primereact/ts-helpers";
import { Calendar } from "primereact/calendar";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FeedingPlanSessionDetail from "../../models/FeedingPlanSessionDetail";
import FeedingItem from "../../models/FeedingItem";
import { MultiSelect } from "primereact/multiselect";
import {
  AnimalFeedCategory,
  DayOfWeek,
  EventTimingType,
} from "../../enums/Enumurated";
import FormFieldSelect from "../../components/FormFieldSelect";
import SpeciesDietNeed from "../../models/SpeciesDietNeed";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import {
  InputNumber,
  InputNumberValueChangeEvent,
} from "primereact/inputnumber";
import { Item } from "@radix-ui/react-accordion";

function CreateFeedingPlan() {
  const apiJson = useApiJson();
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;
  const { speciesCode } = useParams<{ speciesCode: string }>();

  const [curSpecies, setCurSpecies] = useState<Species>();
  const [curAnimalList, setCurAnimalList] = useState<Animal[]>([]);

  const [animalSourceList, setAnimalSourceList] = useState<Animal[]>([]);

  // fields
  const [feedingPlanDesc, setFeedingPlanDesc] = useState<string>("");
  const [startDate, setStartDate] = useState<Nullable<Date>>(null);
  const [endDate, setEndDate] = useState<Nullable<Date>>(null);
  const [animalTargetList, setAnimalTargetList] = useState<Animal[]>([]);
  // feeding plan species is curSpecies
  // feeding plan animals is animalTargetList
  interface DummyFeedingItem {
    foodCategory: string | null;
    amount: number | null;
    unit: string | null;
    animal: Animal;
  }
  interface DummyFeedingPlanSessionDetail {
    dayOfTheWeek: string;
    eventTimingType: string;
    feedingItems?: DummyFeedingItem[];
    durationInMinutes: number;
  }
  const [feedingPlanSessions, setFeedingPlanSessions] = useState<
    DummyFeedingPlanSessionDetail[]
  >([]);

  //
  // Add Food Stuff
  const [selectedDaysOfWeekNewFoodItem, setSelectedDaysOfWeekNewFoodItem] =
    useState<string[]>([]);
  const [
    selectedSessionTimingNewFoodItem,
    setSelectedSessionTimingNewFoodItem,
  ] = useState<string | undefined>(undefined);
  const [dietNeedsList, setDietNeedsList] = useState<SpeciesDietNeed[]>([]);
  const [listFeedCategoriesRecommended, setListFeedCategoriesRecommended] =
    useState<string[]>([]);
  const [
    listFeedCategoriesNoRecommendation,
    setListFeedCategoriesNoRecommendation,
  ] = useState<string[]>([]);
  const [
    selectedCurFeedCategoryNewFoodItem,
    setSelectedCurFeedCategoryNewFoodItem,
  ] = useState<string | null>(null);
  const [unitOfMeasurementNewFoodItem, setUnitOfMeasurementNewFoodItem] =
    useState<string | null>(null);
  const [durationInMinutesNewFoodItem, setDurationInMinutesNewFoodItem] =
    useState<number | null>(null);
  // below is the list of feeding items for new session(s) to be added
  const [curFeedingItemsNewFeedSession, setCurFeedingItemsNewFeedSession] =
    useState<DummyFeedingItem[]>(
      animalTargetList.map((animal) => ({
        foodCategory: "",
        amount: null,
        unit: "",
        animal: animal,
      }))
    );

  const handleAmountChangeNewFoodItem = (
    idx: number,
    amount: number | null
  ) => {
    const updatedCurFeedingItemsToBeAdded = [...curFeedingItemsNewFeedSession];
    updatedCurFeedingItemsToBeAdded[idx] = {
      ...updatedCurFeedingItemsToBeAdded[idx],
      amount,
    };
    setCurFeedingItemsNewFeedSession(updatedCurFeedingItemsToBeAdded);
  };

  useEffect(() => {
    setCurFeedingItemsNewFeedSession(
      animalTargetList.map((animal) => {
        const existingItem = curFeedingItemsNewFeedSession.find((feedingItem) =>
          feedingItem.animal
            ? feedingItem.animal.animalCode === animal.animalCode
            : null
        );
        if (existingItem) {
          return existingItem;
        } else {
          return {
            foodCategory: "",
            amount: null,
            unit: "",
            animal,
          };
        }
      })
    );
  }, [animalTargetList]);

  function clearNewFoodSessionFormBox() {
    setSelectedCurFeedCategoryNewFoodItem(null);
    setSelectedDaysOfWeekNewFoodItem([]);
    setSelectedSessionTimingNewFoodItem(undefined);
    setUnitOfMeasurementNewFoodItem(null);
    const resetList = curFeedingItemsNewFeedSession.map((item) => ({
      ...item,
      amount: null,
    }));
    setCurFeedingItemsNewFeedSession(resetList);
  }

  function mergeFeedingItems(
    existingItems: DummyFeedingItem[],
    newItems: DummyFeedingItem[]
  ): DummyFeedingItem[] {
    const itemsMap = new Map();

    // Initialize the map with the existing items
    existingItems.forEach((item) => {
      if (item.foodCategory && item.animal?.animalCode) {
        const key = `${item.foodCategory}_${item.animal.animalCode}`;
        itemsMap.set(key, item);
      }
    });

    // Merge new items into the map
    newItems.forEach((item) => {
      if (item.foodCategory && item.animal?.animalCode) {
        const key = `${item.foodCategory}_${item.animal.animalCode}`;
        if (itemsMap.has(key)) {
          // Item with the same foodCategory and animalCode already exists, update the amount
          const existingItem = itemsMap.get(key);
          if (item.amount !== null) {
            existingItem.amount = item.amount;
          }
        } else {
          // Item with a new combination of foodCategory and animalCode, add it to the map
          itemsMap.set(key, item);
        }
      }
    });

    return Array.from(itemsMap.values());
  }

  function addNewFoodSessionToPlan() {
    // console.log("add new food session to plan");
    // console.log(selectedDaysOfWeekNewFoodItem);
    // console.log(selectedSessionTimingNewFoodItem);
    // console.log(selectedCurFeedCategoryNewFoodItem);
    // console.log(unitOfMeasurementNewFoodItem);
    // console.log(curFeedingItemsNewFeedSession);

    // feeding plan: has many feed sessions
    // feed session: has many feed items

    // interface DummyFeedingPlanSessionDetail {
    //   dayOfTheWeek: string;
    //   eventTimingType: string;
    //   feedingItems?: DummyFeedingItem[];
    // }

    // fill up all unit of measurements and food category for curFeedingItemsNewFeedSession
    const newFeedingItemsListWithUomAndCategory =
      curFeedingItemsNewFeedSession.map((item) => ({
        ...item,
        foodCategory: selectedCurFeedCategoryNewFoodItem,
        unit: unitOfMeasurementNewFoodItem,
      }));
    console.log(newFeedingItemsListWithUomAndCategory);

    // loop for each day of week:
    if (
      selectedDaysOfWeekNewFoodItem != undefined &&
      selectedSessionTimingNewFoodItem != undefined &&
      durationInMinutesNewFoodItem != null
    ) {
      for (const day of selectedDaysOfWeekNewFoodItem as string[]) {
        // create new feeding session object (the dummy one)
        var newFeedingSessionObject: DummyFeedingPlanSessionDetail = {
          dayOfTheWeek: day[0],
          eventTimingType: selectedSessionTimingNewFoodItem,
          feedingItems: newFeedingItemsListWithUomAndCategory,
          durationInMinutes: durationInMinutesNewFoodItem,
        };

        // check inside feedingPlanSessions,
        const existingSessionIndex = feedingPlanSessions.findIndex(
          (session) =>
            session.dayOfTheWeek === newFeedingSessionObject.dayOfTheWeek &&
            session.eventTimingType === newFeedingSessionObject.eventTimingType
        );
        // if the session with selectedDayOfWeek and selectedSessionTiming already exists
        if (existingSessionIndex != -1) {
          const updatedFeedingPlanSessions = [...feedingPlanSessions];

          // merge feedingItems array between the new and existing feedingSession
          const existingSession =
            updatedFeedingPlanSessions[existingSessionIndex];
          if (
            existingSession.feedingItems &&
            newFeedingSessionObject.feedingItems
          ) {
            // Merge the feedingItems arrays (concatenation)
            // existingSession.feedingItems = existingSession.feedingItems.concat(
            //   newFeedingSessionObject.feedingItems
            // );
            existingSession.feedingItems = mergeFeedingItems(
              existingSession.feedingItems,
              newFeedingSessionObject.feedingItems
            );
          } else if (newFeedingSessionObject.feedingItems) {
            // If the existing session has no feedingItems, assign the new items
            existingSession.feedingItems = newFeedingSessionObject.feedingItems;
          }
          setFeedingPlanSessions(updatedFeedingPlanSessions);
        } else {
          // No matching item found, add the newFeedingPlanSession to feedingPlanSessions
          const updatedFeedingPlanSessions = [...feedingPlanSessions];
          updatedFeedingPlanSessions.push(newFeedingSessionObject);
          setFeedingPlanSessions(updatedFeedingPlanSessions);
        }
      }
    }
    console.log("end of here");
    console.log(feedingPlanSessions);
  }

  // data structure to group feeding items by animals
  // const feedingItemsByAnimal: {
  //   [key: string]: { animal: Animal; items: DummyFeedingItem[] };
  // } = feedingPlanSessions.reduce((result: any, session) => {
  //   if (session.feedingItems) {
  //     session.feedingItems.forEach((item) => {
  //       const animalId = item.animal?.animalId;
  //       if (animalId !== undefined) {
  //         if (!result[animalId]) {
  //           result[animalId] = { animal: item.animal, items: [] };
  //         }
  //         result[animalId].items.push(item);
  //       }
  //     });
  //   }
  //   return result;
  // }, {});
  function groupFeedingItemsByAnimal(
    feedingPlanSession: DummyFeedingPlanSessionDetail
  ) {
    const result: {
      [key: string]: { animal: Animal; items: DummyFeedingItem[] };
    } = {};

    if (feedingPlanSession.feedingItems) {
      feedingPlanSession.feedingItems.forEach((item) => {
        const animalId = item.animal?.animalId;
        if (animalId !== undefined) {
          if (!result[animalId]) {
            result[animalId] = { animal: item.animal, items: [] };
          }
          result[animalId].items.push(item);
        }
      });
    }

    return result;
  }

  // Usage
  // const feedingItemsByAnimal = groupFeedingItemsByAnimal(feedingPlanSessions);

  //edit food session????? bruh dman hard

  /// end add food stuff

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/species/getspecies/${speciesCode}`
        );
        setCurSpecies(responseJson as Species);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchSpecies();
  }, []);

  useEffect(() => {
    const fetchAnimalsBySpecies = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/animal/getAllAnimalsBySpeciesCode/${speciesCode}`
        );
        const animalListNoDeceasedOrReleased = (
          responseJson as Animal[]
        ).filter((animal) => {
          let statuses = animal.animalStatus.split(",");
          return !(
            statuses.includes("DECEASED") || statuses.includes("RELEASED")
          );
        });
        setAnimalSourceList(animalListNoDeceasedOrReleased);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchAnimalsBySpecies();
  }, []);

  useEffect(() => {
    const fetchDietNeedsList = async () => {
      try {
        if (curSpecies) {
          const responseJson = await apiJson.get(
            `http://localhost:3000/api/species/getAllDietNeedbySpeciesCode/${curSpecies.speciesCode}`
          );
          setDietNeedsList(responseJson as SpeciesDietNeed[]);

          const listAllFeedCategories = Object.keys(AnimalFeedCategory).map(
            (animalFeedCategoryKey) =>
              AnimalFeedCategory[
                animalFeedCategoryKey as keyof typeof AnimalFeedCategory
              ].toString()
          );
          const listRecommendedFeedCategories = (
            responseJson as SpeciesDietNeed[]
          ).map((speciesDietNeed) => {
            return speciesDietNeed.animalFeedCategory.toString();
          });
          // console.log("here");
          // console.log(listRecommendedFeedCategories);
          const listLeftoverFoodCategories = listAllFeedCategories
            .filter(
              (feedCategory) =>
                !listRecommendedFeedCategories?.includes(feedCategory)
            )
            .filter((feedCategory) => feedCategory != "OTHERS");
          // console.log("hereee");
          // console.log(listLeftoverFoodCategories);
          setListFeedCategoriesRecommended(listRecommendedFeedCategories);
          setListFeedCategoriesNoRecommendation(listLeftoverFoodCategories);
        }
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchDietNeedsList();
  }, [curSpecies]);

  const animalStatusTemplate = (statuses: string[]) => {
    return (
      <React.Fragment>
        <div className="flex gap-2">
          {statuses.map((status, index) => (
            <div
              key={index}
              className={` flex w-max items-center justify-center rounded px-1 text-sm font-bold
                ${
                  status === "NORMAL"
                    ? " bg-emerald-100  text-emerald-900"
                    : status === "PREGNANT"
                    ? " bg-orange-100 p-[0.1rem] text-orange-900"
                    : status === "SICK"
                    ? " bg-yellow-100 p-[0.1rem]  text-yellow-900"
                    : status === "INJURED"
                    ? "bg-red-100 p-[0.1rem] text-red-900"
                    : status === "OFFSITE"
                    ? " bg-blue-100 p-[0.1rem]  text-blue-900"
                    : status === "RELEASED"
                    ? " bg-fuchsia-100 p-[0.1rem]  text-fuchsia-900"
                    : status === "DECEASED"
                    ? " bg-slate-300 p-[0.1rem]  text-slate-900"
                    : "bg-gray-100 text-black"
                }`}
            >
              {status}
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  };

  // some validations
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

  /// end some validations

  // select animal stuff
  function validateSelectAnimal(props: ValidityState) {
    // console.log(props);
    if (props != undefined) {
      if (animalTargetList.length == 0) {
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
  const animalItemTemplate = (animal: Animal) => {
    return (
      <div className="flex flex-wrap items-center gap-3 p-2">
        <img
          className="aspect-square h-12 w-12 rounded-full border border-white object-cover shadow-4"
          src={`http://localhost:3000/${animal.imageUrl}`}
          alt={animal.houseName}
        />
        <div className="flex flex-1 flex-col justify-center gap-1">
          <div className="font-bold">
            {animal.houseName} -{" "}
            <span className="text-sm">{animal.species?.commonName}</span>
          </div>
          <div className="flex flex-col items-start gap-1">
            <span>{animal.animalCode}</span>
          </div>
        </div>
        {/* <span className="font-bold text-900">${item.price}</span> */}
      </div>
    );
  };

  const onAnimalChange = (event: any) => {
    setAnimalSourceList(event.source);
    setAnimalTargetList(event.target);
  };

  //
  function isSessionExist(
    curDdayOfTheWeek: string,
    curEventTimingType: string
  ) {
    return (
      feedingPlanSessions.findIndex(
        (session) =>
          session.dayOfTheWeek === curDdayOfTheWeek &&
          session.eventTimingType === curEventTimingType
      ) != -1
    );
  }

  // Session Template
  const sessionTemplate = (
    curDdayOfTheWeek: string,
    curEventTimingType: string
  ) => {
    return (
      <React.Fragment>
        <div>
          {feedingPlanSessions
            .filter(
              (session) =>
                session.dayOfTheWeek === curDdayOfTheWeek &&
                session.eventTimingType === curEventTimingType
            )
            .map((session) => (
              // session.feedingItems?.map((item, index) => (
              //   <div key={`MONDAYMorningItem-${index}`}>
              //     {item.foodCategory}
              //   </div>
              // ))
              <div>
                {Object.values(groupFeedingItemsByAnimal(session)).map(
                  (
                    group: {
                      animal: Animal;
                      items: DummyFeedingItem[];
                    },
                    index
                  ) => (
                    <div key={`animal-${group.animal.animalId}`}>
                      <h2>Animal {group.animal.houseName}:</h2>
                      <ul>
                        {group.items.map((item, itemIndex) => (
                          <li
                            key={`feeding-item-${item.animal?.animalId}-${itemIndex}`}
                          >
                            - Feeding Item {itemIndex + 1}: {item.foodCategory};
                            amount:{" "}
                            {item.amount != 0 ? (
                              <span>
                                {item.amount} {item.unit}
                              </span>
                            ) : (
                              <span>None!</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </div>
            ))}
          <Separator />
        </div>
      </React.Fragment>
    );
  };

  // Edit session dialog
  const [openEditSessionDialog, setOpenEditSessionDialog] =
    useState<boolean>(false);
  const editSessionDialog = (
    curDayOfTheWeek: string,
    curEventTimingType: string
  ) => {
    // const [selectedSessionToEdit, setSelectedSessionToEdit] =
    //   useState<DummyFeedingPlanSessionDetail | null>(null);

    const tempFeedingPlanSessions = [...feedingPlanSessions];

    // find selected session
    const existingSessionIndex = [...feedingPlanSessions].findIndex(
      (session) =>
        session.dayOfTheWeek === curDayOfTheWeek &&
        session.eventTimingType === curEventTimingType
    );

    // const [curSessionToEdit, setCurSessionToEdit] =
    //   useState<DummyFeedingPlanSessionDetail | null>(
    //     [...feedingPlanSessions][existingSessionIndex]
    //   );
    let curSessionToEdit: DummyFeedingPlanSessionDetail;
    if (existingSessionIndex != -1) {
      curSessionToEdit = tempFeedingPlanSessions[existingSessionIndex];
    } else {
      return;
    }

    const handleAmountChangeEditSession = (
      index: number,
      amount: number | null
    ) => {
      if (!curSessionToEdit) {
        return;
      }
      if (curSessionToEdit.feedingItems == undefined) {
        return;
      }
      const updatedCurSessionFeedingItemsToBeEdited = [
        ...curSessionToEdit.feedingItems,
      ];
      updatedCurSessionFeedingItemsToBeEdited[index] = {
        ...updatedCurSessionFeedingItemsToBeEdited[index],
        amount,
      };
      curSessionToEdit.feedingItems = updatedCurSessionFeedingItemsToBeEdited;
      // setCurSessionToEdit({
      //   ...curSessionToEdit,
      //   feedingItems: updatedCurSessionFeedingItemsToBeEdited,
      // });
    };

    function handleEditSession() {
      // const existingSessionIndexInRealPlan = feedingPlanSessions.findIndex(
      //   (session) =>
      //     session.dayOfTheWeek === curDayOfTheWeek &&
      //     session.eventTimingType === curEventTimingType
      // );
      setFeedingPlanSessions(tempFeedingPlanSessions);
      setOpenEditSessionDialog(false);
    }

    return (
      <React.Fragment>
        <Dialog
          open={openEditSessionDialog}
          onOpenChange={setOpenEditSessionDialog}
        >
          <DialogTrigger asChild>
            <Button
              variant={"outline"}
              className="h-min bg-white px-2 py-1 text-sm"
            >
              Edit session
            </Button>
          </DialogTrigger>
          <DialogContent className="ml-[10%] max-w-[60vw]">
            <DialogHeader>
              <DialogTitle>
                Edit Session: {curDayOfTheWeek}, {curEventTimingType}
              </DialogTitle>
              <DialogDescription>
                Edit Session Info or Food Amount
              </DialogDescription>
            </DialogHeader>
            {curSessionToEdit && (
              <div>
                <div>
                  Duration in minutes: {curSessionToEdit.durationInMinutes}
                </div>
                {/* <div>
                  {curSessionToEdit.feedingItems &&
                    curSessionToEdit.feedingItems.map((feedingItem) => (
                      <div>
                        <div>{feedingItem.animal.houseName}</div>
                        <div>
                          {feedingItem.foodCategory}: {feedingItem.amount}
                        </div>
                      </div>
                    ))}
                </div> */}
                <div>
                  {Object.values(
                    groupFeedingItemsByAnimal(curSessionToEdit)
                  ).map(
                    (
                      group: {
                        animal: Animal;
                        items: DummyFeedingItem[];
                      },
                      index
                    ) => (
                      <div key={group.animal.animalCode}>
                        <div>{group.animal.houseName}</div>
                        <div>
                          {group.items.map((item) => (
                            <div>
                              {item.foodCategory}: {item.amount}
                              <div>Amount of food to be given:</div>
                              <InputNumber
                                placeholder="Amount of food"
                                value={item.amount}
                                onValueChange={(
                                  e: InputNumberValueChangeEvent
                                ) =>
                                  handleAmountChangeEditSession(
                                    index,
                                    e.value as number | null
                                  )
                                }
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button type="button" onClick={handleEditSession}>
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </React.Fragment>
    );
  };

  ///

  //
  async function handleSubmit() {}

  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-lg">
        {/* Header */}
        <div className="flex flex-col">
          <div className="mb-4 flex justify-between">
            {/* <NavLink className="flex" to={(-1)}> */}
            <Button
              onClick={() => navigate("/animal/viewallanimals/")}
              variant={"outline"}
              type="button"
              className=""
            >
              Back
            </Button>
            {/* </NavLink> */}
            <span className="self-center text-lg text-graydark">
              Create New Feeding Plan
            </span>
            <Button disabled className="invisible">
              Back
            </Button>
          </div>
          <Separator />
          <span className="mt-4 self-center text-title-xl font-bold">
            {curSpecies?.commonName}
          </span>
        </div>

        {/*  */}
        <Form.Root
          className="flex w-full flex-col gap-6 rounded-lg bg-white text-black"
          onSubmit={handleSubmit}
        >
          <Form.Field
            name="selectedAnimals"
            className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
          >
            <Form.Label className="m-4 self-center text-center">
              <span className="text-lg font-medium">Involved Animals:</span>
              <br />
              <span className="text-base">
                Select one or more animals to be added to the feeding plan.{" "}
                <br />
                Hold the Control/Shift keys and click to select multiple
              </span>
            </Form.Label>
            <Form.Control
              className="hidden"
              type="text"
              value={animalTargetList.toString()}
              required={true}
              onChange={() => null}
            ></Form.Control>
            <PickList
              source={animalSourceList}
              target={animalTargetList}
              onChange={onAnimalChange}
              itemTemplate={animalItemTemplate}
              filter
              filterBy="houseName,species.commonName"
              breakpoint="1400px"
              sourceHeader="Available"
              targetHeader="Selected"
              sourceStyle={{ height: "20rem" }}
              targetStyle={{ height: "20rem" }}
              sourceFilterPlaceholder="Search by name"
              targetFilterPlaceholder="Search by name"
            />
            <div className="self-center">
              <Form.ValidityState>{validateSelectAnimal}</Form.ValidityState>
            </div>
          </Form.Field>

          <Separator />

          <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
            {/* Start Date */}
            <Form.Field
              name="startDate"
              id="startDateField"
              className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
            >
              <Form.Label className="font-medium">
                Applicable Period Start Date
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
                    const element = document.getElementById("startDateField");
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
                Applicable Period End Date
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
                  }
                }}
              />
              <Form.ValidityState>{validateEndDate}</Form.ValidityState>
            </Form.Field>
          </div>

          <Separator className="my-6" />

          <div className="text-lg font-medium">Feeding Plan Details:</div>
          <div className="w-5/6 self-center border bg-whiten p-4">
            <div className="text-lg font-bold">Add Food To Plan</div>
            <br />

            {/* Day Of Week, select multiple. Session Timing, select one */}
            <div className="flex gap-8">
              <div className="w-full">
                <div>Day Of Week:</div>
                <MultiSelect
                  value={selectedDaysOfWeekNewFoodItem}
                  // onChange={(e: MultiSelectChangeEvent) => setSelectedBiomes(e.value)}
                  onChange={(e) => setSelectedDaysOfWeekNewFoodItem(e.value)}
                  // options={Object.values(BiomeEnum).map((biome) => biome.toString())}
                  options={Object.keys(DayOfWeek).map((dayOfWeekKey) => [
                    DayOfWeek[
                      dayOfWeekKey as keyof typeof DayOfWeek
                    ].toString(),
                  ])}
                  placeholder="Select day(s) of week"
                  className="p-multiselect-token:tailwind-multiselect-chip w-full"
                  display="chip"
                />
              </div>

              <div className="w-full">
                <div>Feeding Session Timing:</div>
                <Dropdown
                  value={selectedSessionTimingNewFoodItem}
                  onChange={(e: DropdownChangeEvent) =>
                    setSelectedSessionTimingNewFoodItem(e.value)
                  }
                  options={Object.keys(EventTimingType).map(
                    (eventTImingTypeKey) =>
                      EventTimingType[
                        eventTImingTypeKey as keyof typeof EventTimingType
                      ].toString()
                  )}
                  placeholder="Select Feeding Session Timing"
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <div>Duration (in minutes):</div>
              <InputNumber
                placeholder="Duration in minutes"
                value={durationInMinutesNewFoodItem}
                onValueChange={(e: InputNumberValueChangeEvent) =>
                  setDurationInMinutesNewFoodItem(e.value as number | null)
                }
                className="w-full"
              />
            </div>

            <div>
              <div>Select Feed Category</div>
              <Dropdown
                value={selectedCurFeedCategoryNewFoodItem}
                onChange={(e: DropdownChangeEvent) =>
                  setSelectedCurFeedCategoryNewFoodItem(e.value)
                }
                options={[
                  {
                    label: "Recommended",
                    items: listFeedCategoriesRecommended,
                  },
                  {
                    label: "Others",
                    items: listFeedCategoriesNoRecommendation,
                  },
                ]}
                optionGroupLabel="label"
                optionGroupChildren="items"
                placeholder="Select Food Item Category"
                className="w-full"
              />
              {/* <div className="text-sm">
                Below are recommended food types according to the animal's
                dietary requirements
              </div>
              <div className="flex flex-wrap gap-4 overflow-x-auto">
                {dietNeedsList.map((dietNeed) => (
                  <div className="">
                    <img
                      src={
                        "../../../../src/assets/feedcategory/" +
                        dietNeed.animalFeedCategory +
                        ".jpg"
                      }
                      alt={`Animal Feed Category: ${dietNeed.animalFeedCategory}`}
                      className="aspect-square h-32 w-32 object-cover"
                    />
                    <div>{dietNeed.animalFeedCategory}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 overflow-x-auto">
                {listFeedCategoriesNoRecommendation.map((feedCategory) => (
                  <div className="">
                    <img
                      src={
                        "../../../../src/assets/feedcategory/" +
                        feedCategory +
                        ".jpg"
                      }
                      alt={`Animal Feed Category: ${feedCategory}`}
                      className="aspect-square h-32 w-32 object-cover"
                    />
                    <div className="">{feedCategory}</div>
                  </div>
                ))}
              </div> */}
            </div>

            <div>
              <div>Select Unit of Measurement</div>
              <Dropdown
                value={unitOfMeasurementNewFoodItem}
                onChange={(e: DropdownChangeEvent) =>
                  setUnitOfMeasurementNewFoodItem(e.value)
                }
                options={[
                  "Kilograms (kg)",
                  "Grams (g)",
                  "Pounds (lbs)",
                  "Ounces (oz)",
                  "Milligrams (mg)",
                  "Micrograms (µg)",
                  "Liters (L)",
                  "Milliliters (ml)",
                  "Gallons (gal)",
                  "Fluid ounces (fl oz)",
                  "Cups",
                  "Pints (pt)",
                  "Quarts (qt)",
                ]}
                placeholder="Select Unit of Measurement"
                className="w-full"
              />
            </div>

            <div className="my-4 border border-strokedark/50 bg-whiter p-6">
              {animalTargetList.length > 0 ? (
                <div>
                  {selectedCurFeedCategoryNewFoodItem ? (
                    <div>
                      How much of {selectedCurFeedCategoryNewFoodItem} should
                      each individual eat this session?
                      <div className="text-sm">
                        Note: if {selectedCurFeedCategoryNewFoodItem} is already
                        added to the selected session(s), the new amount
                        indicated will overwrite the previously entered amount
                      </div>
                    </div>
                  ) : (
                    <div className="text-danger">
                      Select a feed category above!
                    </div>
                  )}
                  {animalTargetList.map((curAnimal, idx) => (
                    <div key={curAnimal.animalCode} className="">
                      <div>{curAnimal.houseName}</div>
                      <div>
                        {animalStatusTemplate(
                          curAnimal.animalStatus.split(",")
                        )}
                      </div>
                      <div className="flex gap-20">
                        <div>
                          <div>Amount of food to be given:</div>
                          <InputNumber
                            disabled={
                              selectedCurFeedCategoryNewFoodItem == null
                            }
                            placeholder="Amount of food"
                            value={curFeedingItemsNewFeedSession[idx]?.amount}
                            onValueChange={(e: InputNumberValueChangeEvent) =>
                              handleAmountChangeNewFoodItem(
                                idx,
                                e.value as number | null
                              )
                            }
                          />
                        </div>
                        <div>
                          Recommended: <div>100000 kg per meal</div>
                          <div>100000 kg per week</div>
                        </div>
                      </div>
                      <Separator className="my-4" />
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  Select at least one animal to be involved in this feeding plan
                </div>
              )}
            </div>

            {/* <div>
              {curFeedingItemsNewFeedSession.toString()},{" "}
              {curFeedingItemsNewFeedSession.length}
              {curFeedingItemsNewFeedSession?.map((feedingItem) => (
                <div key={feedingItem.animal?.animalCode}>
                  {feedingItem && (
                    <div>
                      {feedingItem?.amount} for {feedingItem.animal?.houseName}
                    </div>
                  )}
                </div>
              ))}
            </div> */}
            <Button type="button" onClick={addNewFoodSessionToPlan}>
              Add Feeding Session(s)
            </Button>
            <Button
              type="button"
              variant={"ghost"}
              onClick={clearNewFoodSessionFormBox}
            >
              Clear
            </Button>

            {/* end add food box */}
          </div>
          <Table>
            {/* <TableHeader>
              <TableRow>
                <TableHead className=""></TableHead>
                <TableHead className="">Monday</TableHead>
                <TableHead className="">Tuesday</TableHead>
                <TableHead className="">Wednesday</TableHead>
                <TableHead className="">Thursday</TableHead>
                <TableHead className="">Friday</TableHead>
                <TableHead className="">Saturday</TableHead>
                <TableHead className="">Sunday</TableHead>
              </TableRow>
            </TableHeader> */}
            <TableBody>
              <TableRow>
                <TableCell className="font-medium" colSpan={3}>
                  MONDAY
                </TableCell>
              </TableRow>
              <TableRow key={"MONDAYSessions"} className="hover:bg-transparent">
                <TableCell className="w-1/3 align-top font-medium hover:bg-muted/50">
                  <div className="flex justify-between">
                    <div className="">Morning</div>
                    <div>
                      {isSessionExist("MONDAY", "MORNING") &&
                        editSessionDialog("MONDAY", "MORNING")}
                    </div>
                  </div>
                  <div>{sessionTemplate("MONDAY", "MORNING")}</div>
                </TableCell>
                <TableCell className="w-1/3 font-medium hover:bg-muted/50">
                  <div className="h-32">Afternoon</div>
                  <div>{sessionTemplate("MONDAY", "AFTERNOON")}</div>
                </TableCell>
                <TableCell className="w-1/3 font-medium hover:bg-muted/50">
                  <div className="h-32">Evening</div>
                  <div>{sessionTemplate("MONDAY", "EVENING")}</div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium" colSpan={3}>
                  TUESDAY
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-transparent">
                <TableCell className="font-medium hover:bg-muted/50">
                  <div className="h-32">Morning</div>
                </TableCell>
                <TableCell className="font-medium hover:bg-muted/50">
                  <div className="h-32">Afternoon</div>
                </TableCell>
                <TableCell className="font-medium hover:bg-muted/50">
                  <div className="h-32">Evening</div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

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
    </div>
  );
}

export default CreateFeedingPlan;
