import React, { useEffect, useState } from "react";
import * as Form from "@radix-ui/react-form";

import { MultiSelectChangeEvent } from "primereact/multiselect";

import useApiJson from "../../../../hooks/useApiJson";
import Facility from "../../../../models/Facility";
import { useToast } from "@/components/ui/use-toast";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  MapContainer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
  ImageOverlay,
  TileLayer,
} from "react-leaflet";
import L, {
  CRS,
  LatLng,
  LatLngBounds,
  LatLngBoundsLiteral,
  LatLngExpression,
} from "leaflet";

interface ChangeFacilityLocationFormProps {
  curFacility: Facility;
}

const merlioncenter: LatLngExpression = [1.295, 103.775887811];
const merliontopleft: LatLng = new LatLng(1.3, 103.766998922);
const merlionbottomright: LatLng = new LatLng(1.29, 103.7847767);
const bounds: LatLngBounds = new LatLngBounds(
  merliontopleft,
  merlionbottomright
);
const backgroundtopleft: LatLng = new LatLng(1.4, 104.766998922);
const backgroundbottomright: LatLng = new LatLng(1.1, 102.7847767);
const backgroundbounds: LatLngBounds = new LatLngBounds(
  backgroundtopleft,
  backgroundbottomright
);

function ChangeFacilityLocationForm(props: ChangeFacilityLocationFormProps) {
  const toastShadcn = useToast().toast;
  const apiJson = useApiJson();
  const navigate = useNavigate();

  const { curFacility } = props;

  const [xCoordinate, setXCoordinate] = useState<number | null>(
    curFacility.xCoordinate
  );
  const [yCoordinate, setYCoordinate] = useState<number | null>(
    curFacility.yCoordinate
  );

  const DummyMapChildren = () => {
    // need dummy child to use event handlers
    const map = useMapEvents({
      click(e) {
        // on click
        setYCoordinate(e.latlng.lat);
        setXCoordinate(e.latlng.lng);
      },
    });

    return null;
  };

  async function handleSubmit() {
    if (!curFacility) {
      return;
    }

    const updatedFacility = {
      facilityName: curFacility.facilityName,
      xCoordinate: xCoordinate,
      yCoordinate: yCoordinate,
      showOnMap: curFacility.showOnMap,
      facilityDetail: curFacility.facilityDetail,
      isSheltered: curFacility.isSheltered,
      facilityDetailJson: curFacility.facilityDetailJson,
    };

    try {
      const responseJson = await apiJson.put(
        `http://localhost:3000/api/assetFacility/updateFacility/${curFacility.facilityId}`,
        updatedFacility
      );
      // success
      toastShadcn({
        description: "Successfully updated facility map location",
      });
      const redirectUrl = `/assetfacility/maplanding`;
      navigate(redirectUrl);
    } catch (error: any) {
      toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "An error has occurred while updating facility location: \n" +
          error.message,
      });
    }
  }

  return (
    <div className="">
      <div className="mb-2 text-xl font-medium">
        {/* <div className="mb-4">Selected First Animal:</div> */}

        <div className="flex h-max w-full rounded-md border border-strokedark/70 p-4">
          <div className="flex w-full flex-col items-center justify-center gap-4 text-lg">
            <div className="font-bold">Location Coordinates:</div>
            <div className="rounded border border-stroke px-8 py-2">
              {xCoordinate && yCoordinate ? (
                <div className="flex w-max gap-8">
                  <span>
                    X-Coordinate: <span>{xCoordinate.toFixed(4)}</span>
                  </span>
                  <span>
                    Y-Coordinate: <span>{yCoordinate.toFixed(4)}</span>
                  </span>
                </div>
              ) : (
                <div className="text-destructive">
                  Click on the map below to select a location
                </div>
              )}
            </div>
            <div>
              <Button
                onClick={handleSubmit}
                disabled={!(curFacility && xCoordinate && yCoordinate)}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Separator className="mx-auto my-8 w-1/2" />
      <div className="flex h-[50vh] w-full gap-10">
        <div className="w-full overflow-hidden rounded-md border border-stroke shadow-md">
          <MapContainer
            center={merlioncenter}
            zoom={16}
            bounds={bounds}
            maxBounds={bounds}
            minZoom={15}
            maxZoom={20}
          >
            <TileLayer
              noWrap={true}
              attribution="Merlion Zoo"
              url={"https://tile.openstreetmap.org/{z}/{x}/{y}.png"}
            />
            <ImageOverlay
              url={"../../../../src/assets/merlionzoogreenbgonly.png"}
              bounds={backgroundbounds}
            />
            <ImageOverlay
              url={"../../../../src/assets/merlionzootest.png"}
              bounds={bounds}
            />
            {yCoordinate && xCoordinate && (
              <Marker position={[yCoordinate, xCoordinate]}></Marker>
            )}
            <DummyMapChildren />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default ChangeFacilityLocationForm;
