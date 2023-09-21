import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useApiJson from "../../hooks/useApiJson";
import ViewEmployeeDetails from "../../components/EmployeeAccountManagement/ViewEmployeeDetails";
import Employee from "src/models/Employee";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";

function ViewEmployeeDetailsPage() {
    const apiJson = useApiJson();
    let employee: Employee = {
        employeeId: -1,
        employeeName: "",
        employeeEmail: "",
        employeeAddress: "",
        employeePhoneNumber: "",
        employeePasswordhash: "",
        employeeSalt: "",
        employeeDoorAccessCode: "",
        employeeEducation: "",
        employeeBirthDate: new Date(),
        isAccountManager: false,
        dateOfResignation: new Date(),
        employeeProfileUrl: "",
    };

    const { employeeId } = useParams<{ employeeId: string}>();
    const [curEmployee, setCurEmployee] = useState<Employee>(employee);
    const [refreshSeed, setRefreshSeed] = useState<number>(0);

    useEffect(() => {
        const fetchEmployees = async () => {
          try {
            const responseJson = await apiJson.get(
              `http://localhost:3000/api/employee/getEmployee/${employeeId}`
            );
            console.log(responseJson);
            setCurEmployee(responseJson.employee as Employee);
          } catch (error: any) {
            console.log(error);
          }
        };
    
        fetchEmployees();
    }, [refreshSeed]);


      return (
        <div className="p-10">
          <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default">
            {curEmployee && curEmployee.employeeId != -1 && (
              <div className="flex flex-col">
                <span className="self-center text-xl font-bold">
                  Employee Details
                </span>{" "}
                <br />
                <span className="self-center text-title-xl font-bold">
                  {curEmployee.employeeName}
                </span>
                <hr className="opacity-2 my-2 bg-stroke" />
                {/*<img
                  src={"http://localhost:3000/" + curSpecies.imageUrl}
                  alt="Current species image"
                  className="my-4 aspect-square w-1/5 self-center rounded-full border shadow-4"
                />*/}
                <Accordion type="multiple">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Personal Information</AccordionTrigger>
                    <AccordionContent>
                        <ViewEmployeeDetails curEmployee={curEmployee} refreshSeed={refreshSeed} setRefreshSeed={setRefreshSeed} />
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Access Role</AccordionTrigger>
                    <AccordionContent>
                        <ViewEmployeeDetails curEmployee={curEmployee} refreshSeed={refreshSeed} setRefreshSeed={setRefreshSeed}/>
                    </AccordionContent>
                  </AccordionItem>
                  {/*<AccordionItem value="item-2">
                    <AccordionTrigger>Species Educational Content</AccordionTrigger>
                    <AccordionContent>
                      <SpeciesEduContentDetails curSpecies={curSpecies} />
                    </AccordionContent>
                    </AccordionItem>*/}
                </Accordion>
              </div>
            )}
          </div>
        </div>
      );
}

export default ViewEmployeeDetailsPage;