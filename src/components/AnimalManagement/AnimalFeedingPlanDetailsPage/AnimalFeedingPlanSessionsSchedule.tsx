import React, { useEffect, useState } from "react";
import useApiJson from "../../../hooks/useApiJson";
import FeedingPlan from "../../../models/FeedingPlan";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { Dialog } from "primereact/dialog";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import {
  InputNumber,
  InputNumberValueChangeEvent,
} from "primereact/inputnumber";
import { HiCheck, HiOutlineExclamationCircle, HiX } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { AnimalFeedCategory, FoodUnit } from "../../../enums/Enumurated";
import { useAuthContext } from "../../../hooks/useAuthContext";
import Animal from "../../../models/Animal";
import FeedingItem from "../../../models/FeedingItem";
import FeedingPlanSessionDetail from "../../../models/FeedingPlanSessionDetail";
import SpeciesDietNeed from "../../../models/SpeciesDietNeed";

interface AnimalFeedingPlanSessionsScheduleProps {
  curFeedingPlan: FeedingPlan;
  setCurFeedingPlan: any;
  refreshSeed: number;
  setRefreshSeed: any;
}

function AnimalFeedingPlanSessionsSchedule(
  props: AnimalFeedingPlanSessionsScheduleProps
) {
  const apiJson = useApiJson();
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;
  const employee = useAuthContext().state.user?.employeeData;

  const { curFeedingPlan, setCurFeedingPlan, refreshSeed, setRefreshSeed } =
    props;
  const [feedingPlanSessions, setFeedingPlanSessions] = useState<
    FeedingPlanSessionDetail[]
  >(
    curFeedingPlan.feedingPlanSessionDetails
      ? [...curFeedingPlan.feedingPlanSessionDetails]
      : []
  );

  function getRecoAmountsFeedCategoryForSpecies(animalFeedCategory: string) {
    const fetchRecoAmount = async () => {
      try {
        if (!curFeedingPlan.species) {
          throw Error("No species information");
        }
        const recoAmountBody = {
          speciesCode: curFeedingPlan.species.speciesCode,
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

  const [dietNeedsList, setDietNeedsList] = useState<SpeciesDietNeed[]>([]);
  const [listFeedCategoriesRecommended, setListFeedCategoriesRecommended] =
    useState<string[]>([]);
  const [
    listFeedCategoriesNoRecommendation,
    setListFeedCategoriesNoRecommendation,
  ] = useState<string[]>([]);

  useEffect(() => {
    const fetchDietNeedsList = async () => {
      try {
        if (curFeedingPlan.species) {
          const responseJson = await apiJson.get(
            `http://localhost:3000/api/species/getAllDietNeedbySpeciesCode/${curFeedingPlan.species.speciesCode}`
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
          // setListFeedCategoriesNoRecommendation(listLeftoverFoodCategories);

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
    if (curFeedingPlan.feedingPlanSessionDetails) {
      setFeedingPlanSessions(curFeedingPlan.feedingPlanSessionDetails);
    }
  }, [curFeedingPlan]);

  // templates
  function groupFeedingItemsByAnimal(
    feedingPlanSession: FeedingPlanSessionDetail
  ) {
    const result: {
      [key: string]: { animal: Animal; feedingItems: FeedingItem[] };
    } = {};

    if (feedingPlanSession.feedingItems) {
      feedingPlanSession.feedingItems.forEach((item) => {
        const animalId = item.animal?.animalId;
        if (animalId !== undefined) {
          if (!result[animalId]) {
            result[animalId] = { animal: item.animal, feedingItems: [] };
          }
          result[animalId].feedingItems.push(item);
        }
      });
    }
    return result;
  }

  //
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

  // reco
  interface RecoAmount {
    animalCode: string;
    weekOrMeal: string;
    animalFeedCategory: string;
    recoAmt: number | string | null;
  }
  const [animalRecoAmounts, setAnimalRecoAmounts] = useState<RecoAmount[]>([]);

  function getAmountFoodAlreadyAddedPerWeekInGrams(
    animalCode: string,
    animalFeedCategory: string,
    unit: string
  ) {
    const sum = feedingPlanSessions.reduce((total, session) => {
      if (!session.feedingItems) {
        return 0;
      }
      const filteredItems = session.feedingItems.filter((item) => {
        return (
          item.animal?.animalCode === animalCode &&
          item.foodCategory === animalFeedCategory
        );
      });

      const sessionSum = filteredItems.reduce((sessionTotal, item) => {
        const amountInGrams = convertToGramsOrMl(item.amount, item.unit);
        return sessionTotal + amountInGrams;
      }, 0);

      return total + sessionSum;
    }, 0);

    return unit == "GRAM"
      ? sum.toFixed(2).toLocaleString() + " (g)"
      : (sum / 1000).toFixed(2).toLocaleString() + " (kg)";
  }

  function getRecoAmountAnimal(
    animalFeedCategory: string,
    weekOrMeal: string,
    animalCode: string,
    unit: string
  ) {
    const recoAmountForSpecificAnimal = animalRecoAmounts.find((recoAmount) => {
      return (
        recoAmount.animalCode === animalCode &&
        recoAmount.animalFeedCategory === animalFeedCategory &&
        recoAmount.weekOrMeal === weekOrMeal
      );
    });
    // console.log("bababbabahahaha");
    // console.log(animalRecoAmounts);
    if (recoAmountForSpecificAnimal) {
      return (
        <>
          {recoAmountForSpecificAnimal.recoAmt != "No dietary data found!" ? (
            <div>
              {unit == "GRAM" ? (
                <span>
                  {recoAmountForSpecificAnimal.recoAmt &&
                    Number(recoAmountForSpecificAnimal.recoAmt)
                      .toFixed(2)
                      .toLocaleString()}{" "}
                  (g)
                </span>
              ) : (
                <span>
                  {(Number(recoAmountForSpecificAnimal.recoAmt) / 1000)
                    .toFixed(2)
                    .toLocaleString()}{" "}
                  (kg)
                </span>
              )}
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

  //// EDIT SESSION STUFF
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
        useState<FeedingPlanSessionDetail | null>(null);

      const tempFeedingPlanSessions = [...feedingPlanSessions];

      // find selected session
      const existingSessionIndex = [...feedingPlanSessions].findIndex(
        (session) =>
          session.dayOfWeek === selectedSessionToEditDayOfWeek &&
          session.eventTimingType === selectedSessionToEditTiming
      );

      // const [curSessionToEdit, setCurSessionToEdit] =
      //   useState<DummyFeedingPlanSessionDetail | null>(
      //     [...feedingPlanSessions][existingSessionIndex]
      //   );
      let curSessionToEdit: FeedingPlanSessionDetail;
      let curSessionToEditUnchanged: FeedingPlanSessionDetail;

      if (existingSessionIndex != -1) {
        curSessionToEdit = tempFeedingPlanSessions[existingSessionIndex];
        curSessionToEditUnchanged = {
          ...tempFeedingPlanSessions[existingSessionIndex],
        };
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
        // console.log("edit unit");
        // console.log(curSessionToEdit.feedingItems[index].unit);
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
        if (!amount) {
          return;
        }
        console.log("above");
        console.log(curSessionToEdit);

        const updatedCurSessionFeedingItemsToBeEdited = [
          ...curSessionToEdit.feedingItems,
        ];
        updatedCurSessionFeedingItemsToBeEdited[index] = {
          ...updatedCurSessionFeedingItemsToBeEdited[index],
          amount,
        };
        curSessionToEdit.feedingItems = updatedCurSessionFeedingItemsToBeEdited;
        console.log("below");
        console.log(curSessionToEdit);
        // setCurSessionToEdit({
        //   ...curSessionToEdit,
        //   feedingItems: updatedCurSessionFeedingItemsToBeEdited,
        // });
      };

      async function handleEditSession() {
        if (curSessionToEdit.feedingItems == null) {
          return;
        }
        const feedingPlanSessionToBeUpdated = {
          feedingPlanDetailId: curSessionToEdit.feedingPlanSessionDetailId,
          dayOftheWeek: curSessionToEdit.dayOfWeek,
          eventTimingType: curSessionToEdit.eventTimingType,
          durationInMinutes: curSessionToEdit.durationInMinutes,
          isPublic: curSessionToEdit.isPublic,
          publicEventStartTime: curSessionToEdit.publicEventStartTime,
          requiredNumberOfKeeper: curSessionToEdit.requiredNumberOfKeeper,
          items: curSessionToEdit.feedingItems.map((item) => ({
            ...item,
            animalCode: item.animal.animalCode,
          })),
        };

        const updateFeedingPlanSessionApi = async () => {
          try {
            const response = await apiJson.put(
              "http://localhost:3000/api/animal/updateFeedingPlanSessionDetail",
              feedingPlanSessionToBeUpdated
            );
            // success
            toastShadcn({
              description: `Successfully updated feeding plan session`,
            });

            setFeedingPlanSessions(tempFeedingPlanSessions);
            setOpenEditSessionDialog(false);
          } catch (error: any) {
            // got error
            toastShadcn({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description:
                "An error has occurred while updating feeding plan session detail: \n" +
                error.message,
            });
          }
        };
        updateFeedingPlanSessionApi();
      }

      const footerContent = (
        <Button type="button" onClick={handleEditSession}>
          Save changes
        </Button>
      );

      function handleCloseEditSessionDialog() {
        curSessionToEdit.durationInMinutes =
          curSessionToEditUnchanged.durationInMinutes;
        curSessionToEdit.feedingItems = curSessionToEditUnchanged.feedingItems;
        setFeedingPlanSessions(tempFeedingPlanSessions);
        setOpenEditSessionDialog(false);
      }

      return (
        <React.Fragment>
          <Dialog
            visible={openEditSessionDialog}
            header={"Edit Session Details"}
            onHide={handleCloseEditSessionDialog}
            // onOpenChange={setOpenEditSessionDialog}
            footer={footerContent}
            style={{ width: "60vw", height: "70vh" }}
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
                      <TableCell>{curSessionToEdit.dayOfWeek}</TableCell>
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
                        feedingItems: FeedingItem[];
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
                          {group.feedingItems.map((item) => (
                            <div key={item.feedingItemId} className="h-full">
                              <div className="flex gap-8">
                                <div className="flex gap-4">
                                  <div className="text-sm">
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
                                        <div
                                          className={`rounded bg-slate-200 p-1`}
                                        >
                                          <span className="text-sm font-bold">
                                            {item.foodCategory &&
                                              getRecoAmountAnimal(
                                                item.foodCategory,
                                                "meal",
                                                group.animal.animalCode,
                                                item.unit
                                              )}
                                          </span>
                                        </div>
                                      </div>
                                      <div>
                                        Per week: <br />
                                        <div
                                          className={`rounded bg-slate-200 p-1`}
                                        >
                                          <span className="text-sm font-bold">
                                            {item.foodCategory &&
                                              getRecoAmountAnimal(
                                                item.foodCategory,
                                                "week",
                                                group.animal.animalCode,
                                                item.unit
                                              )}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="w-1/3">
                                    <span className="font-medium">
                                      Amount Added
                                    </span>
                                    <div
                                      className={`w-full rounded bg-slate-200 p-1 text-center`}
                                    >
                                      <span className="w-full text-sm font-bold">
                                        {item.foodCategory &&
                                          getAmountFoodAlreadyAddedPerWeekInGrams(
                                            group.animal.animalCode,
                                            item.foodCategory,
                                            item.unit
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

  //// END EDIT SESSION STUFF

  //// CREATE NEW SESSION STUFF
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
  // Create session dialog
  const [openCreateSessionDialog, setOpenCreateSessionDialog] =
    useState<boolean>(false);
  const [selectedDayOfWeekNewFoodItem, setSelectedDayOfWeekNewFoodItem] =
    useState<string | undefined>(undefined);
  const [
    selectedSessionTimingNewFoodItem,
    setSelectedSessionTimingNewFoodItem,
  ] = useState<string | undefined>(undefined);
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
      curFeedingPlan.animals
        ? curFeedingPlan.animals.map((animal) => ({
            foodCategory: "",
            amount: null,
            unit: "",
            animal: animal,
          }))
        : []
    );
  // const [selectedSessionToEdit, setSelectedSessionToEdit] =
  //   useState<DummyFeedingPlanSessionDetail | null>(null);
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

  function clearNewFoodSessionFormBox() {
    setSelectedCurFeedCategoryNewFoodItem(null);
    setSelectedDayOfWeekNewFoodItem(undefined);
    setSelectedSessionTimingNewFoodItem(undefined);
    setUnitOfMeasurementNewFoodItem(null);
    setDurationInMinutesNewFoodItem(null);
    const resetList = curFeedingItemsNewFeedSession.map((item) => ({
      ...item,
      amount: null,
    }));
    setCurFeedingItemsNewFeedSession(resetList);
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

  const createSessionDialog = () =>
    // curDayOfTheWeek: string,
    // curEventTimingType: string
    {
      async function handleCreateOneSession() {
        if (!curFeedingPlan || !curFeedingPlan.animals) {
          return;
        }
        const animalCodes = curFeedingPlan.animals.map(
          (animal) => animal.animalCode
        );

        if (
          selectedDayOfWeekNewFoodItem == undefined ||
          selectedSessionTimingNewFoodItem == undefined ||
          durationInMinutesNewFoodItem == null ||
          requiredNumberOfKeeperNewFoodItem == null
        ) {
          return;
        }

        const newFeedingItemsListWithUomAndCategory =
          curFeedingItemsNewFeedSession.map((item) => ({
            ...item,
            amount: item.amount == null ? 0 : item.amount,
            foodCategory: selectedCurFeedCategoryNewFoodItem,
            unit: unitOfMeasurementNewFoodItem,
            animalCode: item.animal.animalCode,
            animal: null,
          }));

        var newFeedingSessionApiObject = {
          feedingPlanId: curFeedingPlan.feedingPlanId,
          dayOftheWeek: selectedDayOfWeekNewFoodItem,
          eventTimingType: selectedSessionTimingNewFoodItem,
          items: newFeedingItemsListWithUomAndCategory,
          durationInMinutes: durationInMinutesNewFoodItem,
          isPublic: false,
          publicEventStartTime: null,
          requiredNumberOfKeeper: requiredNumberOfKeeperNewFoodItem,
        };

        // console.log("creating new feeding plan");
        // console.log(newFeedingPlan);

        const createFeedingPlanSessionApi = async () => {
          try {
            const response = await apiJson.post(
              "http://localhost:3000/api/animal/createFeedingPlanSessionDetail",
              newFeedingSessionApiObject
            );
            // success
            toastShadcn({
              description: `Successfully created a new feeding plan session`,
            });
            // const redirectUrl = `/animal/feedingplanhome/${speciesCode}/`;
            // navigate(redirectUrl);
            setOpenCreateSessionDialog(false);
            setRefreshSeed(refreshSeed + 1);
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
        createFeedingPlanSessionApi();
      }

      return (
        <React.Fragment>
          <Dialog
            visible={openCreateSessionDialog}
            header={"Add New Session Details"}
            onHide={() => setOpenCreateSessionDialog(false)}
            // onOpenChange={setOpenEditSessionDialog}
            style={{ width: "60vw", height: "80vh" }}
          >
            {/* <div className="text-center text-xl font-bold">
              Add Food To Plan
            </div> */}

            <div className="mb-4 flex gap-8">
              {/* Day Of Week, select multiple */}
              <div className="w-full">
                <div>
                  Day Of Week:{" "}
                  <span className="text-lg font-bold">
                    {selectedDayOfWeekNewFoodItem}
                  </span>
                </div>
              </div>
              {/* Session Timing, select one */}
              <div className="w-full">
                <div>
                  Feeding Session Timing:{" "}
                  <span className="text-lg font-bold">
                    {selectedSessionTimingNewFoodItem}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-4">
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

            <div className="mb-4">
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

            <div className="mb-4">
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

            <div className="mb-4">
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
              {curFeedingPlan.animals && curFeedingPlan.animals.length > 0 ? (
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
                    {curFeedingPlan.animals &&
                      curFeedingPlan.animals.map((curAnimal, idx) => (
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
                                value={
                                  curFeedingItemsNewFeedSession[idx]?.amount
                                }
                                onValueChange={(
                                  e: InputNumberValueChangeEvent
                                ) =>
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
                                          unitOfMeasurementNewFoodItem &&
                                          getRecoAmountAnimal(
                                            selectedCurFeedCategoryNewFoodItem,
                                            "meal",
                                            curAnimal.animalCode,
                                            unitOfMeasurementNewFoodItem
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
                                          unitOfMeasurementNewFoodItem &&
                                          getRecoAmountAnimal(
                                            selectedCurFeedCategoryNewFoodItem,
                                            "week",
                                            curAnimal.animalCode,
                                            unitOfMeasurementNewFoodItem
                                          )}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="w-1/3">
                                <span className="font-medium">
                                  Added Amount:
                                </span>
                                <div>
                                  <div
                                    className={`w-full rounded bg-slate-200 p-1 text-center ${
                                      !selectedCurFeedCategoryNewFoodItem &&
                                      "animate-pulse p-2"
                                    }`}
                                  >
                                    <span className="w-full text-base font-bold">
                                      {selectedCurFeedCategoryNewFoodItem &&
                                        unitOfMeasurementNewFoodItem &&
                                        getAmountFoodAlreadyAddedPerWeekInGrams(
                                          curAnimal.animalCode,
                                          selectedCurFeedCategoryNewFoodItem,
                                          unitOfMeasurementNewFoodItem
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
                  !selectedDayOfWeekNewFoodItem ||
                  !selectedSessionTimingNewFoodItem ||
                  !unitOfMeasurementNewFoodItem ||
                  !durationInMinutesNewFoodItem
                }
                onClick={handleCreateOneSession}
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
          </Dialog>
        </React.Fragment>
      );
    };

  //// END CREATE NEW SESSION STUFF

  // delete Feeding Plan Session stuff
  const [selectedFeedingPlanSession, setSelectedFeedingPlanSession] =
    useState<FeedingPlanSessionDetail | null>(null);
  const [deleteFeedingPlanSessionDialog, setDeleteFeedingPlanSessionDialog] =
    useState<boolean>(false);

  const confirmDeleteFeedingPlanSession = (
    curDayOfTheWeek: string,
    curEventTimingType: string
  ) => {
    const curSession = feedingPlanSessions.find(
      (session) =>
        session.dayOfWeek === curDayOfTheWeek &&
        session.eventTimingType === curEventTimingType
    );
    if (curSession) {
      setSelectedFeedingPlanSession(curSession);
    }
    setDeleteFeedingPlanSessionDialog(true);
  };

  const hideDeleteFeedingPlanSessionDialog = () => {
    setDeleteFeedingPlanSessionDialog(false);
  };
  //
  const deleteFeedingPlanSession = async () => {
    let _feedingPlanSessionsList = feedingPlanSessions.filter(
      (val) =>
        val.feedingPlanSessionDetailId !==
        selectedFeedingPlanSession?.feedingPlanSessionDetailId
    );

    const deleteFeedingPlanSessionApi = async () => {
      try {
        console.log(
          "selectedFeedingPlanSession?.feedingPlanSessionDetailId: " +
            selectedFeedingPlanSession?.feedingPlanSessionDetailId
        );
        const responseJson = await apiJson.del(
          "http://localhost:3000/api/animal/deleteFeedingPlanSessionDetailById/" +
            selectedFeedingPlanSession?.feedingPlanSessionDetailId
        );

        toastShadcn({
          // variant: "destructive",
          title: "Deletion Successful",
          description: "Successfully deleted feeding plan session detail!",
        });
        setFeedingPlanSessions(_feedingPlanSessionsList);
        setDeleteFeedingPlanSessionDialog(false);
        setSelectedFeedingPlanSession(null);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while deleting feeding plan session: \n" +
            error.message,
        });
      }
    };
    deleteFeedingPlanSessionApi();
  };

  const deleteFeedingPlanSessionDialogFooter = (
    <React.Fragment>
      <Button onClick={hideDeleteFeedingPlanSessionDialog}>
        <HiX className="mr-2" />
        No
      </Button>
      <Button variant={"destructive"} onClick={deleteFeedingPlanSession}>
        <HiCheck className="mr-2" />
        Yes
      </Button>
    </React.Fragment>
  );
  // end delete feeding plan session stuff

  //
  function isSessionExist(
    curDdayOfTheWeek: string,
    curEventTimingType: string
  ) {
    return (
      feedingPlanSessions.findIndex(
        (session) =>
          session.dayOfWeek === curDdayOfTheWeek &&
          session.eventTimingType === curEventTimingType
      ) != -1
    );
  }

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
                session.dayOfWeek === curDayOfTheWeek &&
                session.eventTimingType === curEventTimingType
            )
            .map((session) => (
              // session.feedingItems?.map((item, index) => (
              //   <div key={`MONDAYMorningItem-${index}`}>
              //     {item.foodCategory}
              //   </div>
              // ))
              <div
                key={session.dayOfWeek + session.eventTimingType}
                className="max-h-[16em] overflow-y-auto py-2"
              >
                {Object.values(groupFeedingItemsByAnimal(session)).map(
                  (
                    group: {
                      animal: Animal;
                      feedingItems: FeedingItem[];
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
                        {group.feedingItems.map((item, itemIndex) => (
                          <li
                            key={`feeding-item-${item.animal?.animalId}-${itemIndex}`}
                            className="ml-4 font-normal"
                          >
                            {item.foodCategory}:{" "}
                            {item.amount != 0 ? (
                              <span>
                                {item.amount.toFixed(2)}{" "}
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
  // function deleteOneSession(
  //   curDayOfTheWeek: string,
  //   curEventTimingType: string
  // ) {
  //   const tempFeedingPlanSessions = [...feedingPlanSessions];
  //   const existingSessionIndex = [...feedingPlanSessions].findIndex(
  //     (session) =>
  //       session.dayOfWeek === curDayOfTheWeek &&
  //       session.eventTimingType === curEventTimingType
  //   );
  //   let curSessionToEdit: FeedingPlanSessionDetail;
  //   if (existingSessionIndex !== -1) {
  //     // Remove the session with the existingSessionIndex from tempFeedingPlanSessions
  //     tempFeedingPlanSessions.splice(existingSessionIndex, 1);
  //   } else {
  //     return;
  //   }
  //   setFeedingPlanSessions(tempFeedingPlanSessions);
  // }

  const sessionCell = (curDayOfTheWeek: string, curEventTimingType: string) => {
    const sessionExists = !!feedingPlanSessions.find(
      (session) =>
        session.dayOfWeek === curDayOfTheWeek &&
        session.eventTimingType === curEventTimingType
    );

    const curSession = feedingPlanSessions.find(
      (session) =>
        session.dayOfWeek === curDayOfTheWeek &&
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
            {isSessionExist(curDayOfTheWeek, curEventTimingType) &&
              curSession &&
              (employee.superAdmin ||
                employee.planningStaff?.plannerType == "CURATOR") && (
                <>
                  <Button
                    variant={"destructive"}
                    className="mr-2 h-min px-2 py-1 text-sm"
                    onClick={() =>
                      // deleteOneSession(curDayOfTheWeek, curEventTimingType)
                      confirmDeleteFeedingPlanSession(
                        curDayOfTheWeek,
                        curEventTimingType
                      )
                    }
                  >
                    Delete
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
            {!sessionExists &&
              (employee.superAdmin ||
                employee.planningStaff?.plannerType == "CURATOR") && (
                <Button
                  type="button"
                  className="h-min px-2 py-1 text-sm"
                  onClick={() => {
                    setSelectedDayOfWeekNewFoodItem(curDayOfTheWeek);
                    setSelectedSessionTimingNewFoodItem(curEventTimingType);
                    setOpenCreateSessionDialog(true);
                  }}
                >
                  Add Session
                </Button>
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

  return (
    <div>
      <Dialog
        visible={deleteFeedingPlanSessionDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteFeedingPlanSessionDialogFooter}
        onHide={hideDeleteFeedingPlanSessionDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedFeedingPlanSession && (
            <span>
              Are you sure you want to delete the selected feeding plan session
              (ID {selectedFeedingPlanSession.feedingPlanSessionDetailId}
              )?
            </span>
          )}
        </div>
      </Dialog>
      <div>{editSessionDialog()}</div>
      <div>{createSessionDialog()}</div>
      <Table>
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
          <TableRow key={"TUESDAYSessions"} className="hover:bg-transparent">
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
          <TableRow key={"THURSDAYSessions"} className="hover:bg-transparent">
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
          <TableRow key={"SATURDAYSessions"} className="hover:bg-transparent">
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
    </div>
  );
}

export default AnimalFeedingPlanSessionsSchedule;
