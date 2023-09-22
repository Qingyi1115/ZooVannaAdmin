import React, { useEffect, useState, useRef } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import { ProductService } from './service/ProductService';
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

import Sensor from "../../../../models/Sensor";
import useApiJson from "../../../../hooks/useApiJson";
import { HiCheck, HiEye, HiPencil, HiTrash, HiX } from "react-icons/hi";

import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { SensorType } from "../../../../enums/SensorType";
import { useToast } from "@/components/ui/use-toast";

function AllSensorDatatable() {
  const apiJson = useApiJson();

  let emptySensor: Sensor = {
    sensorId: -1,
    sensorName: "",
    dateOfActivation: new Date(),
    dateOfLastMaintained: new Date(),
    sensorType: SensorType.CAMERA
  };

  const [sensorList, setSensorList] = useState<Sensor[]>([]);
  const [selectedSensor, setSelectedSensor] = useState<Sensor>(emptySensor);
  const [deleteSensorDialog, setDeleteSensorDialog] =
    useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Sensor[]>>(null);
  const toastShadcn = useToast().toast;

  useEffect(() => {
    const fetchSensor = async () => {
      try {
        const responseJson = await apiJson.get(
          "http://localhost:3000/api/assetFacility/getAllSensors"
        );
        console.log(responseJson["sensors"] );
        setSensorList(responseJson["sensors"] as Sensor[]);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchSensor();
  }, []);

  //
  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const rightToolbarTemplate = () => {
    return <Button onClick={exportCSV}>Export to .csv</Button>;
  };

  const navigateEditProduct = (sensor: Sensor) => {};

  const confirmDeleteSensor = (sensor: Sensor) => {
    setSelectedSensor(sensor);
    setDeleteSensorDialog(true);
  };

  const hideDeleteSensorDialog = () => {
    setDeleteSensorDialog(false);
  };

  // delete sensor stuff
  const deleteSensor = async () => {
    let _sensor = sensorList.filter(
      (val) => val.sensorId !== selectedSensor?.sensorId
    );

    const deleteSensor = async () => {
      try {
        const responseJson = await apiJson.del(
          "http://localhost:3000/api/assetFacility/deletesensor/" +
            selectedSensor.sensorId
        );

        toastShadcn({
          // variant: "destructive",
          title: "Deletion Successful",
          description:
            "Successfully deleted sensor: " + selectedSensor.sensorName,
        });
        setSensorList(_sensor);
        setDeleteSensorDialog(false);
        setSelectedSensor(emptySensor);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while deleting sensor: \n" + apiJson.error,
        });
      }
    };
    deleteSensor();
  };

  const deleteSensorDialogFooter = (
    <React.Fragment>
      <Button onClick={hideDeleteSensorDialog}>
        <HiX />
        No
      </Button>
      <Button variant={"destructive"} onClick={deleteSensor}>
        <HiCheck />
        Yes
      </Button>
    </React.Fragment>
  );
  // end delete sensor stuff

  const actionBodyTemplate = (sensor: Sensor) => {
    return (
      <React.Fragment>
        <NavLink to={`/assetFacility/updateSensor/${sensor.sensorName}`}>
          <Button className="mr-2">
            <HiEye className="mr-auto" />
          </Button>
        </NavLink>
        <Button
          variant={"destructive"}
          className="mr-2"
          onClick={() => confirmDeleteSensor(sensor)}
        >
          <HiTrash className="mx-auto" />
        </Button>
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="m-1">Manage Sensor</h4>
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
          <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>

          <DataTable
            ref={dt}
            value={sensorList}
            selection={selectedSensor}
            onSelectionChange={(e) => {
              if (Array.isArray(e.value)) {
                setSelectedSensor(e.value);
              }
            }}
            dataKey="sensorId"
            paginator
            rows={10}
            selectionMode={"single"}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} sensor"
            globalFilter={globalFilter}
            header={header}
          >
            <Column
              field="sensorName"
              header="Name"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="dateOfActivation"
              header="Activation Date"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="dateOfLastMaintained"
              header="Last Maintained"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="sensorType"
              header="Sensor Type"
              sortable
              style={{ minWidth: "16rem" }}
            ></Column>
            <Column
              body={actionBodyTemplate}
              header="Actions"
              exportable={false}
              style={{ minWidth: "18rem" }}
            ></Column>
          </DataTable>
        </div>
      </div>
      <Dialog
        visible={deleteSensorDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteSensorDialogFooter}
        onHide={hideDeleteSensorDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedSensor && (
            <span>
              Are you sure you want to delete{" "}
              <b>{selectedSensor.sensorName}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default AllSensorDatatable;
