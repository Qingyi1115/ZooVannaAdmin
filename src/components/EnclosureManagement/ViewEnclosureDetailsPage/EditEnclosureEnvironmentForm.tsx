import React, { useState, useEffect } from "react";

import * as Form from "@radix-ui/react-form";

import useApiJson from "../../../hooks/useApiJson";
import FormFieldInput from "../../FormFieldInput";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import Enclosure from "../../../models/Enclosure";
import { TwoThumbSliderWithNumber } from "../../SpeciesManagement/TwoThumbSliderWithNumber";
import { Label } from "@/components/ui/label";
import { TwoThumbSliderWithReco } from "../TwoThumbSliderWithReco";
interface EditEnclosureEnvironmentFormProps {
  curEnclosure: Enclosure;
}

function EditEnclosureEnvironmentForm(
  props: EditEnclosureEnvironmentFormProps
) {
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;
  const navigate = useNavigate();

  const { curEnclosure } = props;

  // fields
  const [enclosureId, setEnclosureId] = useState<number>(
    curEnclosure.enclosureId
  );
  const [landArea, setLandArea] = useState<number | null | undefined>(
    curEnclosure.landArea
  ); // must validate > 0
  const [waterArea, setWaterArea] = useState<number | null | undefined>(
    curEnclosure.waterArea
  );
  const [acceptableTempMin, setAcceptableTempMin] = useState<
    number | null | undefined
  >(curEnclosure.acceptableTempMin);
  const [acceptableTempMax, setAcceptableTempMax] = useState<
    number | null | undefined
  >(curEnclosure.acceptableTempMax);
  const [acceptableHumidityMin, setAcceptableHumidityMin] = useState<
    number | null | undefined
  >(curEnclosure.acceptableHumidityMin);
  const [acceptableHumidityMax, setAcceptableHumidityMax] = useState<
    number | null | undefined
  >(curEnclosure.acceptableHumidityMax);
  const [standOffBarrierDist, setStandOffBarrierDist] = useState<number | null>(
    curEnclosure.standOffBarrierDist
  );
  const [plantationCoveragePercent, setPlantationCoveragePercent] = useState<
    number | null | undefined
  >(curEnclosure.plantationCoveragePercent);
  const [longGrassPercent, setLongGrassPercent] = useState<number>(
    curEnclosure.longGrassPercent ? curEnclosure.longGrassPercent : 0
  );
  const [shortGrassPercent, setShortGrassPercent] = useState<number>(
    curEnclosure.shortGrassPercent ? curEnclosure.shortGrassPercent : 0
  );
  const [rockPercent, setRockPercent] = useState<number>(
    curEnclosure.rockPercent ? curEnclosure.rockPercent : 0
  );
  const [sandPercent, setSandPercent] = useState<number>(
    curEnclosure.sandPercent ? curEnclosure.sandPercent : 0
  );
  const [snowPercent, setSnowPercent] = useState<number>(
    curEnclosure.snowPercent ? curEnclosure.snowPercent : 0
  );
  const [soilPercent, setSoilPercent] = useState<number>(
    curEnclosure.soilPercent ? curEnclosure.soilPercent : 0
  );

  /////
  // fetch recommendation
  type Recommends = {
    minLandAreaRequired: number;
    minWaterAreaRequired: number;
    acceptableTempMin: number;
    acceptableTempMax: number;
    acceptableHumidityMin: number;
    acceptableHumidityMax: number;
    plantationCoveragePercentMin: number;
    plantationCoveragePercentMax: number;
    longGrassPercentMin: number;
    longGrassPercentMax: number;
    shortGrassPercentMin: number;
    shortGrassPercentMax: number;
    rockPercentMin: number;
    rockPercentMax: number;
    sandPercentMin: number;
    sandPercentMax: number;
    snowPercentMin: number;
    snowPercentMax: number;
    soilPercentMin: number;
    soilPercentMax: number;
  };
  const [
    enclosureTerrainDistributionRecommendation,
    setEnclosureTerrainDistributionRecommendation,
  ] = useState<Recommends>();
  useEffect(() => {
    const fetchEnclosureTerrainStuffReco = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/enclosure/getEnclosureTerrainDistributionRecommendation/${curEnclosure.enclosureId}`
        );
        // console.log("test");
        // console.log(responseJson);
        setEnclosureTerrainDistributionRecommendation(
          responseJson.enclosureTerrainDistributionReco as Recommends
        );
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchEnclosureTerrainStuffReco();
  }, [curEnclosure]);
  /////

  ///////
  // validate functions
  ////////
  function validateLandArea(props: ValidityState) {
    // if (props != undefined) {
    if (landArea != undefined && landArea != null && landArea <= 0) {
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

  function validateWaterArea(props: ValidityState) {
    // if (props != undefined) {
    if (waterArea != undefined && waterArea != null && waterArea <= 0) {
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
      if (standOffBarrierDist == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please enter a stand-off barrier distance
          </div>
        );
      } else if (standOffBarrierDist <= 0) {
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

  ///////
  // validate functions end
  ////////

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Remember, your form must have enctype="multipart/form-data" for upload pictures
    e.preventDefault();
    const newEnclosureRequirements = {
      enclosureId,
      landArea,
      waterArea,
      acceptableTempMin,
      acceptableTempMax,
      acceptableHumidityMin,
      acceptableHumidityMax,
      plantationCoveragePercent,
      longGrassPercent,
      shortGrassPercent,
      rockPercent,
      sandPercent,
      snowPercent,
      soilPercent,
      standOffBarrierDist,
    };

    console.log("new enclosure req obj:", newEnclosureRequirements);

    const updateEnclosureEnclosureRequirements = async () => {
      try {
        const response = await apiJson.put(
          "http://localhost:3000/api/enclosure/updateEnclosureTerrainDistribution",
          newEnclosureRequirements
        );
        // success
        console.log("succes?");
        toastShadcn({
          description: "Successfully updated enclosure environment details.",
        });

        // clearForm();
        navigate(-1);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while updating enclosure environment details: \n" +
            error.message,
        });
      }
    };
    updateEnclosureEnclosureRequirements();
  }

  return (
    <div>
      <Form.Root
        className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="flex flex-col">
          <div className="mb-4 flex justify-between">
            <Button
              onClick={() => navigate(-1)}
              variant={"outline"}
              type="button"
              className=""
            >
              Back
            </Button>
            <span className="self-center text-lg text-graydark">
              Edit Enclosure Environment Details
            </span>
            <Button disabled className="invisible">
              Back
            </Button>
          </div>
          <Separator />
          <span className="mt-4 flex flex-col items-center self-center text-title-xl font-bold">
            {curEnclosure.name}
          </span>
        </div>
        <Separator className="opacity-20" />

        {/* <div className="flex flex-col gap-6 lg:flex-row lg:gap-12">
          <div className="flex w-full items-center">
            <Label className="text-lg">
              Recommended Min Temperature:{" "}
              {enclosureTerrainDistributionRecommendation?.acceptableTempMin}
            </Label>
          </div>
          <div className="flex w-full">
            <Label className="text-lg">
              Recommended Max Temperature:{" "}
              {enclosureTerrainDistributionRecommendation?.acceptableTempMax}
            </Label>
          </div>
        </div> */}
        <div className="text-lg font-bold">Acceptable Condition Ranges</div>
        <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
          {/* Min Acceptable Temperature */}
          <div className="w-full">
            <div className="italic">
              Recommended:{" "}
              <span className="font-bold text-emerald-700">
                {enclosureTerrainDistributionRecommendation?.acceptableTempMin !=
                Number.MIN_SAFE_INTEGER ? (
                  <span>
                    {
                      enclosureTerrainDistributionRecommendation?.acceptableTempMin
                    }
                    °C
                  </span>
                ) : (
                  <span>Not available</span>
                )}
              </span>
            </div>
            <FormFieldInput
              type="number"
              formFieldName="acceptableTempMin"
              label={`Minimum Acceptable Temperate (°C)`}
              required={true}
              placeholder="e.g., 8"
              pattern={undefined}
              value={acceptableTempMin || 0}
              setValue={setAcceptableTempMin}
              validateFunction={validateMinTemperature}
            />
          </div>
          {/* Max Acceptable Temperature */}
          <div className="w-full">
            <div className="italic">
              Recommended:{" "}
              <span className="font-bold text-emerald-700">
                {enclosureTerrainDistributionRecommendation?.acceptableTempMax !=
                Number.MAX_SAFE_INTEGER ? (
                  <span>
                    {
                      enclosureTerrainDistributionRecommendation?.acceptableTempMax
                    }
                    °C
                  </span>
                ) : (
                  <span>Not available</span>
                )}
              </span>
            </div>
            <FormFieldInput
              type="number"
              formFieldName="acceptableTempMax"
              label={`Maximum Acceptable Temperate (°C)`}
              required={true}
              placeholder="e.g., 8"
              pattern={undefined}
              value={acceptableTempMax || 0}
              setValue={setAcceptableTempMax}
              validateFunction={validateMaxTemperature}
            />
          </div>
        </div>
        <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
          {/* Min Acceptable Humidity */}
          <div className="w-full">
            <div className="italic">
              Recommended:{" "}
              <span className="font-bold text-emerald-700">
                {enclosureTerrainDistributionRecommendation?.acceptableHumidityMin !=
                Number.MIN_SAFE_INTEGER ? (
                  <span>
                    {
                      enclosureTerrainDistributionRecommendation?.acceptableHumidityMin
                    }
                    g.m⁻³
                  </span>
                ) : (
                  <span>Not available</span>
                )}
              </span>
            </div>
            <FormFieldInput
              type="number"
              formFieldName="acceptableHumidityMin"
              label={`Minimum Acceptable Humidity (g.m⁻³)`}
              required={true}
              placeholder="e.g., 8"
              pattern={undefined}
              value={acceptableHumidityMin || 0}
              setValue={setAcceptableHumidityMin}
              validateFunction={validateMinHumidity}
            />
          </div>
          {/* Max Acceptable Humidity */}
          <div className="w-full">
            <div className="italic">
              Recommended:{" "}
              <span className="font-bold text-emerald-700">
                {enclosureTerrainDistributionRecommendation?.acceptableHumidityMax !=
                Number.MAX_SAFE_INTEGER ? (
                  <span>
                    {
                      enclosureTerrainDistributionRecommendation?.acceptableHumidityMax
                    }
                    g.m⁻³
                  </span>
                ) : (
                  <span>Not available</span>
                )}
              </span>
            </div>
            <FormFieldInput
              type="number"
              formFieldName="acceptableTempMax"
              label={`Maximum Acceptable Humidity (g.m⁻³)`}
              required={true}
              placeholder="e.g., 8"
              pattern={undefined}
              value={acceptableHumidityMax || 0}
              setValue={setAcceptableHumidityMax}
              validateFunction={validateMaxHumidity}
            />
          </div>
        </div>
        {/* Recommended Stand-off Barrier Distance */}
        {/* <FormFieldInput
          type="number"
          formFieldName="standOffBarrierDist"
          label={`Stand-off Barrier Distance (m)`}
          required={true}
          placeholder="e.g., 12"
          pattern={undefined}
          value={standOffBarrierDist || 0}
          setValue={setStandOffBarrierDist}
          validateFunction={validateStandOffBarrierDist}
        /> */}

        <br />
        <div className="text-lg font-bold">Terrain Distribution</div>

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
          <div className="h-28 w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter">
            {enclosureTerrainDistributionRecommendation &&
            enclosureTerrainDistributionRecommendation.longGrassPercentMin !=
              Number.MIN_SAFE_INTEGER ? (
              <div className="flex h-1/2 items-center justify-center gap-2">
                <span>0%</span>
                <TwoThumbSliderWithReco
                  value={[
                    enclosureTerrainDistributionRecommendation.longGrassPercentMin,
                    enclosureTerrainDistributionRecommendation.longGrassPercentMax,
                  ]}
                  onValueChange={(value) => {
                    if (longGrassPercent != value[0]) {
                      setLongGrassPercent(value[0]);
                    } else {
                      setLongGrassPercent(value[1]);
                    }
                  }}
                  min={0}
                  max={100}
                  step={1}
                  minStepsBetweenThumbs={0}
                />
                <span>100%</span>
              </div>
            ) : (
              <div>No recommedation available</div>
            )}
            <div className="flex h-1/2 items-center justify-center gap-2">
              <span>0%</span>
              <TwoThumbSliderWithNumber
                value={[longGrassPercent, longGrassPercent]}
                onValueChange={(value) => {
                  if (longGrassPercent != value[0]) {
                    setLongGrassPercent(value[0]);
                  } else {
                    setLongGrassPercent(value[1]);
                  }
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
          <div className="h-28 w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter">
            {enclosureTerrainDistributionRecommendation &&
            enclosureTerrainDistributionRecommendation.shortGrassPercentMin !=
              Number.MIN_SAFE_INTEGER ? (
              <div className="flex h-1/2 items-center justify-center gap-2">
                <span>0%</span>
                <TwoThumbSliderWithReco
                  value={[
                    enclosureTerrainDistributionRecommendation.shortGrassPercentMin,
                    enclosureTerrainDistributionRecommendation.shortGrassPercentMax,
                  ]}
                  onValueChange={(value) => {
                    if (longGrassPercent != value[0]) {
                      setLongGrassPercent(value[0]);
                    } else {
                      setLongGrassPercent(value[1]);
                    }
                  }}
                  min={0}
                  max={100}
                  step={1}
                  minStepsBetweenThumbs={0}
                />
                <span>100%</span>
              </div>
            ) : (
              <div>No recommedation available</div>
            )}
            <div className="flex h-full items-center justify-center gap-2">
              <span>0%</span>
              <TwoThumbSliderWithNumber
                value={[shortGrassPercent, shortGrassPercent]}
                onValueChange={(value) => {
                  if (shortGrassPercent != value[0]) {
                    setShortGrassPercent(value[0]);
                  } else {
                    setShortGrassPercent(value[1]);
                  }
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
          <div className="h-28 w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter">
            {enclosureTerrainDistributionRecommendation &&
            enclosureTerrainDistributionRecommendation.soilPercentMin !=
              Number.MIN_SAFE_INTEGER ? (
              <div className="flex h-1/2 items-center justify-center gap-2">
                <span>0%</span>
                <TwoThumbSliderWithReco
                  value={[
                    enclosureTerrainDistributionRecommendation.soilPercentMin,
                    enclosureTerrainDistributionRecommendation.soilPercentMax,
                  ]}
                  onValueChange={(value) => {
                    if (longGrassPercent != value[0]) {
                      setLongGrassPercent(value[0]);
                    } else {
                      setLongGrassPercent(value[1]);
                    }
                  }}
                  min={0}
                  max={100}
                  step={1}
                  minStepsBetweenThumbs={0}
                />
                <span>100%</span>
              </div>
            ) : (
              <div>No recommedation available</div>
            )}
            <div className="flex h-full items-center justify-center gap-2">
              <span>0%</span>
              <TwoThumbSliderWithNumber
                value={[soilPercent, soilPercent]}
                onValueChange={(value) => {
                  if (soilPercent != value[0]) {
                    setSoilPercent(value[0]);
                  } else {
                    setSoilPercent(value[1]);
                  }
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
          <div className="h-28 w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter">
            {enclosureTerrainDistributionRecommendation &&
            enclosureTerrainDistributionRecommendation.rockPercentMin !=
              Number.MIN_SAFE_INTEGER ? (
              <div className="flex h-1/2 items-center justify-center gap-2">
                <span>0%</span>
                <TwoThumbSliderWithReco
                  value={[
                    enclosureTerrainDistributionRecommendation.rockPercentMin,
                    enclosureTerrainDistributionRecommendation.rockPercentMax,
                  ]}
                  onValueChange={(value) => {
                    if (longGrassPercent != value[0]) {
                      setLongGrassPercent(value[0]);
                    } else {
                      setLongGrassPercent(value[1]);
                    }
                  }}
                  min={0}
                  max={100}
                  step={1}
                  minStepsBetweenThumbs={0}
                />
                <span>100%</span>
              </div>
            ) : (
              <div>No recommedation available</div>
            )}
            <div className="flex h-full items-center justify-center gap-2">
              <span>0%</span>
              <TwoThumbSliderWithNumber
                value={[rockPercent, rockPercent]}
                onValueChange={(value) => {
                  if (rockPercent != value[0]) {
                    setRockPercent(value[0]);
                  } else {
                    setRockPercent(value[1]);
                  }
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
          <div className="h-28 w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter">
            {enclosureTerrainDistributionRecommendation &&
            enclosureTerrainDistributionRecommendation.sandPercentMin !=
              Number.MIN_SAFE_INTEGER ? (
              <div className="flex h-1/2 items-center justify-center gap-2">
                <span>0%</span>
                <TwoThumbSliderWithReco
                  value={[
                    enclosureTerrainDistributionRecommendation.sandPercentMin,
                    enclosureTerrainDistributionRecommendation.sandPercentMax,
                  ]}
                  onValueChange={(value) => {
                    if (longGrassPercent != value[0]) {
                      setLongGrassPercent(value[0]);
                    } else {
                      setLongGrassPercent(value[1]);
                    }
                  }}
                  min={0}
                  max={100}
                  step={1}
                  minStepsBetweenThumbs={0}
                />
                <span>100%</span>
              </div>
            ) : (
              <div>No recommedation available</div>
            )}
            <div className="flex h-full items-center justify-center gap-2">
              <span>0%</span>
              <TwoThumbSliderWithNumber
                value={[sandPercent, sandPercent]}
                onValueChange={(value) => {
                  if (sandPercent != value[0]) {
                    setSandPercent(value[0]);
                  } else {
                    setSandPercent(value[1]);
                  }
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
          <div className="h-28 w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter">
            {enclosureTerrainDistributionRecommendation &&
            enclosureTerrainDistributionRecommendation.snowPercentMin !=
              Number.MIN_SAFE_INTEGER ? (
              <div className="flex h-1/2 items-center justify-center gap-2">
                <span>0%</span>
                <TwoThumbSliderWithReco
                  value={[
                    enclosureTerrainDistributionRecommendation.snowPercentMin,
                    enclosureTerrainDistributionRecommendation.snowPercentMax,
                  ]}
                  onValueChange={(value) => {
                    if (longGrassPercent != value[0]) {
                      setLongGrassPercent(value[0]);
                    } else {
                      setLongGrassPercent(value[1]);
                    }
                  }}
                  min={0}
                  max={100}
                  step={1}
                  minStepsBetweenThumbs={0}
                />
                <span>100%</span>
              </div>
            ) : (
              <div>No recommedation available</div>
            )}
            <div className="flex h-full items-center justify-center gap-2">
              <span>0%</span>
              <TwoThumbSliderWithNumber
                value={[snowPercent, snowPercent]}
                onValueChange={(value) => {
                  if (snowPercent != value[0]) {
                    setSnowPercent(value[0]);
                  } else {
                    setSnowPercent(value[1]);
                  }
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
    </div>
  );
}

export default EditEnclosureEnvironmentForm;
