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
import { NavLink, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import FacilityLog from "../../../../../models/FacilityLog";
import Facility from "../../../../../models/Facility";
import InHouse from "../../../../../models/InHouse";
import { FacilityType } from "../../../../../enums/FacilityType";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Card } from "primereact/card";
import { ScrollPanel } from "primereact/scrollpanel";

interface AllFacilityLogsDatatableProps {
  curFacility: Facility;
  curInHouse: InHouse;
}

function AllFacilityLogsDatatable(props: AllFacilityLogsDatatableProps) {
  const apiJson = useApiJson();
  const { curFacility, curInHouse } = props;
  let emptyInHouse: InHouse = {
    isPaid: false,
    lastMaintained: new Date(),
    maxAccommodationSize: 0,
    hasAirCon: false,
    facilityType: FacilityType.AED,
    facilityLogs: []
  };

  let emptyFacility: Facility = {
    facilityId: -1,
    facilityName: "",
    xCoordinate: 0,
    yCoordinate: 0,
    facilityDetail: "",
    facilityDetailJson: emptyInHouse,
    isSheltered: false,
    hubProcessors: []
  };

  let emptyFacilityLog: FacilityLog = {
    logId: 0,
    dateTime: new Date(),
    isMaintenance: false,
    title: "",
    details: "",
    remarks: "",
    facility: emptyFacility
  };

  const [facilityLogList, setFacilityLogList] = useState<FacilityLog[]>([]);
  const [selectedFacilityLog, setSelectedFacilityLog] = useState<FacilityLog>(emptyFacilityLog);
  const [deletefacilityLogDialog, setDeleteFacilityLogDialog] =
    useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<FacilityLog[]>>(null);
  const toastShadcn = useToast().toast;

  useEffect(() => {
    apiJson.get(
      `http://localhost:3000/api/assetfacility/getFacilityLogs/${curFacility.facilityId}`)
      .then(res => { setFacilityLogList(res.facilityLogs as FacilityLog[]); })
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
      (val) => val.logId !== selectedFacilityLog?.logId
    );

    const deleteFacilityLog = async () => {
      try {
        setDeleteFacilityLogDialog(false);
        const responseJson = await apiJson.del(
          "http://localhost:3000/api/assetFacility/deleteFacilityLog/" +
          selectedFacilityLog.logId
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

  const actionBodyTemplate = (facilityLog: FacilityLog) => {
    return (
      <React.Fragment>
        <NavLink to={`/assetfacility/viewfacilityLogdetails/${facilityLog.logId}`}>
          <Button variant={"outline"} className="mb-1 mr-1">
            <HiEye className="mx-auto" />

          </Button>
        </NavLink>
        <NavLink to={`/assetfacility/editfacilityLog/${facilityLog.logId}`}>
          <Button className="mr-1">
            <HiPencil className="mr-1" />

          </Button>
        </NavLink>
        <Button
          variant={"destructive"}
          className="mr-2"
          onClick={() => confirmDeletefacilityLog(facilityLog)}
        >
          <HiTrash className="mx-auto" />

        </Button>
      </React.Fragment>
    );
  };

  //Sort results
  interface SortOption {
    label: string;
    value: string;
  }
  const [sortKey, setSortKey] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<1 | 0 | -1 | undefined | null>(0);
  const [sortField, setSortField] = useState<string>('');
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
    </div>
  );

  const listItem = (facilityLog: FacilityLog) => {
    return (
      <div>
        <Card className="my-4 relative"
          title={facilityLog.title}
          subTitle={"Date created: " + facilityLog.dateTime.toString()}>
          <Button className="absolute top-5 right-5"
            variant={"destructive"}
            onClick={() => confirmDeletefacilityLog(facilityLog)}
          >
            <HiTrash className="mx-auto" />
          </Button>
          <div className="flex flex-col justify-left gap-6 lg:flex-row lg:gap-12">
            <div>
              <div className="text-xl font-bold text-900">Details</div>
              <p>{facilityLog.details}</p>
            </div>
            <Separator orientation="vertical" />
            <div>
              <div className="text-xl font-bold text-900">Remarks</div>
              <p>{facilityLog.remarks}</p>
            </div>
          </div>

        </Card>
      </div>
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
        <div className="rounded-lg bg-white p-4">
          {/* Title Header and back button */}
          <div className="flex flex-col">
            <div className="mb-4 flex justify-between">
              <NavLink to={`/assetfacility/createfacilitylog/${curFacility.facilityId}`}>
                <Button className="mr-2">
                  <HiPlus className="mr-auto" />
                </Button>
              </NavLink>
              <span className=" self-center text-title-xl font-bold">
                All Facility Logs
              </span>
              <Button disabled className="invisible">
                Back
              </Button>
            </div>
            <Separator />
          </div>
          <DataView
            value={facilityLogList}
            itemTemplate={itemTemplate}
            layout="list"
            dataKey="logId"
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
