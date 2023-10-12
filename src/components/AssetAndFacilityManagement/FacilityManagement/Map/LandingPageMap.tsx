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

function LandingPageMap() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );

  function MyComponent() {
    const map = useMapEvents({
      click: () => {
        map.locate();
      },
      locationfound: (location) => {
        console.log("location found:", location);
        const { lat, lng } = location.latlng;
        setLocation({ lat, lng });
      },
    });
    return null;
  }

  return (
    <div>
      <div className="h-[65vh] w-full">
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
            url={"../../../../src/assets/merlionzootest.png"}
            bounds={bounds}
          />
          <Marker position={[100, -180]}></Marker> {/* Top left */}
          <Marker position={[-10, -180]}></Marker> {/* Bottom left */}
          <Marker position={[-10, 157]}></Marker> {/* Bottom right */}
          <Marker position={[100, 157]}></Marker> {/* Top right */}
          <Marker position={[1.3, 103.773813]}>test</Marker> {/* Utown */}
          <Marker position={[100, 157]}></Marker> {/* Top right */}
          <Marker draggable position={[1.29, 103.7827767]}>
            test
          </Marker>{" "}
          {/* <MyComponent /> */}
        </MapContainer>
      </div>
    </div>
  );
}

export default LandingPageMap;
