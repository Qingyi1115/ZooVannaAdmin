import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

import useApiJson from "../../../../hooks/useApiJson";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";

import Facility from "../../../../models/Facility";

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

const facilityDetail = "thirdParty";
const facilityDetailJson =
  facilityDetail == "thirdParty"
    ? {
      ownership: "",
      ownerContact: "",
      maxAccommodationSize: "",
      hasAirCon: "",
      facilityType: "",
    }
    : {
      isPaid: "",
      maxAccommodationSize: "",
      hasAirCon: "",
      facilityType: "",
    };

let emptyFacility: Facility = {
  facilityId: -1,
  facilityName: "",
  showOnMap: false,
  xCoordinate: 0,
  yCoordinate: 0,
  facilityDetail: "",
  facilityDetailJson: facilityDetailJson,
  isSheltered: false,
  hubProcessors: [],
  imageUrl: ""
};

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

function AddNewLocationForm() {
  const apiJson = useApiJson();
  const navigate = useNavigate();

  const [facilityList, setFacilityList] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(
    null
  );
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const [xCoordinate, setXCoordinate] = useState<number | null>(null);
  const [yCoordinate, setYCoordinate] = useState<number | null>(null);

  const dt = useRef<DataTable<Facility[]>>(null);
  const toastShadcn = useToast().toast;

  useEffect(() => {
    const fetchNoLocationFacilities = async () => {
      try {
        const responseJson = await apiJson.post(
          "http://localhost:3000/api/assetFacility/getAllFacility",
          { includes: ["facilityDetail"] }
        );
        const facilityListWithoutLocation = (
          responseJson.facilities as Facility[]
        ).filter((facility) => {
          return facility.xCoordinate == null || facility.yCoordinate == null;
        });
        setFacilityList(facilityListWithoutLocation);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchNoLocationFacilities();
  }, []);

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
    if (!selectedFacility) {
      return;
    }

    const updatedFacility = {
      facilityName: selectedFacility.facilityName,
      xCoordinate: xCoordinate,
      yCoordinate: yCoordinate,
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
        description: "Successfully added facility to map",
      });
      const redirectUrl = `/assetfacility/maplanding`;
      navigate(redirectUrl);
    } catch (error: any) {
      toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "An error has occurred while adding new location: \n" + error.message,
      });
    }
  }

  const imageBodyTemplate = (rowData: Facility) => {
    return (
      <img
        src={"http://localhost:3000/" + rowData.imageUrl}
        alt={rowData.facilityName}
        className="aspect-square w-16 rounded-full border border-white object-cover shadow-4"
      />
    );
  };

  return (
    <div>
      <div className="mb-2 text-xl font-medium">
        {/* <div className="mb-4">Selected First Animal:</div> */}

        <div className="flex h-max w-full rounded-md border border-strokedark/70 p-4">
          <div className="flex w-full flex-col items-center justify-center gap-4 text-lg">
            <span className="font-bold">Selected facility: </span>
            <div className="w-max rounded border border-stroke px-8 py-2">
              {selectedFacility ? (
                <div className="">
                  <div className="font-bold text-primary">
                    {selectedFacility.facilityName}
                  </div>
                  {/* <div className="flex flex-col items-start gap-1">
                    <span>{selectedFacility.facilityDetail}</span>
                  </div> */}
                </div>
              ) : (
                <div className="text-destructive">
                  Please select a facility below
                </div>
              )}
            </div>
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
                disabled={!(selectedFacility && xCoordinate && yCoordinate)}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Separator className="mx-auto my-8 w-1/2" />
      <div className="flex h-full w-full gap-10">
        <div className="flex w-1/3 flex-col gap-4">
          <InputText
            type="search"
            placeholder="Search for facility..."
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              setGlobalFilter(target.value);
            }}
          />
          <DataTable
            value={facilityList}
            scrollable
            scrollHeight="100%"
            selection={selectedFacility!}
            selectionMode="single"
            globalFilter={globalFilter}
            onSelectionChange={(e) => setSelectedFacility(e.value)}
            style={{ height: "50vh" }}
            dataKey="facilityId"
            className="h-1/2 overflow-hidden rounded border border-graydark/30"
          >
            <Column
              field="imageUrl"
              header="Image"
              frozen
              body={imageBodyTemplate}
              style={{ minWidth: "6rem" }}
            ></Column>
            <Column
              field="facilityId"
              header="ID"
              sortable
              style={{ minWidth: "7rem" }}
            ></Column>
            <Column
              field="facilityName"
              header="Name"
              sortable
              style={{ minWidth: "5rem" }}
            ></Column>
            {/* <Column
                            body={animalActionBodyTemplate}
                            header="Actions"
                            exportable={false}
                            style={{ minWidth: "3rem" }}
                          ></Column> */}
          </DataTable>
        </div>
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
              <Marker position={[yCoordinate, xCoordinate]}></Marker>
            )}
            <DummyMapChildren />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default AddNewLocationForm;
