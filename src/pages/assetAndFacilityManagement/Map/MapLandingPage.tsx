import React, { useEffect, useRef, useState } from "react";
import LandingPageMap from "../../../components/AssetAndFacilityManagement/FacilityManagement/Map/LandingPageMap";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { NavLink, useNavigate } from "react-router-dom";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import {
  HiCheck,
  HiInformationCircle,
  HiX
} from "react-icons/hi";
import { HiMapPin } from "react-icons/hi2";
import { FacilityType } from "../../../enums/FacilityType";
import beautifyText from "../../../hooks/beautifyText";
import useApiJson from "../../../hooks/useApiJson";
import Facility from "../../../models/Facility";
// import geolocation from "geolocation";

let emptyFacility: FacilityWithSelected = {
  facilityId: -1,
  facilityName: "",
  inHouse: {
    lastMaintained: new Date(),
    isPaid: false,
    maxAccommodationSize: 0,
    hasAirCon: false,
    facilityType: FacilityType.AMPHITHEATRE,
    facilityLogs: [],
  },
  showOnMap: false,
  xCoordinate: 0,
  yCoordinate: 0,
  facilityDetail: "",
  facilityDetailJson: "",
  isSheltered: false,
  hubProcessors: [],
  selected: false,
  imageUrl: ""
};
interface FacilityWithSelected extends Facility {
  selected: boolean;
}

