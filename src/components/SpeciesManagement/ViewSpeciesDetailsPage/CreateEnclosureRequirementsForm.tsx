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

interface CreateEnclosureRequirementsFormProps {
  curSpecies: Species;
}

function CreateEnclosureRequirementsForm(
  props: CreateEnclosureRequirementsFormProps
) {
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;

  const { curSpecies } = props;

  // fields
  const [speciesCode, setSpeciesCode] = useState<string>("");
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
  ] = useState<number>(0);
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
  const [soilPercenMin, setSoilPercenMin] = useState<number>(0); // validate smaller than max, >= 0
  const [soilPercenMax, setSoilPercenMax] = useState<number>(0); // validate greater than min, but if min == 0, max can be 0

  const [newEnclosureRequirementsCreated, setNewEnclosureRequirementsCreated] =
    useState<boolean>(false);

  ///////
  // validate functions
  ////////
  function validateMinLandAreaRequired(props: ValidityState) {
    // if (props != undefined) {
    if (minLandAreaRequired <= 0) {
      return (
        <div className="font-medium text-danger">
          * Minimum land area required must be greate than 0
        </div>
      );
    }
    // add any other cases here
    // }
    return null;
  }

  function validateMinWaterAreaRequired(props: ValidityState) {
    // if (props != undefined) {
    if (minLandAreaRequired < 0) {
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

  function validatePlantationCoverageRange(props: ValidityState) {
    // if (props != undefined) {
    if (plantationCoveragePercentMin > plantationCoveragePercentMax) {
      return (
        <div className="font-medium text-danger">
          * Minimum plantation coverage has to be smaller than maximum
          plantation coverage
        </div>
      );
    }
    // add any other cases here
    // }
    return null;
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
      soilPercenMin,
      soilPercenMax,
    };

    // console.log("plantation coverage min: " + plantationCoveragePercentMin);
    // console.log("plantation coverage max: " + plantationCoveragePercentMax);
    console.log("new enclosure req obj:");
    console.log(newEnclosureRequirements);

    const createSpecies = async () => {
      try {
        const response = await apiJson.post(
          "http://localhost:3000/api/species/createEnclosureNeeds",
          newEnclosureRequirements
        );
        // success
        console.log("succes?");
        toastShadcn({
          description: "Successfully created enclosure requirements",
        });

        // clearForm();
        // setNewSpeciesCreated(true);
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
    // createSpecies();
  }

  return (
    <div>
      <Form.Root
        className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <span className="flex flex-col items-center self-center text-title-xl font-bold">
          <span className="font-medium">
            Create Species Enclosure Requirements for{" "}
          </span>
          {curSpecies.commonName}
        </span>
        <hr className="bg-stroke opacity-20" />

        {/* Small Exhibit Height Required */}
        {curSpecies.habitatOrExhibit.toLowerCase() == "exhibit" && (
          <FormFieldInput
            type="text"
            formFieldName="smallExhibitHeightRequired"
            label={`Small Exhibit Height Required (m\u00B2)`}
            required={false}
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
            value={acceptableTempMin}
            setValue={setAcceptableTempMin}
            validateFunction={validateMinLandAreaRequired}
          />
          {/* Min Water Area Required */}
          <FormFieldInput
            type="number"
            formFieldName="acceptableTempMax"
            label={`Maximum acceptable temperate (°C)`}
            required={true}
            placeholder="e.g., 8"
            value={acceptableTempMax}
            setValue={setAcceptableTempMax}
            validateFunction={validateMinLandAreaRequired}
          />
        </div>

        <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
          {/* Min Land Area Required */}
          <FormFieldInput
            type="number"
            formFieldName="acceptableHumidityMin"
            label={`Minimum acceptable humidity (g.m⁻³)`}
            required={true}
            placeholder="e.g., 8"
            value={acceptableHumidityMin}
            setValue={setAcceptableHumidityMin}
            validateFunction={validateMinLandAreaRequired}
          />
          {/* Min Water Area Required */}
          <FormFieldInput
            type="number"
            formFieldName="acceptableTempMax"
            label={`Maximum acceptable humidity (g.m⁻³)`}
            required={true}
            placeholder="e.g., 8"
            value={acceptableHumidityMax}
            setValue={setAcceptableHumidityMax}
            validateFunction={validateMinLandAreaRequired}
          />
        </div>

        {/* Recommended Stand-off Barrier Distance */}
        <FormFieldInput
          type="text"
          formFieldName="recommendedStandOffBarrierDistMetres"
          label={`Recommended Stand-off Barrier Distance (m)`}
          required={false}
          placeholder="e.g., 12"
          value={recommendedStandOffBarrierDistMetres}
          setValue={setRecommendedStandOffBarrierDistMetres}
          validateFunction={() => null}
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
                value={[soilPercenMin, soilPercenMax]}
                onValueChange={(value) => {
                  setSoilPercenMin(value[0]);
                  setSoilPercenMax(value[1]);
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
          {!newEnclosureRequirementsCreated ? (
            <Button
              disabled={apiJson.loading}
              className="h-12 w-2/3 self-center rounded-full text-lg"
            >
              {!apiJson.loading ? (
                <div>Create Enclosure Requirements</div>
              ) : (
                <div>Loading</div>
              )}
            </Button>
          ) : (
            <div>
              <span>Enclosure Requirements creations successful. </span>
              <Button
                disabled
                className="h-12 w-2/3 self-center rounded-full text-lg"
              >
                Click to return to Species Details page
              </Button>
            </div>
          )}
        </Form.Submit>
        {/* {formError && (
          <div className="m-2 border-danger bg-red-100 p-2">{formError}</div>
        )} */}
      </Form.Root>
    </div>
  );
}

export default CreateEnclosureRequirementsForm;
