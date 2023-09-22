import React, {useState, useRef, useEffect} from "react";
import Employee from "../../models/Employee";
import { Button } from "@/components/ui/button";
import useApiJson from "../../hooks/useApiJson";
import { useToast } from "@/components/ui/use-toast";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { HiCheck, HiEye, HiPencil, HiTrash, HiX } from "react-icons/hi";
import FormFieldSelect from "../FormFieldSelect";
import * as Form from "@radix-ui/react-form";


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

function ViewEmployeeRoleDetails(props: EmployeeInfoDetailsProps) {
    const apiJson = useApiJson();
    const {curEmployee, refreshSeed, setRefreshSeed} = props;
    console.log(props);
    const toastShadcn = useToast().toast;
    const [disableRoleDialog, setDisableRoleDialog] = useState<boolean>(false);
    const [enableRoleDialog, setEnableRoleDialog] = useState<boolean>(false);
    const [role, setRole] = useState<string | undefined>();
    const [roleType, setRoleType] = useState<string | undefined>();
    const [specializationType, setSpecializationType] = useState<string | undefined>();
    const [updateRoleDialog, setUpdateRoleDialog] = useState<boolean>(false);
    const [updateSpecializationDialog, setUpdateSpecializationDialog] = useState<boolean>(false);

    function validateRoleType(props: ValidityState) {
        if (props != undefined) {
          if (roleType == undefined) {
            return (
              <div className="font-medium text-danger">
                * Please select a role type!
              </div>
            );
          }
          // add any other cases here
        }
        return null;
      }
    
      function validateSpecializationType(props: ValidityState) {
        if (props != undefined) {
          if (specializationType == undefined) {
            return (
              <div className="font-medium text-danger">
                * Please select a specialization type!
              </div>
            );
          }
          // add any other cases here
        }
        return null;
      }
    
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

    const disableRole = async() => {
        try {
            console.log("here " + role);
            let roleJson = {
                role: role,
            };
            console.log("this here " + roleJson.role);
            const responseJson = await apiJson.put(
                `http://localhost:3000/api/employee/getEmployee/${curEmployee.employeeId}/disableRole`, roleJson);
            
            toastShadcn({
                // variant: "destructive",
                title: "Successfully disabled!",
                description:
                    "Successfully disabled " + role + " role access: " + curEmployee.employeeName,
            });
            setDisableRoleDialog(false);
            setRefreshSeed(refreshSeed + 1);
        } catch (error: any) {
            // got error
            toastShadcn({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description:
                "An error has occurred while disabling " +  role + " access: \n" + apiJson.error,
            });
        }
    }

    const hideDisableRoleDialog = () => {
        setDisableRoleDialog(false);
    }

    const confirmDisableRole= (props: string) => {
        setRole(props);
        console.log(props,role);
        setDisableRoleDialog(true);
    };

    const disableRoleDialogFooter= (
    <React.Fragment>
        <Button onClick={hideDisableRoleDialog}>
        <HiX />
        No
        </Button>
        {role && <Button variant={"destructive"} onClick={disableRole}>
        <HiCheck />
        Yes
        </Button>}
    </React.Fragment>
    );

    async function enableRole(e : any){
        try {
            let roleJson;
            console.log(props, role);

            if(role === "Keeper") {
                roleJson = {
                    keeperType: roleType,
                    isDisabled: false,
                    specialization: specializationType
                }
            } 
            else if (role === "General Staff") {
                roleJson = {
                    generalStaffType: roleType,
                    isDisabled: false,
                }
            }

            else if(role === "Planning Staff") {
                roleJson = {
                    plannerType: roleType,
                    isDisabled: false,
                    specialization: specializationType,
                }
            }

            let result;
            result = {
                role,
                roleJson,
            }
            console.log("this way please " + role);
            console.log(result.role, result.roleJson);
            const responseJson = await apiJson.put(`http://localhost:3000/api/employee/getEmployee/${curEmployee.employeeId}/enableRole`, result);

            console.log("Here2" + responseJson);
            
            toastShadcn({
                // variant: "destructive",
                title: "Access is granted",
                description:
                    "Successfully granted role access: " + curEmployee.employeeName,
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

    async function updateSpecialization(e : any){
        try {
            let roleJson;
            console.log(props, role);

            let result;
            
            result = {
                role,
                specializationType,
            }
            console.log("this way please " + role);
            console.log(result.role, result.specializationType);
            const responseJson = await apiJson.put(`http://localhost:3000/api/employee/getEmployee/${curEmployee.employeeId}/updateSpecializationType`, result);

            console.log("Here2" + responseJson);
            
            toastShadcn({
                // variant: "destructive",
                title: "Role Type is updated!",
                description:
                    "Successfully update Specialization Type" + curEmployee.employeeName,
            });
            setRefreshSeed(refreshSeed + 1);
        } catch (error: any) {
            // got error
            toastShadcn({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description:
                "An error has occurred while updating specialization type: \n" + apiJson.error,
            });
        }
    } 

    const hideSpecializationTypeDialog = () => {
        setUpdateSpecializationDialog(false);
    }

    async function updateRole(e : any){
        try {
            console.log(props, role);     
            let result;
            
            result = {
                role,
                roleType,
            }
            console.log("this way please " + role);
            console.log(result.role, result.roleType);
            const responseJson = await apiJson.put(`http://localhost:3000/api/employee/getEmployee/${curEmployee.employeeId}/updateRoleType`, result);

            console.log("Here2" + responseJson);
            
            toastShadcn({
                // variant: "destructive",
                title: "Role Type is updated!",
                description:
                    "Successfully update role type" + curEmployee.employeeName,
            });
            setRefreshSeed(refreshSeed + 1);
        } catch (error: any) {
            // got error
            toastShadcn({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description:
                "An error has occurred while updating role type: \n" + apiJson.error,
            });
        }
    } 

    const hideEnableRoleDialog = () => {
        setDisableRoleDialog(false);
    }

    const hideUpdateRoleDialog = () => {
        setUpdateRoleDialog(false);
    }

    const confirmEnableRole= (props: string) => {
        setRole(props);
        console.log(props, role);
        if(props === "Keeper" && !curEmployee.keeper) {
            setEnableRoleDialog(true);
        }
        else if (props === "General Staff" && !curEmployee.generalStaff) {
            setEnableRoleDialog(true);
        }
        else if (props === "Planning Staff" && !curEmployee.planningStaff) {
            setEnableRoleDialog(true);
        }
        else if (props === "Keeper" || props === "General Staff" || props === "Planning Staff") {
            enableRole(undefined);
            
            console.log("HEEEEEE")
        }
        
    };

    const enableRoleDialogFooter= (
        <React.Fragment>
            <Button onClick={hideEnableRoleDialog}>
            <HiX />
            No
            </Button>
            {role && <Button variant={"destructive"} onClick={() => enableRole}>
            <HiCheck />
            Yes
            </Button>}
        </React.Fragment>
    );

    const updateRoleType = (props: string) => {
        setRole(props);
        setUpdateRoleDialog(true);
    }

    const updateSpecializationType = (props: string) => {
        setRole(props);
        setUpdateSpecializationDialog(true);
    }

    return(
        <div>
            <div className="overflow-hidden rounded-lg border border-strokedark/40 lg:mx-20">
            <Table>
            <TableHeader className=" bg-whiten">
                <TableRow>
                <TableHead className="w-3/3 font-bold" colSpan={3}>
                    Access Role
                </TableHead>
                <TableHead className="w-1/3 font-bold" colSpan={2}></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="w-1/4 font-bold" colSpan={1}>
                        Account Manager
                    </TableCell>
                    <TableCell className="w-1/6" colSpan={1}>{curEmployee.isAccountManager ? "Yes" : "No"}</TableCell>
                    {!curEmployee.dateOfResignation && <TableCell className="w-1/6" colSpan={2}>{curEmployee.isAccountManager ? 
                        <Button type="button" onClick={disableAccountManager}>Revoke access</Button>
                        : 
                        <Button type="button" onClick={enableAccountManager}>Set As Account Manager</Button>
                        }
                    </TableCell>}
                    {curEmployee.dateOfResignation && <TableCell className="w-1/6" colSpan={2}>{curEmployee.isAccountManager ? 
                        <Button type="button" disabled variant={"destructive"} onClick={disableAccountManager}>Revoke access</Button>
                        : 
                        <Button type="button" disabled variant={"destructive"} onClick={enableAccountManager}>Set As Account Manager</Button>
                        }
                    </TableCell>}
                </TableRow>
                <TableRow>
                    {curEmployee.keeper && 
                    <TableCell className="w-1/4 font-bold" rowSpan={4} colSpan={1}>
                        Keeper Role
                    </TableCell>
                    }
                    {!curEmployee.keeper && 
                    <TableCell className="w-1/4 font-bold" rowSpan={2} colSpan={1}>
                        Keeper Role
                    </TableCell>}
                </TableRow>
                <TableRow>
                    {curEmployee.keeper && <TableCell className="w-1/6 font-bold">Disabled</TableCell>}
                    {curEmployee.keeper && <TableCell >{curEmployee.keeper.isDisabled ? "Yes" : "No"}</TableCell>}
                    {!curEmployee.dateOfResignation &&<TableCell className="w-1/3" rowSpan={1} colSpan={1}>
                        {!curEmployee.keeper || curEmployee.keeper.isDisabled
                        ? <Button type="button" onClick={() => confirmEnableRole("Keeper")}>Enable</Button>
                        : <Button type="button" onClick={() => confirmDisableRole("Keeper")}>Disable</Button>}
                    </TableCell>}
                    {curEmployee.dateOfResignation && <TableCell className="w-1/3" rowSpan={1} colSpan={1}>
                        {!curEmployee.keeper || curEmployee.keeper.isDisabled
                        ? <Button type="button" disabled variant={"destructive"} onClick={() => confirmEnableRole("Keeper")}>Enable</Button>
                        : <Button type="button" disabled variant ={"destructive"} onClick={() => confirmDisableRole("Keeper")}>Disable</Button>}
                    </TableCell>}
                </TableRow>
                {/*{(!curEmployee.keeper || curEmployee.keeper.isDisabled) && 
                    <TableRow>
                        <TableCell className="w-1/4" colSpan={3}>
                            <Button type="button" onClick={() => confirmEnableRole("Keeper")}>Enable</Button>
                        </TableCell>
                    </TableRow>
                }*/}
                {curEmployee.keeper && 
                    <TableRow>
                        <TableCell className="w-1/6 font-bold">Keeper Type</TableCell>
                        <TableCell colSpan={1}>{curEmployee.keeper.keeperType.toString()}</TableCell>
                        {!curEmployee.keeper.isDisabled && 
                            <TableCell colSpan={1}>
                                <Button type="button" onClick={() => updateRoleType("Keeper")}>Change</Button>
                            </TableCell>
                        }
                    </TableRow>
                }
                {curEmployee.keeper && 
                    <TableRow>
                        <TableCell className="w-1/6 font-bold">Specialization Type</TableCell>
                        <TableCell colSpan={1}>{curEmployee.keeper.specialization.toString()}</TableCell>
                        {!curEmployee.keeper.isDisabled && 
                            <TableCell colSpan={1}>
                                <Button type="button" onClick={() => updateSpecializationType("Keeper")}>Change</Button>
                            </TableCell>
                        }
                    </TableRow>
                }
                <TableRow>
                    {curEmployee.generalStaff && 
                    <TableCell className="w-1/4 font-bold" rowSpan={3} colSpan={1}>
                        General Staff Role
                    </TableCell>}
                    {!curEmployee.generalStaff && 
                    <TableCell className="w-1/4 font-bold" rowSpan={2} colSpan={1}>
                        General Staff
                    </TableCell>}
                </TableRow>
                
                <TableRow>
                    {curEmployee.generalStaff && <TableCell className="w-1/6 font-bold">Disabled</TableCell>}
                    {curEmployee.generalStaff && <TableCell colSpan={1}>{curEmployee.generalStaff.isDisabled ? "Yes" : "No"}</TableCell>}
                    {!curEmployee.generalStaff && <TableCell></TableCell>}
                    <TableCell className="w-1/3" rowSpan={1} colSpan={1}>
                        {!curEmployee.generalStaff || curEmployee.generalStaff.isDisabled
                        ? <Button type="button" onClick={() => confirmEnableRole("General Staff")}>Enable</Button>
                        : <Button type="button" onClick={() => confirmDisableRole("General Staff")}>Disable</Button>}
                    </TableCell>
                </TableRow>
                {/*{(!curEmployee.keeper || curEmployee.keeper.isDisabled) && 
                    <TableRow>
                        <TableCell className="w-1/4" colSpan={3}>
                            <Button type="button" onClick={() => confirmEnableRole("Keeper")}>Enable</Button>
                        </TableCell>
                    </TableRow>
                }*/}
                {curEmployee.generalStaff && 
                    <TableRow>
                        <TableCell className="w-1/6 font-bold">General Staff Type</TableCell>
                        <TableCell colSpan={1}>{curEmployee.generalStaff.generalStaffType.toString()}</TableCell>
                        {!curEmployee.generalStaff.isDisabled && 
                            <TableCell colSpan={1}>
                                <Button type="button" onClick={() => updateRoleType("General Staff")}>Change</Button>
                            </TableCell>
                        }
                    </TableRow>
                }
                <TableRow>
                    <TableCell className="w-1/4 font-bold" rowSpan={4} colSpan={1}>
                        Planning Staff Role
                    </TableCell>
                </TableRow>

                <TableRow>
                    {curEmployee.planningStaff && <TableCell className="w-1/6 font-bold">Disabled</TableCell>}
                    {curEmployee.planningStaff && <TableCell colSpan={1}>{curEmployee.planningStaff.isDisabled ? "Yes" : "No"}</TableCell>}
                    <TableCell className="w-1/3" rowSpan={1} colSpan={1}>
                        {!curEmployee.planningStaff || curEmployee.planningStaff.isDisabled
                        ? <Button type="button" onClick={() => confirmEnableRole("Planning Staff")}>Enable</Button>
                        : <Button type="button" onClick={() => confirmDisableRole("Planning Staff")}>Disable</Button>}
                    </TableCell>
                </TableRow>
                {/*{(!curEmployee.keeper || curEmployee.keeper.isDisabled) && 
                    <TableRow>
                        <TableCell className="w-1/4" colSpan={3}>
                            <Button type="button" onClick={() => confirmEnableRole("Keeper")}>Enable</Button>
                        </TableCell>
                    </TableRow>
                }*/}
                {curEmployee.planningStaff && 
                    <TableRow>
                        <TableCell className="w-1/6 font-bold">Planning Staff Type</TableCell>
                        <TableCell colSpan={1}>{curEmployee.planningStaff.plannerType.toString()}</TableCell>
                        {!curEmployee.planningStaff.isDisabled && 
                            <TableCell colSpan={1}>
                                <Button type="button" onClick={() => updateRoleType("Planning Staff")}>Change</Button>
                            </TableCell>
                        }
                        
                    </TableRow>
                }
                {curEmployee.planningStaff && 
                    <TableRow>
                        <TableCell className="w-1/6 font-bold">Specialization Type</TableCell>
                        <TableCell colSpan={1}>{curEmployee.planningStaff.specialization.toString()}</TableCell>
                        {!curEmployee.planningStaff.isDisabled && 
                            <TableCell colSpan={1}>
                                <Button type="button" onClick={() => updateSpecializationType("Planning Staff")}>Change</Button>
                            </TableCell>
                        }
                    </TableRow>
                }

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
            <Dialog
            visible={disableRoleDialog}
            style={{ width: "32rem" }}
            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
            header="Confirm"
            modal
            footer={disableRoleDialogFooter}
            onHide={hideDisableRoleDialog}
            >
                <div className="confirmation-content">
                    <i
                    className="pi pi-exclamation-triangle mr-3"
                    style={{ fontSize: "2rem" }}
                    />
                    {curEmployee && (
                    <span>
                        Are you sure you want to disable{" "}
                        <b>{curEmployee.employeeName}</b>?
                    </span>
                    )}
                </div>
            </Dialog>

            { enableRoleDialog && role && 
                <Form.Root
                className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark"
                onSubmit={enableRole}>
                    {role === "Keeper" && 
                    <FormFieldSelect
                    formFieldName="keeperType"
                    label="Keeper Type"
                    required={true}
                    placeholder="Select a keeper type"
                    valueLabelPair={[
                        ["KEEPER", "Keeper"],
                        ["SENIOR_KEEPER", "Senior Keeper"],
                    ]}
                    value={roleType}
                    setValue={setRoleType}
                    validateFunction={validateRoleType}
                    />
                    }

                    {role === "Keeper" && 
                        <FormFieldSelect
                        formFieldName="specializationType"
                        label="Specialization Type"
                        required={true}
                        placeholder="Select a specialization"
                        valueLabelPair={[
                            ["MAMMAL", "Mammal"],
                            ["BIRD", "Bird"],
                            ["FISH", "Fish"],
                            ["REPTILE", "Reptile"],
                            ["AMPHIBIAN", "Amphibian"]
                        ]}
                        value={specializationType}
                        setValue={setSpecializationType}
                        validateFunction={validateSpecializationType}
                        />
                    }

                    {role === "General Staff" && 
                        <FormFieldSelect
                        formFieldName="generalStaffType"
                        label="General Staff Type"
                        required={true}
                        placeholder="Select a general staff type."
                        valueLabelPair={[
                            ["ZOO_OPERATIONS", "Operations"],
                            ["ZOO_MAINTENANCE", "Maintenance"],
                        ]}
                        value={roleType}
                        setValue={setRoleType}
                        validateFunction={validateRoleType}
                        />
                    }

                    {role === "Planning Staff" && 
                        <FormFieldSelect
                        formFieldName="planningStaffType"
                        label="Planning Staff Type"
                        required={true}
                        placeholder="Select a planning staff type."
                        valueLabelPair={[
                            ["CURATOR", "Curator"],
                            ["OPERATIONS_MANAGER", "Operations Manager"],
                            ["CUSTOMER_OPERATIONS", "Customer Operations"],
                            ["MARKETING", "Marketing"],
                            ["SALES", "Sales"],
                        ]}
                        value={roleType}
                        setValue={setRoleType}
                        validateFunction={validateRoleType}
                        />
                    }

                    {role === "Planning Staff" && 
                        <FormFieldSelect
                        formFieldName="specializationType"
                        label="Specialization Type"
                        required={true}
                        placeholder="Select a specialization"
                        valueLabelPair={[
                            ["MAMMAL", "Mammal"],
                            ["BIRD", "Bird"],
                            ["FISH", "Fish"],
                            ["REPTILE", "Reptile"],
                            ["AMPHIBIAN", "Amphibian"]
                        ]}
                        value={specializationType}
                        setValue={setSpecializationType}
                        validateFunction={validateSpecializationType}
                        />
                    }
                    <Form.Submit asChild>
                        <>
                            <button className="mt-10 h-12 w-2/3 self-center rounded-full border bg-primary text-lg text-whiten transition-all hover:bg-opacity-80" onClick = {() => enableRole}>
                                Save
                            </button>
                            <button className="mt-10 h-12 w-2/3 self-center rounded-full border bg-primary text-lg text-whiten transition-all hover:bg-opacity-80" onClick = {hideEnableRoleDialog}>
                                Cancel
                            </button>
                        </>
                    </Form.Submit>
                </Form.Root>
                }

                { updateRoleDialog && role &&
                    <Form.Root
                className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark"
                onSubmit={updateRole}>
                    {role === "Keeper" && 
                    <FormFieldSelect
                    formFieldName="keeperType"
                    label="Keeper Type"
                    required={true}
                    placeholder="Select a keeper type"
                    valueLabelPair={[
                        ["KEEPER", "Keeper"],
                        ["SENIOR_KEEPER", "Senior Keeper"],
                    ]}
                    value={roleType}
                    setValue={setRoleType}
                    validateFunction={validateRoleType}
                    />
                    }
                    {role === "General Staff" && 
                        <FormFieldSelect
                        formFieldName="generalStaffType"
                        label="General Staff Type"
                        required={true}
                        placeholder="Select a general staff type."
                        valueLabelPair={[
                            ["ZOO_OPERATIONS", "Operations"],
                            ["ZOO_MAINTENANCE", "Maintenance"],
                        ]}
                        value={roleType}
                        setValue={setRoleType}
                        validateFunction={validateRoleType}
                        />
                    }
                    {role === "Planning Staff" && 
                        <FormFieldSelect
                        formFieldName="planningStaffType"
                        label="Planning Staff Type"
                        required={true}
                        placeholder="Select a planning staff type."
                        valueLabelPair={[
                            ["CURATOR", "Curator"],
                            ["OPERATIONS_MANAGER", "Operations Manager"],
                            ["CUSTOMER_OPERATIONS", "Customer Operations"],
                            ["MARKETING", "Marketing"],
                            ["SALES", "Sales"],
                        ]}
                        value={roleType}
                        setValue={setRoleType}
                        validateFunction={validateRoleType}
                        />
                    }
                    <Form.Submit asChild>
                        <>
                            <button className="mt-10 h-12 w-2/3 self-center rounded-full border bg-primary text-lg text-whiten transition-all hover:bg-opacity-80" onClick = {updateRole}>
                                Save
                            </button>
                            <button className="mt-10 h-12 w-2/3 self-center rounded-full border bg-primary text-lg text-whiten transition-all hover:bg-opacity-80" onClick = {hideUpdateRoleDialog}>
                                Cancel
                            </button>
                        </>
                    </Form.Submit>
                    </Form.Root>
                }
                
                { updateSpecializationDialog && role &&
                    <Form.Root
                    className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark"
                    onSubmit={updateSpecialization}>
                        {role === "Keeper" && 
                        <FormFieldSelect
                        formFieldName="specializationType"
                        label="Specialization Type"
                        required={true}
                        placeholder="Select a specialization"
                        valueLabelPair={[
                            ["MAMMAL", "Mammal"],
                            ["BIRD", "Bird"],
                            ["FISH", "Fish"],
                            ["REPTILE", "Reptile"],
                            ["AMPHIBIAN", "Amphibian"]
                        ]}
                        value={specializationType}
                        setValue={setSpecializationType}
                        validateFunction={validateSpecializationType}
                        />
                        }
                        {role === "Planning Staff" && 
                        <FormFieldSelect
                        formFieldName="specializationType"
                        label="Specialization Type"
                        required={true}
                        placeholder="Select a specialization"
                        valueLabelPair={[
                            ["MAMMAL", "Mammal"],
                            ["BIRD", "Bird"],
                            ["FISH", "Fish"],
                            ["REPTILE", "Reptile"],
                            ["AMPHIBIAN", "Amphibian"]
                        ]}
                        value={specializationType}
                        setValue={setSpecializationType}
                        validateFunction={validateSpecializationType}
                        />
                        }
                        <Form.Submit asChild>
                        <>
                            <button className="mt-10 h-12 w-2/3 self-center rounded-full border bg-primary text-lg text-whiten transition-all hover:bg-opacity-80" onClick = {updateSpecialization}>
                                Save
                            </button>
                            <button className="mt-10 h-12 w-2/3 self-center rounded-full border bg-primary text-lg text-whiten transition-all hover:bg-opacity-80" onClick = {hideSpecializationTypeDialog}>
                                Cancel
                            </button>
                        </>
                    </Form.Submit>
                    </Form.Root>
                }
        </div>
    )
}

export default ViewEmployeeRoleDetails;