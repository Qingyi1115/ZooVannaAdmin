import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Customer from "src/models/Customer";
import EditCustomerForm from "../../components/CustomerAccountManagement/EditCustomerForm";
import { Country } from "../../enums/Country";
import useApiJson from "../../hooks/useApiJson";


function EditCustomerPage() {
  const apiJson = useApiJson();

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

  const { customerName } = useParams<{ customerName: string }>();
  const [curCustomer, setCurCustomer] = useState<Customer>(emptyCustomer);

  useEffect(() => {
    apiJson.get(`http://localhost:3000/api/customer/getcustomer/${customerName}`);
  }, []);

  return (
    <div className="p-10">
      {curCustomer && curCustomer.customerId != -1 && (
        <EditCustomerForm curCustomer={curCustomer} />
      )}
    </div>
  );
}

export default EditCustomerPage;