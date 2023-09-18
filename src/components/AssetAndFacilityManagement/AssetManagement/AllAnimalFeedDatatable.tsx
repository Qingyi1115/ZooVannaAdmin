import React, { useEffect, useState, useRef } from "react";

import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import { ProductService } from './service/ProductService';
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import { Rating } from "primereact/rating";
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import { InputNumber, InputNumberChangeEvent } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";

import Asset from "../../../models/Asset";
import useApiJson from "../../../hooks/useApiJson";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { HiCheck, HiPencil, HiTrash, HiX } from "react-icons/hi";

import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";

function AllAssetDatatable() {
  const apiJson = useApiJson();

  let emptyAsset: Asset = {
    assetId: -1,
    assetCode: "",
    commonName: "",
    scientificName: "",
    aliasName: "",
    conservationStatus: "",
    domain: "",
    kingdom: "",
    phylum: "",
    assetClass: "",
    order: "",
    family: "",
    genus: "",
    nativeContinent: "",
    nativeBiomes: "",
    educationalDescription: "",
    groupSexualDynamic: "",
    habitatOrExhibit: "habitat",
    imageUrl: "",
    generalDietPreference: "",
  };

  const [assetList, setAssetList] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset>(emptyAsset);
  const [deleteAssetDialog, setDeleteAssetDialog] =
    useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Asset[]>>(null);

  useEffect(() => {
    apiJson.get("http://localhost:3000/api/asset/getallasset");
  }, []);

  useEffect(() => {
    const assetData = apiJson.result as Asset[];
    setAssetList(assetData);
  }, [apiJson.loading]);

  //
  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const rightToolbarTemplate = () => {
    return <Button onClick={exportCSV}>Export to .csv</Button>;
  };

  const imageBodyTemplate = (rowData: Asset) => {
    return (
      <img
        src={rowData.imageUrl}
        alt={rowData.commonName}
        className="border-round shadow-2"
        style={{ width: "64px" }}
      />
    );
  };

  const navigateEditProduct = (asset: Asset) => {};

  const confirmDeleteAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setDeleteAssetDialog(true);
  };

  const hideDeleteAssetDialog = () => {
    setDeleteAssetDialog(false);
  };

  // delete asset stuff
  const deleteAsset = () => {
    let _asset = assetList.filter(
      (val) => val.assetId !== selectedAsset?.assetId
    );

    setAssetList(_asset);
    setDeleteAssetDialog(false);
    setSelectedAsset(emptyAsset);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "Asset Deleted",
      life: 3000,
    });
  };

  const deleteAssetDialogFooter = (
    <React.Fragment>
      <Button onClick={hideDeleteAssetDialog}>
        <HiX />
        No
      </Button>
      <Button variant={"destructive"} onClick={deleteAsset}>
        <HiCheck />
        Yes
      </Button>
    </React.Fragment>
  );
  // end delete asset stuff

  const actionBodyTemplate = (asset: Asset) => {
    return (
      <React.Fragment>
        <NavLink to={`/asset/editasset/${asset.assetCode}`}>
          <Button className="mr-2">
            <HiPencil />
            <span>Edit</span>
          </Button>
        </NavLink>
        <Button
          variant={"destructive"}
          className="mr-2"
          onClick={() => confirmDeleteAsset(asset)}
        >
          <HiTrash />
          <span>Delete</span>
        </Button>
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="m-1">Manage Asset</h4>
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
            value={assetList}
            selection={selectedAsset}
            onSelectionChange={(e) => {
              if (Array.isArray(e.value)) {
                setSelectedAsset(e.value);
              }
            }}
            dataKey="assetId"
            paginator
            rows={10}
            selectionMode={"single"}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} asset"
            globalFilter={globalFilter}
            header={header}
          >
            <Column
              field="assetCode"
              header="Code"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="imageUrl"
              header="Image"
              body={imageBodyTemplate}
            ></Column>
            <Column
              field="commonName"
              header="Common Name"
              sortable
              style={{ minWidth: "16rem" }}
            ></Column>
            <Column
              field="generalDietPreference"
              header="General Diet Preference"
              sortable
              style={{ minWidth: "10rem" }}
            ></Column>
            <Column
              field="conservationStatus"
              header="Conservation Status"
              sortable
              style={{ minWidth: "16rem" }}
            ></Column>
            <Column
              field="aliasName"
              header="Alias Name"
              sortable
              style={{ minWidth: "16rem" }}
            ></Column>

            <Column
              field="scientificName"
              header="Scientific Name"
              sortable
              style={{ minWidth: "16rem" }}
            ></Column>
            <Column
              field="domain"
              header="Domain"
              sortable
              style={{ minWidth: "10rem" }}
            ></Column>
            <Column
              field="kingdom"
              header="Kingdom"
              sortable
              style={{ minWidth: "10rem" }}
            ></Column>
            <Column
              field="phylum"
              header="Phylum"
              sortable
              style={{ minWidth: "10rem" }}
            ></Column>
            <Column
              field="assetClass"
              header="Class"
              style={{ minWidth: "10rem" }}
            ></Column>
            <Column
              field="order"
              header="Order"
              style={{ minWidth: "10rem" }}
            ></Column>
            <Column
              field="family"
              header="Family"
              style={{ minWidth: "10rem" }}
            ></Column>
            <Column
              field="genus"
              header="Genus"
              style={{ minWidth: "10rem" }}
            ></Column>
            <Column
              field="nativeContinent"
              header="Native Continent"
              sortable
              style={{ minWidth: "10rem" }}
            ></Column>
            <Column
              field="nativeBiomes"
              header="Native Biomes"
              sortable
              style={{ minWidth: "16rem" }}
            ></Column>
            <Column
              field="groupSexualDynamic"
              header="Group Sexual Dynamic"
              sortable
              style={{ minWidth: "16rem" }}
            ></Column>
            <Column
              field="habitatOrExhibit"
              header="Habitat or Exhibit"
              sortable
              style={{ minWidth: "10rem" }}
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
        visible={deleteAssetDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteAssetDialogFooter}
        onHide={hideDeleteAssetDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedAsset && (
            <span>
              Are you sure you want to delete{" "}
              <b>{selectedAsset.commonName}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default AllAssetDatatable;
