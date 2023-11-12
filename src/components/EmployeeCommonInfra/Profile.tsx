import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableRow
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import {
  HiOutlineCog,
  HiOutlineLockOpen
} from "react-icons/hi";
import { NavLink } from "react-router-dom";
import Employee from "src/models/Employee";
import useApiJson from "../../hooks/useApiJson";

{
  /*const toast = useRef<Toast>(null);*/
}

function Profile() {
  const apiJson = useApiJson();

  let emptyEmployee: Employee = {
    employeeId: -1,
    employeeName: "",
    employeeEmail: "",
    employeeAddress: "",
    employeePhoneNumber: "",
    employeeDoorAccessCode: "",
    employeeEducation: "",
    employeeBirthDate: null,
    isAccountManager: false,
    dateOfResignation: null,
  };

  const [curEmployee, setCurEmployee] = useState<Employee>(emptyEmployee);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const responseJson = await apiJson.get(
          "http://localhost:3000/api/employee/getEmployee"
        );
        setCurEmployee(responseJson["employee"]);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchEmployees();
  }, []);

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="m-1">Manage Employees</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
      </span>
    </div>
  );

  return (
    <div className="flex w-full flex-col rounded-lg border border-stroke bg-white p-10 text-black shadow-default dark:border-strokedark">
      <div className="flex items-center justify-between">
        <div className="">
          <span className="pl-2 text-title-xl">
            Welcome {curEmployee.employeeName}!
          </span>{" "}
          <br />
          <span className="mb-4 mt-2 pl-2 text-graydark">
            This is how others will see you on the site.
          </span>
        </div>
        <div className="flex gap-4">
          <NavLink to={"/updateProfile"}>
            <Button className="">
              <HiOutlineCog className="mr-2 h-5 w-5" scale={10} />
              Edit Your Profile
            </Button>
          </NavLink>
          <NavLink to={"/edit-password"}>
            <Button className="">
              <HiOutlineLockOpen className="mr-2 h-5 w-5" scale={10} />
              Change Password
            </Button>
          </NavLink>
        </div>
      </div>
      <Table className="mt-2">
        <TableBody>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Email
            </TableCell>
            <TableCell>{curEmployee.employeeEmail}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Address
            </TableCell>
            <TableCell>{curEmployee.employeeAddress}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Access Code
            </TableCell>
            <TableCell>{curEmployee.employeeDoorAccessCode}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Phone Number
            </TableCell>
            <TableCell>{curEmployee.employeePhoneNumber}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Education
            </TableCell>
            <TableCell>{curEmployee.employeeEducation}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      {/* <Form.Root
        className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark"
        onSubmit={() => {}}
        encType="multipart/form-data"
      >
        <div>
          <h1> Welcome {curEmployee.employeeName}!</h1>
        </div>
        <br />

        <Form.Field
          name=""
          className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
        >
          <Form.Control
            type="text"
            required={true}
            placeholder={`Email : ${curEmployee.employeeEmail}`}
            value={`Email : ${curEmployee.employeeEmail}`}
            step={0.5}
            pattern=""
            onChange={(e) => {}}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium shadow outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
          />
        </Form.Field>

        <Form.Field
          name=""
          className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
        >
          <Form.Control
            type="text"
            required={true}
            placeholder={`Address : ${curEmployee.employeeAddress}`}
            value={`Address : ${curEmployee.employeeAddress}`}
            step={0.5}
            pattern=""
            onChange={(e) => {}}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium shadow outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
          />
        </Form.Field>

        <Form.Field
          name=""
          className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
        >
          <Form.Control
            type="text"
            required={true}
            placeholder={`Access Code : ${curEmployee.employeeDoorAccessCode}`}
            value={`Access Code : ${curEmployee.employeeDoorAccessCode}`}
            step={0.5}
            pattern=""
            onChange={(e) => {}}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium shadow outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
          />
        </Form.Field>

        <Form.Field
          name=""
          className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
        >
          <Form.Control
            type="text"
            required={true}
            placeholder={`Phone Number : ${curEmployee.employeePhoneNumber}`}
            value={`Phone Number : ${curEmployee.employeePhoneNumber}`}
            step={0.5}
            pattern=""
            onChange={(e) => {}}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium shadow outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
          />
        </Form.Field>

        <Form.Field
          name=""
          className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
        >
          <Form.Control
            type="text"
            required={true}
            placeholder={`Education : ${curEmployee.employeeEducation}`}
            value={`Education : ${curEmployee.employeeEducation}`}
            step={0.5}
            pattern=""
            onChange={(e) => {}}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium shadow outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
          />
        </Form.Field>
        <React.Fragment>
          <NavLink to={"/updateProfile"}>
            <Button className="mr-2">
              <HiEye className="mr-auto" />
            </Button>
          </NavLink>
        </React.Fragment>
      </Form.Root> */}
    </div>
  );
}

export default Profile;
