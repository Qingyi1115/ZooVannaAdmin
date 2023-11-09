import React, { useEffect, useRef, useState } from "react";

import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
// import { ProductService } from './service/ProductService';
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";

import { HiCheck, HiEye, HiPlus, HiTrash, HiX } from "react-icons/hi";
import useApiJson from "../../../../hooks/useApiJson";
import Hub from "../../../../models/HubProcessor";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { HubStatus } from "../../../../enums/HubStatus";
import beautifyText from "../../../../hooks/beautifyText";
import { useAuthContext } from "../../../../hooks/useAuthContext";
import Facility from "../../../../models/Facility";
import HubProcessor from "../../../../models/HubProcessor";

interface AllHubDatatableProps {
  curFacility: Facility;
}

function AllHubDatatable(props: AllHubDatatableProps) {
  const apiJson = useApiJson();
  const employee = useAuthContext().state.user?.employeeData;
  const navigate = useNavigate();

  const { curFacility } = props;
  let emptyHub: Hub = {
    radioGroup: null,
    hubProcessorId: -1,
    processorName: "",
    ipAddressName: "",
    lastDataUpdate: null,
    hubSecret: "",
    hubStatus: HubStatus.PENDING,
    facility: curFacility,
    sensors: []
  };

  const [hubList, setHubList] = useState<Hub[]>(curFacility.hubProcessors);
  const [selectedHub, setSelectedHub] =
    useState<Hub>(emptyHub);
  const [deleteHubDialog, setDeleteHubDialog] =
    useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Hub[]>>(null);
  const toastShadcn = useToast().toast;

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  useEffect(() => {
    setHubList(curFacility.hubProcessors)
  }, [curFacility.hubProcessors]);

  const confirmDeleteHub = (hub: Hub) => {
    setSelectedHub(hub);
    setDeleteHubDialog(true);
  };

  const hideDeleteHubDialog = () => {
    setDeleteHubDialog(false);
  };

  // delete hub stuff
  const deleteHub = async () => {
    let _hub = hubList.filter(
      (val) => val.hubProcessorId !== selectedHub?.hubProcessorId
    );

    const deleteHub = async () => {
      try {
        const responseJson = await apiJson.del(
          "http://localhost:3000/api/assetFacility/deleteHub/" +
          selectedHub.hubProcessorId
        );

        toastShadcn({
          // variant: "destructive",
          title: "Deletion Successful",
          description:
            "Successfully deleted hub: " +
            selectedHub.processorName,
        });
        setHubList(_hub);
        setDeleteHubDialog(false);
        setSelectedHub(emptyHub);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while deleting hub: \n" +
            apiJson.error,
        });
      }
    };
    deleteHub();
  };

  const deleteHubDialogFooter = (
    <React.Fragment>
      <Button onClick={hideDeleteHubDialog}>
        <HiX className="mr-2" />
        No
      </Button>
      <Button variant={"destructive"} onClick={deleteHub}>
        <HiCheck className="mr-2" />
        Yes
      </Button>
    </React.Fragment>
  );
  // end delete hub stuff

  const actionBodyTemplate = (hub: Hub) => {
    return (
      <React.Fragment>
        <Button
          // variant={"outline"}
          className="mb-1 mr-1" onClick={() => {
            navigate(`/assetfacility/viewfacilitydetails/${curFacility.facilityId}/hubs`, { replace: true });
            navigate(`/assetfacility/viewhubdetails/${hub.hubProcessorId}`);
          }}>
          <HiEye className="mx-auto" />
        </Button>
        {/* {(employee.superAdmin || employee.planningStaff?.plannerType == "OPERATIONS_MANAGER") && (

            <Button className="mr-2" onClick={()=>{ 
                navigate(`/assetfacility/viewfacilitydetails/${curFacility.facilityId}/hubs`, { replace: true });
                navigate(`/assetfacility/edithub/${hub.hubProcessorId}`);
              }}>
              <HiPencil className="mx-auto" />
            </Button>

        )} */}
        {(employee.superAdmin || employee.planningStaff?.plannerType == "OPERATIONS_MANAGER") && (
          <Button
            variant={"destructive"}
            className="mr-2"
            onClick={() => confirmDeleteHub(hub)}
          >
            <HiTrash className="mx-auto" />
          </Button>
        )}
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="m-1">Manage Hubs</h4>
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
          navigate(`/assetfacility/viewfacilitydetails/${curFacility.facilityId}/hubs`, { replace: true });
          navigate(`/assetfacility/createhub/${curFacility.facilityId}`);
        }}>
          <HiPlus className="mr-auto" />
          Add Hub
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
            value={hubList}
            selection={selectedHub}
            onSelectionChange={(e) => {
              if (Array.isArray(e.value)) {
                setSelectedHub(e.value);
              }
            }}
            dataKey="hubProcessorId"
            paginator
            rows={10}
            scrollable
            selectionMode={"single"}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} hubs"
            globalFilter={globalFilter}
            header={header}
          >
            <Column
              field="hubProcessorId"
              header="ID"
              sortable
              style={{ minWidth: "4rem" }}
            ></Column>
            <Column
              field="processorName"
              header="Processor Name"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="ipAddressName"
              header="IP Address Name"
              sortable
              style={{ minWidth: "16rem" }}
            ></Column>
            <Column
              field="lastDataUpdateString"
              header="Last Data Update"
              sortable
              style={{ minWidth: "16rem" }}
            ></Column>
            <Column
              field="hubStatus"
              header="Hub Status"
              body={(hubProcessor: HubProcessor) => beautifyText(hubProcessor.hubStatus)}
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
        visible={deleteHubDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteHubDialogFooter}
        onHide={hideDeleteHubDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedHub && (
            <span>
              Are you sure you want to delete{" "}
              <b>{selectedHub.processorName}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default AllHubDatatable;
