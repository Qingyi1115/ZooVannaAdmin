import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { FiPlay } from "react-icons/fi";
import {
  HiBan,
  HiCheck,
  HiEye,
  HiPencil,
  HiPlus,
  HiX
} from "react-icons/hi";
import { NavLink } from "react-router-dom";
import Listing from "src/models/Listing";
import { ListingStatus, ListingType } from "../../enums/Enumurated";
import beautifyText from "../../hooks/beautifyText";
import useApiJson from "../../hooks/useApiJson";

{
  /*const toast = useRef<Toast>(null);*/
}

function AllListingsDatatable() {
  const apiJson = useApiJson();

  let listing: Listing = {
    listingId: -1,
    name: "",
    description: "",
    price: -1,
    listingType: ListingType.LOCAL_ADULT_ONETIME,
    listingStatus: ListingStatus.DISCONTINUED,
    createdAt: new Date(),
    updateTimestamp: new Date(),
  };

  const toast = useRef<Toast>(null);
  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const [listingList, setlistingList] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing>(listing);
  const dt = useRef<DataTable<Listing[]>>(null);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [listingDisableDialog, setlistingDisableDialog] =
    useState<boolean>(false);
  const toastShadcn = useToast().toast;
  const [disable, setDisable] = useState<boolean>();
  let [count, setCount] = useState<number | null>(null);
  const isInitialRender = useRef(true);

  const fetchlistings = async () => {
    try {
      const responseJson = await apiJson.get(
        "http://localhost:3000/api/listing/getAllListings"
      );
      setlistingList(responseJson.result as Listing[]);
      //console.log("Here " + responseJson);
      //const help = responseJson as listing[];
      //console.log(help);
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchlistings();
  }, []);

  const hidelistingDisableDialog = () => {
    setlistingDisableDialog(false);
  };

  const disableListing = () => {
    setDisable(true);
    console.log(disable);
    setCount(count == null ? 0 : (count += 1));
    console.log(count);
  };

  const enableListing = () => {
    setDisable(false);
    console.log("hereee");
    setCount(count == null ? 0 : (count += 1));
    console.log(count);
  };

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    if (disable) {
      console.log(selectedListing);
      apiJson
        .del(
          `http://localhost:3000/api/listing/disableListing/${selectedListing.listingId}`
        )
        .catch((error) =>
          toastShadcn({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description:
              "An error has occurred while disabling listing: \n" + error,
          })
        )
        .then(() => {
          toastShadcn({
            // variant: "destructive",
            title: "Deletion Successful",
            description:
              "Successfully disabled listing: " + selectedListing.name,
          });
          setlistingDisableDialog(false);
          fetchlistings();
        });
    } else {
      console.log(selectedListing);
      apiJson
        .del(
          `http://localhost:3000/api/listing/enableListing/${selectedListing.listingId}`
        )
        .catch((error) =>
          toastShadcn({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description:
              "An error has occurred while enabling listing: \n" + error,
          })
        )
        .then(() => {
          toastShadcn({
            // variant: "destructive",
            title: "Enable Successful",
            description:
              "Successfully enabled listing: " + selectedListing.name,
          });
          fetchlistings();
        });
    }
  }, [count, disable]);

  {
    /*const disableListing = async () => {
    const selectedlistingName = selectedListing.name;
    console.log(selectedListing);

    const disable = async () => {
      try {
        const responseJson = await apiJson.del(
          `http://localhost:3000/api/listing/disableListing/${selectedListing.listingId}`
        );

        toastShadcn({
          // variant: "destructive",
          title: "Deletion Successful",
          description: "Successfully disabled listing: " + selectedlistingName,
        });

        setSelectedListing(listing);
        console.log("here");
        setlistingDisableDialog(false);
        window.location.reload();
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while disabling listing: \n" + apiJson.error,
        });
      }
    };
    disable();
  };*/
  }

  {
    /*const enableListing = async (listing: Listing) => {
    const enable = async () => {
      try {
        console.log(listing);
        const responseJson = await apiJson.del(
          `http://localhost:3000/api/listing/enableListing/${listing.listingId}`
        );

        toastShadcn({
          // variant: "destructive",
          title: "Enable Successful",
          description: "Successfully enabled listing: " + listing.name,
        });
        setSelectedListing(listing);
        window.location.reload();
        console.log(listing);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while enabling listing: \n" + apiJson.error,
        });
      }
    };
    enable();
  };*/
  }

  const listingDisableDialogFooter = (
    <React.Fragment>
      <Button onClick={hidelistingDisableDialog}>
        <HiX />
        No
      </Button>
      <Button variant={"destructive"} onClick={disableListing}>
        <HiCheck />
        Yes
      </Button>
    </React.Fragment>
  );

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="m-1">Manage listings</h4>
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

  const confirmlistingDisable = (listing: Listing) => {
    setSelectedListing(listing);
    setlistingDisableDialog(true);
  };

  const confirmlistingEnable = (listing: Listing) => {
    setSelectedListing(listing);
    enableListing();
  };

  const actionBodyTemplate = (listing: Listing) => {
    return (
      <div className="">
        <NavLink
          to={`/listing/viewlisting/${listing.listingId}`}
          className="mr-1"
        >
          <Button>
            <HiEye />
          </Button>
        </NavLink>
        <NavLink
          to={`/listing/editlisting/${listing.listingId}`}
          className="mr-1"
        >
          <Button>
            <HiPencil />
          </Button>
        </NavLink>
        {listing.listingStatus === "DISCONTINUED" ? (
          <Button onClick={() => confirmlistingEnable(listing)}>
            <FiPlay />
          </Button>
        ) : (
          <Button
            variant={"destructive"}
            onClick={() => confirmlistingDisable(listing)}
          >
            <HiBan className="" />
          </Button>
        )}
      </div>
    );
  };

  return (
    <div>
      <div>
        <Toast ref={toast} />
        <div className="flex flex-col">
          <div className="mb-4 flex justify-between">
            <NavLink to={"/listing/createnewlisting"}>
              <Button className="mr-2">
                <HiPlus className="mr-auto" />
                Add Listing
              </Button>
            </NavLink>
            <Button onClick={exportCSV}>Export to .csv</Button>
          </div>
          <Separator />
        </div>
        <div>
          <DataTable
            ref={dt}
            value={listingList}
            selection={selectedListing}
            onSelectionChange={(e) => {
              if (Array.isArray(e.value)) {
                setSelectedListing(e.value);
              }
            }}
            dataKey="listingId"
            paginator
            rows={10}
            scrollable
            selectionMode={"single"}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} listings"
            globalFilter={globalFilter}
            header={header}
          >
            <Column
              field="name"
              header="Name"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="description"
              header="Description"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="price"
              header="Price"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="listingType"
              header="Listing Type"
              body={(listing: Listing) => beautifyText(listing.listingType)}
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="listingStatus"
              header="Listing Status"
              body={(listing: Listing) => beautifyText(listing.listingStatus)}
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              body={actionBodyTemplate}
              header="Actions"
              exportable={false}
              frozen
              alignFrozen="right"
              style={{ minWidth: "12rem" }}
            ></Column>
          </DataTable>
        </div>
        <Dialog
          visible={listingDisableDialog}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Confirm"
          modal
          footer={listingDisableDialogFooter}
          onHide={hidelistingDisableDialog}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle mr-3"
              style={{ fontSize: "2rem" }}
            />
            {selectedListing && (
              <span>
                Are you sure you want to discontinue{" "}
                <b>{selectedListing.name}</b>?
              </span>
            )}
          </div>
        </Dialog>
      </div>
    </div>
  );
}

export default AllListingsDatatable;
