import React, { useEffect, useState, useRef } from "react";
import LandingPageMap from "../../../components/AssetAndFacilityManagement/FacilityManagement/Map/LandingPageMap";

import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

import {
  MapContainer,
  Marker,
  useMap,
  useMapEvents,
  ImageOverlay,
  Polygon,
  SVGOverlay,
} from "react-leaflet";
import { TileLayer } from "react-leaflet";
import L, {
  LatLng,
  LatLngBounds,
  LatLngBoundsLiteral,
  LatLngExpression,
} from "leaflet";
import Facility from "../../../models/Facility";
import useApiJson from "../../../hooks/useApiJson";
import { FacilityType } from "../../../enums/FacilityType";
import { Dialog } from "primereact/dialog";
import { HiCheck, HiX } from "react-icons/hi";
// import geolocation from "geolocation";

function MapLandingPage() {
  const navigate = useNavigate();
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;

  const [facilityList, setFacilityList] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(
    null
  );
  const [refreshSeed, setRefreshSeed] = useState<number>(0);

  const [deleteLocationFromMapDialog, setDeleteLocationFromMapDialog] =
    useState<boolean>(false);

  const [isShownOnMap, setIsShownOnMap] = useState<boolean>(false);

  useEffect(() => {
    const fetchNoLocationFacilities = async () => {
      try {
        const responseJson = await apiJson.post(
          "http://localhost:3000/api/assetFacility/getAllFacility",
          { includes: ["facilityDetail"] }
        );
        const facilityListWithLocation = (
          responseJson.facilities as Facility[]
        ).filter((facility) => {
          // console.log(facility);
          return !(
            facility.xCoordinate == null || facility.yCoordinate == null
          );
        });
        setFacilityList(facilityListWithLocation);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchNoLocationFacilities();
  }, [refreshSeed]);

  // Delete stuff
  const confirmDeleteLocationFromMap = () => {
    setDeleteLocationFromMapDialog(true);
  };

  const hideDeleteLocationFromMapDialog = () => {
    setDeleteLocationFromMapDialog(false);
  };

  // delete location from map stuff
  async function handleDeleteLocationFromMap() {
    if (!selectedFacility) {
      return;
    }

    const updatedFacility = {
      facilityName: selectedFacility.facilityName,
      xCoordinate: null,
      yCoordinate: null,
      showOnMap: false,
      facilityDetail: selectedFacility.facilityDetail,
      isSheltered: selectedFacility.isSheltered,
      facilityDetailJson: selectedFacility.facilityDetailJson,
    };

    try {
      const responseJson = await apiJson.put(
        `http://localhost:3000/api/assetFacility/updateFacility/${selectedFacility.facilityId}`,
        updatedFacility
      );
      // success
      toastShadcn({
        description: "Successfully remove location map",
      });
      setSelectedFacility(null);
      setDeleteLocationFromMapDialog(false);
      setRefreshSeed(refreshSeed + 1);
    } catch (error: any) {
      toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "An error has occurred while deleting location from map: \n" +
          error.message,
      });
    }
  }

  const deleteLocationFromMapDialogFooter = (
    <React.Fragment>
      <Button onClick={hideDeleteLocationFromMapDialog}>
        <HiX />
        No
      </Button>
      <Button variant={"destructive"} onClick={handleDeleteLocationFromMap}>
        <HiCheck />
        Yes
      </Button>
    </React.Fragment>
  );
  // end delete stuff

  // Show On Map Toggle stuff
  const [toggleShowOnMapDialog, setToggleShowOnMapDialog] =
    useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);

  function handleOnCheckedChangeShowOnMap(checked: boolean) {
    confirmToggleShowOnMap();
    setIsChecked(checked);
  }

  const confirmToggleShowOnMap = () => {
    setToggleShowOnMapDialog(true);
  };

  const hideToggleShowOnMapDialog = () => {
    setToggleShowOnMapDialog(false);
  };

  // toggle show on map stuff
  async function handleToggleShowOnMap() {
    if (!selectedFacility) {
      return;
    }

    const updatedFacility = {
      facilityName: selectedFacility.facilityName,
      xCoordinate: selectedFacility.xCoordinate,
      yCoordinate: selectedFacility.yCoordinate,
      showOnMap: isChecked,
      facilityDetail: selectedFacility.facilityDetail,
      isSheltered: selectedFacility.isSheltered,
      facilityDetailJson: selectedFacility.facilityDetailJson,
    };

    console.log("heree");
    console.log(isChecked);

    try {
      const responseJson = await apiJson.put(
        `http://localhost:3000/api/assetFacility/updateFacility/${selectedFacility.facilityId}`,
        updatedFacility
      );
      // success
      toastShadcn({
        description: "Successfully updated customer map visibility",
      });
      setIsShownOnMap(isChecked);
      setToggleShowOnMapDialog(false);
      setRefreshSeed(refreshSeed + 1);
    } catch (error: any) {
      toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "An error has occurred while updating customer map visibility map: \n" +
          error.message,
      });
    }
  }

  const toggleShowOnMapMapDialogFooter = (
    <React.Fragment>
      <Button onClick={hideToggleShowOnMapDialog}>
        <HiX />
        No
      </Button>
      <Button variant={"destructive"} onClick={handleToggleShowOnMap}>
        <HiCheck />
        Yes
      </Button>
    </React.Fragment>
  );
  // end delete stuff

  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-10 text-black shadow-default">
        {/* Header */}
        <div className="flex justify-between">
          <Button variant={"outline"} type="button" className="invisible">
            Back
          </Button>
          <span className="self-center text-title-xl font-bold">Zoo Map</span>
          <Button disabled className="invisible">
            Back
          </Button>
        </div>
        <Separator />
        {/*  */}
        <div className="self-center">
          <Button onClick={() => navigate(`/assetfacility/addlocation`)}>
            Add New Location to Map
          </Button>
          {/* <Button onClick={testGetLocation}>Test get location</Button> */}
        </div>
        <div className="flex gap-8">
          <Card className="h-[50vh] w-1/4">
            <CardContent className="flex h-full flex-col justify-between">
              <div className="pb-4 pt-8">
                {!selectedFacility ? (
                  <div className="text-center">No facility selected</div>
                ) : (
                  <div className="flex flex-col gap-4 pt-2 text-center">
                    <div className="text-xl font-medium">
                      {selectedFacility.facilityName}
                    </div>
                    <div className="text-lg">
                      Type:{" "}
                      {
                        FacilityType[
                          selectedFacility.facilityDetailJson
                            .facilityType as keyof typeof FacilityType
                        ]
                      }
                    </div>
                    <div>
                      Current Coordinates:
                      <div>
                        X-Coordinates:{" "}
                        <span className="font-medium">
                          {selectedFacility.xCoordinate.toFixed(4)}
                        </span>
                      </div>
                      <div>
                        Y-Coordinates:{" "}
                        <span className="font-medium">
                          {selectedFacility.yCoordinate.toFixed(4)}
                        </span>
                      </div>
                    </div>
                    <div>
                      Show on map:{" "}
                      <span className="font-medium">
                        {selectedFacility.showOnMap ? (
                          <span className="text-primary">Yes</span>
                        ) : (
                          <span className="text-destructive">No</span>
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <Separator />
              <div className="flex w-full flex-col items-center gap-2">
                <div className="mb-2 flex items-center text-lg">
                  Show on customer map:
                  <Switch
                    disabled={!selectedFacility}
                    className="ml-2"
                    checked={isShownOnMap}
                    onCheckedChange={(checked) =>
                      handleOnCheckedChangeShowOnMap(checked)
                    }
                  />
                </div>

                <Button
                  className="w-full"
                  disabled={!selectedFacility}
                  onClick={() =>
                    navigate(
                      `/assetfacility/changelocation/${selectedFacility?.facilityId}`
                    )
                  }
                >
                  Change Location
                </Button>
                <Button
                  className="w-full"
                  disabled={!selectedFacility}
                  variant={"destructive"}
                  onClick={() => confirmDeleteLocationFromMap()}
                >
                  Remove From Map
                </Button>
              </div>
            </CardContent>
          </Card>
          <div className="w-full overflow-hidden rounded-md border border-stroke shadow-md">
            <LandingPageMap
              facilityList={facilityList}
              selectedFacility={selectedFacility}
              setSelectedFacility={setSelectedFacility}
              setIsShownOnMap={setIsShownOnMap}
            />
          </div>
        </div>
      </div>
      <Dialog
        visible={deleteLocationFromMapDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteLocationFromMapDialogFooter}
        onHide={hideDeleteLocationFromMapDialog}
      >
        <div className="confirmation-content">
          <i className="" />
          {selectedFacility && (
            <span>
              Are you sure you want to remove the selected facility's location
              from the map?
              <br />
              This will not delete the facility, but only remove its location
              details
            </span>
          )}
        </div>
      </Dialog>
      <Dialog
        visible={toggleShowOnMapDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={toggleShowOnMapMapDialogFooter}
        onHide={hideToggleShowOnMapDialog}
      >
        <div className="confirmation-content">
          <i className="" />
          {selectedFacility && (
            <div>
              {isShownOnMap ? (
                <span>
                  Are you sure you want to hide selected facility's location
                  from the customermap?
                  <br />
                  This will not remove the facility and its location details
                  from the map
                </span>
              ) : (
                <span>
                  Are you sure you want to show selected facility's location on
                  the customermap?
                  <br />
                  This will not remove the facility and its location details
                  from the map
                </span>
              )}
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default MapLandingPage;
