import React, { useEffect, useState, useRef } from "react";
import { DataView } from 'primereact/dataview';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import { ProductService } from './service/ProductService';
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import useApiJson from "../../../../../hooks/useApiJson";
import { HiCheck, HiEye, HiPencil, HiPlus, HiTrash, HiX } from "react-icons/hi";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import FacilityLog from "../../../../../models/FacilityLog";
import Facility from "../../../../../models/Facility";
import InHouse from "../../../../../models/InHouse";
import { FacilityType } from "../../../../../enums/FacilityType";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Card } from "primereact/card";
import { ScrollPanel } from "primereact/scrollpanel";
import { useAuthContext } from "../../../../../hooks/useAuthContext";
import { FacilityLogType } from "../../../../../enums/FacilityLogType";
import { BsWrenchAdjustable } from "react-icons/bs";

interface AllFacilityLogsDatatableProps {
  facilityId: number;
}

function AllFacilityLogsDatatable(props: AllFacilityLogsDatatableProps) {
  const apiJson = useApiJson();
  const { facilityId } = props;
  const employee = useAuthContext().state.user?.employeeData;


  let emptyFacility: Facility = {
    facilityId: -1,
    facilityName: "",
    xCoordinate: 0,
    yCoordinate: 0,
    facilityDetail: "",
    facilityDetailJson: "",
    isSheltered: false,
    hubProcessors: [],
    showOnMap: false
  };

  let emptyInHouse: InHouse = {
    isPaid: false,
    lastMaintained: new Date(),
    maxAccommodationSize: 0,
    hasAirCon: false,
    facilityType: FacilityType.AED,
    facilityLogs: [],
    facility: {} as any
  };

  let emptyFacilityLog: FacilityLog = {
    facilityLogId: 0,
    dateTime: new Date(),
    isMaintenance: false,
    title: "",
    details: "",
    remarks: "",
    inHouse: emptyInHouse,
    staffName: "",
    facilityLogType: FacilityLogType.OPERATION_LOG,
    generalStaffs: []
  };

  const [facilityLogList, setFacilityLogList] = useState<FacilityLog[]>([]);
  const [selectedFacilityLog, setSelectedFacilityLog] = useState<FacilityLog>(emptyFacilityLog);
  const [deletefacilityLogDialog, setDeleteFacilityLogDialog] =
    useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<FacilityLog[]>>(null);
  const toastShadcn = useToast().toast;
  const navigate = useNavigate();

  useEffect(() => {
    apiJson.get(
      `http://localhost:3000/api/assetfacility/getFacilityLogs/${facilityId}`)
      .then(res => {
        setFacilityLogList(res.facilityLogs as FacilityLog[]);
      })
      .catch(e => console.log(e));
  }, []);

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const confirmDeletefacilityLog = (facilityLog: FacilityLog) => {
    setSelectedFacilityLog(facilityLog);
    setDeleteFacilityLogDialog(true);
  };

  const hideDeleteFacilityLogDialog = () => {
    setDeleteFacilityLogDialog(false);
  };

  // delete facilityLog stuff
  const deleteFacilityLog = async () => {
    let _facilityLog = facilityLogList.filter(
      (val) => val.facilityLogId !== selectedFacilityLog?.facilityLogId
    );

    const deleteFacilityLog = async () => {
      try {
        setDeleteFacilityLogDialog(false);
        const responseJson = await apiJson.del(
          `http://localhost:3000/api/assetFacility/deleteFacilityLog/${selectedFacilityLog.facilityLogId}`
        );

        toastShadcn({
          // variant: "destructive",
          title: "Deletion Successful",
          description:
            "Successfully deleted facilityLog: " + selectedFacilityLog.title,
        });
        setFacilityLogList(_facilityLog);
        setSelectedFacilityLog(emptyFacilityLog);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while deleting facilityLog: \n" + apiJson.error,
        });
      }
    };
    deleteFacilityLog();
  };

  const deleteFacilityLogDialogFooter = (
    <React.Fragment>
      <Button onClick={hideDeleteFacilityLogDialog}>
        <HiX />
        No
      </Button>
      <Button variant={"destructive"} onClick={deleteFacilityLog}>
        <HiCheck />
        Yes
      </Button>
    </React.Fragment>

  );
  // end delete facilityLog stuff

  // const actionBodyTemplate = (facilityLog: FacilityLog) => {
  //   return (
  //     <React.Fragment>
  //       <NavLink to={`/assetfacility/viewfacilityLogdetails/${facilityLog.facilityLogId}`} >
  //         <Button variant={"outline"} className="mb-1 mr-1">
  //           <HiEye className="mx-auto" />

  //         </Button>
  //       </NavLink>
  //       <NavLink to={`/assetfacility/editfacilityLog/${facilityLog.facilityLogId}`}>
  //         <Button className="mr-1">
  //           <HiPencil className="mr-1" />

  //         </Button>
  //       </NavLink>
  //       <Button
  //         variant={"destructive"}
  //         className="mr-2"
  //         onClick={() => confirmDeletefacilityLog(facilityLog)}
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
      <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
        <h4 className="m-1">Manage Facility Logs</h4>
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
        {((employee.superAdmin || employee.planningStaff?.plannerType == "OPERATIONS_MANAGER" ||
          employee.generalStaff?.generalStaffType == "ZOO_MAINTENANCE") &&
          <Button className="mr-2"
            onClick={() => {
              navigate(`/assetfacility/viewfacilitydetails/${facilityId}/facilityLog`, { replace: true })
              navigate(`/assetfacility/createfacilitylog/${facilityId}/MAINTENANCE_LOG`)
            }}
          >
            <HiPlus className="mr-auto" />
            Create Maintenance Log
          </Button>
        )}
        {(employee.superAdmin || employee.generalStaff?.generalStaffType == "ZOO_OPERATIONS") && (
          <Button
            onClick={() => {
              navigate(`/assetfacility/viewfacilitydetails/${facilityId}/facilityLog`, { replace: true })
              navigate(`/assetfacility/createfacilitylog/${facilityId}/OPERATION_LOG`)
            }}
            className="mr-2">
            <BsWrenchAdjustable className="mx-auto" ></BsWrenchAdjustable>
            Create Operations Log
          </Button>
        )}
      </div>
    </div>
  );

  const listItem = (facilityLog: FacilityLog) => {
    console.log(facilityLog)

    return (
      <div>
        <Card
          // className="my-4 relative"
          className={(facilityLog.generalStaffs.find(generalStaff => generalStaff.employee?.employeeId == employee.employeeId)) && facilityLog.facilityLogType == FacilityLogType.ACTIVE_REPAIR_TICKET ? "my-4 relative bg-red-100 border-stroke" : "my-4 relative"}
          title={facilityLog.title}
          subTitle={<div>
            {facilityLog.dateTime ? "Date created: " + new Date(facilityLog.dateTime).toLocaleString() : ""}
            <p></p>{facilityLog.staffName ? "Created by: " + facilityLog.staffName : ""}
            <p></p>{facilityLog.facilityLogType == FacilityLogType.ACTIVE_REPAIR_TICKET && facilityLog.generalStaffs
              ? "Assigned to: " + facilityLog.generalStaffs.map((generalStaff) => " " + generalStaff.employee?.employeeName).toString() : ""}
          </div>

          }>
          {(employee.superAdmin || employee.planningStaff?.plannerType == "OPERATIONS_MANAGER" || facilityLog.staffName == employee.employeeName) &&
            <Button
              className="absolute top-5 right-35"
              onClick={() => {
                navigate(`/assetfacility/viewfacilitydetails/${facilityId}/facilityLog`, { replace: true })
                navigate(`/assetfacility/editfacilityLog/${facilityLog.facilityLogId}`)
              }}
            >
              <HiPencil className="mx-auto" />
            </Button>}
          {((employee.superAdmin || employee.planningStaff?.plannerType == "OPERATIONS_MANAGER" || facilityLog.staffName == employee.employeeName) &&
            <Button className="absolute top-5 right-20"
              variant={"destructive"}
              onClick={() => confirmDeletefacilityLog(facilityLog)}
            >
              <HiTrash className="mx-auto" />
            </Button>
          )}
          {(employee.superAdmin || (facilityLog.generalStaffs.find(generalStaff => generalStaff.employee?.employeeId == employee.employeeId))) && facilityLog.facilityLogType == FacilityLogType.ACTIVE_REPAIR_TICKET &&
            (
              <Button
                onClick={() => {
                  navigate(`/assetfacility/viewfacilitydetails/${facilityId}/facilityLog`, { replace: true })
                  navigate(`/assetfacility/completeFacilityRepair/${facilityLog.facilityLogId}`)
                }}
                className="absolute top-5 right-5">
                <BsWrenchAdjustable className="mx-auto" ></BsWrenchAdjustable>
              </Button>
            )}

          <div className="flex flex-col justify-left gap-6 lg:flex-row lg:gap-12">
            <div>
              <div className="text-xl font-bold text-900 indent-px">Details</div>
              <p>{facilityLog.details}</p>
            </div>
            <Separator orientation="vertical" />
            <div>
              <div className="text-xl font-bold text-900 indent-px">Remarks</div>
              <p>{facilityLog.remarks}</p>
            </div>
            <div>
              <div className="text-xl font-bold text-900 indent-px">Log Type </div>
              {facilityLog.facilityLogType}
            </div>
          </div>

        </Card>
      </div >
    )
  }

  const itemTemplate = (facilityLog: FacilityLog) => {
    if (!facilityLog) {
      return;
    }
    return listItem(facilityLog);
  };

  return (
    <div>
      <div>
        <Toast ref={toast} />
        <div className="">

          <DataView
            value={facilityLogList}
            itemTemplate={itemTemplate}
            layout="list"
            dataKey="facilityLogId"
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
        visible={deletefacilityLogDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteFacilityLogDialogFooter}
        onHide={hideDeleteFacilityLogDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedFacilityLog && (
            <span>
              Are you sure you want to delete{" "}
              <b>{selectedFacilityLog.title}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default AllFacilityLogsDatatable;
