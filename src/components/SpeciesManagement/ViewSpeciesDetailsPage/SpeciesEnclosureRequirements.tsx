import React, { useEffect, useState } from "react";
import useApiJson from "../../../hooks/useApiJson";
import Species from "../../../models/Species";

import {
  Table,
  TableBody,
  TableCell,
  TableRow
} from "@/components/ui/table";

import { Dialog } from "primereact/dialog";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { HiCheck, HiX } from "react-icons/hi";
import { NavLink } from "react-router-dom";
import SpeciesEnclosureNeed from "../../../models/SpeciesEnclosureNeed";
import { TwoThumbSliderWithNumber } from "../TwoThumbSliderWithNumber";

interface SpeciesEnclosureRequirementsProps {
  curSpecies: Species;
}

const emptyEnclosureNeeds: SpeciesEnclosureNeed = {
  speciesEnclosureNeedId: 1,
  smallExhibitHeightRequired: -1, // nullable
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
  soilPercentMin: 20,
  soilPercentMax: 40,
};

function SpeciesEnclosureRequirements(
  props: SpeciesEnclosureRequirementsProps
) {
  const { curSpecies } = props;
  const apiJson = useApiJson();
  const [curEnclosureNeeds, setCurEnclosureNeeds] =
    useState<SpeciesEnclosureNeed | null>(emptyEnclosureNeeds);
  const [deleteEnclosureReqDialog, setDeleteEnclosureReqDialog] =
    useState<boolean>(false);

  const toastShadcn = useToast().toast;

  useEffect(() => {
    const fetchSpeciesEnclosureNeeds = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/species/getEnclosureNeeds/${curSpecies.speciesCode}`
        );
        setCurEnclosureNeeds(responseJson as SpeciesEnclosureNeed);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchSpeciesEnclosureNeeds();
  }, []);

  // Delete stuff
  const confirmDeleteEnclosureReq = () => {
    setDeleteEnclosureReqDialog(true);
  };

  const hideDeleteEnclosureReqDialog = () => {
    setDeleteEnclosureReqDialog(false);
  };

  // delete species stuff
  const deleteSpeciesEnclosureReq = async () => {
    const deleteSpeciesEnclosureReqApi = async () => {
      try {
        const responseJson = await apiJson.del(
          "http://localhost:3000/api/species/deleteEnclosureNeeds/" +
            curEnclosureNeeds?.speciesEnclosureNeedId
        );

        toastShadcn({
          // variant: "destructive",
          title: "Deletion Successful",
          description: "Successfully deleted species enclosure requirements",
        });
        setCurEnclosureNeeds(null);
        setDeleteEnclosureReqDialog(false);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while deleting species: \n" + apiJson.error,
        });
      }
    };
    deleteSpeciesEnclosureReqApi();
  };

  const deleteSpeciesDialogFooter = (
    <React.Fragment>
      <Button onClick={hideDeleteEnclosureReqDialog}>
        <HiX />
        No
      </Button>
      <Button variant={"destructive"} onClick={deleteSpeciesEnclosureReq}>
        <HiCheck />
        Yes
      </Button>
    </React.Fragment>
  );
  // end delete stuff

  return (
    <div>
      {!curEnclosureNeeds ? (
        <div className="flex flex-col items-center gap-2">
          <span>
            No enclosure requirements information found for current species
          </span>
          <NavLink
            to={`/species/createenclosurerequirements/${curSpecies.speciesCode}`}
          >
            <Button className="mb-1 mr-1">Create Enclosure Requirements</Button>
          </NavLink>
        </div>
      ) : (
        <div className="">
          <div className="my-4 flex justify-start gap-6">
            <NavLink
              to={`/species/editenclosurerequirements/${curSpecies.speciesCode}`}
            >
              <Button>Edit Enclosure Requirements</Button>
            </NavLink>

            <Button
              variant={"destructive"}
              onClick={() => confirmDeleteEnclosureReq()}
            >
              Delete Enclosure Requirements
            </Button>
          </div>
          <Table className="rounded-lg shadow-lg">
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
                  {emptyEnclosureNeeds.smallExhibitHeightRequired &&
                  emptyEnclosureNeeds.smallExhibitHeightRequired > 0
                    ? curEnclosureNeeds.smallExhibitHeightRequired
                    : "Not applicable. This species requires a large habitat."}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="w-1/3 font-bold" colSpan={2}>
                  Minimum Required{" "}
                  <span className="text-amber-600">Land Area</span> (m
                  <sup>2</sup>)
                </TableCell>
                <TableCell>{curEnclosureNeeds.minLandAreaRequired}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="w-1/3 font-bold" colSpan={2}>
                  Minimum Required{" "}
                  <span className="text-blue-600">Water Area</span> (m
                  <sup>2</sup>)
                </TableCell>
                <TableCell>{curEnclosureNeeds.minWaterAreaRequired}</TableCell>
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
                      src="../../../../src/assets/terrain/soil.jpg"
                      className="aspect-square h-6 w-6 rounded-full"
                    />
                    <span>Soil</span>
                  </div>
                </TableCell>
                <TableCell>
                  <TwoThumbSliderWithNumber
                    value={[
                      curEnclosureNeeds.soilPercentMin,
                      curEnclosureNeeds.soilPercentMax,
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
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
      <Dialog
        visible={deleteEnclosureReqDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteSpeciesDialogFooter}
        onHide={hideDeleteEnclosureReqDialog}
      >
        <div className="confirmation-content">
          <i className="" />
          {curEnclosureNeeds && (
            <span>
              Are you sure you want to delete the current enclosure
              requirements?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default SpeciesEnclosureRequirements;
