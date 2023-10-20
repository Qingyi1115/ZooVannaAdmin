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
    animal: Animal | null;
  }
  interface DummyFeedingPlanSessionDetail {
    dayOftheWeek: string;
    eventTimingType: string;
    feedingItems?: DummyFeedingItem[];
  }
  const [feedingPlanSessionDetails, setFeedingPlanSessionDetails] = useState<
    DummyFeedingPlanSessionDetail[]
  >([]);

  //
  // Add Food Stuff
  const [selectedDayOfWeekNewFoodItem, setSelectedDayOfWeekNewFoodItem] =
    useState<string | undefined>(undefined);
  const [selectedSessionTimingCreate, setSelectedSessionTimingCreate] =
    useState<string | undefined>(undefined);
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
  const [curFeedingItemsNewFeedSession, setCurFeedingItemsNewFeedSession] =
    useState<DummyFeedingItem[]>(
      animalTargetList.map((animal) => ({
        foodCategory: "",
        amount: 0,
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
  ///

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

  const onChange = (event: any) => {
    setAnimalSourceList(event.source);
    setAnimalTargetList(event.target);
  };

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
              onChange={onChange}
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
                  value={selectedDayOfWeekNewFoodItem}
                  // onChange={(e: MultiSelectChangeEvent) => setSelectedBiomes(e.value)}
                  onChange={(e) => setSelectedDayOfWeekNewFoodItem(e.value)}
                  // options={Object.values(BiomeEnum).map((biome) => biome.toString())}
                  options={Object.keys(DayOfWeek).map((dayOfWeekKey) => [
                    DayOfWeek[
                      dayOfWeekKey as keyof typeof DayOfWeek
                    ].toString(),
                  ])}
                  // optionLabel="biome"
                  placeholder="Select day(s) of week"
                  className="p-multiselect-token:tailwind-multiselect-chip w-full"
                  display="chip"
                />
              </div>

              <div className="w-full">
                <div>Feeding Session Timing:</div>
                <Dropdown
                  value={selectedSessionTimingCreate}
                  onChange={(e: DropdownChangeEvent) =>
                    setSelectedSessionTimingCreate(e.value)
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
              <div>Select Food Item</div>
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
                  {selectedCurFeedCategoryNewFoodItem && (
                    <div>
                      How much of {selectedCurFeedCategoryNewFoodItem} should
                      each individual eat this session?
                    </div>
                  )}
                  {animalTargetList.map((curAnimal, idx) => (
                    <div key={curAnimal.animalCode} className="">
                      <div>{curAnimal.houseName}</div>
                      <div className="flex gap-20">
                        <div>
                          <div>Amount of food to be given:</div>
                          <InputNumber
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

            <div>
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
            </div>

            {/* end add food box */}
          </div>
          <Button>Add Food</Button>
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
              <TableRow key={"Morning"}>
                <TableCell className="font-medium" colSpan={3}>
                  MONDAY
                </TableCell>
              </TableRow>
              <TableRow key={"Afternoon"} className="hover:bg-transparent">
                <TableCell className="font-medium">
                  <div className="h-32">Morning</div>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="h-32">Afternoon</div>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="h-32">Evening</div>
                </TableCell>
              </TableRow>
              <TableRow key={"Evening"}>
                <TableCell className="font-medium">
                  <div className="h-32">Morning</div>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="h-32">Afternoon</div>
                </TableCell>
                <TableCell className="font-medium">
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
