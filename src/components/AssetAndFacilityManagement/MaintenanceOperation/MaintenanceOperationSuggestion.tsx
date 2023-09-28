import React, { useEffect, useState, useRef } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import { ProductService } from './service/ProductService';
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

import Sensor from "../../../models/Sensor";
import useApiJson from "../../../hooks/useApiJson";
import { HiCheck, HiEye, HiPencil, HiTrash, HiX } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { SensorType } from "../../../enums/SensorType";

export function compareDates(d1: Date, d2: Date): number {
  let date1 = d1.getTime();
  let date2 = d2.getTime();
  return date1 - date2;
};

interface MaintenanceDetails {
  name: string,
  description: string,
  lastMaintenance: string,
  suggestedMaintenance: string,
  type: string,
  id: number
}

function MaintenanceOperationSuggestion() {
  const apiJson = useApiJson();

  const [objectsList, setObjectsList] = useState<MaintenanceDetails[]>([]);
  const [sensorList, setSensorList] = useState<any[]>([]);
  const [facilityList, setFacilityList] = useState<any[]>([]);
  const [selectedObject, setSelectedObject] = useState<MaintenanceDetails>({ name: "", description: "", lastMaintenance: "", suggestedMaintenance: "", type: "", id: -1 });
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<MaintenanceDetails[]>>(null);

  useEffect(() => {
    apiJson.get(
      "http://localhost:3000/api/assetFacility/getFacilityMaintenanceSuggestions"
    ).catch(error => {
      console.log(error);
    }).then(responseJson => {
      let facility = responseJson["facilities"]
      console.log("facilities before", facility)
      facility.filter((f: any) => {
        f.predictedMaintenanceDate && (compareDates(new Date(f.predictedMaintenanceDate), new Date()) <= 0)
      });
      setFacilityList(facility);
      console.log("facilities aft", facility)
    }).then(() => {
      apiJson.get(
        "http://localhost:3000/api/assetFacility/getSensorMaintenanceSuggestions"
      ).catch(error => {
        console.log(error);
      }).then(responseJson => {
        let sensors = responseJson["sensors"]
        console.log("sensors before", sensors)
        sensors.filter((sensor: any) => {
          sensor.predictedMaintenanceDate && (compareDates(new Date(sensor.predictedMaintenanceDate), new Date()) <= 0)
        });
        setSensorList(sensors);
        console.log("sensors aft", sensors)
      });
    });
  }, []);

  useEffect(() => {
    let obj: any = []
    sensorList.forEach((sensor: any) => {
      obj.push({
        name: sensor.sensorName,
        description: "Sensor " + (sensor.sensorType as string).toLocaleLowerCase(),
        lastMaintenance: new Date(sensor.dateOfLastMaintained).toLocaleString(),
        suggestedMaintenance: new Date(sensor.predictedMaintenanceDate).toLocaleString(),
        type: "Sensor",
        id: sensor.sensorId
      })
    })
    facilityList.forEach((facility: any) => {
      obj.push({
        name: facility.facilityName,
        description: (facility.isSheltered ? "Sheltered " : "Unsheltered ") + (facility.facilityDetail as string).toLocaleLowerCase(),
        lastMaintenance: new Date(facility.facilityDetailJson["lastMaintained"]).toLocaleString(),
        suggestedMaintenance: new Date(facility.predictedMaintenanceDate).toLocaleString(),
        type: "Facility",
        id: facility.facilityId
      })
    })
    setObjectsList(obj)
    console.log("dates", new Date().toLocaleString(), "dates", new Date().toDateString(), "dates", new Date().toLocaleDateString(), "dates", new Date())
  }, [facilityList, sensorList]);

  const actionBodyTemplate = (objDetails: MaintenanceDetails) => {
    return (
      <React.Fragment>
        <NavLink to={objDetails.type == "Sensor" ? `/assetfacility/editsensor/${objDetails.id}` : `/assetfacility/editsensor/${objDetails.id}`}>
          <Button className="mb-1 mr-1">
            <HiEye className="mx-auto" />
            <span>View Details</span>
          </Button>
        </NavLink>
        <NavLink to={objDetails.type == "Sensor" ? `/assetfacility/editsensor/${objDetails.id}` : `/assetfacility/editsensor/${objDetails.id}`}>
          <Button className="mb-1 mr-1">
            <HiPencil className="mr-1" />
            <span>Edit</span>
          </Button>
        </NavLink>
        {/* <Button
          variant={"destructive"}
          className="mr-2"
          onClick={() => confirmDeleteSpecies(species)}
        >
          <HiTrash className="mx-auto" />
          <span>Delete</span>
        </Button> */}
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="m-1">Manage Sensor Maintenance</h4>
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

  return (
    <div>
      <div>
        <Toast ref={toast} />
        <div className="rounded-lg bg-white p-4">
          <DataTable
            ref={dt}
            value={objectsList}
            selection={selectedObject}
            onSelectionChange={(e) => {
              if (Array.isArray(e.value)) {
                setSelectedObject(e.value);
              }
            }}
            dataKey="objectId"
            paginator
            rows={10}
            scrollable
            selectionMode={"single"}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} sensors"
            globalFilter={globalFilter}
            header={header}
          >
            <Column
              field="name"
              header="Name"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="description"
              header="Description"
              sortable
              style={{ minWidth: "16rem" }}
            ></Column>
            <Column
              field="lastMaintenance"
              header="Last Maintained"
              sortable
              style={{ minWidth: "16rem" }}
            ></Column>
            <Column
              field="suggestedMaintenance"
              header="Suggested Date of Maintenance"
              sortable
              style={{ minWidth: "16rem" }}
            ></Column>
            <Column
              body={actionBodyTemplate}
              header="Actions"
              frozen
              alignFrozen="right"
              exportable={false}
              style={{ minWidth: "9rem" }}
            ></Column>
          </DataTable>
        </div>
      </div>
      {/* <Dialog
        visible={deleteSensorDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteSensorDialogFooter}
        onHide={hideDeleteSensorDialog}
      > */}
      {/* <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          /> */}
      {/* {selectedSensor && (
            <span>
              Are you sure you want to delete{" "}
              <b>{selectedSensor.sensorName}</b>?
            </span>
          )} */}
      {/* </div> */}
      {/* </Dialog> */}
    </div>
  );
}

export default MaintenanceOperationSuggestion;
