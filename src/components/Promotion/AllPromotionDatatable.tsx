import React, { useEffect, useState, useRef } from "react";

import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import { Rating } from "primereact/rating";
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import { InputNumber, InputNumberChangeEvent } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";

import Promotion from "../../models/Promotion";
import useApiJson from "../../hooks/useApiJson";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { HiCheck, HiEye, HiPencil, HiPlus, HiTrash, HiX } from "react-icons/hi";

import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

import * as moment from "moment-timezone";

function AllPromotionDatatable() {
  const apiJson = useApiJson();

  // date options
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };

  let emptyPromotion: Promotion = {
    promotionId: -1,
    title: "",
    description: "",
    publishDate: new Date(),
    startDate: new Date(),
    endDate: new Date(),
    percentage: 0,
    minimumSpending: 0,
    promotionCode: "",
    imageUrl: "",
    maxRedeemNum: 0,
    currentRedeemNum: 0,
  };

  const [promotionList, setPromotionList] = useState<Promotion[]>([]);
  const [selectedPromotion, setSelectedPromotion] =
    useState<Promotion>(emptyPromotion);
  const [deletePromotionDialog, setDeletePromotionDialog] =
    useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const dt = useRef<DataTable<Promotion[]>>(null);

  const toastShadcn = useToast().toast;

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const responseJson = await apiJson.get(
          "http://localhost:3000/api/promotion/getAllPromotions"
        );
        setPromotionList(responseJson as Promotion[]);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchPromotion();
  }, []);

  //
  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const imageBodyTemplate = (rowData: Promotion) => {
    return (
      <img
        src={"http://localhost:3000/" + rowData.imageUrl}
        alt={rowData.title}
        className="aspect-square w-16 rounded-full border border-white object-cover shadow-4"
      />
    );
  };

  const navigateEditProduct = (promotion: Promotion) => {};

  const confirmDeletePromotion = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setDeletePromotionDialog(true);
  };

  const hideDeletePromotionDialog = () => {
    setDeletePromotionDialog(false);
  };

  function convertUtcToTimezone(utcDate: Date, targetTimezone: string): string {
    const utcMoment = moment.utc(utcDate);
    const targetMoment = utcMoment.tz(targetTimezone);
    const formattedTime: string = targetMoment.format("MM-DD-YYYY");
    return formattedTime;
  }

  // delete promotion stuff
  const deletePromotion = async () => {
    let _promotion = promotionList.filter(
      (val) => val.promotionId !== selectedPromotion?.promotionId
    );

    const selectedPromotionTitle = selectedPromotion.title;

    const deletePromotionApi = async () => {
      try {
        const responseJson = await apiJson.del(
          "http://localhost:3000/api/promotion/deletePromotion/" +
            selectedPromotion.promotionId
        );

        toastShadcn({
          // variant: "destructive",
          title: "Deletion Successful",
          description:
            "Successfully deleted promotion: " + selectedPromotionTitle,
        });
        setPromotionList(_promotion);
        setDeletePromotionDialog(false);
        setSelectedPromotion(emptyPromotion);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while deleting promotion: \n" +
            apiJson.error,
        });
      }
    };
    deletePromotionApi();
  };

  const deletePromotionDialogFooter = (
    <React.Fragment>
      <Button onClick={hideDeletePromotionDialog}>
        <HiX className="mr-2" />
        No
      </Button>
      <Button variant={"destructive"} onClick={deletePromotion}>
        <HiCheck className="mr-2" />
        Yes
      </Button>
    </React.Fragment>
  );
  // end delete promotion stuff

  const actionBodyTemplate = (promotion: Promotion) => {
    return (
      <React.Fragment>
        <div className="mx-auto">
          <NavLink to={`/promotion/viewpromotion/${promotion.promotionId}`}>
            <Button className="mr-2">
              <HiEye className="mr-auto" />
            </Button>
          </NavLink>
          <Button
            variant={"destructive"}
            className="mr-2"
            onClick={() => confirmDeletePromotion(promotion)}
          >
            <HiTrash className="mx-auto" />
          </Button>
        </div>
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="m-1">Manage Promotion</h4>
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
        <div className="rounded-lg bg-white p-4">
          {/* Title Header and back button */}
          <div className="flex flex-col">
            <div className="mb-4 flex justify-between">
              <NavLink to={"/promotion/createpromotion"}>
                <Button className="mr-2">
                  <HiPlus className="mr-auto" />
                </Button>
              </NavLink>
              <span className=" self-center text-title-xl font-bold">
                All Promotions
              </span>
              <Button onClick={exportCSV}>Export to .csv</Button>
            </div>
            <Separator />
          </div>

          <DataTable
            ref={dt}
            value={promotionList}
            selection={selectedPromotion}
            onSelectionChange={(e) => {
              if (Array.isArray(e.value)) {
                setSelectedPromotion(e.value);
              }
            }}
            dataKey="promotionId"
            paginator
            // showGridlines
            rows={10}
            scrollable
            selectionMode={"single"}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} promotion"
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
              field="promotionId"
              header="ID"
              frozen
              sortable
              style={{ minWidth: "6rem" }}
            ></Column>
            <Column
              field="title"
              header="Title"
              sortable
              style={{ minWidth: "7rem" }}
            ></Column>
            <Column
              body={(promotion) => {
                const utcDate = new Date(promotion.publishDate);
                const singaporeTime = convertUtcToTimezone(
                  utcDate,
                  "Asia/Singapore"
                );

                return singaporeTime;
              }}
              field="publishDate"
              header="Publish Date"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              body={(promotion) => {
                const utcDate = new Date(promotion.startDate);
                const singaporeTime = convertUtcToTimezone(
                  utcDate,
                  "Asia/Singapore"
                );

                return singaporeTime;
              }}
              field="startDate"
              header="Start Date"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              body={(promotion) => {
                const utcDate = new Date(promotion.endDate);
                const singaporeTime = convertUtcToTimezone(
                  utcDate,
                  "Asia/Singapore"
                );

                return singaporeTime;
              }}
              field="endDate"
              header="End Date"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="percentage"
              header="Discount (%)"
              sortable
              style={{ minWidth: "7rem" }}
            ></Column>
            <Column
              field="minimumSpending"
              header="Minimum Spending ($)"
              sortable
              style={{ minWidth: "7rem" }}
            ></Column>
            <Column
              field="maxRedeemNum"
              header="Maximum Redemption Number"
              sortable
              style={{ minWidth: "7rem" }}
            ></Column>
            <Column
              field="currentRedeemNum"
              header="Current Redemption Number"
              sortable
              style={{ minWidth: "7rem" }}
            ></Column>
            <Column
              field="promotionCode"
              header="Promo Code"
              sortable
              style={{ minWidth: "7rem" }}
            ></Column>
            <Column
              body={actionBodyTemplate}
              header="Actions"
              frozen
              alignFrozen="right"
              exportable={false}
              style={{ minWidth: "9rem" }}
            ></Column>
          </DataTable>
        </div>
      </div>
      <Dialog
        visible={deletePromotionDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deletePromotionDialogFooter}
        onHide={hideDeletePromotionDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedPromotion && (
            <span>
              Are you sure you want to delete <b>{selectedPromotion.title}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default AllPromotionDatatable;
