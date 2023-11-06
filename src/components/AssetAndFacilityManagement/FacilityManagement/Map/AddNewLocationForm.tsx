import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

import useApiJson from "../../../../hooks/useApiJson";

import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";

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
      iconUrl = `../../../../../src/assets/mapicons/new.png`;
      break;
  }

  return new L.Icon({
    iconUrl,
    iconSize: [40, 41], // Adjust the size as needed
    iconAnchor: [15, 40], // Adjust the anchor point as needed
    // Additional selected marker styles
  });
}

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

  return (
    <div>
      <div className="mb-2 text-xl font-medium">
        {/* <div className="mb-4">Selected First Animal:</div> */}

        <div className="mb-4 flex h-max w-full rounded-md border border-strokedark/20 p-2">
          <div className="flex w-full items-center justify-center gap-4 text-lg">
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
      {/* <Separator className="mx-auto my-8 w-1/2" /> */}
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
              <Marker
                icon={iconFunction(
                  selectedFacility
                    ? selectedFacility.facilityDetailJson.facilityType
                    : ""
                )}
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

export default AddNewLocationForm;
