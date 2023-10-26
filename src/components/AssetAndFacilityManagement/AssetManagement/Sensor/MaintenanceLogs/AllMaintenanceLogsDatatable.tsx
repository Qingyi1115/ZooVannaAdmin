import React, { useEffect, useState, useRef } from "react";

import { DataView } from "primereact/dataview";
// import { ProductService } from './service/ProductService';
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import useApiJson from "../../../../../hooks/useApiJson";
import { HiCheck, HiEye, HiPencil, HiPlus, HiTrash, HiX } from "react-icons/hi";

import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import MaintenanceLog from "../../../../../models/MaintenanceLog";
import Sensor from "../../../../../models/Sensor";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { useAuthContext } from "../../../../../hooks/useAuthContext";

interface AllMaintenanceLogsDatatableProps {
  sensorId: number;
}

function AllMaintenanceLogsDatatable(props: AllMaintenanceLogsDatatableProps) {
  const apiJson = useApiJson();
  const { sensorId } = props;
  const employee = useAuthContext().state.user?.employeeData;
  const [curSensor, setCurSensor] = useState<any>({});

  useEffect(() => {
    apiJson.post(
      `http://localhost:3000/api/assetFacility/getSensor/${sensorId}`,
      { includes: ["hubProcessor", "maintenanceLogs", "generalStaff"] }).then(res => {
        setCurSensor(res.sensor as Sensor);
        setMaintenanceLogList(res.sensor.maintenanceLogs)
      }).catch(e => console.log(e));
  }, []);

  let emptyMaintenanceLog: MaintenanceLog = {
    maintenanceLogId: 0,
    dateTime: new Date(),
    title: "",
    details: "",
    remarks: "",
    sensor: curSensor,
    staffName: ""
  };

  const [maintenanceLogList, setMaintenanceLogList] = useState<MaintenanceLog[]>(curSensor.maintenanceLogs);
  const [selectedMaintenanceLog, setSelectedMaintenanceLog] = useState<MaintenanceLog>(emptyMaintenanceLog);
  const [deletemaintenanceLogDialog, setDeleteMaintenanceLogDialog] =
    useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<MaintenanceLog[]>>(null);
  const toastShadcn = useToast().toast;
  const navigate = useNavigate();

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const confirmDeletemaintenanceLog = (maintenanceLog: MaintenanceLog) => {
    setSelectedMaintenanceLog(maintenanceLog);
    setDeleteMaintenanceLogDialog(true);
  };

  const hideDeleteMaintenanceLogDialog = () => {
    setDeleteMaintenanceLogDialog(false);
  };

  // delete maintenanceLog stuff
  const deleteMaintenanceLog = async () => {
    let _maintenanceLog = maintenanceLogList.filter(
      (val) => val.maintenanceLogId !== selectedMaintenanceLog?.maintenanceLogId
    );

    const deleteMaintenanceLog = async () => {
      try {
        setDeleteMaintenanceLogDialog(false);
        const responseJson = await apiJson.del(
          "http://localhost:3000/api/assetFacility/deleteSensorMaintenanceLog/" +
          selectedMaintenanceLog.maintenanceLogId
        );

        toastShadcn({
          // variant: "destructive",
          title: "Deletion Successful",
          description:
            "Successfully deleted maintenanceLog: " + selectedMaintenanceLog.title,
        });
        setMaintenanceLogList(_maintenanceLog);
        setSelectedMaintenanceLog(emptyMaintenanceLog);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while deleting maintenanceLog: \n" + apiJson.error,
        });
      }
    };
    deleteMaintenanceLog();
  };

  const deleteMaintenanceLogDialogFooter = (
    <React.Fragment>
      <Button onClick={hideDeleteMaintenanceLogDialog}>
        <HiX />
        No
      </Button>
      <Button variant={"destructive"} onClick={deleteMaintenanceLog}>
        <HiCheck />
        Yes
      </Button>
    </React.Fragment>
  );
  // end delete maintenanceLog stuff

  // const actionBodyTemplate = (maintenanceLog: MaintenanceLog) => {
  //   return (
  //     <React.Fragment>
  //       <NavLink to={`/assetfacility/viewmaintenanceLogdetails/${maintenanceLog.maintenanceLogId}`}>
  //         <Button variant={"outline"} className="mb-1 mr-1">
  //           <HiEye className="mx-auto" />
  //         </Button>
  //       </NavLink>
  //       <NavLink to={`/assetfacility/editmaintenanceLog/${maintenanceLog.maintenanceLogId}`}>
  //         <Button className="mr-1">
  //           <HiPencil className="mr-1" />

  //         </Button>
  //       </NavLink>
  //       <Button
  //         variant={"destructive"}
  //         className="mr-2"
  //         onClick={() => confirmDeletemaintenanceLog(maintenanceLog)}
  //       >
  //         <HiTrash className="mx-auto" />

  //       </Button>
  //     </React.Fragment>
  //   );
  // };

  //Sort results
  interface SortOption {
    label: string;
    value: string;
  }
  const [sortKey, setSortKey] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<1 | 0 | -1 | undefined | null>(-1);
  const [sortField, setSortField] = useState<string>('dateTime');
  const sortOptions: SortOption[] = [
    { label: 'Latest log', value: '!dateTime' },
    { label: 'Earliest log', value: 'dateTime' },
    { label: 'Title (A-Z)', value: 'title' },
    { label: 'Title (Z-A)', value: '!title' }
  ]

  const onSortChange = (event: DropdownChangeEvent) => {
    const value = event.value;

    if (value.indexOf('!') === 0) {
      setSortOrder(-1);
      setSortField(value.substring(1, value.length));
      setSortKey(value);
    } else {
      setSortOrder(1);
      setSortField(value);
      setSortKey(value);
    }
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="m-1">Manage Maintenance Logs</h4>
      <Dropdown
        options={sortOptions}
        value={sortKey}
        optionLabel="label"
        placeholder="Sort By"
        onChange={onSortChange}
      />
      {/* <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          placeholder="Search..."
          onInput={(e) => {
            const target = e.target as HTMLInputElement;
            setGlobalFilter(target.value);
          }}
        />
      </span> */}
      {(employee.superAdmin || employee.planningStaff?.plannerType == "OPERATIONS_MANAGER") && (
        <Button className="mr-2" onClick={() => {
          navigate(`/assetfacility/viewsensordetails/${curSensor.sensorId}/maintenanceLogs`, { replace: true });
          navigate(`/assetfacility/createsensormaintenancelog/${curSensor.sensorId}`);
        }}>
          <HiPlus className="mr-auto" />
          Add Maintenance Log
        </Button>
      )}
    </div>
  );

  const listItem = (maintenanceLog: MaintenanceLog) => {
    return (
      <div>
        <Card className="my-4 relative"
          title={maintenanceLog.title}
          subTitle={<div>
            {maintenanceLog.dateTime ? "Date created: " + new Date(maintenanceLog.dateTime).toLocaleString() : ""}
            <p></p>{maintenanceLog.staffName ? "Created by: " + maintenanceLog.staffName : ""}
          </div>}
        >
          {(employee.superAdmin || employee.planningStaff?.plannerType == "OPERATIONS_MANAGER" || maintenanceLog.staffName == employee.employeeName) &&
            <Button

              className="absolute top-5 right-20"
              onClick={() => navigate(`/assetfacility/editmaintenanceLog/${maintenanceLog.maintenanceLogId}`)}
            >
              <HiPencil className="mx-auto" />
            </Button>}
          {(employee.superAdmin || employee.planningStaff?.plannerType == "OPERATIONS_MANAGER" || maintenanceLog.staffName == employee.employeeName) && <Button
            variant={"destructive"}
            className="absolute top-5 right-5"
            onClick={() => confirmDeletemaintenanceLog(maintenanceLog)}
          >
            <HiTrash className="mx-auto" />
          </Button>}

          <div className="flex flex-col left gap-6 lg:flex-row lg:gap-12">
            <div>
              <div className="text-xl font-bold text-900">Details</div>
              <p>{maintenanceLog.details}</p>
            </div>
            <Separator orientation="vertical" />
            <div>
              <div className="text-xl font-bold text-900">Remarks</div>
              <p>{maintenanceLog.remarks}</p>
            </div>
          </div>

        </Card>
      </div>
    )
  }

  const itemTemplate = (maintenanceLog: MaintenanceLog) => {
    if (!maintenanceLog) {
      return;
    }
    return listItem(maintenanceLog);
  };

  return (
    <div>
      <div>
        <Toast ref={toast} />
        <div className="">

          <DataView
            value={maintenanceLogList}
            itemTemplate={itemTemplate}
            layout="list"
            dataKey="maintenanceLogId"
            header={header}
            sortField={sortField}
            sortOrder={sortOrder}
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} facility logs"
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            paginator
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          />
        </div>
      </div>
      <Dialog
        visible={deletemaintenanceLogDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteMaintenanceLogDialogFooter}
        onHide={hideDeleteMaintenanceLogDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedMaintenanceLog && (
            <span>
              Are you sure you want to delete{" "}
              <b>{selectedMaintenanceLog.title}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default AllMaintenanceLogsDatatable;
