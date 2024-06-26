import { useState } from "react";


import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import useApiJson from "../../../../hooks/useApiJson";
import Facility from "../../../../models/Facility";

import L, {
  LatLng,
  LatLngBounds,
  LatLngExpression
} from "leaflet";
import {
  ImageOverlay,
  MapContainer,
  Marker,
  TileLayer,
  useMapEvents
} from "react-leaflet";

interface ChangeFacilityLocationFormProps {
  curFacility: Facility;
}

function iconFunction(facilityType: string) {
  let iconUrl = `../../../../../src/assets/mapicons/1.png`;
  switch (facilityType) {
    case "INFORMATION_CENTRE":
      iconUrl = `../../../../../src/assets/mapicons/1.png`;
      break;
    case "ZOO_DIRECTORY":
      iconUrl = `../../../../../src/assets/mapicons/3.png`;
      break;
    case "AMPHITHEATRE":
      iconUrl = `../../../../../src/assets/mapicons/4.png`;
      break;

    case "GAZEBO":
      iconUrl = `../../../../../src/assets/mapicons/5.png`;
      break;

    case "AED":
      iconUrl = `../../../../../src/assets/mapicons/6.png`;
      break;

    case "RESTROOM":
      iconUrl = `../../../../../src/assets/mapicons/7.png`;
      break;

    case "NURSERY":
      iconUrl = `../../../../../src/assets/mapicons/8.png`;
      break;

    case "FIRST_AID":
      iconUrl = `../../../../../src/assets/mapicons/9.png`;
      break;
    case "BENCHES":
      iconUrl = `../../../../../src/assets/mapicons/10.png`;
      break;
    case "PLAYGROUND":
      iconUrl = `../../../../../src/assets/mapicons/11.png`;
      break;
    case "TRAMSTOP":
      iconUrl = `../../../../../src/assets/mapicons/13.png`;
      break;
    case "PARKING":
      iconUrl = `../../../../../src/assets/mapicons/14.png`;
      break;
    case "RESTAURANT":
      iconUrl = `../../../../../src/assets/mapicons/15.png`;
      break;
    case "SHOP_SOUVENIR":
      iconUrl = `../../../../../src/assets/mapicons/16.png`;
      break;
    default:
      iconUrl = `../../../../../src/assets/mapicons/17.png`;
      break;
  }

  return new L.Icon({
    iconUrl,
    iconSize: [40, 41], // Adjust the size as needed
    iconAnchor: [15, 40], // Adjust the anchor point as needed
    // Additional selected marker styles
  });
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
              url={"../../../../src/assets/realmap.png"}
              bounds={bounds}
            />
            {yCoordinate && xCoordinate && (
              <Marker
                icon={iconFunction(curFacility.facilityDetailJson.facilityType)}
                position={[yCoordinate, xCoordinate]}
              ></Marker>
            )}
            <DummyMapChildren />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default ChangeFacilityLocationForm;
