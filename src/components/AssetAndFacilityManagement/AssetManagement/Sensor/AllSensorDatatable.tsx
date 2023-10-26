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
import { HiCheck, HiEye, HiPencil, HiPlus, HiTrash, HiX } from "react-icons/hi";

import { Button } from "@/components/ui/button";
import { SensorType } from "../../../../enums/SensorType";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import Hub from "../../../../models/Hub";
import { useAuthContext } from "../../../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

interface AllSensorDatatableProps {
  curHub: Hub,
  refreshSeed: any;
}

function AllSensorDatatable(props: AllSensorDatatableProps) {
  const apiJson = useApiJson();
  const { curHub, refreshSeed } = props;
  const employee = useAuthContext().state.user?.employeeData;

  let emptySensor: Sensor = {
    sensorId: -1,
    sensorName: "",
    dateOfActivation: new Date(),
    dateOfLastMaintained: new Date(),
    sensorType: SensorType.CAMERA,
    hub: curHub,
    sensorReadings: [],
    maintenanceLogs: [],
    generalStaff: []
  };

  const [sensorList, setSensorList] = useState<Sensor[]>(curHub.sensors);
  const [selectedSensor, setSelectedSensor] = useState<Sensor>(emptySensor);
  const [deleteSensorDialog, setDeleteSensorDialog] =
    useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Sensor[]>>(null);
  const toastShadcn = useToast().toast;
  const navigate = useNavigate();

  useEffect(() => {
    setSensorList(curHub.sensors);
  }, [curHub.sensors]);

  const exportCSV = () => {
    dt.current?.exportCSV();
  };


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
        <Button
          // variant={"outline"}
          className="mb-1 mr-1" onClick={() => {
            navigate(`/assetfacility/viewhubdetails/${curHub.hubProcessorId}/sensors`, { replace: true });
            navigate(`/assetfacility/viewsensordetails/${sensor.sensorId}`);
          }}>
          <HiEye className="mx-auto" />
        </Button>
        {/* {(employee.superAdmin || employee.planningStaff?.plannerType == "OPERATIONS_MANAGER") && (
            <Button className="mr-2" onClick={()=>{ 
                navigate(`/assetfacility/viewhubdetails/${curHub.hubProcessorId}/sensors`, { replace: true });
                navigate(`/assetfacility/editsensor/${sensor.sensorId}`);
              }}>
              <HiPencil className="mx-auto" />
            </Button>
        )} */}
        {(employee.superAdmin || employee.planningStaff?.plannerType == "OPERATIONS_MANAGER") && (
          <Button
            variant={"destructive"}
            className="mr-2"
            onClick={() => confirmDeleteSensor(sensor)}
          >
            <HiTrash className="mx-auto" />
          </Button>
        )}
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="m-1">Manage Sensors</h4>
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
      {(employee.superAdmin || employee.planningStaff?.plannerType == "OPERATIONS_MANAGER") && (
        <Button className="mr-2" onClick={() => {
          navigate(`/assetfacility/viewhubdetails/${curHub.hubProcessorId}/sensors`, { replace: true });
          navigate(`/assetfacility/createsensor/${curHub.hubProcessorId}`);
        }}>
          <HiPlus className="mr-auto" />
          Add Sensor
        </Button>
      )}
      <Button onClick={exportCSV}>Export to .csv</Button>
    </div>
  );

  return (
    <div>
      <div>
        <Toast ref={toast} />
        <div className="">

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
            scrollable
            selectionMode={"single"}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} sensors"
            globalFilter={globalFilter}
            header={header}
          >
            <Column
              field="sensorId"
              header="ID"
              sortable
              style={{ minWidth: "4rem" }}
            ></Column>
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
              frozen
              alignFrozen="right"
              exportable={false}
              style={{ minWidth: "12rem" }}
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
