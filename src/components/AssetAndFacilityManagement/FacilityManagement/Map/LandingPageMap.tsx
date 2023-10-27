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
function iconFunction(facilityType: string) {
  console.log("facil type icon: " + facilityType);
  switch (facilityType) {
    case "INFORMATION_CENTRE":
      return new L.Icon({
        iconUrl: `../../../../../src/assets/mapicons/1.png`,
        iconSize: [40, 41 ],
        iconAnchor: [15, 40],
      });
    case "ZOO_DIRECTORY":
      return new L.Icon({
        iconUrl: `../../../../../src/assets/mapicons/3.png`,
        iconSize: [40, 41 ],
        iconAnchor: [15, 40],
      });
    case "AMPHITHEATRE":
      return new L.Icon({
        iconUrl: `../../../../../src/assets/mapicons/4.png`,
        iconSize: [40, 41 ],
        iconAnchor: [15, 40],
      });
    case "GAZEBO":
      return new L.Icon({
        iconUrl: `../../../../../src/assets/mapicons/5.png`,
        iconSize: [40, 41 ],
        iconAnchor: [15, 40],
      });
    case "AED":
      return new L.Icon({
        iconUrl: `../../../../../src/assets/mapicons/6.png`,
        iconSize: [40, 41 ],
        iconAnchor: [15, 40],
      });
    case "RESTROOM":
      return new L.Icon({
        iconUrl: `../../../../../src/assets/mapicons/7.png`,
        iconSize: [40, 41 ],
        iconAnchor: [15, 40],
      });
    case "NURSERY":
      return new L.Icon({
        iconUrl: `../../../../../src/assets/mapicons/8.png`,
        iconSize: [40, 41 ],
        iconAnchor: [15, 40],
      });
    case "FIRST_AID":
      return new L.Icon({
        iconUrl: `../../../../../src/assets/mapicons/9.png`,
        iconSize: [40, 41 ],
        iconAnchor: [15, 40],
      });
    case "BENCHES":
      return new L.Icon({
        iconUrl: `../../../../../src/assets/mapicons/10.png`,
        iconSize: [40, 41 ],
        iconAnchor: [15, 40],
      });
    case "PLAYGROUND":
      return new L.Icon({
        iconUrl: `../../../../../src/assets/mapicons/11.png`,
        iconSize: [40, 41 ],
        iconAnchor: [15, 40],
      });
    case "TRAMSTOP":
      return new L.Icon({
        iconUrl: `../../../../../src/assets/mapicons/13.png`,
        iconSize: [40, 41 ],
        iconAnchor: [15, 40],
      });
    case "PARKING":
      return new L.Icon({
        iconUrl: `../../../../../src/assets/mapicons/14.png`,
        iconSize: [40, 41 ],
        iconAnchor: [15, 40],
      });
    case "RESTAURANT":
      return new L.Icon({
        iconUrl: `../../../../../src/assets/mapicons/15.png`,
        iconSize: [40, 41 ],
        iconAnchor: [15, 40],
      });
    case "SHOP_SOUVENIR":
      return new L.Icon({
        iconUrl: `../../../../../src/assets/mapicons/16.png`,
        iconSize: [40, 41 ],
        iconAnchor: [15, 40],
      });
    default:
      return new L.Icon({
        iconUrl: `../../../../../src/assets/mapicons/17.png`,
        iconSize: [40, 41 ],
        iconAnchor: [15, 40],
      });
  }
  // return new L.Icon({
  //   iconUrl: "../../../../src/assets/mapicons/parking.png",
  //   iconSize: [31, 40],
  //   iconAnchor: [15, 40],
  // });
}

interface LandingPageMapProps {
  facilityList: Facility[];
  selectedFacility: Facility | null;
  setSelectedFacility: any;
  setIsShownOnMap: any;
}

function LandingPageMap(props: LandingPageMapProps) {
  const [curRealLocation, setCurRealLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const { facilityList, setSelectedFacility, setIsShownOnMap } = props;

  function handleMarkerClick(facility: Facility) {
    setSelectedFacility(facility);
    setIsShownOnMap(facility.showOnMap);
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
              icon={iconFunction(facility.facilityDetailJson.facilityType)}
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
