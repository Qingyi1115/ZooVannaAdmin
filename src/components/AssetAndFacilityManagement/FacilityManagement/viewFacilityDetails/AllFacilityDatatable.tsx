import React, { useEffect, useState, useRef } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import { ProductService } from './service/ProductService';
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

import facility from "src/models/Facility";
import useApiJson from "../../../../hooks/useApiJson";
import { HiCheck, HiEye, HiPencil, HiPlus, HiTrash, HiX } from "react-icons/hi";
import { MdOutlineAssignmentInd } from "react-icons/md";

import { Button } from "@/components/ui/button";
import { NavLink, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import Facility from "../../../../models/Facility";
import { Separator } from "@/components/ui/separator";
import { useAuthContext } from "../../../../hooks/useAuthContext";
import { BsWrenchAdjustable } from "react-icons/bs";

function AllFacilityDatatable() {
  const apiJson = useApiJson();
  const employee = useAuthContext().state.user?.employeeData;
  const { facilityDetail } = useParams<{ facilityDetail: string }>();
  const facilityDetailJson =
    facilityDetail == "thirdParty"
      ? {
        ownership: "",
        ownerContact: "",
        maxAccommodationSize: "",
        hasAirCon: "",
        facilityType: "",
      }
      : {
        isPaid: "",
        maxAccommodationSize: "",
        hasAirCon: "",
        facilityType: "",
      };

  let emptyFacility: Facility = {
    facilityId: -1,
    facilityName: "",
    showOnMap: false,
    xCoordinate: 0,
    yCoordinate: 0,
    facilityDetail: "",
    facilityDetailJson: facilityDetailJson,
    isSheltered: false,
    hubProcessors: [],
    imageUrl: ""
  };

  const [facilityList, setFacilityList] = useState<facility[]>([]);
  const [selectedFacility, setSelectedFacility] =
    useState<facility>(emptyFacility);
  const [deletefacilityDialog, setDeleteFacilityDialog] =
    useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<facility[]>>(null);
  const toastShadcn = useToast().toast;

  useEffect(() => {
    apiJson
      .post("http://localhost:3000/api/assetFacility/getAllFacility", {
        includes: ["facilityDetail"],
      })
      .catch((e) => {
        console.log(e);
      })
      .then((res) => {
        console.log("req", res)
        setFacilityList(res["facilities"].map(facility => {
          facility.opStaffStr = facility.facilityDetailJson.operationStaffs?.map(staff => staff.employee.employeeName).join(", ") || "-"
          facility.manStaffStr = facility.facilityDetailJson.maintenanceStaffs?.map(staff => staff.employee.employeeName).join(", ") || "-"
          return facility;
        }));
      });
  }, []);

  //
  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const confirmDeletefacility = (facility: facility) => {
    setSelectedFacility(facility);
    setDeleteFacilityDialog(true);
  };

  const hideDeleteFacilityDialog = () => {
    setDeleteFacilityDialog(false);
  };

  // delete facility stuff
  const deleteFacility = async () => {
    let _facility = facilityList.filter(
      (val) => val.facilityId !== selectedFacility?.facilityId
    );

    setDeleteFacilityDialog(false);
    const responseJson = await apiJson
      .del(
        "http://localhost:3000/api/assetFacility/deleteFacility/" +
        selectedFacility.facilityId
      )
      .then(() => {
        toastShadcn({
          // variant: "destructive",
          title: "Deletion Successful",
          description:
            "Successfully deleted facility: " + selectedFacility.facilityName,
        });
        setFacilityList(_facility);
        setSelectedFacility(emptyFacility);
      })
      .catch((error) => {
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while deleting facility: \n" + apiJson.error,
        });
      });
  };

  const deleteFacilityDialogFooter = (
    <React.Fragment>
      <Button onClick={hideDeleteFacilityDialog}>
        <HiX />
        No
      </Button>
      <Button
        variant={"destructive"}
        onClick={deleteFacility}
      // disabled={}
      >
        <HiCheck />
        Yes
      </Button>
    </React.Fragment>
  );
  // end delete facility stuff

  const actionBodyTemplate = (facility: Facility) => {
    return (
      <React.Fragment>
        <NavLink
          to={`/assetfacility/viewfacilitydetails/${facility.facilityId}`}
          state={{ prev: `/assetfacility/viewallfacilities` }}
        >
          <Button
            // variant={"outline"}
            className="mb-1 mr-1">
            <HiEye className="mx-auto" />
          </Button>
        </NavLink>
        {(employee.superAdmin ||
          employee.planningStaff?.plannerType == "OPERATIONS_MANAGER") && (
            <NavLink
              to={`/assetfacility/viewfacilitydetails/${facility.facilityId}/manageOperations`}
              state={{ prev: `/assetfacility/viewallfacilities` }}
            >
              <Button variant={"outline"} className="mb-1 mr-1">
                <MdOutlineAssignmentInd className="mx-auto" />
              </Button>
            </NavLink>
          )}
        {/* {(employee.superAdmin ||
          employee.planningStaff?.plannerType == "OPERATIONS_MANAGER") && (
            <NavLink
              to={`/assetfacility/editfacility/${facility.facilityId}`}
              state={{ prev: `/assetfacility/viewallfacilities` }}
            >
              <Button className="mr-1">
                <HiPencil className="mr-1" />
              </Button>
            </NavLink>
          )} */}
        {(employee.superAdmin ||
          employee.planningStaff?.plannerType == "OPERATIONS_MANAGER") && (
            <Button
              variant={"destructive"}
              className="mr-2"
              onClick={() => confirmDeletefacility(facility)}
            >
              <HiTrash className="mx-auto" />
            </Button>
          )}
        {/* {(employee.superAdmin || employee.generalStaff?.generalStaffType == "ZOO_MAINTENANCE") && (
          <NavLink to={`/assetfacility/viewfacilitydetails/${facility.facilityId}/facilityLog`}
            state={{ prev: `/assetfacility/viewallfacilities` }}>
            <Button className="mr-2">
              <BsWrenchAdjustable className="mx-auto" ></BsWrenchAdjustable>
            </Button>
          </NavLink>
        )} */}
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="m-1">Manage Facilities</h4>
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

  const imageBodyTemplate = (rowData: Facility) => {
    return (
      rowData.imageUrl ?
        <img
          src={"http://localhost:3000/" + rowData.imageUrl}
          alt={rowData.facilityName}
          className="aspect-square w-16 rounded-full border border-white object-cover shadow-4"
        /> :
        "-"
    );
  };

  return (
    <div>
      <div>
        <Toast ref={toast} />
        <div className="rounded-lg bg-white p-4">
          {/* Title Header and back button */}
          <div className="flex flex-col">
            <div className="mb-4 flex justify-between">
              {employee.superAdmin ||
                employee.planningStaff?.plannerType == "OPERATIONS_MANAGER" ? (
                <NavLink to={"/assetfacility/createfacility"}>
                  <Button className="mr-2">
                    <HiPlus className="mr-auto" />
                    Add Facility
                  </Button>
                </NavLink>
              ) : (
                <Button disabled className="invisible">
                  Export to .csv
                </Button>
              )}
              <span className=" self-center text-title-xl font-bold">
                All Facilities
              </span>
              <Button onClick={exportCSV}>Export to .csv</Button>
            </div>
            <Separator />
          </div>

          <DataTable
            ref={dt}
            value={facilityList}
            selection={selectedFacility}
            onSelectionChange={(e) => {
              if (Array.isArray(e.value)) {
                setSelectedFacility(e.value);
              }
            }}
            dataKey="facilityId"
            paginator
            rows={10}
            scrollable
            selectionMode={"single"}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} facilities"
            globalFilter={globalFilter}
            header={header}
          >
            <Column
              field="imageUrl"
              header="Image"
              frozen
              body={imageBodyTemplate}
              style={{ minWidth: "6rem" }}
            ></Column>
            <Column
              field="facilityId"
              header="ID"
              sortable
              style={{ minWidth: "4rem" }}
            ></Column>
            <Column
              field="facilityName"
              header="Name"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="facilityDetail"
              header="Owner Type"
              body={(facility) => {
                return facility.facilityDetail == "thirdParty" ?
                  "Third-party" : "In-house"
              }}
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="isSheltered"
              header="Shelter available"
              body={(facility) => {
                return facility.isSheltered ? "Yes" : "No"
              }}
              sortable
              style={{ minWidth: "12rem" }
              }
            ></Column>
            <Column
              field="opStaffStr"
              header="Operation Staff"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="manStaffStr"
              header="Maintenance Staff"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              body={actionBodyTemplate}
              header="Actions"
              frozen
              alignFrozen="right"
              exportable={false}
              style={{ minWidth: "15rem" }}
            ></Column>
          </DataTable>
        </div>
      </div>
      <Dialog
        visible={deletefacilityDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteFacilityDialogFooter}
        onHide={hideDeleteFacilityDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedFacility && (
            <span>
              Are you sure you want to delete{" "}
              <b>{selectedFacility.facilityName}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default AllFacilityDatatable;
