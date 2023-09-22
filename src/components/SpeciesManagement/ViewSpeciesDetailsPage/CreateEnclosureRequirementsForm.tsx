import React, { useState, useEffect } from "react";

import * as Form from "@radix-ui/react-form";

import useApiJson from "../../../hooks/useApiJson";
import FormFieldInput from "../../FormFieldInput";
import FormFieldSelect from "../../FormFieldSelect";
import { ContinentEnum } from "../../../enums/ContinentEnum";
import { HiCheck } from "react-icons/hi";
import { BiomeEnum } from "../../../enums/BiomeEnum";
import FormFieldRadioGroup from "../../FormFieldRadioGroup";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import Species from "../../../models/Species";
import { TwoThumbSliderWithNumber } from "../TwoThumbSliderWithNumber";
import { NavLink } from "react-router-dom";
import SpeciesEnclosureNeed from "../../../models/SpeciesEnclosureNeed";
import { Separator } from "@/components/ui/separator";

import { useNavigate } from "react-router-dom";

interface CreateEnclosureRequirementsFormProps {
  curSpecies: Species;
}

function CreateEnclosureRequirementsForm(
  props: CreateEnclosureRequirementsFormProps
) {
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;
  const navigate = useNavigate();

  const { curSpecies } = props;

  // check if enclosure need already exists
  const [curEnclosureNeeds, setCurEnclosureNeeds] =
    useState<SpeciesEnclosureNeed | null>(null);
  useEffect(() => {
    const fetchSpeciesEnclosureNeeds = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/species/getEnclosureNeeds/${curSpecies.speciesCode}`
        );
        console.log(responseJson);
        setCurEnclosureNeeds(responseJson as SpeciesEnclosureNeed);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchSpeciesEnclosureNeeds();
  }, []);

  // fields
  const [speciesCode, setSpeciesCode] = useState<string>(
    curSpecies.speciesCode
  );
  const [smallExhibitHeightRequired, setSmallExhibitHeightRequired] =
    useState<number>(-1);
  const [minLandAreaRequired, setMinLandAreaRequired] = useState<number>(0); // must validate > 0
  const [minWaterAreaRequired, setMinWaterAreaRequired] = useState<number>(0);
  const [acceptableTempMin, setAcceptableTempMin] = useState<number>(0); // validate smaller than max, 1 dp only
  const [acceptableTempMax, setAcceptableTempMax] = useState<number>(0); // validate greater than min
  const [acceptableHumidityMin, setAcceptableHumidityMin] = useState<number>(0); // validate smaller than max
  const [acceptableHumidityMax, setAcceptableHumidityMax] = useState<number>(0); // validate greater than min
  const [
    recommendedStandOffBarrierDistMetres,
    setRecommendedStandOffBarrierDistMetres,
  ] = useState<number | undefined>(undefined);
  const [plantationCoveragePercentMin, setPlantationCoveragePercentMin] =
    useState<number>(0); // validate smaller than max, >= 0
  const [plantationCoveragePercentMax, setPlantationCoveragePercentMax] =
    useState<number>(0); // validate greater than min, but if min == 0, max can be 0
  const [longGrassPercentMin, setLongGrassPercentMin] = useState<number>(0); // validate smaller than max, >= 0, integer only!!
  const [longGrassPercentMax, setLongGrassPercentMax] = useState<number>(0); // validate greater than min, but if min == 0, max can be 0
  const [shortGrassPercentMin, setShortGrassPercentMin] = useState<number>(0); // validate smaller than max, >= 0
  const [shortGrassPercentMax, setShortGrassPercentMax] = useState<number>(0); // validate greater than min, but if min == 0, max can be 0
  const [rockPercentMin, setRockPercentMin] = useState<number>(0); // validate smaller than max, >= 0
  const [rockPercentMax, setRockPercentMax] = useState<number>(0); // validate greater than min, but if min == 0, max can be 0
  const [sandPercentMin, setSandPercentMin] = useState<number>(0); // validate smaller than max, >= 0
  const [sandPercentMax, setSandPercentMax] = useState<number>(0); // validate greater than min, but if min == 0, max can be 0
  const [snowPercentMin, setSnowPercentMin] = useState<number>(0); // validate smaller than max, >= 0
  const [snowPercentMax, setSnowPercentMax] = useState<number>(0); // validate greater than min, but if min == 0, max can be 0
  const [soilPercentMin, setSoilPercentMin] = useState<number>(0); // validate smaller than max, >= 0
  const [soilPercentMax, setSoilPercentMax] = useState<number>(0); // validate greater than min, but if min == 0, max can be 0

  const [newEnclosureRequirementsCreated, setNewEnclosureRequirementsCreated] =
    useState<boolean>(false);

  ///////
  // validate functions
  ////////
  function validateMinLandAreaRequired(props: ValidityState) {
    // if (props != undefined) {
    if (Number(minLandAreaRequired) <= 0) {
      return (
        <div className="font-medium text-danger">
          * Minimum land area required must be greater than 0
        </div>
      );
    }
    // add any other cases here
    // }
    return null;
  }

  function validateMinWaterAreaRequired(props: ValidityState) {
    // if (props != undefined) {
    if (Number(minLandAreaRequired) < 0) {
      return (
        <div className="font-medium text-danger">
          * Minimum water area required must be equal to or greater than 0
        </div>
      );
    }
    // add any other cases here
    // }
    return null;
  }

  function validateMinTemperature(props: ValidityState) {
    if (props != undefined) {
      if (Number(acceptableTempMin) >= Number(acceptableTempMax)) {
        return (
          <div className="font-medium text-danger">
            * Minimum acceptable temperature must be smaller than the maximum
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateMaxTemperature(props: ValidityState) {
    if (props != undefined) {
      if (Number(acceptableTempMin) >= Number(acceptableTempMax)) {
        return (
          <div className="font-medium text-danger">
            * Maximum acceptable temperature must be greater than the minimum
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateMinHumidity(props: ValidityState) {
    if (props != undefined) {
      if (Number(acceptableHumidityMax) < Number(acceptableHumidityMin)) {
        return (
          <div className="font-medium text-danger">
            * Minimum acceptable humidity must be smaller than the maximum
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateMaxHumidity(props: ValidityState) {
    if (props != undefined) {
      if (Number(acceptableHumidityMin) >= Number(acceptableHumidityMax)) {
        return (
          <div className="font-medium text-danger">
            * Maximum acceptable humidity must be greater than the minimum
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateStandOffBarrierDist(props: ValidityState) {
    if (props != undefined) {
      if (recommendedStandOffBarrierDistMetres == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please enter a recommended stand-off barrier distance
          </div>
        );
      } else if (Number(recommendedStandOffBarrierDistMetres) <= 0) {
        return (
          <div className="font-medium text-danger">
            * Stand-off barrier distance must be greater than 0
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  // check if current recommendation ranges will allow a valid distribution
  interface RecommendationValidationResult {
    isValid: boolean;
    isMinTooHigh: boolean;
    isMaxTooLow: boolean;
    totalMin: number;
    totalMax: number;
  }
  function areRecommendationRangesValid(): RecommendationValidationResult {
    const totalMin =
      longGrassPercentMin +
      shortGrassPercentMin +
      rockPercentMin +
      sandPercentMin +
      snowPercentMin +
      soilPercentMin;

    const totalMax =
      longGrassPercentMax +
      shortGrassPercentMax +
      rockPercentMax +
      sandPercentMax +
      snowPercentMax +
      soilPercentMax;

    const isMinTooHigh = totalMin > 100;
    const isMaxTooLow = totalMax < 100;
    const isValid = !isMinTooHigh && !isMaxTooLow;

    return {
      isValid,
      isMinTooHigh,
      isMaxTooLow,
      totalMin,
      totalMax,
    };
  }

  ///////
  // validate functions end
  ////////

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Remember, your form must have enctype="multipart/form-data" for upload pictures
    e.preventDefault();
    const newEnclosureRequirements = {
      speciesCode,
      smallExhibitHeightRequired,
      minLandAreaRequired,
      minWaterAreaRequired,
      acceptableTempMin,
      acceptableTempMax,
      acceptableHumidityMin,
      acceptableHumidityMax,
      recommendedStandOffBarrierDistMetres,
      plantationCoveragePercentMin,
      plantationCoveragePercentMax,
      longGrassPercentMin,
      longGrassPercentMax,
      shortGrassPercentMin,
      shortGrassPercentMax,
      rockPercentMin,
      rockPercentMax,
      sandPercentMin,
      sandPercentMax,
      snowPercentMin,
      snowPercentMax,
      soilPercentMin,
      soilPercentMax,
    };

    const terrainDistributionValidation: RecommendationValidationResult =
      areRecommendationRangesValid();

    if (!terrainDistributionValidation.isValid) {
      if (terrainDistributionValidation.isMinTooHigh) {
        toastShadcn({
          variant: "destructive",
          title: "Invalid Terrain Distribution",
          description:
            "Your recommended distribution will not result in any valid actual distributions because total minimums are too high",
        });
      } else if (terrainDistributionValidation.isMaxTooLow) {
        toastShadcn({
          variant: "destructive",
          title: "Invalid Terrain Distribution",
          description:
            "Your recommended distribution will not result in any valid actual distributions because total maximums are too low",
        });
      }

      return;
    }

    // console.log("plantation coverage min: " + plantationCoveragePercentMin);
    // console.log("plantation coverage max: " + plantationCoveragePercentMax);
    console.log("new enclosure req obj:");
    console.log(newEnclosureRequirements);

    const createSpeciesEnclosureRequirements = async () => {
      try {
        const response = await apiJson.post(
          "http://localhost:3000/api/species/createEnclosureNeeds",
          newEnclosureRequirements
        );
        // success
        console.log("succes?");
        toastShadcn({
          description:
            "Successfully created enclosure requirements. Please go back to Species Details page",
        });

        // clearForm();
        setNewEnclosureRequirementsCreated(true);
        const redirectUrl = `/species/viewspeciesdetails/${curSpecies.speciesCode}/enclosureneed`;
        navigate(redirectUrl);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while creating enclosure requirements: \n" +
            error.message,
        });
      }
    };
    createSpeciesEnclosureRequirements();
  }

  return (
    <div>
      {curEnclosureNeeds != null ? (
        <div className="flex w-full flex-col items-center gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark">
          <span className="font-medium">
            Enclosure requirements have already been created for the current
            species ({curSpecies.commonName})
          </span>
          <NavLink
            className="w-1/3"
            to={`/species/viewspeciesdetails/${curSpecies.speciesCode}`}
          >
            <Button
              type="button"
              className="h-12 w-full rounded-full px-4 text-lg"
            >
              Click to return to Species Details page
            </Button>
          </NavLink>
        </div>
      ) : (
        <Form.Root
          className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="flex flex-col">
            <div className="mb-4 flex justify-between">
              <NavLink
                className="flex"
                to={`/species/viewspeciesdetails/${speciesCode}`}
              >
                <Button variant={"outline"} type="button" className="">
                  Back
                </Button>
              </NavLink>
              <span className="self-center text-lg text-graydark">
                Create Species Enclosure Requirements
              </span>
              <Button disabled className="invisible">
                Back
              </Button>
            </div>
            <Separator />
            <span className="mt-4 self-center text-title-xl font-bold">
              {curSpecies.commonName}
            </span>
          </div>
          {/* Small Exhibit Height Required */}
          {curSpecies.habitatOrExhibit.toLowerCase() == "exhibit" && (
            <FormFieldInput
              type="text"
              formFieldName="smallExhibitHeightRequired"
              label={`Small Exhibit Height Required (m\u00B2)`}
              required={false}
              pattern={undefined}
              placeholder="e.g., 12"
              value={smallExhibitHeightRequired}
              setValue={setSmallExhibitHeightRequired}
              validateFunction={() => null}
            />
          )}

          <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
            {/* Min Land Area Required */}
            <FormFieldInput
              type="number"
              formFieldName="minLandAreaRequired"
              label={`Minimum Land Area Required (m\u00B2)`}
              required={true}
              pattern={undefined}
              placeholder="e.g., 8"
              value={minLandAreaRequired}
              setValue={setMinLandAreaRequired}
              validateFunction={validateMinLandAreaRequired}
            />
            {/* Min Water Area Required */}
            <FormFieldInput
              type="number"
              formFieldName="minWaterAreaRequired"
              label={`Minimum Water Area Required (m\u00B2)`}
              required={true}
              placeholder="e.g., 8"
              pattern={undefined}
              value={minWaterAreaRequired}
              setValue={setMinWaterAreaRequired}
              validateFunction={validateMinWaterAreaRequired}
            />
          </div>

          <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
            {/* Min Land Area Required */}
            <FormFieldInput
              type="number"
              formFieldName="acceptableTempMin"
              label={`Minimum acceptable temperate (°C)`}
              required={true}
              placeholder="e.g., 8"
              pattern={undefined}
              value={acceptableTempMin}
              setValue={setAcceptableTempMin}
              validateFunction={validateMinTemperature}
            />
            {/* Min Water Area Required */}
            <FormFieldInput
              type="number"
              formFieldName="acceptableTempMax"
              label={`Maximum acceptable temperate (°C)`}
              required={true}
              placeholder="e.g., 8"
              pattern={undefined}
              value={acceptableTempMax}
              setValue={setAcceptableTempMax}
              validateFunction={validateMaxTemperature}
            />
          </div>

          <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
            {/* Min Acceptable Humidity */}
            <FormFieldInput
              type="number"
              formFieldName="acceptableHumidityMin"
              label={`Minimum acceptable humidity (g.m⁻³)`}
              required={true}
              placeholder="e.g., 8"
              pattern={undefined}
              value={acceptableHumidityMin}
              setValue={setAcceptableHumidityMin}
              validateFunction={validateMinHumidity}
            />
            {/* Max Acceptable Humidity */}
            <FormFieldInput
              type="number"
              formFieldName="acceptableHumidityMax"
              label={`Maximum acceptable humidity (g.m⁻³)`}
              required={true}
              placeholder="e.g., 8"
              pattern={undefined}
              value={acceptableHumidityMax}
              setValue={setAcceptableHumidityMax}
              validateFunction={validateMaxHumidity}
            />
          </div>

          {/* Recommended Stand-off Barrier Distance */}
          <FormFieldInput
            type="number"
            formFieldName="recommendedStandOffBarrierDistMetres"
            label={`Recommended Stand-off Barrier Distance (m)`}
            required={true}
            placeholder="e.g., 12"
            pattern={undefined}
            value={recommendedStandOffBarrierDistMetres}
            setValue={setRecommendedStandOffBarrierDistMetres}
            validateFunction={validateStandOffBarrierDist}
          />

          {/* Plantation Coverage Range */}
          <Form.Field
            name="educationalDescription"
            className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
          >
            <Form.Label className="font-medium">
              Recommended Plantation Coverage Range (%)
            </Form.Label>
            <div className="h-14 w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter">
              <div className="flex h-full items-center justify-center gap-2">
                <span>0%</span>
                <TwoThumbSliderWithNumber
                  value={[
                    plantationCoveragePercentMin,
                    plantationCoveragePercentMax,
                  ]}
                  onValueChange={(value) => {
                    // console.log(
                    //   "value[0]: " + value[0] + ", value[1]: " + value[1]
                    // );
                    setPlantationCoveragePercentMin(value[0]);
                    setPlantationCoveragePercentMax(value[1]);
                  }}
                  min={0}
                  max={100}
                  step={1}
                  minStepsBetweenThumbs={0}
                />
                <span>100%</span>
              </div>
            </div>
            {/* <Form.ValidityState> */}
            {/* {validatePlantationCoverageRange} */}
            {/* </Form.ValidityState> */}
          </Form.Field>
          <br />

          <div className="mb-[-10] text-lg font-bold text-black">
            Recommended Terrain Distribution
          </div>
          {/* Long Grass Coverage Range */}
          <Form.Field
            name="longGrassRange"
            className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
          >
            <Form.Label className="font-medium">
              <div className="flex items-center gap-2 pl-1">
                <img
                  src="../../../../src/assets/terrain/long-grass.jpg"
                  className="aspect-square h-6 w-6 rounded-full"
                />
                <span>Long Grass (%)</span>
              </div>
            </Form.Label>
            <div className="h-14 w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter">
              <div className="flex h-full items-center justify-center gap-2">
                <span>0%</span>
                <TwoThumbSliderWithNumber
                  value={[longGrassPercentMin, longGrassPercentMax]}
                  onValueChange={(value) => {
                    setLongGrassPercentMin(value[0]);
                    setLongGrassPercentMax(value[1]);
                  }}
                  min={0}
                  max={100}
                  step={1}
                  minStepsBetweenThumbs={0}
                />
                <span>100%</span>
              </div>
            </div>
          </Form.Field>

          {/* Short Grass Coverage Range */}
          <Form.Field
            name="shortGrassRange"
            className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
          >
            <Form.Label className="font-medium">
              <div className="flex items-center gap-2 pl-1">
                <img
                  src="../../../../src/assets/terrain/short-grass.jpg"
                  className="aspect-square h-6 w-6 rounded-full"
                />
                <span>Short Grass (%)</span>
              </div>
            </Form.Label>
            <div className="h-14 w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter">
              <div className="flex h-full items-center justify-center gap-2">
                <span>0%</span>
                <TwoThumbSliderWithNumber
                  value={[shortGrassPercentMin, shortGrassPercentMax]}
                  onValueChange={(value) => {
                    setShortGrassPercentMin(value[0]);
                    setShortGrassPercentMax(value[1]);
                  }}
                  min={0}
                  max={100}
                  step={1}
                  minStepsBetweenThumbs={0}
                />
                <span>100%</span>
              </div>
            </div>
          </Form.Field>

          {/* Soil Coverage Range */}
          <Form.Field
            name="soilRange"
            className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
          >
            <Form.Label className="font-medium">
              <div className="flex items-center gap-2 pl-1">
                <img
                  src="../../../../src/assets/terrain/soil.jpg"
                  className="aspect-square h-6 w-6 rounded-full"
                />
                <span>Soil (%)</span>
              </div>
            </Form.Label>
            <div className="h-14 w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter">
              <div className="flex h-full items-center justify-center gap-2">
                <span>0%</span>
                <TwoThumbSliderWithNumber
                  value={[soilPercentMin, soilPercentMax]}
                  onValueChange={(value) => {
                    setSoilPercentMin(value[0]);
                    setSoilPercentMax(value[1]);
                  }}
                  min={0}
                  max={100}
                  step={1}
                  minStepsBetweenThumbs={0}
                />
                <span>100%</span>
              </div>
            </div>
          </Form.Field>

          {/* Rock Coverage Range */}
          <Form.Field
            name="rockRange"
            className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
          >
            <Form.Label className="font-medium">
              <div className="flex items-center gap-2 pl-1">
                <img
                  src="../../../../src/assets/terrain/rock.jpg"
                  className="aspect-square h-6 w-6 rounded-full"
                />
                <span>Rock (%)</span>
              </div>
            </Form.Label>
            <div className="h-14 w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter">
              <div className="flex h-full items-center justify-center gap-2">
                <span>0%</span>
                <TwoThumbSliderWithNumber
                  value={[rockPercentMin, rockPercentMax]}
                  onValueChange={(value) => {
                    setRockPercentMin(value[0]);
                    setRockPercentMax(value[1]);
                  }}
                  min={0}
                  max={100}
                  step={1}
                  minStepsBetweenThumbs={0}
                />
                <span>100%</span>
              </div>
            </div>
          </Form.Field>

          {/* Rock Coverage Range */}
          <Form.Field
            name="sandRange"
            className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
          >
            <Form.Label className="font-medium">
              <div className="flex items-center gap-2 pl-1">
                <img
                  src="../../../../src/assets/terrain/sand.jpg"
                  className="aspect-square h-6 w-6 rounded-full"
                />
                <span>Sand (%)</span>
              </div>
            </Form.Label>
            <div className="h-14 w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter">
              <div className="flex h-full items-center justify-center gap-2">
                <span>0%</span>
                <TwoThumbSliderWithNumber
                  value={[sandPercentMin, sandPercentMax]}
                  onValueChange={(value) => {
                    setSandPercentMin(value[0]);
                    setSandPercentMax(value[1]);
                  }}
                  min={0}
                  max={100}
                  step={1}
                  minStepsBetweenThumbs={0}
                />
                <span>100%</span>
              </div>
            </div>
          </Form.Field>

          {/* Snow Coverage Range */}
          <Form.Field
            name="snowRange"
            className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
          >
            <Form.Label className="font-medium">
              <div className="flex items-center gap-2 pl-1">
                <img
                  src="../../../../src/assets/terrain/snow.jpg"
                  className="aspect-square h-6 w-6 rounded-full"
                />
                <span>Snow (%)</span>
              </div>
            </Form.Label>
            <div className="h-14 w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter">
              <div className="flex h-full items-center justify-center gap-2">
                <span>0%</span>
                <TwoThumbSliderWithNumber
                  value={[snowPercentMin, snowPercentMax]}
                  onValueChange={(value) => {
                    setSnowPercentMin(value[0]);
                    setSnowPercentMax(value[1]);
                  }}
                  min={0}
                  max={100}
                  step={1}
                  minStepsBetweenThumbs={0}
                />
                <span>100%</span>
              </div>
            </div>
          </Form.Field>

          <Form.Submit asChild>
            <Button
              disabled={apiJson.loading}
              className="h-12 w-2/3 self-center rounded-full text-lg"
            >
              {!apiJson.loading ? <div>Submit</div> : <div>Loading</div>}
            </Button>
          </Form.Submit>
          {/* {formError && (
          <div className="m-2 border-danger bg-red-100 p-2">{formError}</div>
        )} */}
        </Form.Root>
      )}
    </div>
  );
}

export default CreateEnclosureRequirementsForm;
