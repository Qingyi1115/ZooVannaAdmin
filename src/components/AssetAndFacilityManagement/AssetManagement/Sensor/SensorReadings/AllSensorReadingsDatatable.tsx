import React, { useEffect, useState, useRef } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import { ProductService } from './service/ProductService';
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

import SensorReading from "../../../../../models/SensorReading";
import useApiJson from "../../../../../hooks/useApiJson";
import { HiCheck, HiEye, HiPencil, HiPlus, HiTrash, HiX } from "react-icons/hi";

import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import Hub from "../../../../../models/Hub";
import Sensor from "../../../../../models/Sensor";

interface AllSensorReadingDatatableProps {
  curSensor: Sensor,
}

function AllSensorReadingDatatable(props: AllSensorReadingDatatableProps) {
  const apiJson = useApiJson();
  const { curSensor } = props;
  let emptySensorReading: SensorReading = {
    readingDate: new Date(),
    value: 0,
    sensor: curSensor
  };

  const [sensorReadingList, setSensorReadingList] = useState<SensorReading[]>(curSensor.sensorReadings);
  const [selectedSensorReading, setSelectedSensorReading] = useState<SensorReading>(emptySensorReading);
  const [deleteSensorReadingDialog, setDeleteSensorReadingDialog] =
    useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<SensorReading[]>>(null);
  const toastShadcn = useToast().toast;


  // View all sensorReading
  // useEffect(() => {
  //   const fetchSensorReading = async () => {
  //     try {
  //       const responseJson = await apiJson.get(
  //         "http://localhost:3000/api/assetFacility/getAllSensorReadings"
  //       );
  //       console.log(responseJson["sensorReading"]);
  //       setSensorReadingList(responseJson["sensorReading"] as SensorReading[]);
  //     } catch (error: any) {
  //       console.log(error);
  //     }
  //   };
  //   fetchSensorReading();
  // }, []);

  const exportCSV = () => {
    dt.current?.exportCSV();
  };



  const confirmDeleteSensorReading = (sensorReading: SensorReading) => {
    setSelectedSensorReading(sensorReading);
    setDeleteSensorReadingDialog(true);
  };

  const hideDeleteSensorReadingDialog = () => {
    setDeleteSensorReadingDialog(false);
  };

  // delete sensorReading stuff
  const deleteSensorReading = async () => {
    let _sensorReading = sensorReadingList.filter(
      (val) => val.readingDate !== selectedSensorReading?.readingDate
    );

    const deleteSensorReading = async () => {
      try {
        const responseJson = await apiJson.del(
          "http://localhost:3000/api/assetFacility/deletesensorReading/" +
          selectedSensorReading.readingDate
        );

        toastShadcn({
          // variant: "destructive",
          title: "Deletion Successful",
          description:
            "Successfully deleted sensor reading: " + selectedSensorReading.readingDate,
        });
        setSensorReadingList(_sensorReading);
        setDeleteSensorReadingDialog(false);
        setSelectedSensorReading(emptySensorReading);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while deleting sensor reading: \n" + apiJson.error,
        });
      }
    };
    deleteSensorReading();
  };

  const deleteSensorReadingDialogFooter = (
    <React.Fragment>
      <Button onClick={hideDeleteSensorReadingDialog}>
        <HiX />
        No
      </Button>
      <Button variant={"destructive"} onClick={deleteSensorReading}>
        <HiCheck />
        Yes
      </Button>
    </React.Fragment>
  );
  // end delete sensorReading stuff

  const actionBodyTemplate = (sensorReading: SensorReading) => {
    return (
      <React.Fragment>
        <Button
          variant={"destructive"}
          className="mr-2"
          onClick={() => confirmDeleteSensorReading(sensorReading)}
        >
          <HiTrash className="mx-auto" />
        </Button>
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="m-1">Manage Sensor Readings</h4>
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
          {/* Title Header and back button */}
          <div className="flex flex-col">
            <div className="mb-4 flex justify-between">
              <Button disabled className="invisible">
                Back
              </Button>
              <span className=" self-center text-title-xl font-bold">
                All Sensor Readings
              </span>
              <Button onClick={exportCSV}>Export to .csv</Button>
            </div>
            <Separator />
          </div>

          <DataTable
            ref={dt}
            value={sensorReadingList}
            selection={selectedSensorReading}
            onSelectionChange={(e) => {
              if (Array.isArray(e.value)) {
                setSelectedSensorReading(e.value);
              }
            }}
            dataKey="readingDate"
            paginator
            rows={10}
            scrollable
            selectionMode={"single"}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} sensor readings"
            globalFilter={globalFilter}
            header={header}
          >
            <Column
              field="readingDate"
              header="Reading Date"
              sortable
              style={{ minWidth: "4rem" }}
            ></Column>
            <Column
              field="value"
              header="Value"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              body={actionBodyTemplate}
              header="Actions"
              frozen
              alignFrozen="right"
              exportable={false}
              style={{ minWidth: "5rem" }}
            ></Column>
          </DataTable>
        </div>
      </div>
      <Dialog
        visible={deleteSensorReadingDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteSensorReadingDialogFooter}
        onHide={hideDeleteSensorReadingDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedSensorReading && (
            <span>
              Are you sure you want to delete{" "}
              <b>{String(selectedSensorReading.readingDate)}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default AllSensorReadingDatatable;
