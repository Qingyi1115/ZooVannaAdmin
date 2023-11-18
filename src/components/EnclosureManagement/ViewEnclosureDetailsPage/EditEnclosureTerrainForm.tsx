import React, { useEffect, useState } from "react";

import * as Form from "@radix-ui/react-form";

import useApiJson from "../../../hooks/useApiJson";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import Enclosure from "../../../models/Enclosure";
import { TwoThumbSliderWithNumber } from "../../SpeciesManagement/TwoThumbSliderWithNumber";
import { TwoThumbSliderWithReco } from "../TwoThumbSliderWithReco";
interface EditEnclosureTerrainFormProps {
  curEnclosure: Enclosure;
}

function EditEnclosureTerrainForm(props: EditEnclosureTerrainFormProps) {
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;
  const navigate = useNavigate();

  const { curEnclosure } = props;

  // fields
  const [enclosureId, setEnclosureId] = useState<number>(
    curEnclosure.enclosureId
  );

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

  ///////
  // validate functions end
  ////////

  interface RecommendationValidationResult {
    isValid: boolean;
    isMinTooHigh: boolean;
    isMaxTooLow: boolean;
    totalMin: number;
    totalMax: number;
  }
  function areRecommendationRangesValid(): any {
    const total =
      longGrassPercent +
      shortGrassPercent +
      rockPercent +
      sandPercent +
      snowPercent +
      soilPercent;

    return { isValid: total <= 100, total: total };
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Remember, your form must have enctype="multipart/form-data" for upload pictures
    e.preventDefault();
    const newEnclosureRequirements = {
      enclosureId,
      longGrassPercent,
      shortGrassPercent,
      rockPercent,
      sandPercent,
      snowPercent,
      soilPercent,
    };

    console.log("new enclosure req obj:", newEnclosureRequirements);

    const isTerrainDistributionValid: any = areRecommendationRangesValid();

    if (!isTerrainDistributionValid.isValid) {
      toastShadcn({
        variant: "destructive",
        title: "Invalid Terrain Distribution",
        description: `Your terrain distribution is not valid. Total terrain dsitribution percentages should be equal to or smaller than 100%. (Current: ${isTerrainDistributionValid.total}%)`,
      });
      return;
    }

    const updateEnclosureEnclosureRequirements = async () => {
      try {
        const response = await apiJson.put(
          "http://localhost:3000/api/enclosure/updateEnclosureTerrainDistribution",
          newEnclosureRequirements
        );
        // success
        console.log("succes?");
        toastShadcn({
          description: "Successfully updated enclosure terrain details.",
        });

        // clearForm();
        navigate(-1);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while updating enclosure terrain details: \n" +
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
              Edit Enclosure Terrain Details
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
              <div>No recommendation available</div>
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
      </Form.Root>
    </div>
  );
}

export default EditEnclosureTerrainForm;
