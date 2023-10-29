import L, {
  CRS,
  LatLng,
  LatLngBounds,
  LatLngBoundsLiteral,
  LatLngExpression,
} from "leaflet";
import React, { useEffect, useState } from "react";

import {
  MapContainer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
  ImageOverlay,
  TileLayer,
} from "react-leaflet";
import Facility from "../../../../models/Facility";

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

// map icons
function iconFunction(selected: boolean, facilityType: string) {
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

  if (selected) {
    return new L.Icon({
      iconUrl,
      iconSize: [50, 51], // Adjust the size as needed
      iconAnchor: [20, 50],
      className: "selected-icon", // Add your custom class
      // Additional selected marker styles
    });
  }

  return new L.Icon({
    iconUrl,
    iconSize: [40, 41], // Adjust the size as needed
    iconAnchor: [15, 40], // Adjust the anchor point as needed
    // Additional selected marker styles
  });
}

interface FacilityWithSelected extends Facility {
  selected: boolean;
}
interface LandingPageMapProps {
  facilityList: FacilityWithSelected[];
  setFacilityList: any;
  selectedFacility: Facility | null;
  setSelectedFacility: any;
  setIsShownOnMap: any;
}

function LandingPageMap(props: LandingPageMapProps) {
  const [curRealLocation, setCurRealLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const {
    facilityList,
    setFacilityList,
    setSelectedFacility,
    setIsShownOnMap,
  } = props;

  function handleMarkerClick(selectedFacility: FacilityWithSelected) {
    const tempFacilityList = facilityList.map((facility) =>
      facility.facilityId === selectedFacility.facilityId
        ? { ...facility, selected: !facility.selected }
        : { ...facility, selected: false }
    );
    setSelectedFacility(selectedFacility);
    setIsShownOnMap(selectedFacility.showOnMap);
    setFacilityList(tempFacilityList);
  }

  return (
    <div>
      <div className="h-[50vh] w-full">
        {/* 
            OLD MAP
        <MapContainer
          center={[0, 0]}
          zoom={3}
          // maxBounds={[
          //   [-21, 28],
          //   [120, -180],
          // ]}
          //   bounds={[]}
          minZoom={1}
          maxZoom={5}
          crs={CRS.Simple}
        >
          <TileLayer
            noWrap={true}
            attribution="Merlion Zoo"
            url={"../../../../src/assets/maps/merlionzootest/{z}/{x}/{y}.png"}
          />
          <Marker position={[yCoord, xCoord]}></Marker>
          {markers.map((position, idx) => (
              <Marker key={`marker-${idx}`} position={position}></Marker>
            ))}
          <MyComponent />
        </MapContainer> */}
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
          {facilityList.map((facility, idx) => (
            <Marker
              key={`marker-${idx}`}
              icon={iconFunction(
                facility.selected,
                facility.facilityDetailJson.facilityType
              )}
              eventHandlers={{
                click: () => handleMarkerClick(facility),
                // mouseover: onHoverMarker,
                // mouseout: onStopHoverMarker,
              }}
              position={[facility.yCoordinate, facility.xCoordinate]}
            ></Marker>
          ))}
          {/* <Marker draggable position={[1.29, 103.7827767]}></Marker>{" "} */}
          {/* <MyComponent /> */}
        </MapContainer>
      </div>
    </div>
  );
}

export default LandingPageMap;