function MapLandingPage() {
  const navigate = useNavigate();
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;

  const [facilityList, setFacilityList] = useState<FacilityWithSelected[]>([]);
  const [selectedFacility, setSelectedFacility] =
    useState<FacilityWithSelected>(emptyFacility);
  const [refreshSeed, setRefreshSeed] = useState<number>(0);

  const [deleteLocationFromMapDialog, setDeleteLocationFromMapDialog] =
    useState<boolean>(false);

  const [isShownOnMap, setIsShownOnMap] = useState<boolean>(false);

  const [filteredFacilityList, setFilteredFacilityList] = useState<
    FacilityWithSelected[]
  >([]);
  const [facilityTypeFilterValue, setFacilityTypeFilterValue] = useState<
    string | null
  >(null);
  const [isShownOnMapFilterValue, setIsShownOnMapFilterValue] = useState<
    string | null
  >(null);

  useEffect(() => {
    const fetchNoLocationFacilities = async () => {
      try {
        const responseJson = await apiJson.post(
          "http://localhost:3000/api/assetFacility/getAllFacility",
          { includes: ["facilityDetail"] }
        );

        const responseJson2 = await apiJson.get(
          "http://localhost:3000/api/enclosure/getAllEnclosures"
        ).then(res => {
          return res.map(enclosure => {
            return {
              ...enclosure.facility,
              facilityDetail: "enclosure",
              facilityDetailJson: { ...enclosure, facility: undefined },
            };
          });
        });

        console.log(responseJson2, responseJson.facilities)


        const facilityListWithLocation = (
          responseJson.facilities as FacilityWithSelected[]
        )
          .concat(
            responseJson2 as FacilityWithSelected[]
          )
          .filter((facility) => {
            // console.log(facility);
            return !(
              facility.xCoordinate == null || facility.yCoordinate == null
            );
          })
          .map((facility) => ({
            ...facility,
            selected: false,
          }));
        setFacilityList(facilityListWithLocation);
        setFilteredFacilityList(facilityListWithLocation);
        if (selectedFacility) {
          const updatedFacility = facilityListWithLocation.find(
            (facility) => facility.facilityId === selectedFacility.facilityId
          );
          if (updatedFacility) setSelectedFacility(updatedFacility);
        }
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchNoLocationFacilities();
  }, [refreshSeed]);

  function handleFacilTypeFilterMap(value: string) {
    const tempFacilityList = [...facilityList].filter((facility) => {
      // console.log(
      //   "facil type: " +
      //     FacilityType[
      //       facility.facilityDetailJson
      //         .facilityType as keyof typeof FacilityType
      //     ].toString()
      // );
      // console.log("facil filter value: " + value);
      if (value == "All") {
        return true;
      } else {
        return (
          // FacilityType[
          //   facility.facilityDetailJson
          //     .facilityType as keyof typeof FacilityType
          // ].toString() == value
          facility.facilityDetailJson.facilityType == value
        );
      }
    });

    setFilteredFacilityList(tempFacilityList);
  }

  function handleCustMapVisibilityFilterMap(value: string) {
    const tempFacilityList = [...facilityList].filter((facility) => {
      if (value == "All") {
        return true;
      } else {
        return facility.showOnMap.toString() == value;
      }
    });

    setFilteredFacilityList(tempFacilityList);
  }

  function clearMapFilters() {
    setIsShownOnMapFilterValue("All");
    setFacilityTypeFilterValue("All");
    setFilteredFacilityList(facilityList);
  }

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
      setSelectedFacility(emptyFacility);
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

  // Datatable stuff

  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [tableSelectedFacility, setTableSelectedFacility] =
    useState<FacilityWithSelected>(emptyFacility);

  const dt = useRef<DataTable<FacilityWithSelected[]>>(null);

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="m-1">All Facilities</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          placeholder="Search..."
          onInput={(e) => {
            const target = e.target as HTMLInputElement;
            setGlobalFilter(target.value);
          }}
        />
      </span>
    </div>
  );

  const actionBodyTemplate = (facility: FacilityWithSelected) => {
    return (
      <React.Fragment>
        <div className="flex flex-col gap-2">
          <Button
            // variant={"outline"}
            onClick={() => {
              handleMarkerClick(facility);
            }}
            className="mr-1"
          >
            <HiMapPin className="mr-1" />
          </Button>
          <NavLink
            to={`/assetfacility/viewfacilitydetails/${facility.facilityId}`}
            state={{ prev: `/assetfacility/maplanding` }}
          >
            <Button variant={"outline"} className="mb-1 mr-1">
              <HiInformationCircle className="mx-auto" />
            </Button>
          </NavLink>
        </div>
      </React.Fragment>
    );
  };

  function handleMarkerClick(selectedFacility: FacilityWithSelected) {
    const tempFacilityList = facilityList.map((facility) =>
      facility.facilityId === selectedFacility.facilityId
        ? { ...facility, selected: !facility.selected }
        : { ...facility, selected: false }
    );
    setSelectedFacility(selectedFacility);
    setIsShownOnMap(selectedFacility.showOnMap);
    setFilteredFacilityList(tempFacilityList);
  }

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
        <Card className="flex h-[15vh] items-center">
          <CardContent className="flex h-full w-full items-center justify-between pb-0">
            <div className="">
              {selectedFacility.facilityId == -1 ? (
                <div className="text-center">No facility selected</div>
              ) : (
                <div className="flex gap-12 text-start text-base">
                  <div className="flex flex-col ">
                    <div className="text-xl font-medium">
                      {selectedFacility.facilityName}
                    </div>
                    <div className="text-base">
                      Type:{" "}
                      {
                        FacilityType[
                        selectedFacility.facilityDetailJson
                          .facilityType as keyof typeof FacilityType
                        ]
                      }
                    </div>
                  </div>
                  <div>
                    Current Coordinates:
                    <div>
                      X:{" "}
                      <span className="font-medium">
                        {selectedFacility.xCoordinate.toFixed(4)}
                      </span>
                    </div>
                    <div>
                      Y:{" "}
                      <span className="font-medium">
                        {selectedFacility.yCoordinate.toFixed(4)}
                      </span>
                    </div>
                  </div>
                  <div>
                    Show on map:{" "}
                    <div className="font-medium">
                      {selectedFacility.showOnMap ? (
                        <span className="text-primary">Yes</span>
                      ) : (
                        <span className="text-destructive">No</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-8">
              <div className="flex items-center text-lg">
                Show on customer map:
                <Switch
                  disabled={selectedFacility.facilityId == -1}
                  className="ml-2"
                  checked={isShownOnMap}
                  onCheckedChange={(checked) =>
                    handleOnCheckedChangeShowOnMap(checked)
                  }
                />
              </div>

              <div className="flex flex-col gap-4">
                <Button
                  className="w-full"
                  disabled={selectedFacility.facilityId == -1}
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
                  disabled={selectedFacility.facilityId == -1}
                  variant={"destructive"}
                  onClick={() => confirmDeleteLocationFromMap()}
                >
                  Remove From Map
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex gap-8">
          <Card className="h-[50vh]">
            <DataTable
              ref={dt}
              value={filteredFacilityList}
              selection={selectedFacility}
              onSelectionChange={(e) => {
                if (Array.isArray(e.value)) {
                  handleMarkerClick(e.value);
                }
              }}
              dataKey="facilityId"
              // paginator
              rows={10}
              scrollable
              scrollHeight="100%"
              selectionMode={"single"}
              // rowsPerPageOptions={[5, 10, 25]}
              // paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
              // currentPageReportTemplate="Showing {first} to {last} of {totalRecords} facilities"
              globalFilter={globalFilter}
              header={header}
              style={{ width: "25vw", height: "100%" }}
            >
              <Column
                field="facilityId"
                header="ID"
                sortable
                style={{ minWidth: "4rem" }}
              ></Column>
              <Column
                field="facilityName"
                header="Name"
                sortable
                style={{ minWidth: "12rem" }}
              ></Column>
              <Column
                field="facilityDetail"
                header="Owner Type"
                body={(facility) => {
                  return facility.facilityDetail == "thirdParty" ? "Third-party" :
                    facility.facilityDetail == "inHouse" ? "In-House" :
                      beautifyText(facility.facilityDetail);
                }}
                sortable
                style={{ minWidth: "12rem" }}
              ></Column>
              <Column
                field="isSheltered"
                header="Shelter Available"
                body={(facility) => {
                  return facility.isSheltered ? "Yes" : "No";
                }}
                sortable
                style={{ minWidth: "12rem" }}
              ></Column>
              <Column
                body={actionBodyTemplate}
                header="Actions"
                frozen
                alignFrozen="right"
                exportable={false}
              ></Column>
            </DataTable>
          </Card>

          <div className="w-full space-y-4">
            <div className="flex h-[5vh] items-center gap-4">
              <div>Filters: </div>
              {/* Facility Type Filter */}
              <Select
                value={facilityTypeFilterValue?.toString()}
                onValueChange={(value) => {
                  setFacilityTypeFilterValue(value);
                  handleFacilTypeFilterMap(value);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Facility type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup className="h-64" id="facilityTypeFilterSelect">
                    <SelectLabel>Facility Type</SelectLabel>
                    <SelectItem key={"all"} value="All">
                      All
                    </SelectItem>
                    {Object.keys(FacilityType).map((facilityTypeKey) => (
                      <SelectItem key={facilityTypeKey} value={facilityTypeKey}>
                        {FacilityType[
                          facilityTypeKey as keyof typeof FacilityType
                        ].toString()}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {/* Facility Type Filter */}
              <Select
                value={isShownOnMapFilterValue?.toString()}
                onValueChange={(value) => {
                  setIsShownOnMapFilterValue(value);
                  handleCustMapVisibilityFilterMap(value);
                }}
              >
                <SelectTrigger className="w-56">
                  <SelectValue placeholder="Customer map visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup id="shownOnMapFilterSelect">
                    <SelectLabel>Is Shown on Customer Map</SelectLabel>
                    <SelectItem key={"all"} value="All">
                      All
                    </SelectItem>
                    <SelectItem key={"true"} value="true">
                      Only Yes
                    </SelectItem>
                    <SelectItem key={"false"} value="false">
                      Only No
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button onClick={clearMapFilters}>Clear Filter</Button>
            </div>
            <div className="w-full overflow-hidden rounded-md border border-stroke shadow-md">
              <LandingPageMap
                facilityList={filteredFacilityList}
                setFacilityList={setFilteredFacilityList}
                selectedFacility={selectedFacility}
                setSelectedFacility={setSelectedFacility}
                setIsShownOnMap={setIsShownOnMap}
              />
            </div>

            {/* <Card>
              <DataTable
                ref={dt}
                value={filteredFacilityList}
                selection={selectedFacility}
                onSelectionChange={(e) => {
                  if (Array.isArray(e.value)) {
                    handleMarkerClick(e.value);
                  }
                }}
                dataKey="facilityId"
                paginator
                rows={10}
                scrollable
                selectionMode={"single"}
                rowsPerPageOptions={[5, 10, 25]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} facilities"
                globalFilter={globalFilter}
                header={header}
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
                  style={{ minWidth: "4rem" }}
                ></Column>
                <Column
                  field="facilityName"
                  header="Name"
                  sortable
                  style={{ minWidth: "12rem" }}
                ></Column>
                <Column
                  field="facilityDetail"
                  header="Owner Type"
                  sortable
                  style={{ minWidth: "12rem" }}
                ></Column>
                <Column
                  field="isSheltered"
                  header="Shelter Available"
                  sortable
                  style={{ minWidth: "12rem" }}
                ></Column>
                <Column
                  body={actionBodyTemplate}
                  header="Actions"
                  frozen
                  alignFrozen="right"
                  exportable={false}
                ></Column>
              </DataTable>
            </Card> */}
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
