import React, { useEffect, useRef, useState } from "react";

import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
// import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";

import { HiEye } from "react-icons/hi";
import useApiJson from "../../hooks/useApiJson";
import CustomerOrder from "../../models/CustomerOrder";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { NavLink } from "react-router-dom";

import * as moment from "moment-timezone";
import { OrderStatus } from "../../enums/Enumurated";
import { PaymentStatus } from "../../enums/PaymentStatus";
import beautifyText from "../../hooks/beautifyText";

function AllCustomerOrderDatatable() {
  const apiJson = useApiJson();

  // date options
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };

  let emptyCustomerOrder: CustomerOrder = {
    customerOrderId: -1,
    bookingReference: "",
    totalAmount: 0,
    orderStatus: OrderStatus.COMPLETED,
    entryDate: new Date(),
    customerFirstName: "",
    customerLastName: "",
    customerContactNo: "",
    customerEmail: "",
    paymentStatus: PaymentStatus.COMPLETED,
    createdAt: new Date(),
    orderItems: [],
  };

  const [customerOrderList, setCustomerOrderList] = useState<CustomerOrder[]>(
    []
  );
  const [selectedCustomerOrder, setSelectedCustomerOrder] =
    useState<CustomerOrder>(emptyCustomerOrder);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const dt = useRef<DataTable<CustomerOrder[]>>(null);

  const toastShadcn = useToast().toast;

  useEffect(() => {
    const fetchCustomerOrder = async () => {
      try {
        const responseJson = await apiJson.post(
          "http://localhost:3000/api/customerOrder/getAllCustomerOrders",
          { includes: ["orderItems"] }
        );
        setCustomerOrderList(responseJson as CustomerOrder[]);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchCustomerOrder();
  }, []);

  //
  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  function convertUtcToTimezone(utcDate: Date, targetTimezone: string): string {
    const utcMoment = moment.utc(utcDate);
    const targetMoment = utcMoment.tz(targetTimezone);
    const formattedTime: string = targetMoment.format("DD MMM YYYY");
    return formattedTime;
  }

  const actionBodyTemplate = (customerOrder: CustomerOrder) => {
    return (
      <React.Fragment>
        <div className="mx-auto">
          <NavLink
            to={`/customerOrder/viewCustomerOrder/${customerOrder.customerOrderId}`}
          >
            <Button className="mr-2">
              <HiEye className="mr-auto" />
            </Button>
          </NavLink>
        </div>
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="m-1">Manage Customer Order</h4>
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
              {/* <NavLink to={"/customerOrder/createnewcustomerOrder"}>
                <Button className="mr-2">
                  <HiPlus className="mr-auto" />
                  Add CustomerOrder
                </Button>
              </NavLink> */}
              <span className=" self-center text-title-xl font-bold">
                All Customer Orders
              </span>
              <Button onClick={exportCSV}>Export to .csv</Button>
            </div>
            <Separator />
          </div>

          <DataTable
            ref={dt}
            value={customerOrderList}
            selection={selectedCustomerOrder}
            onSelectionChange={(e) => {
              if (Array.isArray(e.value)) {
                setSelectedCustomerOrder(e.value);
              }
            }}
            dataKey="customerOrderId"
            paginator
            // showGridlines
            rows={10}
            scrollable
            selectionMode={"single"}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} customerOrder"
            globalFilter={globalFilter}
            header={header}
          >
            <Column
              field="customerOrderId"
              header="ID"
              frozen
              sortable
              style={{ minWidth: "6rem" }}
            ></Column>
            <Column
              field="bookingReference"
              header="Booking Reference"
              sortable
              style={{ minWidth: "7rem" }}
            ></Column>
            <Column
              field="totalAmount"
              header="Total Amount (S$)"
              sortable
              style={{ minWidth: "7rem" }}
            ></Column>
            <Column
              field="orderStatus"
              header="Order Status"
              body={(customerOrder: CustomerOrder) => beautifyText(customerOrder.orderStatus)}
              sortable
              style={{ minWidth: "7rem" }}
            ></Column>
            <Column
              body={(customerOrder) => {
                const utcDate = new Date(customerOrder.entryDate);
                const singaporeTime = convertUtcToTimezone(
                  utcDate,
                  "Asia/Singapore"
                );

                return singaporeTime;
              }}
              field="entryDate"
              header="Entry Date"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="customerFirstName"
              header="First Name"
              sortable
              style={{ minWidth: "7rem" }}
            ></Column>
            <Column
              field="customerLastName"
              header="Last Name"
              sortable
              style={{ minWidth: "7rem" }}
            ></Column>
            <Column
              field="paymentStatus"
              header="Payment Status"
              sortable
              style={{ minWidth: "7rem" }}
            ></Column>
            <Column
              body={(customerOrder) => {
                const utcDate = new Date(customerOrder.createdAt);
                const singaporeTime = convertUtcToTimezone(
                  utcDate,
                  "Asia/Singapore"
                );

                return singaporeTime;
              }}
              field="createdAt"
              header="Order Time"
              sortable
              style={{ minWidth: "12rem" }}
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
    </div>
  );
}

export default AllCustomerOrderDatatable;
