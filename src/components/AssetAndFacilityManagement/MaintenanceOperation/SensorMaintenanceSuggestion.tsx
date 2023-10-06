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
import { HiCheck, HiEye, HiOutlinePresentationChartLine, HiPencil, HiTrash, HiX } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { SensorType } from "../../../enums/SensorType";
import { Separator } from "@/components/ui/separator";
import { Tag } from "primereact/tag";

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

function SensorMaintenanceSuggestion() {
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
      "http://localhost:3000/api/assetFacility/getSensorMaintenanceSuggestions"
    ).catch(error => {
    }).then(responseJson => {
      let sortedList = responseJson["sensors"].sort((a: any, b: any) => {
        if (!a.predictedMaintenanceDate) return 1;
        if (!b.predictedMaintenanceDate) return -1;
        return compareDates(new Date(a.predictedMaintenanceDate), new Date(b.predictedMaintenanceDate))
      });
      setSensorList(sortedList);
    });
  }, []);

  useEffect(() => {
    let obj: any = []
    sensorList.forEach((sensor: any) => {
      obj.push({
        name: sensor.sensorName,
        description: "Sensor " + (sensor.sensorType as string).toLocaleLowerCase(),
        lastMaintenance: new Date(sensor.dateOfLastMaintained).toLocaleString(),
        suggestedMaintenance: sensor.predictedMaintenanceDate ?
          new Date(sensor.predictedMaintenanceDate).toString() : "No suggested date",
        type: "Sensor",
        id: sensor.sensorId
      })
    })
    setObjectsList(obj)
  }, [facilityList, sensorList]);

  const actionBodyTemplate = (objDetails: MaintenanceDetails) => {
    return (
      <React.Fragment>
        <NavLink to={`/assetfacility/viewsensordetails/${objDetails.id}`}>
          <Button variant="outline" className="mb-1 mr-1">
            <HiEye className="mx-auto" />
          </Button>
        </NavLink>
        <NavLink to={`/assetfacility/viewSensorMaintenanceChart/${objDetails.id}`}>
          <Button className="mb-1 mr-1">
            <HiOutlinePresentationChartLine className="mx-auto" />
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

  const exportCSV = () => {
    dt.current?.exportCSV();
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
      <Button onClick={exportCSV}>Export to .csv</Button>
    </div>
  );

  const statusBodyTemplate = (rowData: any) => {
    return <Tag value={isNaN(Date.parse(rowData.suggestedMaintenance)) ? rowData.suggestedMaintenance : new Date(rowData.suggestedMaintenance).toLocaleString()}
      severity={isNaN(Date.parse(rowData.suggestedMaintenance)) ? "info" :
        (compareDates(new Date(rowData.suggestedMaintenance), new Date()) <= -1000 * 60 * 60 * 24 * 3) ? "danger"
          : (compareDates(new Date(rowData.suggestedMaintenance), new Date()) <= 0) ? "warning" : "success"} />;
  };

  return (
    <div>
      <div>
        <Toast ref={toast} />
        <div className="">
          <DataTable
            ref={dt}
            value={objectsList}
            selection={selectedObject}
            onSelectionChange={(e) => {
              if (Array.isArray(e.value)) {
                setSelectedObject(e.value);
              }
            }}
            dataKey="id"
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
              style={{ minWidth: "4rem" }}
            ></Column>
            <Column
              field="description"
              header="Description"
              sortable
              style={{ minWidth: "10rem" }}
            ></Column>
            <Column
              field="lastMaintenance"
              header="Last Maintained"
              sortable
              style={{ minWidth: "13rem" }}
            ></Column>
            <Column
              field="suggestedMaintenance"
              header="Suggested Date of Maintenance"
              sortable
              body={statusBodyTemplate}
              style={{ minWidth: "13rem" }}
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

export default SensorMaintenanceSuggestion;
