import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Employee from "src/models/Employee";
import ViewEmployeeDetails from "../../components/EmployeeAccountManagement/ViewEmployeeDetails";
import ViewEmployeeRoleDetails from "../../components/EmployeeAccountManagement/ViewEmployeeRoleDetails";
import useApiJson from "../../hooks/useApiJson";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function ViewEmployeeDetailsPage() {
  const apiJson = useApiJson();

  let employee: Employee = {
    employeeId: -1,
    employeeName: "",
    employeeEmail: "",
    employeeAddress: "",
    employeePhoneNumber: "",
    employeeDoorAccessCode: "",
    employeeEducation: "",
    employeeBirthDate: new Date(),
    isAccountManager: false,
    dateOfResignation: new Date(),
    employeeProfileUrl: "",
    keeper: null,
    generalStaff: null,
    planningStaff: null,
  };

  const { employeeId } = useParams<{ employeeId: string }>();
  const [curEmployee, setCurEmployee] = useState<Employee>(employee);
  const [refreshSeed, setRefreshSeed] = useState<number>(0);
  const navigate = useNavigate();

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
            <div className="flex flex-col">
              <div className="mb-4 flex justify-between">
                <Button
                  variant={"outline"}
                  type="button"
                  onClick={() => navigate(-1)}
                  className=""
                >
                  Back
                </Button>
                <span className="self-center text-lg text-graydark">
                  Employee Details
                </span>
                <Button disabled className="invisible">
                  Back
                </Button>
              </div>
              <Separator />
              <span className="mt-4 self-center text-title-xl font-bold">
                {curEmployee.employeeName}
              </span>
            </div>
            <Accordion type="multiple">
              <AccordionItem value="item-1">
                <AccordionTrigger>Personal Information</AccordionTrigger>
                <AccordionContent>
                  <ViewEmployeeDetails
                    curEmployee={curEmployee}
                    refreshSeed={refreshSeed}
                    setRefreshSeed={setRefreshSeed}
                  />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Access Role</AccordionTrigger>
                <AccordionContent>
                  <ViewEmployeeRoleDetails
                    curEmployee={curEmployee}
                    refreshSeed={refreshSeed}
                    setRefreshSeed={setRefreshSeed}
                  />
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
