import React, { useEffect, useState, useRef } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import { ProductService } from './service/ProductService';
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

import Customer from "../../models/Customer";
import useApiJson from "../../hooks/useApiJson";
import { HiCheck, HiEye, HiPencil, HiPlus, HiTrash, HiX } from "react-icons/hi";

import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { Country } from "../../enums/Country";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

function AllCustomerDatatable() {
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;

  let emptyCustomer: Customer = {
    customerId: -1,
    firstName: "",
    lastName: "",
    email: "",
    contactNo: "",
    birthday: new Date(),
    address: "",
    nationality: Country.Singapore,
    passwordHash: "",
    salt: ""
  };

  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>(emptyCustomer);
  const [deleteCustomerDialog, setDeleteCustomerDialog] =
    useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Customer[]>>(null);

  useEffect(() => {
    apiJson.get("http://localhost:3000/api/customer/getallcustomer");
  }, []);

  useEffect(() => {
    const customerData = apiJson.result as Customer[];
    setCustomerList(customerData);
  }, [apiJson.loading]);

  //
  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const rightToolbarTemplate = () => {
    return <Button onClick={exportCSV}>Export to .csv</Button>;
  };

  // const imageBodyTemplate = (rowData: Customer) => {
  //   return (
  //     <img
  //       src={rowData.customerImageUrl}
  //       alt={rowData.customerName}
  //       className="border-round shadow-2"
  //       style={{ width: "64px" }}
  //     />
  //   );
  // };

  const navigateEditProduct = (customer: Customer) => { };

  const confirmDeleteCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDeleteCustomerDialog(true);
  };

  const hideDeleteCustomerDialog = () => {
    setDeleteCustomerDialog(false);
  };

  // delete customer stuff
  const deleteCustomer = async () => {
    let _customer = customerList.filter(
      (val) => val.customerId !== selectedCustomer?.customerId
    );

    const selectedCustomerName = selectedCustomer.firstName + selectedCustomer.lastName;

    const deleteCustomer = async () => {
      try {
        const responseJson = await apiJson.del(
          "http://localhost:3000/api/customer/deleteCustomer/" +
          selectedCustomer.email
        );

        toastShadcn({
          // variant: "destructive",
          title: "Deletion Successful",
          description:
            "Successfully deleted customer: " + selectedCustomerName,
        });
        setCustomerList(_customer);
        setDeleteCustomerDialog(false);
        setSelectedCustomer(emptyCustomer);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while deleting customer: \n" + apiJson.error,
        });
      }
    };
    deleteCustomer();
  };

  const deleteCustomerDialogFooter = (
    <React.Fragment>
      <Button onClick={hideDeleteCustomerDialog}>
        <HiX />
        No
      </Button>
      <Button variant={"destructive"} onClick={deleteCustomer}>
        <HiCheck />
        Yes
      </Button>
    </React.Fragment>
  );
  // end delete customer stuff

  const actionBodyTemplate = (customer: Customer) => {
    return (
      <React.Fragment>
        <NavLink to={`/customer/editcustomer/${customer.firstName + " " + customer.lastName}`}>
          <Button className="mr-2">
            <HiEye className="mr-auto" />
          </Button>
        </NavLink>
        <Button
          variant={"destructive"}
          className="mr-2"
          onClick={() => confirmDeleteCustomer(customer)}
        >
          <HiTrash className="mx-auto" />
        </Button>
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="m-1">Manage Customer</h4>
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
              <NavLink to={"/customer/createnewcustomer"}>
                <Button className="mr-2">
                  <HiPlus className="mr-auto" />
                </Button>
              </NavLink>
              <span className=" self-center text-title-xl font-bold">
                All Customers
              </span>
              <Button onClick={exportCSV}>Export to .csv</Button>
            </div>
            <Separator />
          </div>

          <DataTable
            ref={dt}
            value={customerList}
            selection={selectedCustomer}
            onSelectionChange={(e) => {
              if (Array.isArray(e.value)) {
                setSelectedCustomer(e.value);
              }
            }}
            dataKey="customerId"
            paginator
            rows={10}
            scrollable
            selectionMode={"single"}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} customers"
            globalFilter={globalFilter}
            header={header}
          >
            <Column
              field="customerId"
              header="ID"
              sortable
              style={{ minWidth: "4rem" }}
            ></Column>
            <Column
              field="firstName"
              header="First Name"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="lastName"
              header="Last Name"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="email"
              header="Email"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="contactNo"
              header="Contact Number"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="birthday"
              header="Birthday"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="address"
              header="Address"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            {/* <Column
              field="customerImageUrl"
              header="Image"
              body={imageBodyTemplate}
            ></Column> */}
            <Column
              field="nationality"
              header="Nationality"
              sortable
              style={{ minWidth: "16rem" }}
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
        visible={deleteCustomerDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteCustomerDialogFooter}
        onHide={hideDeleteCustomerDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedCustomer && (
            <span>
              Are you sure you want to delete{" "}
              <b>{selectedCustomer.firstName + " " + selectedCustomer.lastName}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default AllCustomerDatatable;
