import React, { useEffect, useState } from "react";
import useApiJson from "../../../hooks/useApiJson";
import Species from "../../../models/Species";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TwoThumbSlider } from "@/components/ui/two-thumb-slider";
import { Slider } from "@/components/ui/slider";

import SpeciesEnclosureNeed from "../../../models/SpeciesEnclosureNeed";
import { TwoThumbSliderWithNumber } from "../TwoThumbSliderWithNumber";

interface SpeciesEnclosureRequirementsProps {
  curSpecies: Species;
}

const emptyEnclosureNeeds: SpeciesEnclosureNeed = {
  speciesEnclosureNeedId: 1,
  smallExhibitHeightRequired: null, // nullable
  minLandAreaRequired: 10,
  minWaterAreaRequired: 10,
  acceptableTempMin: 10,
  acceptableTempMax: 10,
  acceptableHumidityMin: 10,
  acceptableHumidityMax: 20,
  recommendedStandOffBarrierDistMetres: 10,
  plantationCoveragePercentMin: 10,
  plantationCoveragePercentMax: 20,
  longGrassPercentMin: 10,
  longGrassPercentMax: 20,
  shortGrassPercentMin: 10,
  shortGrassPercentMax: 20,
  rockPercentMin: 10,
  rockPercentMax: 20,
  sandPercentMin: 0,
  sandPercentMax: 0,
  snowPercentMin: 0,
  snowPercentMax: 0,
  soilPercenMin: 20,
  soilPercenMax: 40,
};

