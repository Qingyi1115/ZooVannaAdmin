import React, {useState, useRef} from "react";
import Employee from "../../models/Employee";
import { Button } from "@/components/ui/button";
import useApiJson from "../../hooks/useApiJson";
import { useToast } from "@/components/ui/use-toast";
import { Toast } from "primereact/toast";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface EmployeeInfoDetailsProps {
    curEmployee: Employee;
    refreshSeed: number;
    setRefreshSeed: React.Dispatch<React.SetStateAction<number>>;
  }
function ViewEmployeeDetails(props: EmployeeInfoDetailsProps) {
    const apiJson = useApiJson();
    const {curEmployee, refreshSeed, setRefreshSeed} = props;
    console.log(props);
    const toastShadcn = useToast().toast;
    
    const disableAccountManager = async() => {
        try {
            const responseJson = await apiJson.put(
              `http://localhost:3000/api/employee/unSetAccountManager/${curEmployee.employeeId}`, curEmployee);

            toastShadcn({
              // variant: "destructive",
              title: "Revoke is Successful",
              description:
                "Successfully revoke access: " + curEmployee.employeeName,
            });
            setRefreshSeed(refreshSeed + 1);
          } catch (error: any) {
            // got error
            toastShadcn({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description:
                "An error has occurred while revoking access: \n" + apiJson.error,
            });
          }
    }

    const enableAccountManager = async() => {
        try {
            const responseJson = await apiJson.put(
              `http://localhost:3000/api/employee/setAccountManager/${curEmployee.employeeId}`, curEmployee);

            toastShadcn({
              // variant: "destructive",
              title: "Access is granted",
              description:
                "Successfully granted Account Manager access: " + curEmployee.employeeName,
            });
            setRefreshSeed(refreshSeed + 1);
          } catch (error: any) {
            // got error
            toastShadcn({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description:
                "An error has occurred while granting access: \n" + apiJson.error,
            });
          }
    }


    return(
        <div>
            <div className="overflow-hidden rounded-lg border border-strokedark/40 lg:mx-20">
            <Table>
            <TableHeader className=" bg-whiten">
                <TableRow>
                <TableHead className="w-3/3 font-bold" colSpan={2}>
                    Personal Information
                </TableHead>
                <TableHead className="w-1/3 font-bold"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                <TableCell className="w-1/3 font-bold" colSpan={2}>
                    Full name
                </TableCell>
                <TableCell>{curEmployee.employeeName}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell className="w-1/3 font-bold" colSpan={2}>
                    Email
                </TableCell>
                <TableCell>{curEmployee.employeeEmail}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell className="w-1/3 font-bold" colSpan={2}>
                    Phone number
                </TableCell>
                <TableCell>{curEmployee.employeePhoneNumber}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell className="w-1/3 font-bold" colSpan={2}>
                    Birthday
                </TableCell>
                <TableCell>{curEmployee.employeeBirthDate?.toLocaleString()}</TableCell>
                </TableRow>

                <TableRow>
                <TableCell className="w-1/3 font-bold" colSpan={2}>
                    Address
                </TableCell>
                <TableCell>{curEmployee.employeeAddress}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell className="w-1/3 font-bold" colSpan={2}>
                    Education
                </TableCell>
                <TableCell>{curEmployee.employeeEducation}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell className="w-1/3 font-bold" colSpan={2}>
                    Account Manager
                </TableCell>
                <TableCell className="w-1/6" colSpan={3}>{curEmployee.isAccountManager ? "Yes" : "No"}</TableCell>
                <TableCell>{
                curEmployee.isAccountManager ? 
                    <Button type="button" onClick={disableAccountManager}>Revoke access</Button>
                    : 
                    <Button type="button" onClick={enableAccountManager}>Set As Account Manager</Button>
                    }
                    </TableCell>
                </TableRow>

                {/*<TableCell className="w-1/5 font-bold" rowSpan={8}>
                Taxonomy
                </TableCell>
                <TableRow>
                <TableCell className="w-1/6 font-bold">Domain</TableCell>
                <TableCell>{curEmployees.domain}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell className="w-1/6 font-bold">Kingdom</TableCell>
                <TableCell>{curEmployees.kingdom}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell className="w-1/6 font-bold">Phylum</TableCell>
                <TableCell>{curEmployees.phylum}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell className="w-1/6 font-bold">Class</TableCell>
                <TableCell>{curEmployees.speciesClass}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell className="w-1/6 font-bold">Order</TableCell>
                <TableCell>{curEmployees.order}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell className="w-1/6 font-bold">Family</TableCell>
                <TableCell>{curEmployees.family}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell className="w-1/6 font-bold">Genus</TableCell>
                <TableCell>{curEmployees.genus}</TableCell> 
                </TableRow>*/}
            </TableBody>
            </Table>
            </div>
        </div>
    )
}

export default ViewEmployeeDetails;