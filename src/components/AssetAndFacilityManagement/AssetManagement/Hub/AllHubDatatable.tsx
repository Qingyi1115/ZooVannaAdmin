import React, { useEffect, useState, useRef } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import { ProductService } from './service/ProductService';
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

import Hub from "../../../../models/Hub";
import useApiJson from "../../../../hooks/useApiJson";
import { HiCheck, HiEye, HiPencil, HiPlus, HiTrash, HiX } from "react-icons/hi";

import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { HubStatus } from "../../../../enums/HubStatus";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import Facility from "../../../../models/Facility";
import CreateNewHubPage from "../../../../pages/assetAndFacilityManagement/Hub/CreateNewHubPage";
import CreateNewHubForm from "./CreateNewHubForm";

interface AllHubDatatableProps {
  curFacility: Facility;
  refreshSeed: number;
  setRefreshSeed: React.Dispatch<React.SetStateAction<number>>;
}

function AllHubDatatable(props: AllHubDatatableProps) {
  const apiJson = useApiJson();

  let emptyHub: Hub = {
    hubProcessorId: -1,
    processorName: "",
    ipAddressName: "",
    lastDataUpdate: null,
    hubSecret: "",
    hubStatus: HubStatus.PENDING
  };

  const [hubList, setHubList] = useState<Hub[]>([]);
  const [selectedHub, setSelectedHub] =
    useState<Hub>(emptyHub);
  const [deleteHubDialog, setDeleteHubDialog] =
    useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Hub[]>>(null);
  const toastShadcn = useToast().toast;
  const { curFacility, refreshSeed, setRefreshSeed } = props;

  useEffect(() => {
    const fetchHub = async () => {
      try {
        const responseJson = await apiJson.get(
          "http://localhost:3000/api/assetfacility/getAllHubs"
        );
        setHubList(responseJson["hubs"] as Hub[]);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchHub();
  }, []);

  //
  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const rightToolbarTemplate = () => {
    return <Button onClick={exportCSV}>Export to .csv</Button>;
  };

  const navigateEditProduct = (hub: Hub) => { };

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
        <NavLink to={`/assetfacility/viewhubdetails/${hub.hubProcessorId}`}>
          <Button
            variant={"outline"}
            className="mb-1 mr-1"
            onClick={() => confirmDeleteHub(hub)}>
            <HiEye className="mx-auto" />
          </Button>
        </NavLink>
        <NavLink
          to={`/assetfacility/edithub/${hub.hubProcessorId}`}
        >
          <Button className="mr-2">
            <HiPencil className="mx-auto" />
          </Button>
        </NavLink>
        <Button
          variant={"destructive"}
          className="mr-2"
          onClick={() => confirmDeleteHub(hub)}
        >
          <HiTrash className="mx-auto" />
        </Button>
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
              {/* <Button className="mr-2"
                onClick={() => <CreateNewHubForm curFacility={curFacility} refreshSeed={0} setRefreshSeed={setRefreshSeed} />}>
                <HiPlus className="mr-auto" />
              </Button> */}
              <NavLink to={`/assetfacility/createhub/${curFacility.facilityId}`}>
                <Button className="mr-2">
                  <HiPlus className="mr-auto" />
                </Button>
              </NavLink>
              <span className=" self-center text-title-xl font-bold">
                All Hubs
              </span>
              <Button onClick={exportCSV}>Export to .csv</Button>
            </div>
            <Separator />
          </div>

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
              field="lastDataUpdate"
              header="Last Data Update"
              sortable
              style={{ minWidth: "16rem" }}
            ></Column>
            <Column
              field="hubSecret"
              header="Hub Secret"
              sortable
              style={{ minWidth: "16rem" }}
            ></Column>
            <Column
              field="hubStatus"
              header="Hub Status"
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