function SpeciesEnclosureRequirements(
  props: SpeciesEnclosureRequirementsProps
) {
  const { curSpecies } = props;
  const apiJson = useApiJson();
  const [curEnclosureNeeds, setCurEnclosureNeeds] =
    useState<SpeciesEnclosureNeed>(emptyEnclosureNeeds);

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/species/getEnclosureNeeds/${curSpecies.speciesCode}`
        );
        setCurEnclosureNeeds(responseJson as SpeciesEnclosureNeed);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchSpecies();
  }, []);

  // function twoThumbSliderTest(value: number[]) {
  //   // const el = document.getElementById(
  //   //   "twothumbslidertest"
  //   // ) as HTMLInputElement;
  //   console.log(value);
  // }

  return (
    <div>
      <Table>
        {/* <TableHeader className=" bg-whiten">
          <TableRow>
            <TableHead className="w-1/3 font-bold" colSpan={2}>
              Attribute
            </TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader> */}
        <TableBody>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Small Exhibit Height &#40;in metres&#41;
            </TableCell>
            <TableCell>
              {emptyEnclosureNeeds.smallExhibitHeightRequired
                ? curEnclosureNeeds.smallExhibitHeightRequired
                : "Not applicable. This species requires a large habitat"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Minimum Required <span className="text-amber-600">Land Area</span>{" "}
              (m<sup>2</sup>)
            </TableCell>
            <TableCell>{curEnclosureNeeds.minLandAreaRequired}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Minimum Required <span className="text-blue-600">Water Area</span>{" "}
              (m<sup>2</sup>)
            </TableCell>
            <TableCell>{curEnclosureNeeds.minLandAreaRequired}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Acceptable Temperature Range (&deg;C)
            </TableCell>
            <TableCell>
              <span className="font-bold">
                {curEnclosureNeeds.acceptableTempMin}
              </span>{" "}
              &deg;C —{" "}
              <span className="font-bold">
                {curEnclosureNeeds.acceptableTempMax}
              </span>{" "}
              &deg;C
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Acceptable Humidity Range (g.m<sup>-3</sup>)
            </TableCell>
            <TableCell>
              <span className="font-bold">
                {curEnclosureNeeds.acceptableHumidityMin}
              </span>{" "}
              g.m<sup>-3</sup> —{" "}
              <span className="font-bold">
                {curEnclosureNeeds.acceptableHumidityMax}
              </span>{" "}
              g.m
              <sup>-3</sup>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Receommended Stand-off Barrier Distance (m)
            </TableCell>
            <TableCell>
              {curEnclosureNeeds.recommendedStandOffBarrierDistMetres}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Recommended Plantation Coverage (%)
            </TableCell>
            <TableCell>
              <TwoThumbSliderWithNumber
                value={[
                  curEnclosureNeeds.plantationCoveragePercentMin,
                  curEnclosureNeeds.plantationCoveragePercentMax,
                ]}
                min={0}
                max={100}
                minStepsBetweenThumbs={1}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/5 font-bold" rowSpan={7}>
              Recommended Terrain Distribution (%)
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/6 font-bold">
              <div className="flex items-center gap-2">
                <img
                  src="../../../../src/assets/terrain/long-grass.jpg"
                  className="aspect-square h-6 w-6 rounded-full"
                />
                <span>Long Grass</span>
              </div>
            </TableCell>
            <TableCell>
              <TwoThumbSliderWithNumber
                value={[
                  curEnclosureNeeds.longGrassPercentMin,
                  curEnclosureNeeds.longGrassPercentMax,
                ]}
                min={0}
                max={100}
                minStepsBetweenThumbs={1}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/6 font-bold">
              <div className="flex items-center gap-2">
                <img
                  src="../../../../src/assets/terrain/short-grass.jpg"
                  className="aspect-square h-6 w-6 rounded-full"
                />
                <span>Short Grass</span>
              </div>
            </TableCell>
            <TableCell>
              <TwoThumbSliderWithNumber
                value={[
                  curEnclosureNeeds.shortGrassPercentMin,
                  curEnclosureNeeds.shortGrassPercentMax,
                ]}
                min={0}
                max={100}
                minStepsBetweenThumbs={1}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/6 font-bold">
              <div className="flex items-center gap-2">
                <img
                  src="../../../../src/assets/terrain/rock.jpg"
                  className="aspect-square h-6 w-6 rounded-full"
                />
                <span>Rock</span>
              </div>
            </TableCell>
            <TableCell>
              <TwoThumbSliderWithNumber
                value={[
                  curEnclosureNeeds.rockPercentMin,
                  curEnclosureNeeds.rockPercentMax,
                ]}
                min={0}
                max={100}
                minStepsBetweenThumbs={1}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/6 font-bold">
              <div className="flex items-center gap-2">
                <img
                  src="../../../../src/assets/terrain/sand.jpg"
                  className="aspect-square h-6 w-6 rounded-full"
                />
                <span>Sand</span>
              </div>
            </TableCell>
            <TableCell>
              <TwoThumbSliderWithNumber
                value={[
                  curEnclosureNeeds.sandPercentMin,
                  curEnclosureNeeds.sandPercentMax,
                ]}
                min={0}
                max={100}
                minStepsBetweenThumbs={1}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/6 font-bold">
              <div className="flex items-center gap-2">
                <img
                  src="../../../../src/assets/terrain/snow.jpg"
                  className="aspect-square h-6 w-6 rounded-full"
                />
                <span>Snow</span>
              </div>
            </TableCell>
            <TableCell>
              <TwoThumbSliderWithNumber
                value={[
                  curEnclosureNeeds.snowPercentMin,
                  curEnclosureNeeds.snowPercentMax,
                ]}
                min={0}
                max={100}
                minStepsBetweenThumbs={1}
                className="bg-blue-300"
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/6 font-bold">
              <div className="flex items-center gap-2">
                <img
                  src="../../../../src/assets/terrain/soil.jpg"
                  className="aspect-square h-6 w-6 rounded-full"
                />
                <span>Soil</span>
              </div>
            </TableCell>
            <TableCell>
              <TwoThumbSliderWithNumber
                value={[
                  curEnclosureNeeds.soilPercenMin,
                  curEnclosureNeeds.soilPercenMax,
                ]}
                min={0}
                max={100}
                minStepsBetweenThumbs={1}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export default SpeciesEnclosureRequirements;
