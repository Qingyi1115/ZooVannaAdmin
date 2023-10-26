import React, { useState, useEffect, useRef } from "react";

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
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
import { Dialog } from "primereact/dialog";
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
  FoodUnit,
} from "../../enums/Enumurated";
import FormFieldSelect from "../../components/FormFieldSelect";
import SpeciesDietNeed from "../../models/SpeciesDietNeed";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import {
  InputNumber,
  InputNumberValueChangeEvent,
} from "primereact/inputnumber";
import { Item } from "@radix-ui/react-accordion";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import AnimalFeedingPlanInvolvedAnimalDatatable from "../../components/AnimalManagement/AnimalFeedingPlanDetailsPage/AnimalFeedingPlanInvolvedAnimalDatatable";

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
    feedingItems: DummyFeedingItem[];
    durationInMinutes: number;
    isPublic: boolean;
    publicEventStartTime: string | null;
    requiredNumberOfKeeper: number;
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
  const [
    requiredNumberOfKeeperNewFoodItem,
    setRequiredNumberOfKeeperNewFoodItem,
  ] = useState<number | null>(1);
  // below is the list of feeding items for new session(s) to be added
  const [curFeedingItemsNewFeedSession, setCurFeedingItemsNewFeedSession] =
    useState<DummyFeedingItem[]>(
      animalSourceList.map((animal) => ({
        foodCategory: "",
        amount: null,
        unit: "",
        animal: animal,
      }))
    );

  // reco amount
  interface RecoAmount {
    animalCode: string;
    weekOrMeal: string;
    animalFeedCategory: string;
    recoAmt: number | string | null;
  }
  const [animalRecoAmounts, setAnimalRecoAmounts] = useState<RecoAmount[]>([]);

  function getRecoAmountsFeedCategoryForSpecies(animalFeedCategory: string) {
    const fetchRecoAmount = async () => {
      try {
        const recoAmountBody = {
          speciesCode: speciesCode,
          animalFeedCategory: animalFeedCategory,
          // weekOrMeal: weekOrMeal,
        };

        const responseJson = await apiJson.post(
          `http://localhost:3000/api/animal/getFeedingItemAmtRecoAllAnimalsOfSpecies/`,
          recoAmountBody
        );
        const recoAmounts = responseJson.recoAmts as RecoAmount[];
        return recoAmounts;
      } catch (error: any) {
        console.log(error);
      }
    };

    return fetchRecoAmount();
  }

  function getRecoAmountAnimal(
    animalFeedCategory: string,
    weekOrMeal: string,
    animalCode: string
  ) {
    const recoAmountForSpecificAnimal = animalRecoAmounts.find((recoAmount) => {
      return (
        recoAmount.animalCode === animalCode &&
        recoAmount.animalFeedCategory === animalFeedCategory &&
        recoAmount.weekOrMeal === weekOrMeal
      );
    });

    if (recoAmountForSpecificAnimal) {
      return (
        <>
          {recoAmountForSpecificAnimal.recoAmt != "No dietary data found!" ? (
            <div>
              {recoAmountForSpecificAnimal.recoAmt?.toLocaleString()} grams (g)
            </div>
          ) : (
            <div className="text-danger">
              {recoAmountForSpecificAnimal.recoAmt}
            </div>
          )}
        </>
      );
    } else {
      return "Recommended food data not available!";
    }
  }

  // end reco amount

  const convertToGramsOrMl = (amount: any, unit: any) => {
    switch (unit) {
      case "KG":
        return amount * 1000; // Convert kg to g
      case "GRAM":
        return amount; // g to g, no conversion needed
      case "ML":
        return amount; // ml to ml, no conversion needed
      case "L":
        return amount * 1000; // Convert l to ml
      default:
        return 0; // Unknown unit, you can handle this as needed
    }
  };

  function getAmountFoodAlreadyAddedPerWeekInGrams(
    animalCode: string,
    animalFeedCategory: string
  ) {
    const sum = feedingPlanSessions.reduce((total, session) => {
      const filteredItems = session.feedingItems.filter((item) => {
        return (
          item.animal.animalCode === animalCode &&
          item.foodCategory === animalFeedCategory
        );
      });

      const sessionSum = filteredItems.reduce((sessionTotal, item) => {
        const amountInGrams = convertToGramsOrMl(item.amount, item.unit);
        return sessionTotal + amountInGrams;
      }, 0);

      return total + sessionSum;
    }, 0);

    return (
      sum.toLocaleString() + " (g) | " + (sum / 1000).toLocaleString() + " (kg)"
    );
  }

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

  // update feedingItemsNewFeedSession array when animals change
  useEffect(() => {
    setCurFeedingItemsNewFeedSession(
      animalSourceList.map((animal) => {
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

    // update cur feeding sessions also, to remove all items containing animal that were removed
    const tempFeedingPlanSessions = [...feedingPlanSessions];
    const animalCodes = animalSourceList.map((animal) => {
      return animal.animalCode;
    });

    const updatedFeedingPlanSessions = feedingPlanSessions.map((session) => ({
      ...session,
      feedingItems: session.feedingItems
        .map((item) => ({
          ...item,
          animalCode: item.animal.animalCode,
        }))
        .filter((item) => animalCodes.includes(item.animalCode)),
    }));
    setFeedingPlanSessions(updatedFeedingPlanSessions);
  }, [animalSourceList]);

  function clearNewFoodSessionFormBox() {
    setSelectedCurFeedCategoryNewFoodItem(null);
    setSelectedDaysOfWeekNewFoodItem([]);
    setSelectedSessionTimingNewFoodItem(undefined);
    setUnitOfMeasurementNewFoodItem(null);
    setDurationInMinutesNewFoodItem(null);
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
          } else {
            item.amount = 0;
          }
        } else {
          // Item with a new combination of foodCategory and animalCode, add it to the map
          itemsMap.set(key, item);
        }
      }
    });

    return Array.from(itemsMap.values());
  }

  function autoAddSuggestedFeedingAmount() {
    if (!selectedCurFeedCategoryNewFoodItem) {
      return;
    }

    if (
      curFeedingItemsNewFeedSession.length == 0 &&
      !unitOfMeasurementNewFoodItem
    ) {
      return;
    }

    const tempFeedingItemsNewFeedSession = [...curFeedingItemsNewFeedSession];
    // use animalRecoAmounts to fill
    for (var feedingItem of tempFeedingItemsNewFeedSession) {
      // const curRecoAmt = getRecoAmountAnimal(
      //   selectedCurFeedCategoryNewFoodItem,
      //   "meal",
      //   feedingItem.animal.animalCode
      // );
      const curRecoAmt = animalRecoAmounts.find((recoAmount) => {
        return (
          recoAmount.animalCode === feedingItem.animal.animalCode &&
          recoAmount.animalFeedCategory ===
            selectedCurFeedCategoryNewFoodItem &&
          recoAmount.weekOrMeal === "meal"
        );
      });
      // if (curRecoAmt && unitOfMeasurementNewFoodItem == "KG") {
      // }
      if (curRecoAmt) {
        feedingItem.amount =
          curRecoAmt.recoAmt == "No dietary data found!"
            ? Number(0)
            : unitOfMeasurementNewFoodItem == "KG"
            ? Number(curRecoAmt.recoAmt) / 1000
            : Number(curRecoAmt.recoAmt);
      }
    }
    setCurFeedingItemsNewFeedSession(tempFeedingItemsNewFeedSession);
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
        amount: item.amount == null ? 0 : item.amount,
        foodCategory: selectedCurFeedCategoryNewFoodItem,
        unit: unitOfMeasurementNewFoodItem,
      }));
    // console.log(newFeedingItemsListWithUomAndCategory);

    const updatedFeedingPlanSessions = [...feedingPlanSessions];

    // loop for each day of week:
    if (
      selectedDaysOfWeekNewFoodItem != undefined &&
      selectedSessionTimingNewFoodItem != undefined &&
      durationInMinutesNewFoodItem != null &&
      requiredNumberOfKeeperNewFoodItem != null
    ) {
      for (const day of selectedDaysOfWeekNewFoodItem as string[]) {
        console.log("here, " + day);
        // create new feeding session object (the dummy one)
        var newFeedingSessionObject: DummyFeedingPlanSessionDetail = {
          dayOfTheWeek: day[0],
          eventTimingType: selectedSessionTimingNewFoodItem,
          feedingItems: newFeedingItemsListWithUomAndCategory,
          durationInMinutes: durationInMinutesNewFoodItem,
          isPublic: false,
          publicEventStartTime: null,
          requiredNumberOfKeeper: requiredNumberOfKeeperNewFoodItem,
        };

        // check inside feedingPlanSessions,
        const existingSessionIndex = feedingPlanSessions.findIndex(
          (session) =>
            session.dayOfTheWeek === newFeedingSessionObject.dayOfTheWeek &&
            session.eventTimingType === newFeedingSessionObject.eventTimingType
        );
        // if the session with selectedDayOfWeek and selectedSessionTiming already exists
        if (existingSessionIndex != -1) {
          // const updatedFeedingPlanSessions = [...feedingPlanSessions];

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

            // update attributes
            existingSession.durationInMinutes = durationInMinutesNewFoodItem;
            existingSession.requiredNumberOfKeeper =
              requiredNumberOfKeeperNewFoodItem;
          } else if (newFeedingSessionObject.feedingItems) {
            // If the existing session has no feedingItems, assign the new items
            existingSession.feedingItems = newFeedingSessionObject.feedingItems;
          }
          // setFeedingPlanSessions(updatedFeedingPlanSessions);
        } else {
          // No matching item found, add the newFeedingPlanSession to feedingPlanSessiosns
          // const updatedFeedingPlanSessions = [...feedingPlanSessions];
          updatedFeedingPlanSessions.push(newFeedingSessionObject);
          // setFeedingPlanSessions(updatedFeedingPlanSessions);
        }
      }
      setFeedingPlanSessions(updatedFeedingPlanSessions);
    }
    // console.log("end of here");
    // console.log(feedingPlanSessions);
  }

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
          const recommendedFeedSet = new Set(listRecommendedFeedCategories);
          // console.log("here");
          // console.log(listRecommendedFeedCategories);
          const listLeftoverFoodCategories = listAllFeedCategories.filter(
            (feedCategory) =>
              !recommendedFeedSet.has(feedCategory) && feedCategory !== "OTHERS"
          );
          // console.log("hereee");
          // console.log(listLeftoverFoodCategories);
          setListFeedCategoriesRecommended([...recommendedFeedSet]);
          setListFeedCategoriesNoRecommendation(listLeftoverFoodCategories);

          // populate reco amount
          let tempRecoAmounts: RecoAmount[] = [];
          for (var feedCategory of recommendedFeedSet) {
            const recoAmoutsCurFeedcatory =
              await getRecoAmountsFeedCategoryForSpecies(feedCategory);
            // console.log("aaaaa: " + feedCategory);
            // console.log(recoAmoutsCurFeedcatory);

            if (recoAmoutsCurFeedcatory) {
              // tempRecoAmounts.concat(recoAmoutsCurFeedcatory);
              tempRecoAmounts = [
                ...tempRecoAmounts,
                ...recoAmoutsCurFeedcatory,
              ];
              // console.log("getting reco amounts");
              // console.log(tempRecoAmounts);
            }
          }

          setAnimalRecoAmounts(tempRecoAmounts);
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
  function validateFeedingPlanDescrtipion(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter feeding plan description!
          </div>
        );
      }
      // add any other cases here
    }
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
    curDayOfTheWeek: string,
    curEventTimingType: string
  ) => {
    return (
      <React.Fragment>
        <div>
          {feedingPlanSessions
            .filter(
              (session) =>
                session.dayOfTheWeek === curDayOfTheWeek &&
                session.eventTimingType === curEventTimingType
            )
            .map((session) => (
              // session.feedingItems?.map((item, index) => (
              //   <div key={`MONDAYMorningItem-${index}`}>
              //     {item.foodCategory}
              //   </div>
              // ))
              <div
                key={session.dayOfTheWeek + session.eventTimingType}
                className="max-h-[16em] overflow-y-auto py-2"
              >
                {Object.values(groupFeedingItemsByAnimal(session)).map(
                  (
                    group: {
                      animal: Animal;
                      items: DummyFeedingItem[];
                    },
                    index
                  ) => (
                    <div
                      key={`animal-${group.animal.animalId}`}
                      className="mb-2 text-sm"
                    >
                      <div className="font-medium">
                        {group.animal.houseName}:
                      </div>
                      <ul>
                        {group.items.map((item, itemIndex) => (
                          <li
                            key={`feeding-item-${item.animal?.animalId}-${itemIndex}`}
                            className="ml-4 font-normal"
                          >
                            {item.foodCategory}:{" "}
                            {item.amount != 0 ? (
                              <span>
                                {item.amount}{" "}
                                <span className="text-xs">{item.unit}</span>
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
        </div>
      </React.Fragment>
    );
  };

  // session cell template!
  function clearOneSession(
    curDayOfTheWeek: string,
    curEventTimingType: string
  ) {
    const tempFeedingPlanSessions = [...feedingPlanSessions];
    const existingSessionIndex = [...feedingPlanSessions].findIndex(
      (session) =>
        session.dayOfTheWeek === curDayOfTheWeek &&
        session.eventTimingType === curEventTimingType
    );
    let curSessionToEdit: DummyFeedingPlanSessionDetail;
    if (existingSessionIndex !== -1) {
      // Remove the session with the existingSessionIndex from tempFeedingPlanSessions
      tempFeedingPlanSessions.splice(existingSessionIndex, 1);
    } else {
      return;
    }
    setFeedingPlanSessions(tempFeedingPlanSessions);
  }

  const sessionCell = (curDayOfTheWeek: string, curEventTimingType: string) => {
    const sessionExists = !!feedingPlanSessions.find(
      (session) =>
        session.dayOfTheWeek === curDayOfTheWeek &&
        session.eventTimingType === curEventTimingType
    );

    const curSession = feedingPlanSessions.find(
      (session) =>
        session.dayOfTheWeek === curDayOfTheWeek &&
        session.eventTimingType === curEventTimingType
    );

    return (
      <TableCell className="min-h-[8rem] w-1/3 align-top font-medium hover:bg-muted/50">
        <div className="mb-1 flex justify-between">
          <div className="font-bold">
            <div>
              {curEventTimingType.charAt(0).toUpperCase() +
                curEventTimingType.slice(1).toLowerCase()}{" "}
              {curSession && (
                <span className="text-sm font-normal">
                  ({curSession?.durationInMinutes} minutes)
                </span>
              )}
            </div>
            <div>
              {curSession && (
                <div>
                  No. Required Keepers: {curSession?.requiredNumberOfKeeper}
                </div>
              )}
            </div>
          </div>
          <div>
            {isSessionExist(curDayOfTheWeek, curEventTimingType) && (
              <>
                <Button
                  variant={"destructive"}
                  className="mr-2 h-min px-2 py-1 text-sm"
                  onClick={() =>
                    clearOneSession(curDayOfTheWeek, curEventTimingType)
                  }
                >
                  Clear
                </Button>
                <Button
                  variant={"outline"}
                  type="button"
                  className="h-min bg-white px-2 py-1 text-sm"
                  onClick={() => {
                    setSelectedSessionToEditDayOfWeek(curDayOfTheWeek);
                    setSelectedSessionToEditTiming(curEventTimingType);
                    setOpenEditSessionDialog(true);
                  }}
                >
                  Edit
                </Button>
              </>
            )}
          </div>
        </div>
        {sessionExists ? (
          <div>{sessionTemplate(curDayOfTheWeek, curEventTimingType)}</div>
        ) : (
          <div className="text-orange-800">No session created!</div>
        )}
      </TableCell>
    );
  };

  // Edit session dialog
  const [openEditSessionDialog, setOpenEditSessionDialog] =
    useState<boolean>(false);
  const [selectedSessionToEditDayOfWeek, setSelectedSessionToEditDayOfWeek] =
    useState<string | null>(null);
  const [selectedSessionToEditTiming, setSelectedSessionToEditTiming] =
    useState<string | null>(null);
  // const [selectedSessionToEdit, setSelectedSessionToEdit] =
  //   useState<DummyFeedingPlanSessionDetail | null>(null);
  const editSessionDialog = () =>
    // curDayOfTheWeek: string,
    // curEventTimingType: string
    {
      const [selectedSessionToEdit, setSelectedSessionToEdit] =
        useState<DummyFeedingPlanSessionDetail | null>(null);
      const dropdownRef = useRef<Dropdown>(null);

      const tempFeedingPlanSessions = [...feedingPlanSessions];

      // find selected session
      const existingSessionIndex = [...feedingPlanSessions].findIndex(
        (session) =>
          session.dayOfTheWeek === selectedSessionToEditDayOfWeek &&
          session.eventTimingType === selectedSessionToEditTiming
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

      const handleDurationChangeEditSession = (
        newDurationInMinutes: number
      ) => {
        if (!curSessionToEdit) {
          return;
        }
        curSessionToEdit.durationInMinutes = newDurationInMinutes;
      };

      const handleNumKeeperChangeEditSession = (
        newRequiredNumberOfKeeper: number
      ) => {
        if (!curSessionToEdit) {
          return;
        }
        curSessionToEdit.requiredNumberOfKeeper = newRequiredNumberOfKeeper;
      };

      const handleUnitChangeEditSession = (index: number, unit: string) => {
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
          unit,
        };
        curSessionToEdit.feedingItems = updatedCurSessionFeedingItemsToBeEdited;
        console.log("edit unit");
        console.log(curSessionToEdit.feedingItems[index].unit);
        // setCurSessionToEditUseState(curSessionToEdit);
      };

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

      const footerContent = (
        <Button type="button" onClick={handleEditSession}>
          Save changes
        </Button>
      );

      return (
        <React.Fragment>
          <Dialog
            visible={openEditSessionDialog}
            header={"Edit Session Details"}
            onHide={() => setOpenEditSessionDialog(false)}
            // onOpenChange={setOpenEditSessionDialog}
            footer={footerContent}
            style={{
              width: "60vw",
              height: "70vh",
              marginLeft: "10%",
            }}
          >
            {/* <DialogTrigger asChild>
            <Button
              variant={"outline"}
              className="h-min bg-white px-2 py-1 text-sm"
            >
              Edit
            </Button>
          </DialogTrigger> */}
            {/* <DialogContent className="ml-[10%] max-h-[70vh] max-w-[60vw] overflow-auto"> */}
            {/* <DialogHeader>
              <DialogTitle>Edit Session Details</DialogTitle>
              <DialogDescription>
                Edit Session Info or Food Amount
              </DialogDescription>
            </DialogHeader> */}
            {curSessionToEdit && (
              <div className="flex flex-col gap-4">
                <Table className="">
                  <TableHeader className="">
                    <TableRow className="">
                      <TableHead>Day</TableHead>
                      <TableHead>Session Timing</TableHead>
                      {/* <TableHead>Duration (minutes)</TableHead> */}
                      {/* <TableHead>Food Category</TableHead> */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>{curSessionToEdit.dayOfTheWeek}</TableCell>
                      <TableCell>{curSessionToEdit.eventTimingType}</TableCell>
                      {/* <TableCell>
                        {curSessionToEdit.durationInMinutes}
                      </TableCell> */}
                      {/* <TableCell>{curSessionToEdit}</TableCell> */}
                    </TableRow>
                  </TableBody>
                </Table>
                <div>
                  <div>Duration (in minutes):</div>
                  <InputNumber
                    placeholder="Duration in minutes"
                    value={curSessionToEdit.durationInMinutes}
                    onValueChange={(e: InputNumberValueChangeEvent) =>
                      handleDurationChangeEditSession(e.value as number)
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <div>Required Number of Keepers:</div>
                  <InputNumber
                    placeholder="Required number of keepers"
                    value={curSessionToEdit.requiredNumberOfKeeper}
                    onValueChange={(e: InputNumberValueChangeEvent) =>
                      handleNumKeeperChangeEditSession(e.value as number)
                    }
                    className="w-full"
                  />
                </div>
                <div className="mt-2 font-bold">
                  Edit specific amounts below
                </div>
                <div className="flex flex-col gap-4">
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
                      <div
                        key={group.animal.animalCode}
                        className="rounded-md border border-strokedark/30 p-4 shadow-sm"
                      >
                        {/* first row, animal stuff */}
                        <div className="mb-4 flex gap-4">
                          <img
                            className="aspect-square h-12 w-12 rounded-full border border-white object-cover shadow-4"
                            src={`http://localhost:3000/${group.animal.imageUrl}`}
                            alt={group.animal.houseName}
                          />
                          <div>
                            <div className="mb-1 flex gap-2">
                              <div>{group.animal.houseName}</div>
                              {(group.animal.animalStatus
                                .split(",")
                                .includes("PREGNANT") ||
                                group.animal.animalStatus
                                  .split(",")
                                  .includes("SICK")) && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger type="button">
                                      <HiOutlineExclamationCircle className="h-6 w-6 animate-pulse stroke-danger" />
                                    </TooltipTrigger>
                                    <TooltipContent className="border-strokedark/40">
                                      Sick, pregnant, and possibly injured
                                      animals may require{" "}
                                      <span className="font-bold">
                                        more food
                                      </span>{" "}
                                      given to them!
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                            <div>
                              {animalStatusTemplate(
                                group.animal.animalStatus.split(",")
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          {group.items.map((item) => (
                            <div className="h-full">
                              <div className="flex gap-8">
                                <div className="flex gap-4">
                                  <div className="">
                                    <div className="">{item.foodCategory}:</div>
                                    {/* <div>Amount of food to be given:</div> */}
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
                                  <div className="">
                                    <span className="">Unit: </span>
                                    <div className="flex h-12 items-center">
                                      {item.unit}
                                    </div>
                                  </div>
                                </div>
                                {/* reco amounts stuff */}
                                <div className="flex w-full justify-between gap-8">
                                  <div>
                                    <span className="font-medium ">
                                      Recommended Amount:
                                    </span>{" "}
                                    <div className="flex gap-8">
                                      <div>
                                        Per meal: <br />
                                        <span className="text-lg">
                                          {item.foodCategory &&
                                            getRecoAmountAnimal(
                                              item.foodCategory,
                                              "meal",
                                              group.animal.animalCode
                                            )}
                                        </span>
                                      </div>
                                      <div>
                                        Per week: <br />
                                        <span className="text-lg">
                                          {item.foodCategory &&
                                            getRecoAmountAnimal(
                                              item.foodCategory,
                                              "week",
                                              group.animal.animalCode
                                            )}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="w-1/3">
                                    <span className="font-medium">
                                      Amount already added <br />
                                      per week:
                                    </span>
                                    <div>
                                      <span className="text-lg">
                                        {item.foodCategory &&
                                          getAmountFoodAlreadyAddedPerWeekInGrams(
                                            group.animal.animalCode,
                                            item.foodCategory
                                          )}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
            {/* </DialogContent> */}
          </Dialog>
        </React.Fragment>
      );
    };

  ///

  //
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // any validations

    const animalCodes = animalSourceList.map((animal) => animal.animalCode);

    const updatedFeedingPlanSessions = feedingPlanSessions.map((session) => ({
      ...session,
      feedingItems: session?.feedingItems.map((item) => ({
        ...item,
        animalCode: item.animal.animalCode,
        animal: null,
      })),
    }));

    const newFeedingPlan = {
      speciesCode,
      animalCodes,
      feedingPlanDesc,
      startDate,
      endDate,
      sessions: updatedFeedingPlanSessions,
    };

    // console.log("creating new feeding plan");
    // console.log(newFeedingPlan);

    const createFeedingPlanApi = async () => {
      try {
        const response = await apiJson.post(
          "http://localhost:3000/api/animal/createFeedingPlan",
          newFeedingPlan
        );
        // success
        toastShadcn({
          description: `Successfully created a new feeding plan for ${curSpecies?.commonName}`,
        });
        const redirectUrl = `/animal/feedingplanhome/${speciesCode}/`;
        navigate(redirectUrl);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while creating new feeding plan: \n" +
            error.message,
        });
      }
    };
    createFeedingPlanApi();
  }

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
          {/* <Form.Field
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
          </Form.Field> */}
          <div>
            <div className="text-lg font-medium">Involved Animal List:</div>
            <AnimalFeedingPlanInvolvedAnimalDatatable
              involvedAnimalList={animalSourceList ? animalSourceList : []}
            />
          </div>

          <Separator />

          {/* Description */}
          <Form.Field
            name="physicalDefiningCharacteristics"
            className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
          >
            <Form.Label className="font-medium">Details</Form.Label>
            <Form.Control
              asChild
              value={feedingPlanDesc}
              required={true}
              onChange={(e) => setFeedingPlanDesc(e.target.value)}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium shadow-md outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
            >
              <textarea
                rows={3}
                placeholder="e.g., General plan in Summer..."
                // className="bg-blackA5 shadow-blackA9 selection:color-white selection:bg-blackA9 box-border inline-flex w-full resize-none appearance-none items-center justify-center rounded-[4px] p-[10px] text-[15px] leading-none text-white shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
              />
            </Form.Control>
            <Form.ValidityState>
              {validateFeedingPlanDescrtipion}
            </Form.ValidityState>
          </Form.Field>

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
          <div className="flex w-[95%] flex-col gap-4 self-center rounded-md border border-strokedark/30 bg-whiter p-8 shadow-md">
            <div className="text-center text-xl font-bold">
              Add Food To Plan
            </div>

            {/* Day Of Week, select multiple */}
            <div className="w-full">
              <div>Day Of Week:</div>
              <MultiSelect
                value={selectedDaysOfWeekNewFoodItem}
                // onChange={(e: MultiSelectChangeEvent) => setSelectedBiomes(e.value)}
                onChange={(e) => setSelectedDaysOfWeekNewFoodItem(e.value)}
                // options={Object.values(BiomeEnum).map((biome) => biome.toString())}
                options={Object.keys(DayOfWeek).map((dayOfWeekKey) => [
                  DayOfWeek[dayOfWeekKey as keyof typeof DayOfWeek].toString(),
                ])}
                placeholder="Select day(s) of week"
                className="p-multiselect-token:tailwind-multiselect-chip w-full"
                display="chip"
              />
            </div>

            {/* Session Timing, select one */}
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
              <div>Required Number of Keepers:</div>
              <InputNumber
                placeholder="Required number of keepers"
                value={requiredNumberOfKeeperNewFoodItem}
                onValueChange={(e: InputNumberValueChangeEvent) =>
                  setRequiredNumberOfKeeperNewFoodItem(e.value as number | null)
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
            </div>

            <div>
              <div>Select Unit of Measurement</div>
              <Dropdown
                value={unitOfMeasurementNewFoodItem}
                onChange={(e: DropdownChangeEvent) =>
                  setUnitOfMeasurementNewFoodItem(e.value)
                }
                options={Object.keys(FoodUnit).map((foodUnitKey) =>
                  FoodUnit[foodUnitKey as keyof typeof FoodUnit].toString()
                )}
                placeholder="Select Unit of Measurement"
                className="w-full"
              />
            </div>

            <div className="my-4 rounded-lg border border-strokedark/20 bg-white p-6">
              {animalSourceList.length > 0 ? (
                <div>
                  <div className="flex justify-center gap-2 text-center text-lg font-bold">
                    Feed Amount for Each Animal
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger type="button">
                          <HiOutlineExclamationCircle />
                        </TooltipTrigger>
                        <TooltipContent className="border-strokedark/40">
                          How much of the selected food category should each
                          individual eat this session?
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  {selectedCurFeedCategoryNewFoodItem ? (
                    <div className="my-2 text-center text-sm">
                      Note: if the selected food category is already added to
                      the selected session(s), <br /> the new amount indicated
                      will <span className="font-bold">overwrite</span> the
                      previously entered amount
                    </div>
                  ) : (
                    <div className="text-center text-danger">
                      Select a feed category above to start indicating feed
                      amounts!
                    </div>
                  )}
                  <div className="my-4 flex w-full justify-center">
                    <Button
                      disabled={
                        !selectedCurFeedCategoryNewFoodItem ||
                        !unitOfMeasurementNewFoodItem
                      }
                      type="button"
                      onClick={autoAddSuggestedFeedingAmount}
                    >
                      Auto-fill Suggested Amounts
                    </Button>
                  </div>
                  <div className="flex max-h-[40vh] flex-col gap-4 overflow-auto pb-4 pr-4">
                    {animalSourceList.map((curAnimal, idx) => (
                      <div
                        key={curAnimal.animalCode}
                        className="rounded-md border border-strokedark/30 p-4 shadow-sm"
                      >
                        {/* first row, animal stuff */}
                        <div className="mb-4 flex gap-4">
                          <img
                            className="aspect-square h-12 w-12 rounded-full border border-white object-cover shadow-4"
                            src={`http://localhost:3000/${curAnimal.imageUrl}`}
                            alt={curAnimal.houseName}
                          />
                          <div>
                            <div className="mb-1 flex gap-2">
                              <div>{curAnimal.houseName}</div>
                              {(curAnimal.animalStatus
                                .split(",")
                                .includes("PREGNANT") ||
                                curAnimal.animalStatus
                                  .split(",")
                                  .includes("SICK")) && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger type="button">
                                      <HiOutlineExclamationCircle className="h-6 w-6 animate-pulse stroke-danger" />
                                    </TooltipTrigger>
                                    <TooltipContent className="border-strokedark/40">
                                      Sick, pregnant, and possibly injured
                                      animals may require{" "}
                                      <span className="font-bold">
                                        more food
                                      </span>{" "}
                                      given to them!
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                            <div>
                              {animalStatusTemplate(
                                curAnimal.animalStatus.split(",")
                              )}
                            </div>
                          </div>
                        </div>
                        {/* second row, amounts and reco stuff */}
                        <div className="flex w-full gap-8">
                          <div className="flex w-1/3 flex-col gap-2">
                            <div className="font-medium">
                              Amount of food to be given:
                            </div>
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
                          {/* reco amounts stuff */}
                          <div className="flex w-full justify-between gap-8">
                            <div>
                              <span className="font-medium ">
                                Recommended Amount:
                              </span>{" "}
                              <div className="flex items-end gap-8">
                                <div>
                                  <span className="text-sm">
                                    Per meal: <br />
                                  </span>
                                  <div
                                    className={`rounded bg-slate-200 p-1 ${
                                      !selectedCurFeedCategoryNewFoodItem &&
                                      "animate-pulse p-2"
                                    }`}
                                  >
                                    <span className="text-base font-bold">
                                      {selectedCurFeedCategoryNewFoodItem &&
                                        getRecoAmountAnimal(
                                          selectedCurFeedCategoryNewFoodItem,
                                          "meal",
                                          curAnimal.animalCode
                                        )}
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <div className="text-sm">
                                    Per week: <br />
                                  </div>
                                  <div
                                    className={`rounded bg-slate-200 p-1 ${
                                      !selectedCurFeedCategoryNewFoodItem &&
                                      "animate-pulse p-2"
                                    }`}
                                  >
                                    <span className="text-base font-bold">
                                      {selectedCurFeedCategoryNewFoodItem &&
                                        getRecoAmountAnimal(
                                          selectedCurFeedCategoryNewFoodItem,
                                          "week",
                                          curAnimal.animalCode
                                        )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="w-1/3">
                              <span className="font-medium">Added Amount:</span>
                              <div>
                                <div
                                  className={`w-full rounded bg-slate-200 p-1 text-center ${
                                    !selectedCurFeedCategoryNewFoodItem &&
                                    "animate-pulse p-2"
                                  }`}
                                >
                                  <span className="w-full text-base font-bold">
                                    {selectedCurFeedCategoryNewFoodItem &&
                                      getAmountFoodAlreadyAddedPerWeekInGrams(
                                        curAnimal.animalCode,
                                        selectedCurFeedCategoryNewFoodItem
                                      )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  Select at least one animal to be involved in this feeding plan
                </div>
              )}
            </div>

            {/* <div>
              Hey, <br />
              {animalRecoAmounts.map((recoAmount) => (
                <div>
                  {recoAmount.animalCode}, {recoAmount.animalFeedCategory},{" "}
                  {recoAmount.weekOrMeal}: {recoAmount.recoAmt}
                </div>
              ))}
            </div> */}

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
            <div className="flex gap-12">
              <Button
                type="button"
                disabled={
                  !selectedCurFeedCategoryNewFoodItem ||
                  !selectedDaysOfWeekNewFoodItem ||
                  !selectedSessionTimingNewFoodItem ||
                  !unitOfMeasurementNewFoodItem ||
                  !durationInMinutesNewFoodItem
                }
                onClick={addNewFoodSessionToPlan}
                className="w-full"
              >
                Add Feeding Session(s)
              </Button>
              <Button
                type="button"
                variant={"ghost"}
                onClick={clearNewFoodSessionFormBox}
                className="w-full"
              >
                Clear
              </Button>
            </div>

            {/* end add food box */}
          </div>

          <div>{editSessionDialog()}</div>
          <Button
            variant={"destructive"}
            type="button"
            onClick={() => setFeedingPlanSessions([])}
          >
            Clear All Sessions
          </Button>
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
              <TableRow className="bg-muted/20">
                <TableCell className="font-medium" colSpan={3}>
                  MONDAY
                </TableCell>
              </TableRow>
              <TableRow
                key={"MONDAYSessions"}
                className="bg-muted/20 hover:bg-muted/20"
              >
                {sessionCell("MONDAY", "MORNING")}
                {sessionCell("MONDAY", "AFTERNOON")}
                {sessionCell("MONDAY", "EVENING")}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium" colSpan={3}>
                  TUESDAY
                </TableCell>
              </TableRow>
              <TableRow
                key={"TUESDAYSessions"}
                className="hover:bg-transparent"
              >
                {sessionCell("TUESDAY", "MORNING")}
                {sessionCell("TUESDAY", "AFTERNOON")}
                {sessionCell("TUESDAY", "EVENING")}
              </TableRow>
              <TableRow className="bg-muted/20">
                <TableCell className="font-medium" colSpan={3}>
                  WEDNESDAY
                </TableCell>
              </TableRow>
              <TableRow
                key={"WEDNESDAYSessions"}
                className="bg-muted/20 hover:bg-muted/20"
              >
                {sessionCell("WEDNESDAY", "MORNING")}
                {sessionCell("WEDNESDAY", "AFTERNOON")}
                {sessionCell("WEDNESDAY", "EVENING")}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium" colSpan={3}>
                  THURSDAY
                </TableCell>
              </TableRow>
              <TableRow
                key={"THURSDAYSessions"}
                className="hover:bg-transparent"
              >
                {sessionCell("THURSDAY", "MORNING")}
                {sessionCell("THURSDAY", "AFTERNOON")}
                {sessionCell("THURSDAY", "EVENING")}
              </TableRow>
              <TableRow className="bg-muted/20">
                <TableCell className="font-medium" colSpan={3}>
                  FRIDAY
                </TableCell>
              </TableRow>
              <TableRow
                key={"FRIDAYSessions"}
                className="bg-muted/20 hover:bg-muted/20"
              >
                {sessionCell("FRIDAY", "MORNING")}
                {sessionCell("FRIDAY", "AFTERNOON")}
                {sessionCell("FRIDAY", "EVENING")}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium" colSpan={3}>
                  SATURDAY
                </TableCell>
              </TableRow>
              <TableRow
                key={"SATURDAYSessions"}
                className="hover:bg-transparent"
              >
                {sessionCell("SATURDAY", "MORNING")}
                {sessionCell("SATURDAY", "AFTERNOON")}
                {sessionCell("SATURDAY", "EVENING")}
              </TableRow>
              <TableRow className="bg-muted/20">
                <TableCell className="font-medium" colSpan={3}>
                  SUNDAY
                </TableCell>
              </TableRow>
              <TableRow
                key={"SUNDAYSessions"}
                className="bg-muted/20 hover:bg-muted/20"
              >
                {sessionCell("SUNDAY", "MORNING")}
                {sessionCell("SUNDAY", "AFTERNOON")}
                {sessionCell("SUNDAY", "EVENING")}
              </TableRow>
            </TableBody>
          </Table>

          <Form.Submit asChild>
            <Button
              disabled={apiJson.loading}
              className="h-12 w-2/3 self-center rounded-full text-lg"
            >
              {!apiJson.loading ? (
                <div>Create New Feeding Plan</div>
              ) : (
                <div>Loading</div>
              )}
            </Button>
          </Form.Submit>
        </Form.Root>
      </div>
    </div>
  );
}

export default CreateFeedingPlan;
