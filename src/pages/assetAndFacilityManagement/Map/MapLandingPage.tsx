import React, { useEffect, useState, useRef } from "react";
import LandingPageMap from "../../../components/AssetAndFacilityManagement/FacilityManagement/Map/LandingPageMap";

import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

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
// import geolocation from "geolocation";

function MapLandingPage() {
  const navigate = useNavigate();

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
          <Card className="w-1/5">
            <CardContent></CardContent>
          </Card>
          <div className="w-full rounded-md border border-stroke shadow-md">
            <LandingPageMap />
          </div>
        </div>
        <div className="h-[60vh] w-[70vw]"></div>
      </div>
    </div>
  );
}

export default MapLandingPage;
