import { DataTable } from "primereact/datatable";
import React, { useEffect, useRef, useState } from "react";
// import { ProductService } from './service/ProductService';
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { HiCheck, HiEye, HiPlus, HiTrash, HiX } from "react-icons/hi";
import useApiJson from "../../hooks/useApiJson";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Column } from "primereact/column";
import { DropdownChangeEvent } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";
import beautifyText from "../../hooks/beautifyText";
import { useAuthContext } from "../../hooks/useAuthContext";
import PublicEventSession from "../../models/PublicEventSession";

interface AllPublicEventSessionDatatableProps {
  publicEventId: string;
  setRefreshSeed: Function;
}

function AllPublicEventSessionDatatable(props: AllPublicEventSessionDatatableProps) {
  const apiJson = useApiJson();
  const { publicEventId, setRefreshSeed } = props;
  const [animalActivitySearch, setAnimalActivitySearch] =
    useState<boolean>();
  const employee = useAuthContext().state.user?.employeeData;


  const [publicEventSessionList, setPublicEventSessionList] = useState<PublicEventSession[]>([]);
  const [setPublicEventSession, setSelectedPublicEventSession] = useState<PublicEventSession>();
  const [deletepublicEventSessionDialog, setDeleteAnimalActivityLogDialog] =
    useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<PublicEventSession[]>>(null);
  const toastShadcn = useToast().toast;
  const navigate = useNavigate();
  const [innerRefresh, setInnerRefresh] = useState<any[]>([]);

  useEffect(() => {
    apiJson.get(
      `http://localhost:3000/api/zooEvent/getPublicEventById/${publicEventId}`)
      .then(res => {
        console.log("AllPublicEventSessionDatatable", res.publicEvent.publicEventSessions);
        setPublicEventSessionList(res.publicEvent.publicEventSessions);
      })
      .catch(e => console.log(e));

  }, [publicEventId, innerRefresh]);


  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const confirmDeleteAnimalActivityLog = (publicEventSession: PublicEventSession) => {
    setSelectedPublicEventSession(publicEventSession);
    setDeleteAnimalActivityLogDialog(true);
  };

  const hideDeleteAnimalActivityLogDialog = () => {
    setDeleteAnimalActivityLogDialog(false);
  };

  // delete publicEventSession stuff
  const deleteAnimalActivityLog = async () => {
    let _publicEventSession = publicEventSessionList.filter(
      (val) => val.publicEventSessionId !== setPublicEventSession?.publicEventSessionId
    );

    const deleteAnimalActivityLogWrapper = async () => {
      try {
        setDeleteAnimalActivityLogDialog(false);
        const responseJson = await apiJson.del(
          "http://localhost:3000/api/zooEvent/deletePublicEventSessionById/" +
          setPublicEventSession?.publicEventSessionId
        );

        toastShadcn({
          // variant: "destructive",
          title: "Deletion Successful",
          description:
            "Successfully deleted public event session: " + setPublicEventSession?.publicEventSessionId,
        });
        // setAnimalActivityLogList(_publicEventSession);
        // setSelectedPublicEventSession(emptyAnimalActivityLog);
        setRefreshSeed({});
        setInnerRefresh([]);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while deleting public event session: \n" + apiJson.error,
        });
      }
    };
    deleteAnimalActivityLogWrapper();
  };

  const deleteAnimalActivityLogDialogFooter = (
    <React.Fragment>
      <Button onClick={hideDeleteAnimalActivityLogDialog}>
        <HiX />
        No
      </Button>
      <Button variant={"destructive"} onClick={deleteAnimalActivityLog}>
        <HiCheck />
        Yes
      </Button>
    </React.Fragment>

  );
  // end delete publicEventSession stuff

  const actionBodyTemplate = (publicEventSession: PublicEventSession) => {
    return (
      <React.Fragment>
        <div>
          <Button
            // variant={"outline"}
            className="mb-1 mr-1"
            onClick={() => {
              navigate(`/zooevent/viewpubliceventdetails/${publicEventId}/publicEventSessions`, { replace: true })
              navigate(`/zooevent/viewpubliceventsessiondetails/${publicEventSession.publicEventSessionId}`)
            }}>
            <HiEye className="mx-auto" />
          </Button> <Button
            variant={"destructive"}
            className="mr-2"
            onClick={() => confirmDeleteAnimalActivityLog(publicEventSession)}
          >
            <HiTrash className="mx-auto" />
          </Button>

        </div>


      </React.Fragment>
    );
  };

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
    { label: 'Earliest log', value: 'dateTime' }
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

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-row justify-center gap-6 lg:flex-row lg:gap-12">
        <h4 className="m-1">Manage Sessions</h4>
        {/* <Dropdown
          options={sortOptions}
          value={sortKey}
          optionLabel="label"
          placeholder="Sort By"
          onChange={onSortChange}
        /> */}
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
        {(((employee.superAdmin || employee.planningStaff?.plannerType == "CURATOR" ||
          employee.keeper)) &&
          <Button className="mr-2"
            onClick={() => {
              navigate(`/zooevent/viewpubliceventdetails/${publicEventId}/publicEventSessions`, { replace: true })
              navigate(`/zooevent/createpubliceventsession/${publicEventId}`)
            }}>
            <HiPlus className="mr-auto" />
            Add Session
          </Button>
        )}
        <Button onClick={exportCSV}>Export to .csv</Button>
      </div>
    </div>
  );

  return (
    <div>
      <div>
        <Toast ref={toast} />
        <div className="">

          <DataTable
            ref={dt}
            value={publicEventSessionList}
            selection={setPublicEventSession}
            onSelectionChange={(e) => {
              if (Array.isArray(e.value)) {
                setSelectedPublicEventSession(e.value);
              }
            }}
            dataKey="publicEventSessionId"
            paginator
            rows={10}
            scrollable
            selectionMode={"single"}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} public event sessions"
            globalFilter={globalFilter}
            header={header}
          >
            <Column
              field="publicEventSessionId"
              header="ID"
              sortable
              style={{ minWidth: "4rem" }}
            ></Column>
            <Column
              body={(publicEventSession) => {
                return beautifyText(publicEventSession.recurringPattern)
              }}
              header="Target Day"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              body={(publicEventSession) => {
                switch (publicEventSession.recurringPattern) {
                  case "WEEKLY":
                    return beautifyText(publicEventSession.dayOfWeek); break;
                  case "MONTHLY":
                    return beautifyText(publicEventSession.dayOfMonth); break;
                  default:
                    return "Nil";
                }
              }}
              header="Repeat frequency"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="durationInMinutes"
              header="Duration In Minutes"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="time"
              header="Time"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            {/* <Column
              field="animals.houseName"
              header="Animals"
              sortable
              style={{ display: "none" }}
              filter
              filterPlaceholder="Search by animal code"
            ></Column>
            <Column
              // body={(publicEventSession) => {
              //   return publicEventSession.keeper.employeeId;
              // }}
              field="keeper.employee.employeeName"
              header="Keeper"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column> */}
            <Column
              body={actionBodyTemplate}
              header="Actions"
              frozen
              alignFrozen="right"
              exportable={false}
              style={{ minWidth: "12rem" }}
            ></Column>
          </DataTable>
          {/* <DataView
            value={publicEventSessionList}
            itemTemplate={itemTemplate}
            layout="list"
            dataKey="animalTrainingLogId"
            header={header}
            sortField={sortField}
            sortOrder={sortOrder}
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} public event sessions"
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            paginator
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          /> */}
        </div>
      </div>
      <Dialog
        visible={deletepublicEventSessionDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteAnimalActivityLogDialogFooter}
        onHide={hideDeleteAnimalActivityLogDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {setPublicEventSession && (
            <span>
              Are you sure you want to delete{" "}
              <b>{setPublicEventSession.publicEventSessionId}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default AllPublicEventSessionDatatable;
