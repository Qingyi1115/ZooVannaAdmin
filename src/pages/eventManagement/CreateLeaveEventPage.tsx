import React, { useEffect, useState } from "react";
import CreateLeaveEventForm from "../../components/EventManagement/CreateZooEventPage/CreateLeaveEventForm";
import { useParams, useNavigate } from "react-router-dom";
import useApiJson from "../../hooks/useApiJson";
import Employee from "../../models/Employee";

function CreateLeaveEventPage() {
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
      <CreateLeaveEventForm
        curEmployee={curEmployee}
        refreshSeed={refreshSeed}
        setRefreshSeed={setRefreshSeed} />
    </div>
  );
}

export default CreateLeaveEventPage;
