import { Country } from "../enums/Country";

interface Customer {
  customerId: number;
  firstName: string;
  lastName: string;
  email: string;
  contactNo: string;
  birthday: Date;
  address: string;
  nationality: Country;
  passwordHash: string;
  salt: string;
}

export default Customer;
