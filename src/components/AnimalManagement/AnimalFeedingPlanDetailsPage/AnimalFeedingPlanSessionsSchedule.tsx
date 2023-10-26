import React, { useState, useEffect } from "react";
import useApiJson from "../../../hooks/useApiJson";
import FeedingPlan from "../../../models/FeedingPlan";

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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import FeedingPlanSessionDetail from "../../../models/FeedingPlanSessionDetail";
import FeedingItem from "../../../models/FeedingItem";
import Animal from "../../../models/Animal";
import { Button } from "@/components/ui/button";
import { Dialog } from "primereact/dialog";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { HiCheck, HiOutlineExclamationCircle, HiX } from "react-icons/hi";
import {
  InputNumber,
  InputNumberValueChangeEvent,
} from "primereact/inputnumber";
import SpeciesDietNeed from "../../../models/SpeciesDietNeed";
import { AnimalFeedCategory } from "../../../enums/Enumurated";

interface AnimalFeedingPlanSessionsScheduleProps {
  curFeedingPlan: FeedingPlan;
  setCurFeedingPlan: any;
}

function AnimalFeedingPlanSessionsSchedule(
  props: AnimalFeedingPlanSessionsScheduleProps
) {
  const apiJson = useApiJson();
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;

  const { curFeedingPlan, setCurFeedingPlan } = props;
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
    animalFeedCategory: string
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

    return (
      sum.toLocaleString() + " (g) | " + (sum / 1000).toLocaleString() + " (kg)"
    );
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
    // console.log("bababbabahahaha");
    // console.log(animalRecoAmounts);
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

      return (
        <React.Fragment>
          <Dialog
            visible={openEditSessionDialog}
            header={"Edit Session Details"}
            onHide={() => setOpenEditSessionDialog(false)}
            // onOpenChange={setOpenEditSessionDialog}
            footer={footerContent}
            style={{ width: "60vw", height: "70vh", marginLeft: "10%" }}
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

  //// END EDIT SESSION STUFF

  //// CREATE NEW SESSION STUFF

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
              curSession && (
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
